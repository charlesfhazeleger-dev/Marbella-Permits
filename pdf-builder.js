// Minimal PDF builder on top of jsPDF — primitives for the dossier renderers.
// All units in mm, A4 paper (210 × 297). Brand palette built in.

const PDF_BRAND = {
  terracotta:    [200, 81, 44],
  terracottaDk:  [162, 63, 31],
  terracottaTnt: [243, 220, 208],
  ink:           [26, 26, 26],
  ink2:          [58, 58, 58],
  mute:          [107, 107, 107],
  rule:          [230, 226, 220],
  paper:         [250, 248, 244],
  green:         [45, 106, 79],
  red:           [155, 44, 44],
  amber:         [197, 130, 0],
};

class PdfBuilder {
  constructor(pdf) {
    this.pdf = pdf;
    this.pageW = 210;
    this.pageH = 297;
    this.marginL = 20;
    this.marginR = 20;
    this.marginTop = 25;
    this.marginBottom = 25;
    this.contentW = this.pageW - this.marginL - this.marginR;
    this.x = this.marginL;
    this.y = this.marginTop;
    this._setupFont();
  }

  _setupFont() {
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(...PDF_BRAND.ink);
  }

  _color(c) { return Array.isArray(c) ? c : PDF_BRAND[c] || PDF_BRAND.ink; }

  _ensure(h) {
    if (this.y + h > this.pageH - this.marginBottom) {
      this.pdf.addPage();
      this.y = this.marginTop;
    }
  }

  // Page setup helpers
  pageHeader(title, subtitle) {
    // Brand wordmark
    this.pdf.setFont("helvetica", "bold"); this.pdf.setFontSize(11);
    this.pdf.setTextColor(...PDF_BRAND.ink);
    this.pdf.text("Marbella Permits", this.marginL, 15);
    this.pdf.setFillColor(...PDF_BRAND.terracotta);
    this.pdf.circle(this.marginL + 27, 14.2, 0.9, "F");
    // Page title at top-right
    if (title) {
      this.pdf.setFont("helvetica", "normal"); this.pdf.setFontSize(9);
      this.pdf.setTextColor(...PDF_BRAND.mute);
      this.pdf.text(title, this.pageW - this.marginR, 15, { align: "right" });
    }
    // Divider rule
    this.pdf.setDrawColor(...PDF_BRAND.rule);
    this.pdf.setLineWidth(0.3);
    this.pdf.line(this.marginL, 18, this.pageW - this.marginR, 18);
    this.y = Math.max(this.y, this.marginTop);
  }

