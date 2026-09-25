'use client';

/**
 * High-Precision Certificate PDF & Image Export Pipeline
 * Uses html-to-image (SVG foreignObject native browser rendering engine)
 * to fully support modern Tailwind CSS v4 colors (oklab/oklch), gradients, and Devanagari ligatures
 * without using window.print() or failing on modern CSS.
 */

export async function generateCertificatePdf(elementId: string, ticketId: string, fullName: string): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Certificate element not found on page');
  }

  // Dynamic imports to prevent SSR bundle overhead
  const [{ toJpeg }, { default: jsPDF }] = await Promise.all([
    import('html-to-image'),
    import('jspdf'),
  ]);

  // Capture at 2.5x pixel ratio for crisp, 300-DPI print quality
  const imgData = await toJpeg(element, {
    quality: 0.98,
    pixelRatio: 2.5,
    backgroundColor: '#FAF7F2',
    cacheBust: true,
  });

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

  const { toPng } = await import('html-to-image');

  const dataUrl = await toPng(element, {
    pixelRatio: 2.5,
    backgroundColor: '#FAF7F2',
    cacheBust: true,
  });

  const link = document.createElement('a');
  const cleanName = fullName.replace(/[\s-]/g, '_').slice(0, 30);
  link.download = `Lokutsav_Certificate_${ticketId}_${cleanName}.png`;
  link.href = dataUrl;
  link.click();
  return true;
}
