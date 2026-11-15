"""
STELLARAPP // PUENTE SERIAL USB PICO W -> SERVIDOR NUBE
Lee la telemetría en tiempo real del Raspberry Pi Pico W por USB (COM6)
y la sincroniza con el servidor en producción y las alertas de Telegram.
"""
import sys
import json
import time
import requests
import serial

SERIAL_PORT = "COM6"
BAUD_RATE = 115200
PROD_API_URL = "https://stellarapp.nerosystem.solutions/api/telemetry/hardware"
LOCAL_API_URL = "http://127.0.0.1:8000/api/telemetry/hardware"

print("=" * 65, flush=True)
print("🛰️  STELLARAPP // PUENTE HARDWARE-IN-THE-LOOP", flush=True)
print(f"   Puerto Serie: {SERIAL_PORT} @ {BAUD_RATE} baud", flush=True)
print(f"   Servidor Nube: {PROD_API_URL}", flush=True)
print("=" * 65, flush=True)

try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=2)
    print("✅ Conexión establecida con Raspberry Pi Pico W (RP2040).", flush=True)
    print("👉 Apoya tu dedo sobre el chip RP2040 para elevar la temperatura y disparar la alarma.\n", flush=True)
except Exception as e:
    print(f"❌ Error abriendo puerto {SERIAL_PORT}: {e}", flush=True)
    sys.exit(1)

session = requests.Session()
last_broadcast_time = 0
last_post_time = 0

while True:
    try:
        raw_line = ser.readline().decode("utf-8", "ignore").strip()
        if not raw_line or not raw_line.startswith("{"):
            continue

        data = json.loads(raw_line)
        temp_c = float(data.get("chip_temp_c", 25.0))
        o2_raw = float(data.get("o2_raw", 21.0))
        o2_kalman = float(data.get("o2_kalman", 21.0))
        co_ppm = float(data.get("co_ppm", 20.0))
        k_gain = float(data.get("k_gain", 0.167))
        status = data.get("status", "NOMINAL")

        now = time.time()
        # Post every ~1.0 second to keep connection fresh and avoid spamming
        if now - last_post_time < 1.0:
            continue
        last_post_time = now

        is_critical = status == "CRITICO // EVACUACION" or o2_kalman >= 27.5 or temp_c >= 42.0
        should_broadcast = is_critical and (now - last_broadcast_time > 20)

        alert_symbol = "🚨" if is_critical else ("⚠️" if "ALERTA" in status else "🟢")
        print(f"{alert_symbol} [{status}] Chip: {temp_c:.1f}°C | O₂ Kalman: {o2_kalman:.2f}% | CO: {co_ppm:.1f} ppm | K-Gain: {k_gain}", flush=True)

        payload = {
            "device": "Raspberry Pi Pico W",
            "chip_temp_c": temp_c,
            "o2_raw": o2_raw,
            "o2_kalman": o2_kalman,
            "co_ppm": co_ppm,
            "k_gain": k_gain,
            "status": status,
            "scenario_id": "rover",
            "broadcast_to_telegram": should_broadcast
        }

        # 1. Enviar a Servidor Nube en Producción con Session Keep-Alive
        try:
            r = session.post(PROD_API_URL, json=payload, timeout=2.5)
            if should_broadcast:
                print("   📢 ALERTA CRÍTICA EMITIDA A TELEGRAM Y AUDITORIO!", flush=True)
                last_broadcast_time = now
        except Exception as net_err:
            pass

        # 2. Enviar a Backend Local si está activo
        try:
            session.post(LOCAL_API_URL, json=payload, timeout=0.3)
        except Exception:
            pass

    except KeyboardInterrupt:
        print("\n⏹️ Puente detenido por el usuario.", flush=True)
        ser.close()
        break
    except Exception as err:
        time.sleep(0.5)
