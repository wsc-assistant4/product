// app/components/SolutionFinder.jsx

"use client";

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getRecommendation } from '../lib/recommendation';
import { generateDiagnosticPdf } from '../lib/diagnosticPdf';
import { BuildingOfficeIcon, UserCircleIcon, AcademicCapIcon, QuestionMarkCircleIcon } from './Icons.jsx';

// --- Komponen-Komponen UI Kecil ---

function ChoiceCard({ title, icon, onClick, isSelected }) {
  const baseClasses = "rounded-xl border p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 h-full min-h-[120px]";
  const selectedClasses = "bg-brand-secondary text-white ring-2 ring-brand-accent shadow-lg scale-105";
  const unselectedClasses = "bg-white hover:bg-neutral-light hover:shadow-md text-neutral-dark";
  
  return (
    <div onClick={onClick} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
      <div className={`mb-3 h-10 w-10 flex items-center justify-center ${isSelected ? 'text-white' : 'text-brand-primary'}`}>
        {icon}
      </div>
      <span className="font-semibold text-sm">{title}</span>
    </div>
  );
}

function CheckboxCard({ label, onClick, isSelected }) {
    const baseClasses = "w-full text-left p-4 border rounded-lg cursor-pointer transition-colors duration-200 flex items-center";
    const selectedClasses = "bg-brand-secondary border-brand-primary text-white font-semibold";
    const unselectedClasses = "bg-white border-neutral-light/80 hover:bg-neutral-light";
    return (
        <div onClick={onClick} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
            <div className={`w-5 h-5 mr-4 border-2 rounded ${isSelected ? 'bg-white border-white' : 'border-neutral-medium'}`}>
                {isSelected && <svg viewBox="0 0 16 16" fill="currentColor" className="text-brand-secondary w-full h-full"><path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"/></svg>}
            </div>
            <span>{label}</span>
        </div>
    );
}

function RadioPill({ label, isSelected, onClick }) {
    const baseClasses = "w-full text-left p-4 border rounded-lg cursor-pointer transition-colors duration-200";
    const selectedClasses = "bg-brand-secondary border-brand-primary text-white font-semibold";
    const unselectedClasses = "bg-white border-neutral-light/80 hover:bg-neutral-light";
    return <div onClick={onClick} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>{label}</div>;
}

// --- Data untuk Pertanyaan ---
const profileOptions = [
  { value: "Pemerintah & Lembaga Publik", icon: <BuildingOfficeIcon /> },
  { value: "Bisnis & Sektor Swasta", icon: <UserCircleIcon /> },
  { value: "Nirlaba & Komunitas", icon: <UserCircleIcon /> },
  { value: "Akademisi & Lainnya", icon: <AcademicCapIcon /> },
];

const focusOptions = {
  "Pemerintah & Lembaga Publik": ["Pengembangan Destinasi", "Kebijakan & Regulasi", "Peningkatan Kapasitas SDM"],
  "Bisnis & Sektor Swasta": ["Perencanaan & Investasi", "Keberlanjutan & ESG", "Pemasaran & Pasar", "Perencanaan & Pengukuran Dampak Event"],
  "Nirlaba & Komunitas": ["Pengembangan Program", "Pendanaan & Kemitraan", "Pengukuran Dampak"],
  "Akademisi & Lainnya": ["Penelitian Terapan", "Pengembangan Kurikulum", "Publikasi & Diseminasi"],
};

const maturityLabels = ["Baru Wacana", "Inisiatif Awal", "Terstruktur", "Terintegrasi", "Optimal"];

const challengeOptions = [
  "Kami punya ide besar, tapi tidak yakin apakah layak.",
  "Kami ingin diakui secara global, tapi bingung memulai sertifikasi.",
  "Kami butuh rencana aksi yang jelas dan terukur.",
  "Kami perlu data akurat tentang wisatawan.",
  "Kami perlu membuktikan dampak positif acara kami kepada stakeholder.",
];

const priorityOptions = ["Pertumbuhan Finansial", "Kepatuhan & Standarisasi", "Peningkatan Citra Merek", "Dampak Positif (Sosial/Lingkungan)"];
const scaleOptions = ["Kawasan/Destinasi", "Organisasi/Perusahaan", "Spesifik Program/Event"];
const supportOptions = ["Strategi & Perencanaan", "Data & Analisis", "Pelatihan & Kapasitas Tim"];

// --- Komponen Utama ---
export default function SolutionFinder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    q1_profile: "",
    q2_focus: "",
    q3_maturity: 3,
    q4_challenge: "",
    q5_priority: [],
    q6_scale: "",
    q7_support: [],
    contact_name: "",
    contact_email: "",
  });
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, value) => {
    const currentValues = formData[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    updateFormData(field, newValues);
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => (prev > 1 ? prev - 1 : 1));

  const handleSubmit = async () => {
    setIsLoading(true);
    const result = getRecommendation(formData);
    setRecommendation(result);

    const dataToSave = {
        ...formData,
        recommendation_primary: result.primary,
        recommendation_secondary: result.secondary,
        recommendation_soft_sell: result.soft_sell,
    };

    try {
        const { error } = await supabase.from('consultation_leads').insert([dataToSave]);
        if (error) throw error;
    } catch (error) {
        console.error("Error saving to Supabase:", error);
        // Optionally show an error message to the user
    } finally {
        setIsLoading(false);
        nextStep(); // Pindah ke halaman hasil
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1: return !formData.q1_profile;
      case 2: return !formData.q2_focus;
      case 4: return !formData.q4_challenge;
      case 5: return formData.q5_priority.length === 0;
      case 6: return !formData.q6_scale;
      case 7: return formData.q7_support.length === 0;
      case 8: return !formData.contact_name || !formData.contact_email;
      default: return false;
    }
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
                    <ChoiceCard key={opt.value} {...opt} icon={opt.icon} onClick={() => updateFormData('q1_profile', opt.value)} isSelected={formData.q1_profile === opt.value} />
                  ))}
                </div>
              </div>
            );
        case 2:
            const currentFocusOptions = focusOptions[formData.q1_profile] || [];
            return (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-neutral-dark mb-1">Apa fokus utama Anda saat ini?</h2>
                <p className="text-neutral-medium mb-6">Pilih salah satu area yang paling relevan dengan tujuan Anda.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentFocusOptions.map(opt => (
                        <RadioPill key={opt} label={opt} onClick={() => updateFormData('q2_focus', opt)} isSelected={formData.q2_focus === opt} />
                    ))}
                </div>
              </div>
            );
        case 3:
            return (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-neutral-dark mb-1">Perjalanan Keberlanjutan Anda.</h2>
                <p className="text-neutral-medium mb-6">Sejauh mana organisasi Anda saat ini dalam mengintegrasikan prinsip keberlanjutan?</p>
                <div className="flex flex-col items-center pt-8">
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
                    <h2 className="text-2xl font-bold text-neutral-dark mb-1">Apa tantangan utama Anda?</h2>
                    <p className="text-neutral-medium mb-6">Pilih pernyataan yang paling menggambarkan situasi Anda saat ini.</p>
                    <div className="space-y-3">
                        {challengeOptions.map(opt => (
                            <RadioPill key={opt} label={opt} onClick={() => updateFormData('q4_challenge', opt)} isSelected={formData.q4_challenge === opt} />
                        ))}
                    </div>
                </div>
            );
        case 5:
            return (
                <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-neutral-dark mb-1">Prioritas utama dalam 12 bulan ke depan?</h2>
                    <p className="text-neutral-medium mb-6">Anda bisa memilih lebih dari satu.</p>
                    <div className="space-y-3">
                        {priorityOptions.map(opt => (
                            <CheckboxCard key={opt} label={opt} onClick={() => handleCheckboxChange('q5_priority', opt)} isSelected={formData.q5_priority.includes(opt)} />
                        ))}
                    </div>
                </div>
            );
        case 6:
             return (
                <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-neutral-dark mb-1">Apa skala inisiatif yang Anda pikirkan?</h2>
                     <p className="text-neutral-medium mb-6">Ini akan membantu kami menentukan lingkup solusi yang tepat.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {scaleOptions.map(opt => (
                            <RadioPill key={opt} label={opt} onClick={() => updateFormData('q6_scale', opt)} isSelected={formData.q6_scale === opt} />
                        ))}
                    </div>
                </div>
            );
        case 7:
            return (
                <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-neutral-dark mb-1">Jenis dukungan apa yang paling mendesak?</h2>
                    <p className="text-neutral-medium mb-6">Anda bisa memilih lebih dari satu.</p>
                    <div className="space-y-3">
                        {supportOptions.map(opt => (
                            <CheckboxCard key={opt} label={opt} onClick={() => handleCheckboxChange('q7_support', opt)} isSelected={formData.q7_support.includes(opt)} />
                        ))}
                    </div>
                </div>
            );
        case 8:
            return (
                <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-neutral-dark mb-1">Satu langkah terakhir!</h2>
                    <p className="text-neutral-medium mb-6">Di mana kami bisa mengirimkan rekomendasi solusi yang telah dipersonalisasi untuk Anda?</p>
                    <div className="space-y-4">
                        <input type="text" placeholder="Nama Anda" value={formData.contact_name} onChange={e => updateFormData('contact_name', e.target.value)} className="w-full p-3 border border-neutral-light rounded-lg focus:ring-2 focus:ring-brand-primary" />
                        <input type="email" placeholder="Email Anda" value={formData.contact_email} onChange={e => updateFormData('contact_email', e.target.value)} className="w-full p-3 border border-neutral-light rounded-lg focus:ring-2 focus:ring-brand-primary" />
                    </div>
                </div>
            )
        case 9:
            return (
                <div className="animate-fade-in text-center">
                    <h2 className="text-3xl font-bold text-brand-primary mb-4">Rekomendasi Solusi untuk Anda</h2>
                    <p className="text-neutral-medium mb-8 max-w-2xl mx-auto">Berdasarkan jawaban Anda, berikut adalah layanan yang kami yakini paling sesuai untuk mencapai tujuan Anda.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div className="bg-green-50 border-2 border-brand-primary rounded-xl p-6">
                            <h3 className="font-bold text-lg text-neutral-dark mb-2">Rekomendasi Utama</h3>
                            <p className="text-xl font-bold text-brand-primary mb-2">{recommendation?.primary}</p>
                            <p className="text-sm text-neutral-medium">{recommendation?.secondary}</p>
                        </div>
                        <div className="bg-neutral-light/50 border border-neutral-light rounded-xl p-6">
                            <h3 className="font-bold text-lg text-neutral-dark mb-2">Layanan Relevan Lainnya</h3>
                            <ul className="list-disc list-inside text-neutral-medium space-y-1">
                                {recommendation?.soft_sell.map(item => <li key={item}>{item}</li>)}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <a href="https://wa.me/6281236321361" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105">
                            Konsultasi via WhatsApp
                        </a>
                        <button onClick={() => generateDiagnosticPdf(formData, recommendation)} className="w-full sm:w-auto px-8 py-3 bg-white border-2 border-brand-primary text-brand-primary font-semibold rounded-lg hover:bg-neutral-light transition-all">
                            Download Hasil Diagnostik (PDF)
                        </button>
                    </div>
                </div>
            );
        default: return null;
    }
  };

  if (currentStep > 8) {
      return (
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 border border-gray-200 min-h-[420px] flex items-center justify-center">
            {isLoading ? <div>Menganalisis jawaban Anda...</div> : renderCurrentStep()}
        </div>
      )
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 border border-gray-200">
      <div className="min-h-[420px]">{renderCurrentStep()}</div>
      <div className="mt-8 pt-6 border-t border-neutral-light/80 flex justify-between items-center">
        <button onClick={prevStep} disabled={currentStep === 1} className="px-6 py-2 bg-neutral-medium text-white rounded-lg hover:bg-opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
          Kembali
        </button>
        <div className="text-sm text-neutral-medium">Langkah {currentStep} dari 8</div>
        {currentStep === 8 ? (
            <button onClick={handleSubmit} disabled={isNextDisabled() || isLoading} className="px-6 py-2 bg-brand-accent text-neutral-dark font-semibold rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Memproses...' : 'Lihat Hasil'}
            </button>
        ) : (
            <button onClick={nextStep} disabled={isNextDisabled()} className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
              Lanjut
            </button>
        )}
      </div>
    </div>
  );
}