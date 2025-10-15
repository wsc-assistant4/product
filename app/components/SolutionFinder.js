// app/components/SolutionFinder.js

"use client";

import React, { useState } from 'react';
import Image from 'next/image';

// --- Helper Functions & Data ---
const profileOptions = [
  { value: "Pemerintah & Lembaga Publik", iconSrc: "/icons/government.svg" },
  { value: "Bisnis & Sektor Swasta", iconSrc: "/icons/business.svg" },
  { value: "Nirlaba & Komunitas", iconSrc: "/icons/nonprofit.svg" },
  { value: "Akademisi & Lainnya", iconSrc: "/icons/academic.svg" },
];

const focusOptions = {
  "Pemerintah & Lembaga Publik": ["Pengembangan Destinasi", "Kebijakan & Regulasi", "Peningkatan Kapasitas SDM"],
  "Bisnis & Sektor Swasta": ["Perencanaan & Investasi", "Keberlanjutan & ESG", "Pemasaran & Pasar"],
  "Nirlaba & Komunitas": ["Pengembangan Program", "Pendanaan & Kemitraan", "Pengukuran Dampak"],
  "Akademisi & Lainnya": ["Penelitian Terapan", "Pengembangan Kurikulum", "Publikasi & Diseminasi"],
};

const maturityLabels = ["Baru Wacana", "Inisiatif Awal", "Terstruktur", "Terintegrasi", "Optimal"];

const challengeOptions = [
  "Kami punya ide besar, tapi tidak yakin apakah layak.",
  "Kami ingin diakui secara global, tapi bingung memulai sertifikasi.",
  "Kami butuh rencana aksi yang jelas dan terukur.",
  "Kami perlu data akurat tentang wisatawan.",
  "Kami perlu membuktikan dampak positif acara kami.",
];

// --- Komponen-Komponen UI Kecil (didefinisikan di sini agar simpel) ---

function ChoiceCard({ title, iconSrc, onClick, isSelected }) {
  const baseClasses = "rounded-xl border p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 h-full";
  const selectedClasses = "bg-brand-secondary text-white ring-2 ring-brand-accent shadow-lg scale-105";
  const unselectedClasses = "bg-white hover:bg-neutral-light hover:shadow-md text-neutral-dark";
  return (
    <div onClick={onClick} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
      <div className="mb-3 h-10 w-10 flex items-center justify-center">
        <Image src={iconSrc} alt={title} width={40} height={40} className={isSelected ? 'filter-white' : ''} />
      </div>
      <span className="font-semibold text-sm">{title}</span>
    </div>
  );
}

function RadioPill({ label, isSelected, onClick }) {
    const baseClasses = "w-full text-left p-4 border rounded-lg cursor-pointer transition-colors duration-200";
    const selectedClasses = "bg-brand-secondary border-brand-primary text-white font-semibold";
    const unselectedClasses = "bg-white border-neutral-light/80 hover:bg-neutral-light";
    return <div onClick={onClick} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>{label}</div>;
}


// --- Komponen Utama ---
export default function SolutionFinder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    q1_profile: "",
    q2_focus: "",
    q3_maturity: 3,
    q4_challenge: "",
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const nextStep = () => setCurrentStep(prev => prev < 8 ? prev + 1 : prev);
  const prevStep = () => setCurrentStep(prev => prev > 1 ? prev - 1 : prev);

  const isNextDisabled = () => {
    if (currentStep === 1 && !formData.q1_profile) return true;
    if (currentStep === 2 && !formData.q2_focus) return true;
    if (currentStep === 3 && !formData.q3_maturity) return true;
    if (currentStep === 4 && !formData.q4_challenge) return true;
    return false;
  };
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-neutral-dark mb-1">Mari kita mulai dengan mengenal Anda.</h2>
            <p className="text-neutral-medium mb-6">Apa yang paling tepat menggambarkan organisasi Anda?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profileOptions.map(opt => (
                <ChoiceCard key={opt.value} {...opt} iconSrc={opt.iconSrc} onClick={() => updateFormData('q1_profile', opt.value)} isSelected={formData.q1_profile === opt.value} />
              ))}
            </div>
          </div>
        );
      case 2:
        const currentOptions = focusOptions[formData.q1_profile] || [];
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-neutral-dark mb-1">Fokus utama Anda saat ini?</h2>
            <p className="text-neutral-medium mb-6">Pilih salah satu area yang paling relevan dengan tujuan Anda.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentOptions.map(opt => (
                <ChoiceCard key={opt} title={opt} onClick={() => updateFormData('q2_focus', opt)} isSelected={formData.q2_focus === opt} />
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-neutral-dark mb-1">Perjalanan Keberlanjutan Anda.</h2>
            <p className="text-neutral-medium mb-6">Sejauh mana organisasi Anda saat ini dalam mengintegrasikan prinsip keberlanjutan?</p>
            <div className="flex flex-col items-center pt-4">
                <div className="w-full max-w-lg">
                    <input type="range" min="1" max="5" value={formData.q3_maturity} onChange={(e) => updateFormData('q3_maturity', parseInt(e.target.value))} className="w-full h-2 bg-neutral-light rounded-lg appearance-none cursor-pointer range-lg accent-brand-primary" />
                    <div className="text-center mt-4"><p className="text-lg font-semibold text-brand-primary">{maturityLabels[formData.q3_maturity - 1]}</p></div>
                </div>
            </div>
          </div>
        );
    case 4:
        return (
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-neutral-dark mb-1">Tantangan utama Anda saat ini.</h2>
                <p className="text-neutral-medium mb-6">Pilih pernyataan yang paling menggambarkan tantangan Anda.</p>
                <div className="space-y-3">
                    {challengeOptions.map(opt => (
                        <RadioPill key={opt} label={opt} onClick={() => updateFormData('q4_challenge', opt)} isSelected={formData.q4_challenge === opt} />
                    ))}
                </div>
            </div>
        )
      default:
        return <div>Langkah Selanjutnya...</div>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 border border-gray-200">
      <div className="min-h-[250px]">{renderCurrentStep()}</div>
      <div className="mt-8 pt-6 border-t border-neutral-light/80 flex justify-between items-center">
        <button onClick={prevStep} disabled={currentStep === 1} className="px-6 py-2 bg-neutral-medium text-white rounded-lg hover:bg-opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
          Kembali
        </button>
        <div className="text-sm text-neutral-medium">Langkah {currentStep} dari 8</div>
        <button onClick={nextStep} disabled={isNextDisabled()} className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
          Lanjut
        </button>
      </div>
    </div>
  );
}