  pageFooter(text) {
    const totalPages = this.pdf.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      this.pdf.setPage(p);
      this.pdf.setFont("helvetica", "normal"); this.pdf.setFontSize(8);
      this.pdf.setTextColor(...PDF_BRAND.mute);
      this.pdf.text(text || "Marbella Permits · marbellapermits.com",
        this.marginL, this.pageH - 12);
      this.pdf.text(`${p} / ${totalPages}`,
        this.pageW - this.marginR, this.pageH - 12, { align: "right" });
    }
  }

  // Headings
  title(text, opts = {}) {
    this._ensure(20);
    this.pdf.setFont("helvetica", "bold"); this.pdf.setFontSize(opts.size || 22);
    this.pdf.setTextColor(...this._color(opts.color || "ink"));
    const lines = this.pdf.splitTextToSize(text, this.contentW);
    for (const line of lines) {
      this.pdf.text(line, this.marginL, this.y + 8);
      this.y += 9;
    }
    // Accent rule under title
    this.pdf.setDrawColor(...PDF_BRAND.terracotta);
    this.pdf.setLineWidth(0.8);
    this.pdf.line(this.marginL, this.y + 2, this.marginL + 20, this.y + 2);
    this.y += 6;
  }

  h2(text) {
    this._ensure(14);
    this.y += 4;
    this.pdf.setFont("helvetica", "bold"); this.pdf.setFontSize(14);
    this.pdf.setTextColor(...PDF_BRAND.ink);
    this.pdf.text(text, this.marginL, this.y + 5);
    this.y += 8;
  }

  h3(text, opts = {}) {
    this._ensure(10);
    this.y += 2;
    this.pdf.setFont("helvetica", "bold"); this.pdf.setFontSize(11);
    this.pdf.setTextColor(...this._color(opts.color || "ink"));
    this.pdf.text(text, this.marginL, this.y + 4);
    this.y += 6;
  }

  eyebrow(text, color) {
    this._ensure(6);
    this.pdf.setFont("helvetica", "bold"); this.pdf.setFontSize(8);
    this.pdf.setTextColor(...this._color(color || "terracotta"));
    this.pdf.text(text.toUpperCase(), this.marginL, this.y + 3);
    this.y += 4;
  }

  body(text, opts = {}) {
    const fontSize = opts.size || 10;
    const color = this._color(opts.color || "ink2");
    this.pdf.setFont("helvetica", opts.bold ? "bold" : (opts.italic ? "italic" : "normal"));
    this.pdf.setFontSize(fontSize);
    this.pdf.setTextColor(...color);
    const lines = this.pdf.splitTextToSize(text, opts.width || this.contentW);
    const lineH = fontSize * 0.45;
    for (const line of lines) {
      this._ensure(lineH);
      this.pdf.text(line, this.marginL, this.y + lineH);
      this.y += lineH;
    }
    if (opts.after !== false) this.y += 2;
  }

  bullet(items, opts = {}) {
    const indent = 5;
    const bulletChar = opts.bulletChar || "·";
    this.pdf.setFont("helvetica", "normal"); this.pdf.setFontSize(10);
    this.pdf.setTextColor(...PDF_BRAND.ink2);
    for (const item of items) {
      const lines = this.pdf.splitTextToSize(item, this.contentW - indent - 3);
      this._ensure(4.5 * lines.length);
      this.pdf.setTextColor(...PDF_BRAND.terracotta);
      this.pdf.text(bulletChar, this.marginL + 1, this.y + 4);
      this.pdf.setTextColor(...PDF_BRAND.ink2);
      for (let i = 0; i < lines.length; i++) {
        this.pdf.text(lines[i], this.marginL + indent, this.y + 4);
        this.y += 4.5;
      }
      this.y += 0.8;
    }
  }

  checklist(items) {
    for (const item of items) {
      this._ensure(6);
      // Empty square
      this.pdf.setDrawColor(...PDF_BRAND.ink);
      this.pdf.setLineWidth(0.4);
      this.pdf.rect(this.marginL, this.y + 1.2, 3, 3);
      this.pdf.setFont("helvetica", "normal"); this.pdf.setFontSize(10);
      this.pdf.setTextColor(...PDF_BRAND.ink2);
      const lines = this.pdf.splitTextToSize(item, this.contentW - 7);
      for (let i = 0; i < lines.length; i++) {
        this.pdf.text(lines[i], this.marginL + 6, this.y + 3.5 + i * 4.5);
      }
      this.y += 4.5 * lines.length + 1.5;
    }
  }

  callout(title, body, kind = "info") {
    const colors = {
      info:    { border: PDF_BRAND.terracotta, fill: PDF_BRAND.terracottaTnt, text: PDF_BRAND.terracottaDk },
      warn:    { border: PDF_BRAND.amber, fill: [255, 244, 214], text: [146, 64, 14] },
      ok:      { border: PDF_BRAND.green, fill: [232, 240, 236], text: [26, 82, 56] },
      error:   { border: PDF_BRAND.red, fill: [251, 226, 226], text: PDF_BRAND.red },
    }[kind] || { border: PDF_BRAND.terracotta, fill: PDF_BRAND.terracottaTnt, text: PDF_BRAND.terracottaDk };

    this.pdf.setFont("helvetica", "normal"); this.pdf.setFontSize(9.5);
    const bodyLines = body ? this.pdf.splitTextToSize(body, this.contentW - 10) : [];
    const blockH = 6 + (title ? 5 : 0) + bodyLines.length * 4.2 + 2;
    this._ensure(blockH);

    this.pdf.setFillColor(...colors.fill);
    this.pdf.rect(this.marginL, this.y, this.contentW, blockH, "F");
    this.pdf.setFillColor(...colors.border);
    this.pdf.rect(this.marginL, this.y, 1.5, blockH, "F");

    let ty = this.y + 5;
    if (title) {
      this.pdf.setFont("helvetica", "bold"); this.pdf.setFontSize(10);
      this.pdf.setTextColor(...colors.text);
      this.pdf.text(title, this.marginL + 5, ty);
      ty += 5;
    }
    this.pdf.setFont("helvetica", "normal"); this.pdf.setFontSize(9.5);
    this.pdf.setTextColor(...PDF_BRAND.ink2);
    for (const line of bodyLines) {
      this.pdf.text(line, this.marginL + 5, ty);
      ty += 4.2;
    }
    this.y += blockH + 3;
  }

  // Bank-account card — used in the checklist for license + waste-deposit details
  bankCard(opts) {
    const rows = opts.rows; // [[label, value], ...]
    const titleH = opts.title ? 7 : 0;
    const rowH = 5.5;
    const h = 4 + titleH + rows.length * rowH + 3;
    this._ensure(h);
    this.pdf.setFillColor(...PDF_BRAND.paper);
    this.pdf.rect(this.marginL, this.y, this.contentW, h, "F");
    this.pdf.setDrawColor(...PDF_BRAND.rule); this.pdf.setLineWidth(0.3);
    this.pdf.rect(this.marginL, this.y, this.contentW, h);
    this.pdf.setFillColor(...PDF_BRAND.terracotta);
    this.pdf.rect(this.marginL, this.y, 1.5, h, "F");

    let ty = this.y + 5;
    if (opts.title) {
      this.pdf.setFont("helvetica", "bold"); this.pdf.setFontSize(11);
      this.pdf.setTextColor(...PDF_BRAND.ink);
      this.pdf.text(opts.title, this.marginL + 6, ty);
      ty += 5;
    }
    this.pdf.setFontSize(10);
    for (const [label, value] of rows) {
      this.pdf.setFont("helvetica", "normal");
      this.pdf.setTextColor(...PDF_BRAND.mute);
      this.pdf.text(label, this.marginL + 6, ty);
      this.pdf.setFont("helvetica", "bold");
      this.pdf.setTextColor(...PDF_BRAND.ink);
      this.pdf.text(String(value), this.marginL + 38, ty);
      ty += rowH;
    }
    this.y += h + 4;
  }

  table(rows, opts = {}) {
    // Simple 2-col label/value table
    const labelW = opts.labelW || 50;
    this.pdf.setFontSize(10);
    for (const [label, value] of rows) {
      const valueLines = this.pdf.splitTextToSize(String(value || ""), this.contentW - labelW - 3);
      this._ensure(4.5 * valueLines.length);
      this.pdf.setFont("helvetica", "normal");
      this.pdf.setTextColor(...PDF_BRAND.mute);
      this.pdf.text(label, this.marginL, this.y + 4);
      this.pdf.setFont("helvetica", "normal");
      this.pdf.setTextColor(...PDF_BRAND.ink);
      let ty = this.y + 4;
      for (const line of valueLines) {
        this.pdf.text(line, this.marginL + labelW, ty);
        ty += 4.5;
      }
      this.y = ty - 4 + 4.5;
    }
    this.y += 2;
  }

  // Section divider rule
  hr() {
    this._ensure(4);
    this.pdf.setDrawColor(...PDF_BRAND.rule);
    this.pdf.setLineWidth(0.3);
    this.pdf.line(this.marginL, this.y + 2, this.pageW - this.marginR, this.y + 2);
    this.y += 5;
  }

  spacer(h = 4) { this.y += h; }

  signatureBox(label = "Firma") {
    this._ensure(35);
    this.spacer(8);
    this.pdf.setDrawColor(...PDF_BRAND.ink);
    this.pdf.setLineWidth(0.4);
    this.pdf.line(this.marginL, this.y + 20, this.marginL + 80, this.y + 20);
    this.pdf.setFont("helvetica", "normal"); this.pdf.setFontSize(9);
    this.pdf.setTextColor(...PDF_BRAND.mute);
    this.pdf.text(label, this.marginL, this.y + 25);
    this.y += 28;
  }

  stepNumber(n, label) {
    this._ensure(14);
    // Big numeral
    this.pdf.setFont("helvetica", "bold"); this.pdf.setFontSize(28);
    this.pdf.setTextColor(...PDF_BRAND.terracotta);
    this.pdf.text(String(n).padStart(2, "0"), this.marginL, this.y + 10);
    // Label
    this.pdf.setFont("helvetica", "bold"); this.pdf.setFontSize(13);
    this.pdf.setTextColor(...PDF_BRAND.ink);
    this.pdf.text(label, this.marginL + 16, this.y + 8);
    this.y += 13;
  }

  newPage() {
    this.pdf.addPage();
    this.y = this.marginTop;
  }

  // Render an "email card" — used for the email PDFs
  emailHeader(to, subject) {
    this._ensure(20);
    this.pdf.setDrawColor(...PDF_BRAND.rule);
    this.pdf.setLineWidth(0.3);
    this.pdf.rect(this.marginL, this.y, this.contentW, 18);
    this.pdf.setFont("helvetica", "normal"); this.pdf.setFontSize(9);
    this.pdf.setTextColor(...PDF_BRAND.mute);
    this.pdf.text("TO:", this.marginL + 4, this.y + 6);
    this.pdf.text("SUBJECT:", this.marginL + 4, this.y + 12);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.setTextColor(...PDF_BRAND.ink);
    this.pdf.text(to, this.marginL + 25, this.y + 6);
    const subjectLines = this.pdf.splitTextToSize(subject, this.contentW - 30);
    this.pdf.text(subjectLines[0], this.marginL + 25, this.y + 12);
    this.y += 22;
  }

  emailBody(text) {
    // monospace-like in Courier for readability
    this.pdf.setFont("courier", "normal"); this.pdf.setFontSize(9.5);
    this.pdf.setTextColor(...PDF_BRAND.ink);
    const lines = text.split("\n");
    for (const raw of lines) {
      const wrapped = this.pdf.splitTextToSize(raw || " ", this.contentW);
      for (const line of wrapped) {
        this._ensure(4);
        this.pdf.text(line, this.marginL, this.y + 4);
        this.y += 4;
      }
    }
    this.spacer(4);
  }
}
