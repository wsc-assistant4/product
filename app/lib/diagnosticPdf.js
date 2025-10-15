// app/lib/diagnosticPdf.js
import jsPDF from 'jspdf';

export const generateDiagnosticPdf = (formData, recommendation) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let currentY = 20;

    // Header
    doc.setFontSize(18).setFont('helvetica', 'bold');
    doc.text('Ringkasan Diagnostik Kebutuhan Anda', pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;
    doc.setFontSize(12).setFont('helvetica', 'normal');
    doc.text('Disusun oleh WSC Solution Finder', pageWidth / 2, currentY, { align: 'center' });
    currentY += 15;
    
    // Informasi Pengguna
    doc.setFontSize(10);
    doc.text(`Nama: ${formData.contact_name}`, margin, currentY);
    doc.text(`Email: ${formData.contact_email}`, margin + 80, currentY);
    currentY += 10;
    doc.setDrawColor(220).line(margin, currentY - 5, pageWidth - margin, currentY - 5);

    // Ringkasan Jawaban
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('Profil & Kebutuhan Anda', margin, currentY);
    currentY += 8;
    
    const summary = [
        { label: 'Profil Organisasi', value: formData.q1_profile },
        { label: 'Fokus Utama', value: formData.q2_focus },
        { label: 'Tantangan Utama', value: formData.q4_challenge },
        { label: 'Prioritas', value: formData.q5_priority.join(', ') },
    ];

    doc.setFontSize(10).setFont('helvetica', 'normal');
    summary.forEach(item => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${item.label}:`, margin, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(item.value, margin + 40, currentY);
        currentY += 7;
    });
    currentY += 5;

    // Rekomendasi
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('Rekomendasi Solusi dari Wise Steps Consulting', margin, currentY);
    currentY += 8;

    doc.setFillColor(240, 249, 245).rect(margin, currentY, pageWidth - margin * 2, 22, 'F');
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Rekomendasi Utama:', margin + 5, currentY + 7);
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text(recommendation.primary, margin + 5, currentY + 15);
    currentY += 28;
    
    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Rekomendasi Pendukung:', margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(recommendation.secondary, margin + 5, currentY + 7);
    currentY += 12;

    doc.setFontSize(10).setFont('helvetica', 'bold');
    doc.text('Layanan Relevan Lainnya:', margin, currentY);
    doc.setFont('helvetica', 'normal');
    recommendation.soft_sell.forEach((item, index) => {
        doc.text(`- ${item}`, margin + 5, currentY + 7 + (index * 6));
    });
    currentY += 25;

    // Footer & CTA
    doc.setDrawColor(220).line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text('Langkah Selanjutnya', margin, currentY);
    currentY += 7;
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text("Siap untuk diskusi lebih lanjut? Hubungi kami untuk sesi konsultasi gratis.", margin, currentY);
    currentY += 7;
    doc.setTextColor(41, 128, 185);
    doc.textWithLink('Hubungi via WhatsApp: +62 812-3632-1361', margin, currentY, { url: 'https://wa.me/6281236321361' });

    doc.save(`WSC_Diagnostic_Report_${formData.contact_name.replace(/\s/g, '_')}.pdf`);
};