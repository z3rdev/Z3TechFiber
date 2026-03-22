import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getFiberColor, type FusionRecord } from "@/data/fusion-data";
import { format } from "date-fns";

const PRIMARY = [5, 150, 105]; // #059669
const DARK = [20, 27, 38];
const MID_GRAY = [120, 130, 145];
const LIGHT_BG = [245, 247, 250];
const WHITE = [255, 255, 255];

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export async function generateFusionPDF(record: FusionRecord) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = 0;

  // ── Header band ──
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageW, 48, "F");

  // Accent line
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 48, pageW, 2, "F");

  // Title
  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Z3 TECH FUSION", margin, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 210, 220);
  doc.text("Relatório de Fusionamento", margin, 28);

  // Right side info
  doc.setFontSize(9);
  doc.setTextColor(...WHITE);
  doc.text(record.ctoName, pageW - margin, 18, { align: "right" });
  doc.setTextColor(180, 190, 200);
  doc.text(record.isNewBox ? "CAIXA NOVA" : record.ctoId, pageW - margin, 25, { align: "right" });
  doc.text(format(new Date(record.date), "dd/MM/yyyy · HH:mm"), pageW - margin, 32, { align: "right" });

  y = 58;

  // ── Info cards row ──
  const cardW = (contentW - 8) / 3;
  const cards = [
    { label: "TÉCNICO", value: record.technicianName },
    { label: "CABO", value: record.cableType },
    { label: "FIBRAS", value: `${record.fiberCount} fibras` },
  ];

  // Avg attenuation
  const fibersWithAtt = record.fibers.filter((f) => f.spliceAttenuation !== undefined);
  if (fibersWithAtt.length > 0) {
    const avg = fibersWithAtt.reduce((s, f) => s + (f.spliceAttenuation || 0), 0) / fibersWithAtt.length;
    cards.push({ label: "MÉDIA ATEN.", value: `${avg.toFixed(3)} dB` });
  }

  const actualCardW = cards.length === 4 ? (contentW - 12) / 4 : cardW;
  const actualGap = 4;

  cards.forEach((card, i) => {
    const x = margin + i * (actualCardW + actualGap);
    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(x, y, actualCardW, 18, 2, 2, "F");

    doc.setFillColor(...PRIMARY);
    doc.rect(x, y, 1.5, 18, "F");

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...MID_GRAY);
    doc.text(card.label, x + 6, y + 7);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text(card.value, x + 6, y + 14);
  });

  y += 26;

  // ── Fusion diagram ──
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text("Diagrama de Fusionamento", margin, y);
  y += 4;

  // Draw diagram
  const diagramX = margin;
  const diagramW = contentW;
  const rowH = 6;
  const leftCol = diagramX + 18;
  const rightCol = diagramX + diagramW - 18;
  const midCol = diagramX + diagramW / 2;

  // Header
  doc.setFillColor(...DARK);
  doc.roundedRect(diagramX, y, diagramW, 7, 1.5, 1.5, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text("FIBRA", diagramX + 4, y + 5);
  doc.text("ORIGEM", leftCol + 8, y + 5);
  doc.text("SENTIDO", midCol, y + 5, { align: "center" });
  doc.text("DESTINO", rightCol - 20, y + 5);
  doc.text("dB", diagramX + diagramW - 8, y + 5, { align: "right" });
  y += 9;

  record.fibers.forEach((fiber, i) => {
    const rowY = y + i * rowH;

    // Check page overflow
    if (rowY + rowH > pageH - 20) {
      doc.addPage();
      y = margin;
      return;
    }

    // Alternating bg
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(diagramX, rowY, diagramW, rowH, "F");
    }

    const origin = getFiberColor(fiber.originColor);
    const dest = getFiberColor(fiber.destinationColor);
    const originRgb = hexToRgb(origin.hex);
    const destRgb = hexToRgb(dest.hex);

    // Fiber number
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...MID_GRAY);
    doc.text(`F${fiber.fiberIndex}`, diagramX + 4, rowY + 4);

    // Origin color dot + name
    doc.setFillColor(...originRgb);
    doc.circle(leftCol + 2, rowY + 3, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    doc.text(origin.name, leftCol + 7, rowY + 4);

    // Connection line
    const lineStartX = leftCol + 25;
    const lineEndX = rightCol - 25;
    doc.setDrawColor(...originRgb);
    doc.setLineWidth(0.5);
    doc.line(lineStartX, rowY + 3, lineEndX, rowY + 3);

    // Arrow
    const arrowDir = fiber.direction === "A→B" ? 1 : -1;
    const arrowX = arrowDir === 1 ? lineEndX - 2 : lineStartX + 2;
    doc.setFillColor(...originRgb);
    if (arrowDir === 1) {
      doc.triangle(arrowX + 3, rowY + 3, arrowX, rowY + 1.5, arrowX, rowY + 4.5, "F");
    } else {
      doc.triangle(arrowX - 3, rowY + 3, arrowX, rowY + 1.5, arrowX, rowY + 4.5, "F");
    }

    // Direction label
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MID_GRAY);
    doc.text(fiber.direction, midCol, rowY + 1.5, { align: "center" });

    // Dest color dot + name
    doc.setFillColor(...destRgb);
    doc.circle(rightCol - 18, rowY + 3, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    doc.text(dest.name, rightCol - 13, rowY + 4);

    // Attenuation
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MID_GRAY);
    doc.text(
      fiber.spliceAttenuation !== undefined ? `${fiber.spliceAttenuation.toFixed(2)}` : "—",
      diagramX + diagramW - 4,
      rowY + 4,
      { align: "right" }
    );
  });

  y += record.fibers.length * rowH + 6;

  // ── Fiber Table ──
  if (y + 20 > pageH - 30) {
    doc.addPage();
    y = margin;
  }

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text("Tabela Detalhada", margin, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["#", "Cor Origem", "Sentido", "Cor Destino", "Atenuação (dB)"]],
    body: record.fibers.map((f) => [
      `F${f.fiberIndex}`,
      getFiberColor(f.originColor).name,
      f.direction,
      getFiberColor(f.destinationColor).name,
      f.spliceAttenuation !== undefined ? f.spliceAttenuation.toFixed(2) : "—",
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: DARK as [number, number, number],
    },
    headStyles: {
      fillColor: DARK as [number, number, number],
      textColor: WHITE as [number, number, number],
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: LIGHT_BG as [number, number, number],
    },
    columnStyles: {
      0: { halign: "center", fontStyle: "bold", cellWidth: 15 },
      2: { halign: "center", cellWidth: 22 },
      4: { halign: "right", cellWidth: 30 },
    },
  });

  // ── Photos ──
  if (record.photos.length > 0) {
    const tableEndY = (doc as any).lastAutoTable?.finalY || y + 40;
    let photoY = tableEndY + 10;

    if (photoY + 10 > pageH - 30) {
      doc.addPage();
      photoY = margin;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text("Registro Fotográfico", margin, photoY);
    photoY += 6;

    const photoW = (contentW - 8) / 3;
    const photoH = 40;

    for (let i = 0; i < record.photos.length; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const px = margin + col * (photoW + 4);
      const py = photoY + row * (photoH + 10);

      if (py + photoH > pageH - 20) {
        doc.addPage();
        photoY = margin;
        break;
      }

      try {
        const photo = record.photos[i];
        const img = await loadImage(photo.url);
        doc.addImage(img, "JPEG", px, py, photoW, photoH);

        // Label badge
        doc.setFillColor(...PRIMARY);
        doc.roundedRect(px, py + photoH + 1, 16, 5, 1, 1, "F");
        doc.setFontSize(6);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...WHITE);
        const label = photo.label === "caixa" ? "CAIXA" : photo.label === "fusao" ? "FUSÃO" : "OUTRA";
        doc.text(label, px + 8, py + photoH + 4.5, { align: "center" });
      } catch {
        doc.setFillColor(...LIGHT_BG);
        doc.rect(px, py, photoW, photoH, "F");
        doc.setFontSize(7);
        doc.setTextColor(...MID_GRAY);
        doc.text("Foto indisponível", px + photoW / 2, py + photoH / 2, { align: "center" });
      }
    }
  }

  // ── Notes ──
  if (record.notes) {
    const lastPage = doc.getNumberOfPages();
    doc.setPage(lastPage);
    let notesY = (doc as any).lastAutoTable?.finalY || pageH - 60;
    notesY = Math.min(notesY + 10, pageH - 40);

    if (record.photos.length > 0) {
      doc.addPage();
      notesY = margin;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text("Observações", margin, notesY);
    notesY += 5;

    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(margin, notesY, contentW, 20, 2, 2, "F");
    doc.setFillColor(...PRIMARY);
    doc.rect(margin, notesY, 1.5, 20, "F");

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(record.notes, contentW - 12);
    doc.text(lines, margin + 6, notesY + 6);
  }

  // ── Footer on all pages ──
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Bottom accent bar
    doc.setFillColor(...DARK);
    doc.rect(0, pageH - 12, pageW, 12, "F");
    doc.setFillColor(...PRIMARY);
    doc.rect(0, pageH - 12, pageW, 0.8, "F");

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 190, 200);
    doc.text("Z3 Tech Fiber · Relatório de Fusionamento", margin, pageH - 5);
    doc.text(`Página ${p}/${totalPages}`, pageW - margin, pageH - 5, { align: "right" });
  }

  // Save
  const fileName = `Fusao_${record.ctoId}_${format(new Date(record.date), "yyyyMMdd_HHmm")}.pdf`;
  doc.save(fileName);
}

function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });
}
