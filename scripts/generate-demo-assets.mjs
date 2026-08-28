import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "demo");
mkdirSync(outDir, { recursive: true });

const W = 800;
const H = 1100;

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function wrap(text, max) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function ruledLines() {
  const lines = [];
  for (let y = 92; y < H - 40; y += 28) {
    lines.push(
      `<line x1="56" y1="${y}" x2="${W - 36}" y2="${y}" stroke="#c9d7ea" stroke-width="1"/>`,
    );
  }
  return lines.join("\n");
}

function notebookChrome(title, pageLabel) {
  return `
  <rect width="${W}" height="${H}" fill="#fbf6ea"/>
  <rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="#e4d8c4" stroke-width="8"/>
  <line x1="72" y1="48" x2="72" y2="${H - 28}" stroke="#f0b4b0" stroke-width="2"/>
  ${ruledLines()}
  <text x="88" y="58" font-size="13" fill="#8a7a66" font-family="Georgia, serif">${escapeXml(title)}</text>
  <text x="${W - 48}" y="58" text-anchor="end" font-size="13" fill="#8a7a66" font-family="Georgia, serif">${pageLabel}</text>
`;
}

function handText(x, y, lines, options = {}) {
  const size = options.size ?? 22;
  const fill = options.fill ?? "#1e3f73";
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * 28}" font-size="${size}" fill="${fill}" font-family="Comic Sans MS, Segoe Script, cursive" font-style="italic">${escapeXml(line)}</text>`,
    )
    .join("\n");
}

function highlightHint(box) {
  const x = box.x * W;
  const y = box.y * H;
  const width = box.width * W;
  const height = box.height * H;
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none"/>`;
}

const answerPages = [
  {
    file: "answer-sheet-page-1.svg",
    title: "A. Sharma  ·  Roll 17  ·  Class 10 Biology",
    page: "Page 1 of 4",
    extras: `
      ${highlightHint({ x: 0.08, y: 0.08, width: 0.84, height: 0.13 })}
      ${handText(92, 118, ["Q1. Arteries (aorta) carry blood away from the heart.", "Thick muscular walls keep the pressure high."])}
      ${handText(92, 278, [
        "Q3. Chloroplasts are the site of photosynthesis.",
        "Main pigments: chlorophyll a and chlorophyll b.",
        "Light reactions happen on the thylakoid membrane",
        "and the Calvin cycle happens in the stroma.",
        "Light energy → ATP + NADPH → glucose.",
      ])}
      ${handText(92, 598, ["Q2. Chloroplast."])}
      ${handText(92, 778, ["Q5. Alveolus (gas exchange)"])}
      <ellipse cx="250" cy="900" rx="78" ry="70" fill="none" stroke="#1e3f73" stroke-width="2"/>
      <ellipse cx="250" cy="900" rx="38" ry="32" fill="#f7fbff" stroke="#1e3f73" stroke-width="1.5"/>
      <path d="M328 870 C 390 860, 430 880, 470 900" fill="none" stroke="#c45c4a" stroke-width="6"/>
      <path d="M328 930 C 390 940, 430 920, 470 900" fill="none" stroke="#3a6ea5" stroke-width="6"/>
      ${handText(500, 860, ["air space", "capillary", "O2 in / CO2 out"], { size: 18 })}
    `,
  },
  {
    file: "answer-sheet-page-2.svg",
    title: "A. Sharma  ·  Roll 17  ·  Class 10 Biology",
    page: "Page 2 of 4",
    extras: `
      ${handText(92, 118, ["Q6. Digestive system"])}
      <ellipse cx="230" cy="230" rx="42" ry="28" fill="none" stroke="#1e3f73" stroke-width="2"/>
      <path d="M230 258 C 210 310, 250 340, 270 390 C 290 450, 210 500, 250 560" fill="none" stroke="#1e3f73" stroke-width="8"/>
      <rect x="300" y="210" width="70" height="44" rx="16" fill="none" stroke="#1e3f73" stroke-width="2"/>
      <ellipse cx="400" cy="250" rx="36" ry="22" fill="none" stroke="#1e3f73" stroke-width="2"/>
      ${handText(470, 220, ["liver", "stomach", "pancreas", "small intestine *", "large intestine"], { size: 18 })}
      ${handText(92, 430, ["* most absorption occurs in the small intestine / ileum."], { size: 18 })}
      ${handText(92, 520, ["Q7. Nephron"])}
      <circle cx="210" cy="640" r="28" fill="none" stroke="#1e3f73" stroke-width="2"/>
      <circle cx="210" cy="640" r="12" fill="none" stroke="#c45c4a" stroke-width="2"/>
      <path d="M238 640 C 300 640, 320 700, 280 760 C 250 810, 360 820, 390 780 C 420 730, 480 760, 520 810" fill="none" stroke="#1e3f73" stroke-width="3"/>
      ${handText(430, 600, ["Bowman's capsule", "glomerulus", "prox. tubule", "loop of Henle", "distal tubule", "collecting duct"], { size: 17 })}
      ${handText(92, 860, ["Q8. Palisade mesophyll cells are tall and tightly", "packed, with many chloroplasts, so they absorb"])}
    `,
  },
  {
    file: "answer-sheet-page-3.svg",
    title: "A. Sharma  ·  Roll 17  ·  Class 10 Biology",
    page: "Page 3 of 4",
    extras: `
      ${handText(92, 118, ["as much light as possible. Spongy mesophyll has", "air spaces that let CO2 and O2 diffuse quickly."])}
      ${handText(92, 318, ["Q9. Transpiration is the loss of water vapour from", "leaves through stomata. Wind and high temperature", "increase the rate."])}
      ${handText(92, 528, ["Xylem vessels are hollow tubes of dead lignified", "cells, so a continuous water column can be pulled", "up by transpiration."])}
      ${handText(92, 738, ["Q11 (a) Plant B is etiolated — pale, elongated leaves", "because it was kept in dim light and stretched", "towards any available light."])}
      ${handText(92, 958, ["Q11 (b) Move it into bright light and water regularly."])}
    `,
  },
  {
    file: "answer-sheet-page-4.svg",
    title: "A. Sharma  ·  Roll 17  ·  Class 10 Biology",
    page: "Page 4 of 4",
    extras: `
      ${handText(92, 128, ["Q12. Minute ventilation = 0.5 L × 12 breaths", "= 6 L / minute."])}
      ${handText(92, 368, ["Q15. The mitochondria is the powerhouse of the", "cell. It produces ATP by aerobic respiration."])}
      ${handText(92, 620, ["(I think I finished everything? Not sure about", "the heart question or the ventilation calculation", "with dead space.)"], { fill: "#7a6a58", size: 20 })}
    `,
  },
];

