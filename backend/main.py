import os
import json
import httpx
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from ai_service import CombustionAIService
from physics_engine import engine, SCENARIOS
from firms_service import firms_bridge

load_dotenv()

app = FastAPI(
    title="NASA StellarApp - Microgravity Fire Safety & Combustion Intelligence API",
    description="Backend API interpreting NASA microgravity flame experiments (Saffire, BASS, FLEX) with AI assistance.",
    version="1.0.0"
)

# CORS configuration for Frontend (Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = Path(__file__).parent / "data" / "nasa_combustion_data.json"
ai_service = CombustionAIService(str(DATA_PATH))

def load_data() -> List[Dict[str, Any]]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

class QueryRequest(BaseModel):
    query: str

class SimulationRequest(BaseModel):
    material: str = "PMMA"
    gravity_g: float = 0.0001
    oxygen_concentration_pct: float = 21.0
    pressure_kpa: float = 101.3
    air_flow_velocity_cms: float = 5.0

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "NASA Microgravity Fire Safety Intelligence Engine",
        "team": "StellarApp",
        "challenge": "NASA Space Apps Challenge 2026",
        "endpoints": ["/api/experiments", "/api/metrics", "/api/comparison", "/api/ai/ask", "/api/ai/simulate"]
    }

@app.get("/api/metrics")
def get_metrics():
    data = load_data()
    total_experiments = len(data)
    materials = list(set(d["material"] for d in data))
    cool_flame_cases = len([d for d in data if d.get("cool_flame_observed")])
    max_spread = max(d.get("flame_spread_rate_mms", 0.0) for d in data)
    critical_risks = len([d for d in data if d.get("safety_risk_level") in ["Critical", "Extreme"]])

    return {
        "total_experiments": total_experiments,
        "unique_materials_count": len(materials),
        "materials": materials,
        "cool_flame_detections": cool_flame_cases,
        "max_flame_spread_rate_mms": max_spread,
        "critical_risk_count": critical_risks,
        "missions_covered": list(set(d["mission"] for d in data))
    }

@app.get("/api/experiments")
def get_experiments(
    material: Optional[str] = Query(None, description="Filtro por material"),
    environment: Optional[str] = Query(None, description="Filtro por entorno (0g, 1g, Lunar, Marte)"),
    risk: Optional[str] = Query(None, description="Filtro por nivel de riesgo"),
    search: Optional[str] = Query(None, description="Búsqueda libre")
):
    items = load_data()

    if material:
        items = [i for i in items if material.lower() in i["material"].lower()]
    if environment:
        items = [i for i in items if environment.lower() in i["environment"].lower()]
    if risk:
        items = [i for i in items if risk.lower() in i["safety_risk_level"].lower()]
    if search:
        s = search.lower()
        items = [
            i for i in items
            if s in i["material"].lower()
            or s in i["mission"].lower()
            or s in i["spacecraft_implication"].lower()
            or s in i["flame_shape"].lower()
        ]

    return items

@app.get("/api/experiments/{exp_id}")
def get_experiment_detail(exp_id: str):
    data = load_data()
    for item in data:
        if item["id"].lower() == exp_id.lower():
            return item
    raise HTTPException(status_code=404, detail="Experimento no encontrado")

@app.get("/api/comparison")
def get_gravity_comparison(material: str = "PMMA"):
    data = load_data()
    matches = [d for d in data if material.lower() in d["material"].lower()]
    return {
        "target_material": material,
        "comparison_data": matches
    }

@app.post("/api/ai/ask")
async def ask_ai(req: QueryRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="La consulta no puede estar vacía")
    result = await ai_service.ask_safety_assistant(req.query)
    return result

@app.post("/api/ai/simulate")
async def simulate_risk(req: SimulationRequest):
    result = await ai_service.simulate_combustion(req.model_dump())
    frp_data = firms_bridge.compute_frp_radiation(
        req.material,
        result.get("estimated_flame_spread_mms", 1.0),
        req.oxygen_concentration_pct,
        req.gravity_g
    )
    result["frp_radiation_analysis"] = frp_data
    return result

class FrpRequest(BaseModel):
    material: str = "PMMA"
    spread_rate_mms: float = 1.45
    oxygen_concentration_pct: float = 21.0
    gravity_g: float = 0.0001

@app.get("/api/firms/summary")
def get_firms_summary():
    return firms_bridge.get_firms_summary()

@app.post("/api/firms/frp")
def calculate_frp(req: FrpRequest):
    return firms_bridge.compute_frp_radiation(
        req.material,
        req.spread_rate_mms,
        req.oxygen_concentration_pct,
        req.gravity_g
    )

class KalmanRequest(BaseModel):
    scenario_id: str = "iss"
    o2_pct: float = 21.0

@app.get("/api/scenarios")
def get_scenarios():
    return [s.to_dict() for s in SCENARIOS.values()]

