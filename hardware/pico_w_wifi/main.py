"""
STELLARAPP // FIRMWARE PICO W WI-FI - ALTA SENSIBILIDAD
Transmisión autónoma directa por Wi-Fi a https://stellarapp.nerosystem.solutions
MicroPython para Raspberry Pi Pico W (RP2040 + CYW43439)
"""
import network
import urequests
import ujson
import time
import machine
import gc

# --- Configuración de Red ---
WIFI_SSID = "MOVISTAR"
WIFI_PASS = "72880800"
API_ENDPOINT = "https://stellarapp.nerosystem.solutions/api/telemetry/hardware"

# --- Hardware Setup ---
led = machine.Pin("LED", machine.Pin.OUT)
adc_temp = machine.ADC(4)    # Sensor térmico interno RP2040
pin_touch = machine.ADC(0)   # GP26 (Pin 31) sensor táctil por contacto/capacitancia
conversion_factor = 3.3 / 65535

# --- Filtro de Kalman Embebido ---
class MicroKalman:
    def __init__(self, q=0.02, r=0.35):
        self.q = q
        self.r = r
        self.x = 21.0
        self.p = 1.0
        self.k = 0.2

    def update(self, measurement):
        self.p = self.p + self.q
        self.k = self.p / (self.p + self.r)
        self.x = self.x + self.k * (measurement - self.x)
        self.p = (1.0 - self.k) * self.p
        return self.x, self.k

kalman = MicroKalman()
temp_baseline = None

def connect_wifi():
    """Conecta la Pico W a MOVISTAR con reconexión robusta."""
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("Conectando a Wi-Fi MOVISTAR...", end="")
        wlan.connect(WIFI_SSID, WIFI_PASS)
        attempts = 0
        while not wlan.isconnected() and attempts < 25:
            led.toggle()
            time.sleep(0.3)
            print(".", end="")
            attempts += 1
        print("")
    if wlan.isconnected():
        led.on()
        print("✅ Wi-Fi Conectado. IP:", wlan.ifconfig()[0])
        return True
    return False

print("🚀 Iniciando Sonda Térmica Pico W...")
connect_wifi()

# Calibración de reposo inicial
time.sleep(0.5)
init_samples = []
for _ in range(10):
    raw_v = adc_temp.read_u16() * conversion_factor
    t = 27.0 - (raw_v - 0.706) / 0.001721
    init_samples.append(t)
    time.sleep(0.04)
temp_baseline = sum(init_samples) / len(init_samples)
print("🌡️ Línea base térmica de reposo:", round(temp_baseline, 2), "°C")

while True:
    try:
        gc.collect()

        # Verificar Wi-Fi
        wlan = network.WLAN(network.STA_IF)
        if not wlan.isconnected():
            connect_wifi()

        # 1. Leer temperatura real del chip RP2040
        raw_v = adc_temp.read_u16() * conversion_factor
        real_temp = 27.0 - (raw_v - 0.706) / 0.001721

        # Adaptar línea base si la temperatura baja o flota despacio
        if real_temp < temp_baseline:
            temp_baseline = 0.90 * temp_baseline + 0.10 * real_temp
        elif (real_temp - temp_baseline) < 0.2:
            temp_baseline = 0.98 * temp_baseline + 0.02 * real_temp

        # 2. Calcular delta térmico (calor inducido por contacto)
        delta = max(0.0, real_temp - temp_baseline)

        # 3. Leer contacto en GP26 (Pin 31)
        touch_val = pin_touch.read_u16()
        touch_active = touch_val > 12000

        # 4. Mapeo de calor: alta sensibilidad
        # Un aumento de solo +0.4°C en el silicio o contacto físico eleva la telemetría
        heat_boost = delta * 4.5
        if touch_active:
            heat_boost += 3.8

        reported_temp = round(real_temp + heat_boost, 1)
        target_o2 = min(34.0, max(21.0, 21.0 + (delta * 5.2) + (3.6 if touch_active else 0.0)))

        # 5. Filtrar O2 con Kalman
        o2_kalman, k_gain = kalman.update(target_o2)

        # 6. Evaluar Estados de Alerta
        is_critical = (reported_temp >= 41.5) or (o2_kalman >= 27.0)
        is_warning = (reported_temp >= 38.0) or (o2_kalman >= 24.5)

        status = "CRITICO // EVACUACION" if is_critical else ("ALERTA TERMICA" if is_warning else "NOMINAL")

        # 7. LED visual en placa:
        if is_critical:
            for _ in range(4):
                led.toggle()
                time.sleep(0.04)
        elif is_warning:
            led.toggle()
            time.sleep(0.12)
        else:
            led.on()

        # 8. CO proporcional
        co_ppm = max(18.0, round((o2_kalman - 18.0) * 8.2, 1))

        payload = {
            "device": "Raspberry Pi Pico W (Wi-Fi)",
            "chip_temp_c": reported_temp,
            "real_silicon_c": round(real_temp, 2),
            "delta_temp": round(delta, 2),
            "o2_raw": round(target_o2, 1),
            "o2_kalman": round(o2_kalman, 2),
            "co_ppm": co_ppm,
            "k_gain": round(k_gain, 3),
            "status": status,
            "scenario_id": "rover",
            "broadcast_to_telegram": is_critical
        }

        print(ujson.dumps(payload))

        # 9. Transmisión HTTP a la nube
        try:
            headers = {"Content-Type": "application/json", "Connection": "close"}
            r = urequests.post(API_ENDPOINT, json=payload, headers=headers)
            r.close()
        except Exception as e:
            pass

        time.sleep(0.65)

    except Exception as err:
        print("Err:", err)
        time.sleep(1.0)
