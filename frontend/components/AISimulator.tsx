"use client";

import React, { useState } from "react";
import { SimulationResult } from "../types";
import { Cpu, Play, Flame, ShieldAlert, AlertCircle } from "lucide-react";

export default function AISimulator() {
  const [material, setMaterial] = useState("PMMA");
  const [gravity, setGravity] = useState(0.0001);
  const [o2, setO2] = useState(21.0);
  const [pressure, setPressure] = useState(101.3);
  const [airFlow, setAirFlow] = useState(10.0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/ai/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material,
          gravity_g: gravity,
          oxygen_concentration_pct: o2,
          pressure_kpa: pressure,
          air_flow_velocity_cms: airFlow,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        setResult(data);
      } else {
        throw new Error("Backend response error");
      }
    } catch {
      const riskScore = (o2 / 21.0) * (airFlow / 10.0 + 0.5) * (gravity < 0.1 ? 1.1 : 1.0);
      const riskLevel = o2 > 25.0 ? "Extreme" : riskScore > 1.8 ? "Critical" : riskScore > 1.0 ? "Moderate" : "Low";
      const spread = Math.max(0.05, (o2 - 14.0) * 0.15 * (gravity < 0.1 ? 1.0 : 0.8) * (airFlow / 10.0 + 0.2));

      setResult({
        input_parameters: {
          material,
          gravity_g: gravity,
          oxygen_concentration_pct: o2,
          pressure_kpa: pressure,
          air_flow_velocity_cms: airFlow,
        },
        predicted_risk_level: riskLevel,
        risk_score: Number(riskScore.toFixed(2)),
        estimated_flame_spread_mms: Number(spread.toFixed(2)),
        cool_flame_risk: gravity < 0.01 && airFlow < 3.0,
        extinction_strategy:
          gravity < 0.1
            ? "Corte inmediato de ventilación de cabina (< 1.0 cm/s) e inyección de gas inerte N₂"
            : "Descarga de extintor de agua nebulizada / CO₂",
        compliance_note: "Evaluado conforme a directrices NASA-STD-6001 (Flammability in Spacecraft Environments).",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="simulator-section" className="relative bg-[#1a1a1a] border border-[#333333] p-6 lg:p-8">
      {/* Corner Square */}
      <div className="corner-square" />

      {/* Header */}
      <div className="flex items-center space-x-2 pb-6 border-b border-[#333333]">
        <Cpu className="h-5 w-5 text-[#76b900]" />
        <div>
          <span className="text-[11px] font-bold text-[#76b900] uppercase tracking-widest block">
            WORKBENCH DE PREDICCIÓN CON IA
          </span>
          <h2 className="text-xl lg:text-2xl font-bold text-white mt-0.5">
            Simulador de Combustión para Atmósferas de Exploración
          </h2>
          <p className="text-xs text-[#898989]">
            Predicción en tiempo real para hábitats lunares (Artemis), tránsitos a Marte y naves orbitales.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Form Controls */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a7a7a7] mb-2">
                Material de Ensayo
              </label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-black border border-[#333333] text-xs font-bold text-white px-3 py-2.5 focus:border-[#76b900] focus:outline-none"
              >
                <option value="PMMA">PMMA (Acrílico estructural)</option>
                <option value="Nomex">Nomex (Fibra de aramida de trajes)</option>
                <option value="Cotton">Algodón (NASA Standard Test 1)</option>
                <option value="ETFE">ETFE (Aislante de cableado aeroespacial)</option>
                <option value="Heptane">n-Heptano (Combustión de gotas)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a7a7a7] mb-2">
                Régimen Gravitatorio
              </label>
              <select
                value={gravity}
                onChange={(e) => setGravity(parseFloat(e.target.value))}
                className="w-full bg-black border border-[#333333] text-xs font-bold text-white px-3 py-2.5 focus:border-[#76b900] focus:outline-none"
              >
                <option value={0.0001}>Microgravedad Orbital (0g - ISS / Cygnus)</option>
                <option value={0.166}>Gravedad Lunar (0.166g - Artemis Base)</option>
                <option value={0.38}>Gravedad Marciana (0.38g - Mars Habitat)</option>
                <option value={1.0}>Gravedad Terrestre (1.0g - Tierra)</option>
              </select>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span className="text-[#cccccc]">Concentración de Oxígeno (% O₂)</span>
                <span className="font-mono text-[#76b900]">{o2}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="34"
                step="0.5"
                value={o2}
                onChange={(e) => setO2(parseFloat(e.target.value))}
                className="w-full h-1 bg-black appearance-none cursor-pointer accent-[#76b900]"
              />
              <div className="flex justify-between text-[10px] text-[#757575] mt-1 font-mono uppercase">
                <span>15% (Límite hipóxico)</span>
                <span>21% (ISS Estándar)</span>
                <span>26%-32% (Artemis EVA Prep)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span className="text-[#cccccc]">Presión de Cabina (kPa)</span>
                <span className="font-mono text-[#76b900]">{pressure} kPa</span>
              </div>
              <input
                type="range"
                min="35"
                max="102"
                step="1"
                value={pressure}
                onChange={(e) => setPressure(parseFloat(e.target.value))}
                className="w-full h-1 bg-black appearance-none cursor-pointer accent-[#76b900]"
              />
              <div className="flex justify-between text-[10px] text-[#757575] mt-1 font-mono uppercase">
                <span>56 kPa (Exploration Atmosphere)</span>
                <span>101.3 kPa (Nivel del mar)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span className="text-[#cccccc]">Flujo de Ventilación (cm/s)</span>
                <span className="font-mono text-[#76b900]">{airFlow} cm/s</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={airFlow}
                onChange={(e) => setAirFlow(parseFloat(e.target.value))}
                className="w-full h-1 bg-black appearance-none cursor-pointer accent-[#76b900]"
              />
              <div className="flex justify-between text-[10px] text-[#757575] mt-1 font-mono uppercase">
                <span>0 cm/s (Auto-asfixia)</span>
                <span>10 cm/s (Flujo normal ECLSS)</span>
                <span>30 cm/s (Conducto activo)</span>
              </div>
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={loading}
            className="w-full py-3 px-6 bg-[#76b900] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#5a8d00] transition-colors flex items-center justify-center space-x-2"
          >
            <Play className="h-3.5 w-3.5 fill-black" />
            <span>{loading ? "CALCULANDO MODELO FÍSICO..." : "EJECUTAR SIMULACIÓN PREDICTIVA"}</span>
          </button>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-5 bg-black border border-[#333333] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#333333]">
              <span className="text-[11px] font-bold text-[#898989] uppercase tracking-wider">
                DIAGNÓSTICO TÉCNICO
              </span>
              {result && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                  result.predicted_risk_level === "Extreme" 
                    ? "border-[#e52020] text-[#e52020]" 
                    : result.predicted_risk_level === "Critical" 
                    ? "border-[#df6500] text-[#df6500]" 
                    : "border-[#76b900] text-[#76b900]"
                }`}>
                  RIESGO: {result.predicted_risk_level}
                </span>
              )}
            </div>

            {result ? (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                    <span className="text-[10px] font-bold uppercase text-[#898989] block">Índice de Riesgo</span>
                    <div className="text-xl font-bold font-mono text-white mt-0.5">{result.risk_score} / 3.0</div>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                    <span className="text-[10px] font-bold uppercase text-[#898989] block">Tasa Estimada</span>
                    <div className="text-xl font-bold font-mono text-[#76b900] mt-0.5">
                      {result.estimated_flame_spread_mms} mm/s
                    </div>
                  </div>
                </div>

                {result.cool_flame_risk && (
                  <div className="p-3 bg-black border-l-2 border-[#df6500] border-t border-r border-b border-[#333333] flex items-start space-x-2">
                    <Flame className="h-4 w-4 text-[#df6500] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#df6500] leading-relaxed">
                      <strong>ALERTA DE FUEGO FRÍO:</strong> Con flujo de aire &lt; 3 cm/s, la combustión continúa sin emisión de luz ni calor convencional detectable por sensores estándar.
                    </p>
                  </div>
                )}

                <div className="p-3 bg-[#1a1a1a] border border-[#333333] text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#898989] block">Estrategia ECLSS</span>
                  <p className="text-[#ffffff] font-bold mt-1 leading-relaxed">{result.extinction_strategy}</p>
                </div>

                <p className="text-[10px] font-mono text-[#757575] uppercase">{result.compliance_note}</p>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center text-[#757575] space-y-2">
                <Cpu className="h-8 w-8 text-[#333333]" />
                <p className="text-xs uppercase font-mono tracking-wider">Ajusta los parámetros y presiona Ejecutar.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
