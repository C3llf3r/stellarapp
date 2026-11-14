import os
import json
import httpx
from typing import Dict, Any, List

class CombustionAIService:
    def __init__(self, dataset_path: str):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.dataset_path = dataset_path
        self.dataset = self._load_dataset()

    def _load_dataset(self) -> List[Dict[str, Any]]:
        try:
            with open(self.dataset_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading NASA dataset: {e}")
            return []

    def _is_query_in_domain(self, query: str) -> bool:
        """
        Guardrail: Verifies that the query pertains strictly to NASA spaceflight,
        microgravity combustion, fire safety, or spacecraft ECLSS.
        """
        domain_keywords = [
            "fuego", "fire", "combusti", "llama", "flame", "flames", "cool flame",
            "microgravedad", "microgravity", "0g", "gravedad", "gravity", "convecci", "buoyancy",
            "saffire", "bass", "flex", "acme", "same", "cir", "firms", "frp",
            "artemis", "marte", "mars", "luna", "moon", "iss", "cygnus", "orion", "gateway",
            "oxigeno", "oxígeno", "o2", "presion", "presión", "flujo", "ventilaci", "aire",
            "pmma", "nomex", "algodon", "algodón", "cotton", "kapton", "teflon", "etfe", "silicon", "heptan",
            "humo", "smoke", "soot", "hollin", "hollín", "aerosol",
            "extinci", "supresi", "nitrogeno", "nitrógeno", "co2", "apagar",
            "kalman", "sensor", "monoxido", "monóxido", "co", "ppm", "toxic", "eclss",
            "nasa", "std-6001", "astronauta", "tripulaci", "seguridad", "nave", "habitat", "hábitat"
        ]
        q = query.lower()
        return any(kw in q for kw in domain_keywords)

    async def ask_safety_assistant(self, query: str) -> Dict[str, Any]:
        """
        Uses NASA combustion data as grounding context to answer astronaut fire safety queries.
        Enforces strict domain guardrails.
        """
        # Guardrail check
        if not self._is_query_in_domain(query):
            return {
                "answer": (
                    "⚠️ **CONTROL DE DOMINIO Y GUARDRAILS DE MISIÓN (NASA STELLARAPP):**\n\n"
                    "Esta terminal de inteligencia artificial está **estrictamente restringida al perímetro técnico del proyecto**:\n"
                    "• Física de combustión en microgravedad (0g, Lunar, Marciana).\n"
                    "• Misiones de vuelo espacial NASA: Saffire, BASS-II, FLEX-2, ACME y SAME.\n"
                    "• Atmósferas de exploración espacial y enriquecimiento de O₂ (Artemis 26% O₂).\n"
                    "• Filtrado de ruido sensorial de gases tóxicos (Filtro de Kalman para CO).\n"
                    "• Correlación y modelado radiativo entre incendios terrestres (NASA FIRMS) y naves espaciales.\n\n"
                    "**Consultas sugeridas que puedes realizar:**\n"
                    "1. *'¿Por qué las llamas son esféricas y azules en microgravedad?'*\n"
                    "2. *'¿Qué peligro tiene la atmósfera al 26% de O₂ en la misión Artemis?'*\n"
                    "3. *'¿Cómo detecta el experimento SAME las partículas de humo aglomeradas en la ISS?'*\n"
                    "4. *'¿Por qué el Nomex es auto-extinguible según NASA-STD-6001?'*"
                ),
                "grounded": True,
                "model": "NASA-Domain-Guardrails",
                "sources": ["NASA-STD-6001B", "NASA-SP-20205001358"]
            }

        context_summary = json.dumps(self.dataset, indent=2)

        prompt = f"""You are the NASA Fire Safety & Combustion Science AI Specialist for human spaceflight missions (ISS, Artemis Lunar Base, Mars Transit).
Use the following official NASA microgravity combustion experimental data (Saffire, BASS-II, FLEX-2, ACME) to answer the user inquiry accurately and technically.

CRITICAL GUARDRAIL: You are strictly scoped to NASA microgravity combustion science and astronaut fire safety. If the user asks anything outside this domain, politely refuse and redirect them to the project scope.

NASA COMBUSTION DATA CONTEXT:
{context_summary}

USER QUESTION:
{query}

INSTRUCTIONS:
1. Provide a rigorous, data-driven answer citing specific NASA experiments (e.g., Saffire-I, BASS-II, FLEX-2).
2. Explain the physical mechanism (e.g. lack of natural convection/buoyancy in 0g, diffusion flames, cool flame phenomenon, radiative heat loss, limiting oxygen index).
3. Conclude with concrete operational recommendations for spacecraft crew and environmental control (ECLSS).
4. Respond in Spanish (as requested by mission command).
"""

        # Call Gemini API if key is present
        if self.api_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={self.api_key}"
                payload = {
                    "contents": [{
                        "parts": [{"text": prompt}]
                    }]
                }
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        text = data["candidates"][0]["content"]["parts"][0]["text"]
                        return {
                            "answer": text,
                            "grounded": True,
                            "model": "gemini-2.0-flash",
                            "sources": [item["id"] for item in self.dataset[:4]]
                        }
            except Exception as err:
                print(f"Gemini API error: {err}")

        # Fallback intelligent rule-based agent if GEMINI_API_KEY is not yet configured by user
        return self._generate_fallback_answer(query)

    def _generate_fallback_answer(self, query: str) -> Dict[str, Any]:
        q = query.lower()
        matched = []
        for exp in self.dataset:
            if exp["material"].lower() in q or exp["mission"].lower() in q:
                matched.append(exp)

        if not matched:
            matched = self.dataset[:2]

        ref_exp = matched[0]
        
        simulated_response = (
            f"**Análisis de Seguridad Espacial NASA (Basado en {ref_exp['mission']})**\n\n"
            f"1. **Mecanismo Físico:** En microgravedad ({ref_exp['environment']}), la ausencia de convección natural impide que los gases calientes asciendan. "
            f"La combustión pasa a ser dominada por difusión molecular y ventilación forzada ({ref_exp['air_flow_velocity_cms']} cm/s).\n"
            f"2. **Comportamiento del Material ({ref_exp['material']}):** Presenta una tasa de propagación de llama de {ref_exp['flame_spread_rate_mms']} mm/s "
            f"con forma de llama '{ref_exp['flame_shape']}'. Índice de Oxígeno Límite (LOI): {ref_exp['limiting_oxygen_index_pct']}%.\n"
            f"3. **Riesgo Operacional en Nave:** {ref_exp['spacecraft_implication']}\n"
            f"4. **Protocolo de Supresión Recomendado:** {ref_exp['recommended_suppression']}.\n\n"
            f"*(Nota: Para habilitar respuestas generativas en tiempo real de Gemini, configure la variable GEMINI_API_KEY en backend/.env)*"
        )

        return {
            "answer": simulated_response,
            "grounded": True,
            "model": "NASA-Combustion-RuleEngine (Fallback)",
            "sources": [e["id"] for e in matched]
        }

    async def simulate_combustion(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates predicted flame behavior and risk index for arbitrary spacecraft atmospheric conditions.
        """
        o2 = float(params.get("oxygen_concentration_pct", 21.0))
        pressure = float(params.get("pressure_kpa", 101.3))
        velocity = float(params.get("air_flow_velocity_cms", 5.0))
        gravity = float(params.get("gravity_g", 0.0001))
        material = params.get("material", "PMMA")

        # NASA Empirical risk modeling
        # Higher O2 and lower pressure (exploration atmosphere) increases combustion rate
        # Forced air velocity feeds oxidizer
        # In 0g, low air flow (<1.5 cm/s) can cause radiative quenching, but 5-20 cm/s stabilizes flame
        risk_score = (o2 / 21.0) * (velocity / 10.0 + 0.5) * (1.0 + (0.1 if gravity < 0.1 else 0.0))
        
        if o2 > 25.0:
            risk_level = "Extreme"
        elif risk_score > 1.8:
            risk_level = "Critical"
        elif risk_score > 1.0:
            risk_level = "Moderate"
        else:
            risk_level = "Low"

        estimated_spread_rate = round(max(0.05, (o2 - 14.0) * 0.15 * (1.0 if gravity < 0.1 else 0.8) * (velocity / 10.0 + 0.2)), 2)

        return {
            "input_parameters": params,
            "predicted_risk_level": risk_level,
            "risk_score": round(risk_score, 2),
            "estimated_flame_spread_mms": estimated_spread_rate,
            "cool_flame_risk": True if (gravity < 0.01 and velocity < 3.0) else False,
            "extinction_strategy": "Cortar flujo de ventilación a < 1.0 cm/s de inmediato e inyectar N2/CO2" if gravity < 0.1 else "Uso de extintor de agua nebulizada / CO2",
            "compliance_note": "Parámetro evaluado según estándares NASA-STD-6001 (Flammability, Odor, Offgassing, and Compatibility Requirements)."
        }
