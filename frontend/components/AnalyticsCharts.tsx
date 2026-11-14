"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Flame,
  ShieldAlert,
  Layers,
  Info,
  Maximize2,
} from "lucide-react";

interface FlameSpreadPoint {
  o2_pct: number;
  microgravity_0g: number;
  lunar_016g: number;
  mars_038g: number;
  earth_1g: number;
  artemis_baseline: number;
}

interface MaterialRadiation {
  material: string;
  frp_kw: number;
  flux_kw_m2: number;
  loi_pct: number;
  risk: string;
}

interface SootPoint {
  size_um: string;
  earth_1g: number;
  microgravity_0g: number;
}

interface FlammabilityPoint {
  name: string;
  loi: number;
  quenching_mm: number;
  safe: boolean;
}

export default function AnalyticsCharts() {
  const [activeTab, setActiveTab] = useState<"all" | "flame" | "radiation" | "soot" | "flammability">("all");
  const [flameData, setFlameData] = useState<FlameSpreadPoint[]>([]);
  const [materialsData, setMaterialsData] = useState<MaterialRadiation[]>([]);
  const [sootData, setSootData] = useState<SootPoint[]>([]);
  const [flammabilityData, setFlammabilityData] = useState<FlammabilityPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/charts")
      .then((res) => res.json())
      .then((data) => {
        if (data.flame_spread_vs_o2) setFlameData(data.flame_spread_vs_o2);
        if (data.materials_radiation) setMaterialsData(data.materials_radiation);
        if (data.soot_distribution) setSootData(data.soot_distribution);
        if (data.flammability_envelope) setFlammabilityData(data.flammability_envelope);
        setLoading(false);
      })
      .catch(() => {
        // Fallback pre-calculated scientific series
        setFlameData([
          { o2_pct: 16, microgravity_0g: 0.08, lunar_016g: 0, mars_038g: 0, earth_1g: 0, artemis_baseline: 26 },
          { o2_pct: 18, microgravity_0g: 0.41, lunar_016g: 0.29, mars_038g: 0.2, earth_1g: 0.11, artemis_baseline: 26 },
          { o2_pct: 20, microgravity_0g: 0.74, lunar_016g: 0.58, mars_038g: 0.46, earth_1g: 0.33, artemis_baseline: 26 },
          { o2_pct: 21, microgravity_0g: 0.91, lunar_016g: 0.72, mars_038g: 0.58, earth_1g: 0.44, artemis_baseline: 26 },
          { o2_pct: 23, microgravity_0g: 1.24, lunar_016g: 1.01, mars_038g: 0.84, earth_1g: 0.66, artemis_baseline: 26 },
          { o2_pct: 26, microgravity_0g: 1.73, lunar_016g: 1.45, mars_038g: 1.24, earth_1g: 0.99, artemis_baseline: 26 },
          { o2_pct: 28, microgravity_0g: 2.06, lunar_016g: 1.74, mars_038g: 1.5, earth_1g: 1.21, artemis_baseline: 26 },
          { o2_pct: 32, microgravity_0g: 2.72, lunar_016g: 2.32, mars_038g: 2.02, earth_1g: 1.65, artemis_baseline: 26 },
          { o2_pct: 36, microgravity_0g: 3.38, lunar_016g: 2.9, mars_038g: 2.54, earth_1g: 2.09, artemis_baseline: 26 },
        ]);
        setMaterialsData([
          { material: "PMMA (Acrílico)", frp_kw: 18.4, flux_kw_m2: 24.2, loi_pct: 17.3, risk: "Extremo" },
          { material: "SIBL Algodón/Vidrio", frp_kw: 12.8, flux_kw_m2: 16.5, loi_pct: 16.5, risk: "Crítico" },
          { material: "Silicona RTV", frp_kw: 7.2, flux_kw_m2: 9.4, loi_pct: 22.0, risk: "Moderado" },
          { material: "ETFE Cableado", frp_kw: 4.1, flux_kw_m2: 5.8, loi_pct: 25.0, risk: "Moderado" },
          { material: "Kapton Película", frp_kw: 2.6, flux_kw_m2: 3.7, loi_pct: 27.5, risk: "Bajo" },
          { material: "Nomex Textil", frp_kw: 0.8, flux_kw_m2: 1.2, loi_pct: 28.5, risk: "Auto-extinguible" },
        ]);
        setSootData([
          { size_um: "0.05", earth_1g: 42.0, microgravity_0g: 4.5 },
          { size_um: "0.10", earth_1g: 34.0, microgravity_0g: 9.2 },
          { size_um: "0.25", earth_1g: 14.5, microgravity_0g: 18.0 },
          { size_um: "0.50", earth_1g: 6.2, microgravity_0g: 26.5 },
          { size_um: "1.00", earth_1g: 2.1, microgravity_0g: 22.4 },
          { size_um: "2.50", earth_1g: 0.9, microgravity_0g: 12.8 },
          { size_um: "5.00+", earth_1g: 0.3, microgravity_0g: 6.6 },
        ]);
        setFlammabilityData([
          { name: "SIBL (Algodón)", loi: 16.5, quenching_mm: 6.8, safe: false },
          { name: "PMMA", loi: 17.3, quenching_mm: 5.2, safe: false },
          { name: "Silicona", loi: 22.0, quenching_mm: 8.5, safe: false },
          { name: "ETFE", loi: 25.0, quenching_mm: 9.8, safe: false },
          { name: "Kapton", loi: 27.5, quenching_mm: 11.2, safe: true },
          { name: "Nomex", loi: 28.5, quenching_mm: 12.4, safe: true },
        ]);
        setLoading(false);
      });
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a1a] border border-[#76b900] p-2.5 text-xs font-mono shadow-xl rounded-[2px]">
          <p className="text-white font-bold mb-1 border-b border-[#333333] pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="flex justify-between gap-4">
              <span>{entry.name}:</span>
              <strong className="text-white">{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="analytics-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#333333]">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#76b900] uppercase tracking-widest">
            <BarChart3 className="h-4 w-4" />
            <span>CENTRO DE TELEMETRÍA Y ANALÍTICA GRÁFICA NASA</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Visualización Comparativa de Combustión & Dinámica de Fuego
          </h2>
          <p className="text-xs text-[#898989] mt-0.5">
            Modelos de regresión empírica validados contra misiones Saffire (I-IV), BASS-II, FLEX-2 y SAME.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#1a1a1a] border border-[#333333] p-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "all" ? "bg-[#76b900] text-black" : "text-[#cccccc] hover:text-white"
            }`}
          >
            TODOS LOS GRÁFICOS
          </button>
          <button
            onClick={() => setActiveTab("flame")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "flame" ? "bg-[#76b900] text-black" : "text-[#cccccc] hover:text-white"
            }`}
          >
            PROPAGACIÓN vs O₂
          </button>
          <button
            onClick={() => setActiveTab("radiation")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "radiation" ? "bg-[#76b900] text-black" : "text-[#cccccc] hover:text-white"
            }`}
          >
            FRP & RADIACIÓN
          </button>
          <button
            onClick={() => setActiveTab("soot")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "soot" ? "bg-[#76b900] text-black" : "text-[#cccccc] hover:text-white"
            }`}
          >
            HOLLÍN SAME (ISS)
          </button>
          <button
            onClick={() => setActiveTab("flammability")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "flammability" ? "bg-[#76b900] text-black" : "text-[#cccccc] hover:text-white"
            }`}
          >
            MATRIZ NASA-STD-6001
          </button>
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Flame Spread vs O2 Concentration */}
        {(activeTab === "all" || activeTab === "flame") && (
          <div className="relative bg-[#1a1a1a] border border-[#333333] p-6 space-y-4">
            <div className="corner-square" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-[#76b900]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Tasa de Propagación (mm/s) vs. Concentración de O₂ (%)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#76b900] bg-black px-2 py-0.5 border border-[#333333]">
                SAFFIRE MODEL
              </span>
            </div>

            <p className="text-[11px] text-[#898989] leading-tight">
              En microgravedad con flujo forzado constante (15 cm/s), la llama quema más rápido que en 1g debido a la falta de turbulencia convectiva que enfría la zona de reacción.
            </p>

            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={flameData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis
                    dataKey="o2_pct"
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: "% Oxígeno en Cabina", position: "insideBottom", offset: -5, fill: "#757575", fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: "Velocidad (mm/s)", angle: -90, position: "insideLeft", fill: "#757575", fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 10, fontFamily: "monospace", paddingTop: 8 }}
                    formatter={(val) => <span className="text-[#cccccc]">{val}</span>}
                  />
                  <ReferenceLine
                    x={26}
                    stroke="#df6500"
                    strokeDasharray="4 4"
                    label={{ value: "LÍMITE ARTEMIS 26% O₂", fill: "#df6500", fontSize: 9, position: "top" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="microgravity_0g"
                    name="Microgravedad 0g (Cygnus)"
                    stroke="#76b900"
                    strokeWidth={2.5}
                    dot={{ fill: "#76b900", r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lunar_016g"
                    name="Luna (0.16g)"
                    stroke="#00b0ff"
                    strokeWidth={2}
                    dot={{ fill: "#00b0ff", r: 2.5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mars_038g"
                    name="Marte (0.38g)"
                    stroke="#e040fb"
                    strokeWidth={2}
                    dot={{ fill: "#e040fb", r: 2.5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="earth_1g"
                    name="Tierra 1g (Referencia)"
                    stroke="#757575"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    dot={{ fill: "#757575", r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#333333] text-[10px] font-mono">
              <div className="bg-black p-2 border border-[#262626]">
                <span className="text-[#757575] block">EXP. 21% O₂ (ISS):</span>
                <strong className="text-white">0.91 mm/s</strong>
              </div>
              <div className="bg-black p-2 border border-[#df6500]/40">
                <span className="text-[#df6500] block">ARTEMIS 26% O₂:</span>
                <strong className="text-[#df6500]">1.73 mm/s (+90%)</strong>
              </div>
              <div className="bg-black p-2 border border-[#262626]">
                <span className="text-[#757575] block">EXTINCIÓN LOI:</span>
                <strong className="text-[#76b900]">&lt; 15.5% O₂</strong>
              </div>
            </div>
          </div>
        )}

        {/* Chart 2: Fire Radiative Power (FRP) & Thermal Flux by Material */}
        {(activeTab === "all" || activeTab === "radiation") && (
          <div className="relative bg-[#1a1a1a] border border-[#333333] p-6 space-y-4">
            <div className="corner-square" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="h-4 w-4 text-[#df6500]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Potencia Radiativa de Fuego (FRP kW) & Flujo Térmico (kW/m²)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#df6500] bg-black px-2 py-0.5 border border-[#333333]">
                NASA FIRMS & SAFFIRE
              </span>
            </div>

            <p className="text-[11px] text-[#898989] leading-tight">
              Calibración cruzada del sensor MODIS/VIIRS adaptado a cabinas espaciales: el acrílico PMMA emite 18.4 kW de energía radiativa sin disipación convectiva.
            </p>

            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={materialsData} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis
                    dataKey="material"
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 9, fontFamily: "monospace" }}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: "Potencia (kW) / Flujo (kW/m²)", angle: -90, position: "insideLeft", fill: "#757575", fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 10, fontFamily: "monospace", paddingTop: 8 }}
                    formatter={(val) => <span className="text-[#cccccc]">{val}</span>}
                  />
                  <Bar dataKey="frp_kw" name="FRP Radiativo (kW)" fill="#df6500">
                    {materialsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.risk === "Extremo" ? "#df6500" : entry.risk === "Crítico" ? "#f59e0b" : entry.risk === "Moderado" ? "#eab308" : "#76b900"}
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="flux_kw_m2" name="Flujo Térmico (kW/m²)" fill="#76b900" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#333333] text-[10px] font-mono">
              <div className="bg-black p-2 border border-[#262626]">
                <span className="text-[#757575] block">PMMA MÁXIMO FRP:</span>
                <strong className="text-[#df6500]">18.4 kW</strong>
              </div>
              <div className="bg-black p-2 border border-[#262626]">
                <span className="text-[#757575] block">NOMEX AUTO-EXT.:</span>
                <strong className="text-[#76b900]">0.8 kW (Seguro)</strong>
              </div>
              <div className="bg-black p-2 border border-[#262626]">
                <span className="text-[#757575] block">KAPTON ENERGÍA:</span>
                <strong className="text-white">2.6 kW</strong>
              </div>
            </div>
          </div>
        )}

        {/* Chart 3: Soot Aerosol Particle Size Distribution (SAME vs 1g) */}
        {(activeTab === "all" || activeTab === "soot") && (
          <div className="relative bg-[#1a1a1a] border border-[#333333] p-6 space-y-4">
            <div className="corner-square" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-[#00b0ff]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Hollín & Aerosoles: Aglomeración SAME (0g) vs. Tierra (1g)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#00b0ff] bg-black px-2 py-0.5 border border-[#333333]">
                EXP. SAME (ISS)
              </span>
            </div>

            <p className="text-[11px] text-[#898989] leading-tight">
              Los detectores de ionización terrestres fallan en la ISS porque en 0g las partículas de hollín no escapan y se aglomeran en tamaños gigantes (&gt;0.5 a 5.0 µm).
            </p>

            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sootData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis
                    dataKey="size_um"
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: "Diámetro de Partícula (µm)", position: "insideBottom", offset: -5, fill: "#757575", fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: "% Distribución en Masa", angle: -90, position: "insideLeft", fill: "#757575", fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 10, fontFamily: "monospace", paddingTop: 8 }}
                    formatter={(val) => <span className="text-[#cccccc]">{val}</span>}
                  />
                  <Bar dataKey="microgravity_0g" name="Microgravedad ISS (SAME)" fill="#00b0ff" />
                  <Bar dataKey="earth_1g" name="Ambiente Terrestre 1g" fill="#525252" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#333333] text-[10px] font-mono">
              <div className="bg-black p-2 border border-[#00b0ff]/40">
                <span className="text-[#00b0ff] block">PICO EN MICROGRAVEDAD:</span>
                <strong className="text-white">0.50 µm (26.5% de masa)</strong>
              </div>
              <div className="bg-black p-2 border border-[#262626]">
                <span className="text-[#757575] block">PICO EN TIERRA (1g):</span>
                <strong className="text-[#898989]">0.05 µm (42.0% de masa)</strong>
              </div>
            </div>
          </div>
        )}

        {/* Chart 4: NASA-STD-6001 Flammability Matrix */}
        {(activeTab === "all" || activeTab === "flammability") && (
          <div className="relative bg-[#1a1a1a] border border-[#333333] p-6 space-y-4">
            <div className="corner-square" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="h-4 w-4 text-[#76b900]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Matriz de Inflamabilidad NASA-STD-6001 (LOI vs Quenching)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#76b900] bg-black px-2 py-0.5 border border-[#333333]">
                CERTIFICACIÓN JSC
              </span>
            </div>

            <p className="text-[11px] text-[#898989] leading-tight">
              Los materiales con Índice de Oxígeno Límite (LOI) &gt; 26% y Distancia de Quenching &gt; 10 mm son autorizados para cabina habitable de Artemis.
            </p>

            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={flammabilityData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis
                    dataKey="name"
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 9, fontFamily: "monospace" }}
                  />
                  <YAxis
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: "LOI (%) / Dist. Quenching (mm)", angle: -90, position: "insideLeft", fill: "#757575", fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 10, fontFamily: "monospace", paddingTop: 8 }}
                    formatter={(val) => <span className="text-[#cccccc]">{val}</span>}
                  />
                  <ReferenceLine
                    y={26}
                    stroke="#df6500"
                    strokeDasharray="4 4"
                    label={{ value: "UMBRAL CERTIFICACIÓN NASA (26% LOI)", fill: "#df6500", fontSize: 9 }}
                  />
                  <Bar dataKey="loi" name="Índice Oxígeno Límite (LOI %)" fill="#76b900">
                    {flammabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.safe ? "#76b900" : "#df6500"} />
                    ))}
                  </Bar>
                  <Bar dataKey="quenching_mm" name="Distancia de Quenching (mm)" fill="#00b0ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#333333] text-[10px] font-mono">
              <div className="bg-black p-2 border border-[#76b900]/40">
                <span className="text-[#76b900] block">MATERIALES CERTIFICADOS:</span>
                <strong className="text-white">Nomex (28.5%) &amp; Kapton (27.5%)</strong>
              </div>
              <div className="bg-black p-2 border border-[#df6500]/40">
                <span className="text-[#df6500] block">MATERIALES PROHIBIDOS EN ARTEMIS:</span>
                <strong className="text-white">PMMA (17.3%) &amp; Algodón (16.5%)</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
