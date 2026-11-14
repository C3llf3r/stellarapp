"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Compass, Sparkles, Presentation, Radio, Globe2, BarChart3 } from "lucide-react";

interface NavbarProps {
  onOpenAI: () => void;
  onOpenSimulator: () => void;
  onOpenAnalytics?: () => void;
}

interface ISSTelemetry {
  latitude: number;
  longitude: number;
  altitude_km: number;
  velocity_kmh: number;
  is_live: boolean;
}

export default function Navbar({ onOpenAI, onOpenSimulator, onOpenAnalytics }: NavbarProps) {
  const [iss, setIss] = useState<ISSTelemetry | null>(null);

  useEffect(() => {
    const fetchISS = () => {
      fetch("/api/iss/live")
        .then((res) => res.json())
        .then((data) => setIss(data))
        .catch(() => {});
    };
    fetchISS();
    const interval = setInterval(fetchISS, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-[#333333]">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="h-7 w-7 bg-[#76b900] flex items-center justify-center">
            <Flame className="h-4 w-4 text-black fill-black" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-bold text-base sm:text-lg tracking-wider text-white">
              STELLAR<span className="text-[#76b900]">APP</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#898989] uppercase border-l border-[#333333] pl-2 hidden sm:inline">
              NASA SPACE APPS
            </span>
          </div>
        </Link>

        {/* Live ISS Orbital Telemetry Widget */}
        <div className="hidden lg:flex items-center space-x-3 px-3 py-1.5 bg-[#1a1a1a] border border-[#333333] text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-[#76b900]">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span className="font-bold uppercase tracking-wider">ISS LIVE:</span>
          </div>
          {iss ? (
            <div className="flex items-center space-x-2 text-[#cccccc]">
              <span>ALT: <strong className="text-white">{iss.altitude_km} km</strong></span>
              <span className="text-[#333333]">|</span>
              <span>VEL: <strong className="text-white">{iss.velocity_kmh} km/h</strong></span>
              <span className="text-[#333333]">|</span>
              <span className="text-[10px] text-[#76b900] font-bold">[ORBITING]</span>
            </div>
          ) : (
            <span className="text-[#757575]">CONECTANDO TELEMETRÍA...</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link
            href="/pitch"
            className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#76b900] border border-[#76b900] hover:bg-[#76b900] hover:text-black transition-colors"
          >
            <Presentation className="h-3.5 w-3.5" />
            <span>PITCH</span>
          </Link>

          {onOpenAnalytics && (
            <button
              onClick={onOpenAnalytics}
              className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white border border-[#333333] hover:border-white transition-colors"
            >
              <BarChart3 className="h-3.5 w-3.5 text-[#76b900]" />
              <span>GRÁFICOS</span>
            </button>
          )}

          <button
            onClick={onOpenSimulator}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white border border-[#333333] hover:border-white transition-colors"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>SIMULADOR</span>
          </button>

          <button
            onClick={onOpenAI}
            className="inline-flex items-center space-x-1 sm:space-x-1.5 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-[#76b900] text-black hover:bg-[#5a8d00] transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 fill-black" />
            <span>AGENTE IA</span>
          </button>
        </div>
      </div>
    </header>
  );
}