function questionPaperPage(page, items, footer) {
  const blocks = items
    .map((item, index) => {
      const y = 170 + index * 140;
      const lines = wrap(item.text, 88);
      const lineSvg = lines
        .map(
          (line, lineIndex) =>
            `<text x="118" y="${y + 28 + lineIndex * 22}" font-size="16" fill="#2c2c2c" font-family="Georgia, serif">${escapeXml(line)}</text>`,
        )
        .join("\n");
      return `
        <text x="64" y="${y}" font-size="18" font-weight="700" fill="#2c2c2c" font-family="Georgia, serif">${escapeXml(item.number)}.</text>
        ${lineSvg}
        <text x="${W - 64}" y="${y}" text-anchor="end" font-size="13" fill="#8a7a66" font-family="Georgia, serif">[${item.marks}]</text>
      `;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#fffdf8"/>
  <rect x="36" y="36" width="${W - 72}" height="${H - 72}" fill="none" stroke="#e6dccb" stroke-width="2" rx="8"/>
  <text x="${W / 2}" y="84" text-anchor="middle" font-size="22" font-weight="700" fill="#2c2c2c" font-family="Georgia, serif">Delhi Public School, Bokaro Steel City</text>
  <text x="${W / 2}" y="114" text-anchor="middle" font-size="18" fill="#e85d3a" font-family="Georgia, serif">Class 10 Biology · Unit Test</text>
  <text x="64" y="148" font-size="13" fill="#6b6458" font-family="Georgia, serif">Time: 1 hour</text>
  <text x="${W - 64}" y="148" text-anchor="end" font-size="13" fill="#6b6458" font-family="Georgia, serif">Max. marks: 40 · Page ${page} of 2</text>
  <line x1="64" y1="158" x2="${W - 64}" y2="158" stroke="#eadfce"/>
  ${blocks}
  <text x="${W / 2}" y="${H - 48}" text-anchor="middle" font-size="12" fill="#8a7a66" font-family="Georgia, serif">${escapeXml(footer)}</text>
</svg>`;
}

const qPage1 = questionPaperPage(
  1,
  [
    { number: "1", marks: 2, text: "Which blood vessel carries blood away from the heart?" },
    { number: "2", marks: 2, text: "Which of the following organelles is primarily involved in photosynthesis?" },
    { number: "3", marks: 5, text: "Explain the role of chloroplasts in photosynthesis, naming the main pigments involved and briefly outlining the two major stages of the process." },
    { number: "4", marks: 5, text: "Describe the flow of blood through the human heart starting from the right atrium and ending at the aorta, include the names of the valves crossed." },
    { number: "5", marks: 3, text: "Draw a labelled diagram of an alveolus showing capillaries and air space (label all exchange)." },
    { number: "6", marks: 5, text: "Draw a neat labelled diagram of the human digestive system (stomach, small intestine, large intestine, liver, pancreas) and label the site where most absorption occurs." },
  ],
  "Turn over",
);

const qPage2 = questionPaperPage(
  2,
  [
    { number: "7", marks: 4, text: "Draw and label a nephron (Bowman's capsule, glomerulus, proximal tubule, loop of Henle, distal tubule, collecting duct)." },
    { number: "8", marks: 3, text: "Explain the structural differences between palisade mesophyll and spongy mesophyll and state how each structure aids its function in the leaf." },
    { number: "9", marks: 2, text: "Describe the process of transpiration in plants in two to three sentences and name two environmental factors that increase its rate." },
    { number: "10", marks: 2, text: "Explain how the structure of xylem vessels facilitates water transport in plants (mention one adaptation and explain its role)." },
    { number: "11(a)", marks: 2, text: "A diagram shows two potted plants — Plant A in bright light with high water needs, Plant B kept in dim light with pale, elongated leaves." },
    { number: "11(b)", marks: 1, text: "Suggest one practical measure to help Plant B recover." },
    { number: "12", marks: 2, text: "A resting person has tidal volume (air per breath) of 0.5L and breathes 12 times per minute." },
  ],
  "End of question paper. Q13: If dead space is 0.15L per breath, calculate alveolar ventilation per minute.",
);

writeFileSync(join(outDir, "question-paper-page-1.svg"), qPage1);
writeFileSync(join(outDir, "question-paper-page-2.svg"), qPage2);

for (const page of answerPages) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${notebookChrome(page.title, page.page)}
  ${page.extras}
</svg>`;
  writeFileSync(join(outDir, page.file), svg);
}

function wrapPdf(text, max = 92) {
  return wrap(text, max);
}

async function buildPdfs() {
  const questionPdf = await PDFDocument.create();
  const answerPdf = await PDFDocument.create();
  const font = await questionPdf.embedFont(StandardFonts.TimesRoman);
  const bold = await questionPdf.embedFont(StandardFonts.TimesRomanBold);
  const answerFont = await answerPdf.embedFont(StandardFonts.TimesRomanItalic);

  const questions = [
    ["1", "Which blood vessel carries blood away from the heart?", "2"],
    ["2", "Which of the following organelles is primarily involved in photosynthesis?", "2"],
    ["3", "Explain the role of chloroplasts in photosynthesis, naming the main pigments involved and briefly outlining the two major stages of the process.", "5"],
    ["4", "Describe the flow of blood through the human heart starting from the right atrium and ending at the aorta, include the names of the valves crossed.", "5"],
    ["5", "Draw a labelled diagram of an alveolus showing capillaries and air space (label all exchange).", "3"],
    ["6", "Draw a neat labelled diagram of the human digestive system (stomach, small intestine, large intestine, liver, pancreas) and label the site where most absorption occurs.", "5"],
    ["7", "Draw and label a nephron (Bowman's capsule, glomerulus, proximal tubule, loop of Henle, distal tubule, collecting duct).", "4"],
    ["8", "Explain the structural differences between palisade mesophyll and spongy mesophyll and state how each structure aids its function in the leaf.", "3"],
    ["9", "Describe the process of transpiration in plants in two to three sentences and name two environmental factors that increase its rate.", "2"],
    ["10", "Explain how the structure of xylem vessels facilitates water transport in plants (mention one adaptation and explain its role).", "2"],
    ["11(a)", "A diagram shows two potted plants — Plant A in bright light with high water needs, Plant B kept in dim light with pale, elongated leaves.", "2"],
    ["11(b)", "Suggest one practical measure to help Plant B recover.", "1"],
    ["12", "A resting person has tidal volume (air per breath) of 0.5L and breathes 12 times per minute.", "2"],
    ["13", "If dead space is 0.15L per breath, calculate alveolar ventilation per minute. Show working.", "2"],
  ];

  const pageWidth = 595;
  const pageHeight = 842;
  let page = questionPdf.addPage([pageWidth, pageHeight]);
  let y = 780;
  page.drawText("Delhi Public School, Bokaro Steel City", { x: 72, y, size: 14, font: bold, color: rgb(0.17, 0.17, 0.17) });
  y -= 22;
  page.drawText("Class 10 Biology  ·  Unit Test", { x: 72, y, size: 12, font, color: rgb(0.91, 0.36, 0.23) });
  y -= 36;

  for (const [index, [number, text, marks]] of questions.entries()) {
    if (index === 7) {
      page = questionPdf.addPage([pageWidth, pageHeight]);
      y = 780;
    }
    page.drawText(`${number}.`, { x: 72, y, size: 11, font: bold, color: rgb(0.17, 0.17, 0.17) });
    page.drawText(`[${marks}]`, { x: 500, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
    for (const line of wrapPdf(text, 78)) {
      page.drawText(line, { x: 108, y, size: 11, font, color: rgb(0.17, 0.17, 0.17) });
      y -= 16;
    }
    y -= 14;
  }

  const answerLines = [
    ["Q1. Arteries (aorta) carry blood away from the heart.", 720],
    ["Q3. Chloroplasts: chlorophyll a/b; light reactions + Calvin cycle.", 640],
    ["Q2. Chloroplast.", 560],
    ["Q5. Alveolus diagram with capillaries and air space.", 480],
  ];

  const a1 = answerPdf.addPage([pageWidth, pageHeight]);
  a1.drawText("Student: A. Sharma   Roll 17", { x: 72, y: 800, size: 11, font: answerFont, color: rgb(0.12, 0.25, 0.45) });
  for (const [text, top] of answerLines) {
    a1.drawText(text, { x: 72, y: top, size: 12, font: answerFont, color: rgb(0.12, 0.25, 0.45) });
  }

  const a2 = answerPdf.addPage([pageWidth, pageHeight]);
  a2.drawText("Q6. Digestive system — absorption in small intestine.", { x: 72, y: 760, size: 12, font: answerFont, color: rgb(0.12, 0.25, 0.45) });
  a2.drawText("Q7. Nephron labelled (Bowman's capsule to collecting duct).", { x: 72, y: 520, size: 12, font: answerFont, color: rgb(0.12, 0.25, 0.45) });
  a2.drawText("Q8. Palisade tightly packed; spongy has air spaces...", { x: 72, y: 220, size: 12, font: answerFont, color: rgb(0.12, 0.25, 0.45) });

  const a3 = answerPdf.addPage([pageWidth, pageHeight]);
  a3.drawText("...for gas diffusion.", { x: 72, y: 760, size: 12, font: answerFont, color: rgb(0.12, 0.25, 0.45) });
  a3.drawText("Q9. Transpiration through stomata. Wind + heat increase rate.", { x: 72, y: 620, size: 12, font: answerFont, color: rgb(0.12, 0.25, 0.45) });
  a3.drawText("Xylem vessels are hollow lignified tubes (water column).", { x: 72, y: 500, size: 12, font: answerFont, color: rgb(0.12, 0.25, 0.45) });
  a3.drawText("Q11(a) Plant B is etiolated in dim light.", { x: 72, y: 360, size: 12, font: answerFont, color: rgb(0.12, 0.25, 0.45) });
  a3.drawText("Q11(b) Move Plant B into bright light.", { x: 72, y: 220, size: 12, font: answerFont, color: rgb(0.12, 0.25, 0.45) });

  const a4 = answerPdf.addPage([pageWidth, pageHeight]);
  a4.drawText("Q12. 0.5 x 12 = 6 L/min", { x: 72, y: 760, size: 12, font: answerFont, color: rgb(0.12, 0.25, 0.45) });
  a4.drawText("Q15. Mitochondria is the powerhouse of the cell.", { x: 72, y: 600, size: 12, font: answerFont, color: rgb(0.12, 0.25, 0.45) });

  writeFileSync(join(outDir, "Class_10_biology_unit_test.pdf"), Buffer.from(await questionPdf.save()));
  writeFileSync(join(outDir, "student_1_answer_sheet.pdf"), Buffer.from(await answerPdf.save()));
}

await buildPdfs();
console.log("Demo assets written to public/demo");
