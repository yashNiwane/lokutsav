'use client';

/**
 * High-Precision Certificate PDF & Image Export Pipeline
 * Converts the rendered certificate component into a high-DPI (300 DPI equivalent)
 * authentic A4 landscape PDF file without using window.print().
 */

export async function generateCertificatePdf(elementId: string, ticketId: string, fullName: string): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Certificate element not found on page');
  }

  // Dynamic imports to prevent SSR bundle overhead
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  // Capture at high resolution (scale: 2.5 for crisp 2500px+ vector text)
  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#FAF7F2',
    logging: false,
    windowWidth: 1200, // Fixed desktop layout consistency regardless of device screen width
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  // Create standard A4 Landscape PDF (297mm x 210mm)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');

  const cleanName = fullName.replace(/[\s-]/g, '_').slice(0, 30);
  const fileName = `Lokutsav_Certificate_${ticketId}_${cleanName}.pdf`;

  pdf.save(fileName);
  return true;
}

export async function generateCertificateImage(elementId: string, ticketId: string, fullName: string): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Certificate element not found on page');
  }

  const { default: html2canvas } = await import('html2canvas');

  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#FAF7F2',
    logging: false,
    windowWidth: 1200,
  });

  const link = document.createElement('a');
  const cleanName = fullName.replace(/[\s-]/g, '_').slice(0, 30);
  link.download = `Lokutsav_Certificate_${ticketId}_${cleanName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  return true;
}
