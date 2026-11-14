# Ralph Loop Plan: Deep Analysis, Automated Tests & Pitch Defense

## Estado General
- **Progreso:** 2 de 5 tareas completadas (40%)
- **Modo:** Ralph Loop Autónomo (Task -> Code -> Tests -> Feedback -> Repeat)
- **Objetivo:** Ejecutar análisis profundo del proyecto StellarApp, crear suite integral de tests, implementar mejoras identificadas y actualizar el Pitch Deck para el Space Apps Challenge.

---

## Tareas Atómicas

- [x] **Tarea 1: Suite Integral de Pruebas Automatizadas Backend (Tests)**
  - Creado `backend/tests/test_physics.py` para modelos de combustión microgravedad (NASA-STD-6001, difusión esférica, radios de apagado, número de Grashof).
  - Creado `backend/tests/test_ai_service.py` para guardrails aeroespaciales, Instant AeroEngine y Ollama fallback.
  - Creado `backend/tests/test_api_endpoints.py` para todos los endpoints (`/api/experiments`, `/api/simulate`, `/api/chat`, `/api/analytics/charts`, `/api/thermal-limits`, `/health`).
  - Instalado `pytest` en `.venv` y verificado 100% de tests pasando (26 de 26 exitosos).
  - Agregado endpoint `/health` y `pytest.ini`.

- [x] **Tarea 2: Auditoría Profunda de Código y Mejoras de Resiliencia**
  - Robustecida validación de entradas físicas en `physics_engine.py` (clamping estricto de [0.0, 100.0] para O2).
  - Robustecido `_is_query_in_domain` en `ai_service.py` con regex de palabra exacta `\bco\b` evitando falsos positivos con palabras como 'tacos' o 'cocinar'.
  - Agregadas restricciones y esquemas Pydantic `Field` con rangos físicos de vuelo espacial en `main.py`.
  - Creado endpoint modular `/api/thermal-limits` referenciando NASA-STD-3001 y NASA-SP-20205001358.
  - Sincronizados tipos estrictos TypeScript (`ThermalToleranceBand`, `ThermalExcursionPoint`, `ThermalLimitsResponse`) en `frontend/types.ts`.
  - Suite de pruebas backend ampliada a 29 tests con 100% aprobados.

- [ ] **Tarea 3: Verificación Automatizada y Build del Frontend**
  - Ejecutar type-check y build de Next.js (`npm run build`).
  - Corregir cualquier advertencia o discrepancia de interfaces TypeScript.
  - Validar que todos los componentes (AnalyticsCharts, FloatingAIAgent, ComparisonViewer, AISimulator) compilen limpiamente.

- [ ] **Tarea 4: Actualización Estratégica del Pitch Deck (`frontend/app/pitch/page.tsx`)**
  - Incorporar diapositivas/secciones dedicadas que justifiquen técnicamente las innovaciones:
    1. Arquitectura de Calidad Ralph Loop & 100% Test Coverage.
    2. Motor Híbrido AeroEngine Dual (<1ms deterministic + Qwen 2.5 3B local en órbita).
    3. Límites de Supervivencia Térmica Humana y Estructural (NASA-STD-3001 vs NASA-SP-20205001358).
    4. Agente Asistente Flotante con Mascota Astronauta y Grounding Aeroespacial.
    5. Puente Telemetría Tierra-Espacio (FIRMS + ISS microgravedad).
  - Validar renderizado y diseño visual.

- [ ] **Tarea 5: Despliegue en Servidor Remoto y Verificación End-to-End**
  - Commit y push a GitHub (`origin/main`).
  - Desplegar en `ssh server` (`/opt/stellarapp`) con `docker compose up --build -d`.
  - Verificar HTTP 200 en vivo en `https://stellarapp.nerosystem.solutions`, `/pitch`, y endpoints de API.
