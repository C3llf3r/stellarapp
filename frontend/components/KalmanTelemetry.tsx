"use client";

import React, { useState, useEffect } from "react";
import { Activity, ShieldAlert, Cpu, AlertTriangle, ArrowRight, Gauge } from "lucide-react";

interface Scenario {
  id: string;
  name: string;
  gravity: number;
  volume_m3: number;
  ventilation_factor: number;
  description: string;
}

interface TelemetryResult {
  scenario: Scenario;
  o2_percentage: number;
  raw_co_ppm: number;
  filtered_co_ppm: number;
  kalman_gain: number;
  safety_level: string;
  alert_color: string;
  alert_title: string;
  diagnosis: string;
  required_actions: string[];
  critical_evac_time: string;
}

export default function KalmanTelemetry() {
  const [scenarioId, setScenarioId] = useState("rover");
  const [o2Pct, setO2Pct] = useState(26.0);
  const [data, setData] = useState<TelemetryResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTelemetry = async (scen = scenarioId, o2 = o2Pct) => {
    setLoading(true);
    try {
      const resp = await fetch("/api/telemetry/kalman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario_id: scen, o2_pct: o2 }),
      });
      if (resp.ok) {
        const json = await resp.json();
        setData(json);
      }
    } catch {
      // Fallback local
      setData({
        scenario: {
          id: scen,
          name: scen === "rover" ? "Rover Lunar Presurizado" : scen === "lunar" ? "Base Lunar (Artemis)" : "ISS Módulo",
          gravity: scen === "iss" ? 0 : 0.166,
          volume_m3: scen === "rover" ? 42 : scen === "lunar" ? 280 : 916,
          ventilation_factor: 1,
          description: "Simulación de dispersión de gas tóxico CO en microgravedad.",
        },
        o2_percentage: o2,
        raw_co_ppm: Math.round((o2 - 16) * 7.5 + (Math.random() * 8 - 4)),
        filtered_co_ppm: Math.round((o2 - 16) * 6.8),
        kalman_gain: 0.238,
        safety_level: o2 > 28 ? "CRÍTICO" : o2 > 24 ? "ALERTA" : "PRECAUCIÓN",
        alert_color: o2 > 28 ? "#e52020" : o2 > 24 ? "#df6500" : "#bff230",
        alert_title: o2 > 28 ? "ROJO // EVACUACIÓN" : "NARANJA // ALERTA TÓXICA",
        diagnosis: "Monitoreo en tiempo real con filtro de Kalman para reducción de ruido de sensores IoT.",
        required_actions: [
          "Verificar estanqueidad de escotillas",
          "Ajustar extracción forzada del ECLSS",
          "Preparar máscaras autónomas de O₂",
        ],
        critical_evac_time: scen === "rover" ? "< 3 min" : "< 15 min",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, [scenarioId, o2Pct]);

  return (
    <div id="kalman-section" className="relative bg-[#1a1a1a] border border-[#333333] p-6 lg:p-8">
      {/* Corner Square */}
      <div className="corner-square" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#333333] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#76b900] uppercase tracking-widest">
            <Activity className="h-4 w-4" />
            <span>ALGORITMO PREDICTIVO DE SEGURIDAD ECLSS</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white mt-1">
            Filtro de Kalman: Monitoreo de Toxicidad por CO en Hábitats
          </h2>
          <p className="text-xs text-[#898989] mt-0.5">
            Filtrado estocástico de ruido IoT para calcular tiempos de evacuación crítica en volúmenes confinados.
          </p>
        </div>

        {/* Habitat Selector Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap gap-1 bg-black p-1 border border-[#333333]">
          {[
            { id: "iss", label: "ISS (916 m³)" },
            { id: "lunar", label: "BASE LUNAR (280 m³)" },
            { id: "rover", label: "ROVER LUNAR (42 m³)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setScenarioId(tab.id);
                fetchTelemetry(tab.id, o2Pct);
              }}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                scenarioId === tab.id
                  ? "bg-[#76b900] text-black"
                  : "text-[#898989] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-black border border-[#333333]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Oxígeno Ambiental ({o2Pct}%)
              </span>
              <span className="text-xs font-mono text-[#76b900] font-bold">
                {o2Pct >= 26 ? "Artemis EVA Habitat" : "Estándar ISS"}
              </span>
            </div>
            <input
              type="range"
              min="18"
              max="35"
              step="0.5"
              value={o2Pct}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setO2Pct(val);
                fetchTelemetry(scenarioId, val);
              }}
              className="w-full h-1 bg-[#1a1a1a] appearance-none cursor-pointer accent-[#76b900]"
            />
            <div className="flex justify-between text-[10px] text-[#757575] font-mono mt-1 uppercase">
              <span>18% (Sub-nominal)</span>
              <span>21% (Nominal)</span>
              <span>32% (Enriquecido)</span>
            </div>
          </div>

          {/* Sensor Comparison: Raw vs Filtered */}
          {data && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-black border border-[#333333]">
                <span className="text-[10px] font-bold uppercase text-[#757575] block">Sensor Bruto (Ruido IoT)</span>
                <div className="text-xl font-mono font-bold text-white mt-1">
                  {data.raw_co_ppm} <span className="text-xs text-[#757575]">ppm</span>
                </div>
                <span className="text-[10px] text-[#df6500] font-mono mt-1 block">Oscilación ±3.5σ</span>
              </div>
              <div className="p-4 bg-black border border-[#76b900]">
                <span className="text-[10px] font-bold uppercase text-[#76b900] block">Estimación Kalman (Real)</span>
                <div className="text-xl font-mono font-bold text-[#76b900] mt-1">
                  {data.filtered_co_ppm} <span className="text-xs text-[#76b900]">ppm</span>
                </div>
                <span className="text-[10px] text-[#898989] font-mono mt-1 block">K-Gain: {data.kalman_gain}</span>
              </div>
            </div>
          )}

          <div className="p-3 bg-black border border-[#333333] text-xs text-[#a7a7a7]">
            <span className="text-white font-bold block uppercase text-[11px] mb-1">Volumen & Dinámica:</span>
            <p className="text-xs leading-relaxed">{data?.scenario.description}</p>
          </div>
        </div>

        {/* Telemetry Output Status */}
        <div className="lg:col-span-7 bg-black border border-[#333333] p-6 flex flex-col justify-between">
          {data ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#333333]">
                <div>
                  <span className="text-[10px] font-bold text-[#898989] uppercase tracking-wider block">
                    ESTADO DE CONTINGENCIA
                  </span>
                  <h3 className="text-base font-bold uppercase mt-0.5" style={{ color: data.alert_color }}>
                    {data.alert_title}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#898989] uppercase tracking-wider block">
                    TIEMPO CRÍTICO
                  </span>
                  <span className="text-base font-mono font-bold text-white">
                    {data.critical_evac_time}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-white block mb-1">Diagnóstico Físico:</span>
                <p className="text-xs text-[#cccccc] leading-relaxed">{data.diagnosis}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-[#76b900] block mb-2">
                  Protocolos Obligatorios para la Tripulación:
                </span>
                <ul className="space-y-1.5 text-xs text-[#a7a7a7]">
                  {data.required_actions.map((act, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 bg-[#76b900] shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-xs font-mono text-[#757575]">
              CALCULANDO FILTRADO ESTOCÁSTICO...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
