"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { X, Play, FileText, Download, ShieldCheck, Film, ExternalLink } from "lucide-react";

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoVideoModal({ isOpen, onClose }: DemoVideoModalProps) {
  const t = useTranslations("demoModal");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Play automatically when opened
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-[#0c0c0c] border border-[#333333] shadow-2xl p-5 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto">
        {/* NVIDIA Corner accents */}
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#76b900]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#76b900]" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#222222] pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-[#76b900]/15 text-[#76b900] border border-[#76b900]/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                {t("badge")}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase">
                {t("title")}
              </h3>
            </div>
            <p className="text-xs text-[#888888] font-mono">
              {t("subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#888888] hover:text-white border border-[#333333] hover:border-white transition-colors"
            aria-label={t("close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative bg-black border border-[#2a2a2a] rounded-[2px] overflow-hidden shadow-inner">
          <video
            ref={videoRef}
            src="/media/STELLARAPP_Demo.mp4"
            controls
            playsInline
            className="w-full max-h-[52vh] object-contain mx-auto bg-black"
          />
        </div>

        {/* Video Technical Note */}
        <div className="p-3 bg-[#121212] border border-[#222222] flex items-center justify-between gap-3 text-xs font-mono text-[#a7a7a7]">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-[#76b900] shrink-0" />
            <span className="text-[11px] leading-relaxed">{t("videoNote")}</span>
          </div>
          <span className="text-[10px] text-[#777777] uppercase shrink-0 hidden sm:inline">
            HIL · RP2040 · 115200 BAUD
          </span>
        </div>

        {/* Dossier & PDF Downloads Bar */}
        <div className="pt-2 border-t border-[#222222] space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#888888]">
            DOCUMENTACIÓN OFICIAL & DOSSIER TÉCNICO (PDF):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
            {/* 1. Main NASA Report in English */}
            <a
              href="/STELLARAPP_NASA_INGLES.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-[#14230b] hover:bg-[#1f3711] text-[#76b900] border border-[#76b900] rounded-[2px] transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2 truncate">
                <FileText className="h-4 w-4 shrink-0" />
                <span className="font-bold text-[11px] truncate">{t("downloadEn")}</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 shrink-0 ml-1" />
            </a>

            {/* 2. Official Judge Audit Report */}
            <a
              href="/AUDITORIA_JUEZ_NASA_SPACE_APPS_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-[#0e1726] hover:bg-[#16253d] text-[#6ec8ff] border border-[#0088cc]/60 rounded-[2px] transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2 truncate">
                <FileText className="h-4 w-4 shrink-0" />
                <span className="font-bold text-[11px] truncate">{t("downloadAudit")}</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 shrink-0 ml-1" />
            </a>

            {/* 3. Hardware & Software Technical Sheet */}
            <a
              href="/StellarApp_Ficha_Tecnica_Hardware_Software.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-black hover:bg-[#161616] text-white border border-[#444444] hover:border-white rounded-[2px] transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2 truncate">
                <FileText className="h-4 w-4 shrink-0" />
                <span className="font-bold text-[11px] truncate">{t("downloadTech")}</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 shrink-0 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
