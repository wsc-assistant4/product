// app/lib/recommendation.js

const rules = [
    // Skenario #1: Pemerintah Daerah Ambisius
    {
      conditions: {
        q1_profile: "Pemerintah & Lembaga Publik",
        q2_focus: "Pengembangan Destinasi",
        q4_challenge: "Kami punya ide besar, tapi tidak yakin apakah layak.",
      },
      result: {
        primary: "Tourism Master Plan & Destination Development",
        secondary: "Feasibility Study & Financial Projection",
        soft_sell: ["Tourism Assets Mapping", "Carrying Capacity Assessment", "Customized In-House Training (CIHT)"]
      }
    },
    // Skenario #2: Manajer Hotel Sadar Tren
    {
      conditions: {
        q1_profile: "Bisnis & Sektor Swasta",
        q2_focus: "Keberlanjutan & ESG",
        q4_challenge: "Kami ingin diakui secara global, tapi bingung memulai sertifikasi.",
      },
      result: {
        primary: "Sustainability Certification Assistance",
        secondary: "GSTC Sustainable Tourism Course (STC)",
        soft_sell: ["ESG & Sustainability Reporting", "Sustainability Performance Dashboard", "Sustainability Action Plan Workshop"]
      }
    },
    // Skenario #3: Penyelenggara Event Internasional
    {
      conditions: {
        q1_profile: "Bisnis & Sektor Swasta",
        q2_focus: "Perencanaan & Pengukuran Dampak Event",
        q4_challenge: "Kami perlu membuktikan dampak positif acara kami kepada stakeholder.",
      },
      result: {
        primary: "Event Impact Measurement",
        secondary: "Economic Impact Assessment",
        soft_sell: ["Event Planning", "Integrated Marketing Strategy"]
      }
    },
    // Skenario Tambahan: Bisnis ingin membuat rencana aksi
    {
      conditions: {
          q1_profile: "Bisnis & Sektor Swasta",
          q4_challenge: "Kami butuh rencana aksi yang jelas dan terukur.",
      },
      result: {
          primary: "Sustainability Roadmap & Action Plan",
          secondary: "Sustainability Action Plan Workshop",
          soft_sell: ["Sustainability Performance Dashboard", "Customized In-House Training (CIHT)"]
      }
    },
     // Skenario Tambahan: Siapapun yang butuh data wisatawan
    {
      conditions: {
          q4_challenge: "Kami perlu data akurat tentang wisatawan.",
      },
      result: {
          primary: "Tourist Behaviour and Perception Analysis",
          secondary: "Market Demand Analysis",
          soft_sell: ["Customer Experience Feedback Analysis", "Competitor Intelligence"]
      }
    },
    // Aturan Default (Fallback)
    {
      conditions: {}, // Cocok untuk semua jika tidak ada yang cocok sebelumnya
      result: {
        primary: "Konsultasi Strategis Terpersonalisasi",
        secondary: "Kami akan menganalisis kebutuhan unik Anda.",
        soft_sell: ["Tourism Master Plan", "Feasibility Study", "Integrated Marketing Strategy"]
      }
    }
  ];
  
  export function getRecommendation(formData) {
    for (const rule of rules) {
      let match = true;
      for (const key in rule.conditions) {
        if (formData[key] !== rule.conditions[key]) {
          match = false;
          break;
        }
      }
      if (match) {
        return rule.result;
      }
    }
    return rules[rules.length - 1].result; // Fallback ke aturan default
  }