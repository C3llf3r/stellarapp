"use client";

import React from "react";
import Link from "next/link";
import { 
  Flame, 
  Database, 
  ChevronRight, 
  Check, 
  Sparkles, 
  AlertTriangle,
  Award,
  Terminal,
  ShieldCheck
} from "lucide-react";

export default function PitchLanding() {
  const problems = [
    {
      title: "40 AÑOS DE DATOS INACCESIBLES",
      desc: "Miles de experimentos de combustión (Saffire, BASS, FLEX) dispersos en reportes técnicos estáticos (PDFs en NTRS) y videos sin indexar ni comparar.",
      icon: Database,
    },
    {
      title: "LA FÍSICA CAMBIA RADICALMENTE EN 0G",
      desc: "Sin flotabilidad gravitacional, las llamas se vuelven esféricas, casi invisibles ('Cool Flames') y los protocolos terrestres de extinción fallan de inmediato.",
      icon: Flame,
    },
    {
      title: "NUEVO RIESGO EN ARTEMIS Y MARTE",
      desc: "Las atmósferas de exploración espacial operarán a 26%-34% de O₂ y 56 kPa. Los materiales arden hasta un 95% más rápido con gotas encendidas flotantes.",
      icon: AlertTriangle,
    },
    {
      title: "FALTA DE UN PUENTE TIERRA–ESPACIO",
      desc: "La ciencia del fuego de la NASA estaba fragmentada: observación satelital macro en la Tierra (NASA FIRMS) separada de la combustión micro en naves espaciales (Saffire).",
      icon: Terminal,
    },
  ];

  const valueProps = [
    {
      title: "1. BÚSQUEDA Y CLASIFICACIÓN INSTANTÁNEA",
      desc: "Convierte semanas de revisión bibliográfica en consultas en lenguaje natural de 2 segundos para ingenieros de hábitats espaciales.",
    },
    {
      title: "2. GEMELO DIGITAL DE PREDICCIÓN DE COMBUSTIÓN",
      desc: "Modela la tasa de propagación antes de certificar polímeros o cableados bajo la norma aeroespacial NASA-STD-6001.",
    },
    {
      title: "3. ASISTENTE IA PARA PROTOCOLOS DE TRIPULACIÓN",
      desc: "Proporciona pautas operativas precisas para el sistema ECLSS (corte inmediato de ventilación en lugar de abrir extintores a ciegas).",
    },
    {
      title: "4. PUENTE CIENTÍFICO NASA FIRMS & JUPYTER REPRODUCIBLE",
      desc: "Integra modelos de potencia radiativa (FRP), telemetría ISS en vivo, filtro de Kalman de gases y un notebook Jupyter (.ipynb) auditable.",
    },
  ];

  const pitchQuestions = [
    {
      q: "¿Por qué esto es vital para la NASA hoy y no hace 20 años?",
      a: "Porque la ISS opera a 101 kPa y 21% de O₂ (igual que en la Tierra). Pero el programa Artemis (Luna) y los hábitats de Marte usarán 26%-32% de O₂ para permitir paseos espaciales (EVAs) sin descompresión. En este nuevo régimen, los materiales se queman con una violencia que nunca se vio en la Tierra.",
    },
    {
      q: "¿Cómo ayuda directamente a los astronautas y directores de vuelo?",
      a: "Si ocurre un fuego en 0g, un extintor convencional puede esparcir material fundido por toda la cabina. StellarApp indica qué material se está quemando y cuál es su umbral de extinción por asfixia (cortando el flujo de aire por debajo de 1.2 cm/s).",
    },
    {
      q: "¿Qué ventaja tecnológica aporta la IA frente a una base de datos estática?",
      a: "No solo filtra tablas: predice la velocidad de propagación para combinaciones de gravedad parcial (0.166g Luna, 0.38g Marte) y alerta sobre 'Cool Flames' (fuegos fríos que continúan consumiendo oxígeno sin luz ni calor visible).",
    },
    {
      q: "¿Cómo se conecta la observación de incendios terrestres (NASA FIRMS) con el fuego en una nave espacial?",
      a: "Son los dos extremos de la física de la NASA. En la Tierra el fuego asciende por convección y los satélites miden su radiación FRP en MW. En microgravedad el calor no escapa y se transfiere por radiación directa a las paredes (hasta 42%). Conectar ambos mundos permite a StellarApp modelar el flujo térmico superficial (kW/m²) para proteger la aviónica.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-[#cccccc] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-[#333333] bg-black sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="h-7 w-7 bg-[#76b900] flex items-center justify-center">
              <Flame className="h-4 w-4 text-black fill-black" />
            </div>
            <div>
              <span className="font-bold text-base tracking-wider text-white">STELLAR<span className="text-[#76b900]">APP</span></span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-[#1a1a1a] text-[#76b900] border border-[#333333]">
                NASA SPACE APPS 2026
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#76b900] text-black hover:bg-[#5a8d00] transition-colors"
            >
              <span>ABRIR WORKBENCH EN VIVO</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 py-12 space-y-16">
        {/* Pitch Hero */}
        <div className="relative bg-[#1a1a1a] border border-[#333333] p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-6">
          {/* Corner Square */}
          <div className="corner-square" />

          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-black border border-[#76b900] text-[#76b900] text-xs font-bold uppercase tracking-widest">
            <Award className="h-3.5 w-3.5" />
            <span>CHALLENGE: FLAME & FIRE BEHAVIOR IN MICROGRAVITY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Seguridad contra Incendios para la Exploración Humana en la Luna y Marte
          </h1>

          <p className="text-sm sm:text-base text-[#a7a7a7] max-w-2xl mx-auto leading-relaxed">
            StellarApp es la primera plataforma de <strong>inteligencia de combustión espacial</strong> que desbloquea, clasifica y modela con IA cuatro décadas de investigación de la NASA en microgravedad.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/"
              className="px-6 py-3 bg-[#76b900] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#5a8d00] transition-colors flex items-center space-x-2"
            >
              <Sparkles className="h-4 w-4 fill-black" />
              <span>PROBAR DASHBOARD EN VIVO</span>
            </Link>
            <a
              href="#defensa"
              className="px-6 py-3 bg-black text-white border border-[#333333] hover:border-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              DEFENSA ANTE LOS JUECES
            </a>
          </div>
        </div>

        {/* 1. El Problema */}
        <section className="space-y-6">
          <div>
            <span className="text-[11px] font-bold text-[#76b900] uppercase tracking-widest block">
              DIAGNÓSTICO DEL PROBLEMA
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              El Fuego en Microgravedad Desafía los Estándares Terrestres
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="relative bg-[#1a1a1a] border border-[#333333] p-6">
                  <div className="corner-square" />
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon className="h-4 w-4 text-[#76b900]" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{p.title}</h3>
                  </div>
                  <p className="text-xs text-[#a7a7a7] leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. ¿Para qué sirve y cómo ayuda a la NASA? */}
        <section className="bg-[#1a1a1a] border border-[#333333] p-8 sm:p-12 relative">
          <div className="corner-square" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[11px] font-bold text-[#76b900] uppercase tracking-widest block">
                VALOR ESTRATÉGICO PARA LA NASA
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                ¿Por Qué StellarApp es Indispensable para Artemis?
              </h2>
              <p className="text-xs sm:text-sm text-[#a7a7a7] leading-relaxed">
                En el espacio profundo la evacuación es imposible. La plataforma asiste directamente a la NASA en tres áreas prioritarias:
              </p>
              <div className="space-y-3 pt-2">
                {valueProps.map((vp, idx) => (
                  <div key={idx} className="p-4 bg-black border border-[#333333]">
                    <h4 className="text-xs font-bold text-[#76b900] uppercase tracking-wider">{vp.title}</h4>
                    <p className="text-xs text-[#cccccc] mt-1 leading-relaxed">{vp.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-5 bg-black border border-[#333333] text-center space-y-1">
                <div className="text-3xl font-bold font-mono text-[#76b900]">95%</div>
                <div className="text-[11px] font-bold uppercase text-white">Aumento en Tasa</div>
                <p className="text-[10px] text-[#757575]">En 26% O₂ (Atmósfera Artemis).</p>
              </div>
              <div className="p-5 bg-black border border-[#333333] text-center space-y-1">
                <div className="text-3xl font-bold font-mono text-white">0.0001g</div>
                <div className="text-[11px] font-bold uppercase text-white">Microgravedad Real</div>
                <p className="text-[10px] text-[#757575]">Datos de Cygnus Saffire.</p>
              </div>
              <div className="p-5 bg-black border border-[#333333] text-center space-y-1">
                <div className="text-3xl font-bold font-mono text-[#76b900]">&lt; 1.2 cm/s</div>
                <div className="text-[11px] font-bold uppercase text-white">Extinción Pasiva</div>
                <p className="text-[10px] text-[#757575]">Auto-asfixia al apagar flujo.</p>
              </div>
              <div className="p-5 bg-black border border-[#333333] text-center space-y-1">
                <div className="text-3xl font-bold font-mono text-white">STD-6001</div>
                <div className="text-[11px] font-bold uppercase text-white">Norma NASA</div>
                <p className="text-[10px] text-[#757575]">Ensayos de inflamabilidad.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Defensa ante Jueces */}
        <section id="defensa" className="space-y-6">
          <div>
            <span className="text-[11px] font-bold text-[#76b900] uppercase tracking-widest block">
              DEFENSA TÉCNICA DEL PROYECTO
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Preguntas Clave de los Evaluadores de la NASA
            </h2>
          </div>

          <div className="space-y-4">
            {pitchQuestions.map((item, idx) => (
              <div key={idx} className="p-6 bg-[#1a1a1a] border border-[#333333] space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-black border border-[#76b900] text-[#76b900] font-mono text-xs font-bold">
                    Q{idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-white uppercase">{item.q}</h3>
                </div>
                <p className="text-xs text-[#cccccc] pl-7 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="p-8 bg-[#1a1a1a] border border-[#76b900] text-center space-y-4 relative">
          <div className="corner-square" />
          <h3 className="text-xl font-bold text-white uppercase">Acceso al Panel de Control de Vuelo</h3>
          <p className="text-xs text-[#a7a7a7] max-w-xl mx-auto">
            Explora el catálogo de experimentos, ejecuta la simulación predictiva de atmósferas y consulta al agente IA.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#76b900] text-black font-bold uppercase tracking-wider text-xs hover:bg-[#5a8d00] transition-colors"
          >
            <span>LANZAR WORKBENCH STELLARAPP</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-[#333333] bg-black py-8 text-center text-xs text-[#757575]">
        <p>Equipo StellarApp • NASA Space Apps Challenge 2026</p>
      </footer>
    </div>
  );
}