@app.post("/api/telemetry/kalman")
def get_kalman_telemetry(req: KalmanRequest):
    return engine.compute_telemetry(req.scenario_id, req.o2_pct)

@app.get("/api/analytics/charts")
def get_analytics_charts():
    """
    Returns pre-computed scientific chart series for microgravity fire safety dashboard.
    """
    # 1. Flame spread rate vs O2 concentration across gravities
    o2_levels = [16.0, 18.0, 20.0, 21.0, 23.0, 26.0, 28.0, 32.0, 36.0]
    flame_spread_vs_o2 = []
    for o2 in o2_levels:
        # Physical modeling:
        # Microgravity 0g with Cygnus ventilation (15 cm/s): steady flame anchoring
        spread_0g = round(max(0.0, (o2 - 15.5) * 0.165), 2)
        spread_lunar = round(max(0.0, (o2 - 16.0) * 0.145), 2)
        spread_mars = round(max(0.0, (o2 - 16.5) * 0.13), 2)
        spread_1g = round(max(0.0, (o2 - 17.0) * 0.11), 2)
        flame_spread_vs_o2.append({
            "o2_pct": o2,
            "microgravity_0g": spread_0g,
            "lunar_016g": spread_lunar,
            "mars_038g": spread_mars,
            "earth_1g": spread_1g,
            "artemis_baseline": 26.0
        })

    # 2. Materials FRP and thermal radiative flux comparison
    materials_radiation = [
        {"material": "PMMA (Acrílico)", "frp_kw": 18.4, "flux_kw_m2": 24.2, "loi_pct": 17.3, "risk": "Extremo"},
        {"material": "SIBL Algodón/Vidrio", "frp_kw": 12.8, "flux_kw_m2": 16.5, "loi_pct": 16.5, "risk": "Crítico"},
        {"material": "Silicona RTV", "frp_kw": 7.2, "flux_kw_m2": 9.4, "loi_pct": 22.0, "risk": "Moderado"},
        {"material": "ETFE Cableado", "frp_kw": 4.1, "flux_kw_m2": 5.8, "loi_pct": 25.0, "risk": "Moderado"},
        {"material": "Kapton Película", "frp_kw": 2.6, "flux_kw_m2": 3.7, "loi_pct": 27.5, "risk": "Bajo"},
        {"material": "Nomex Textil", "frp_kw": 0.8, "flux_kw_m2": 1.2, "loi_pct": 28.5, "risk": "Auto-extinguible"}
    ]

    # 3. Aerosol Soot Particle Size Distribution (SAME Experiment vs 1g Earth)
    soot_distribution = [
        {"size_um": "0.05", "earth_1g": 42.0, "microgravity_0g": 4.5},
        {"size_um": "0.10", "earth_1g": 34.0, "microgravity_0g": 9.2},
        {"size_um": "0.25", "earth_1g": 14.5, "microgravity_0g": 18.0},
        {"size_um": "0.50", "earth_1g": 6.2, "microgravity_0g": 26.5},
        {"size_um": "1.00", "earth_1g": 2.1, "microgravity_0g": 22.4},
        {"size_um": "2.50", "earth_1g": 0.9, "microgravity_0g": 12.8},
        {"size_um": "5.00+", "earth_1g": 0.3, "microgravity_0g": 6.6}
    ]

    # 4. Flammability Matrix: LOI vs Quenching Distance
    flammability_envelope = [
        {"name": "SIBL (Algodón)", "loi": 16.5, "quenching_mm": 6.8, "safe": False},
        {"name": "PMMA", "loi": 17.3, "quenching_mm": 5.2, "safe": False},
        {"name": "Silicona", "loi": 22.0, "quenching_mm": 8.5, "safe": False},
        {"name": "ETFE", "loi": 25.0, "quenching_mm": 9.8, "safe": False},
        {"name": "Kapton", "loi": 27.5, "quenching_mm": 11.2, "safe": True},
        {"name": "Nomex", "loi": 28.5, "quenching_mm": 12.4, "safe": True}
    ]

    return {
        "flame_spread_vs_o2": flame_spread_vs_o2,
        "materials_radiation": materials_radiation,
        "soot_distribution": soot_distribution,
        "flammability_envelope": flammability_envelope
    }

@app.get("/api/iss/live")
async def get_iss_telemetry():
    url = "https://api.wheretheiss.at/v1/satellites/25544"
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                d = resp.json()
                return {
                    "latitude": round(float(d["latitude"]), 2),
                    "longitude": round(float(d["longitude"]), 2),
                    "altitude_km": round(float(d["altitude"]), 1),
                    "velocity_kmh": round(float(d["velocity"]), 1),
                    "visibility": d.get("visibility", "daylight"),
                    "is_live": True
                }
    except Exception:
        pass
    return {
        "latitude": 51.64,
        "longitude": 12.45,
        "altitude_km": 420.5,
        "velocity_kmh": 27580.0,
        "visibility": "daylight",
        "is_live": False
    }

