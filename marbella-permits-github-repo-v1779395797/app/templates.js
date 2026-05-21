// Spanish-language document and email templates for the Marbella permit dossier.
// Mirrors the structure of the OFFICIAL "Declaracion_responsable_obras_1.pdf" form
// (9-page version, DIR3 LA0013641 LICENCIAS).
//
// UI is English, but the OUTPUT documents are Spanish (Spanish law requires
// Spanish-language submissions).

// ---------- Project-type → Spanish operational description ----------
const PROJECT_TYPE_ES = {
  kitchen_replace:   "Sustitución de mobiliario e instalaciones de cocina, sin modificación de tabiquería ni elementos estructurales.",
  bathroom_redo:     "Reforma de baño consistente en sustitución de sanitarios, alicatado, solado y revestimientos. No se modifica tabiquería.",
  interior_paint:    "Trabajos de pintura interior y renovación de acabados (parquet, alicatados superficiales, falsos techos). No afecta a elementos estructurales.",
  facade_paint:      "Pintura y mantenimiento de fachada existente. No se modifican huecos, ni se interviene en elementos estructurales.",
  terrace_refurb:    "Reforma de terraza/patio: solado, impermeabilización y revestimientos. No se altera la geometría ni la estructura.",
  pool_work:         "Mantenimiento y rehabilitación de piscina existente: alicatado, depuración, instalaciones. No se modifica el vaso ni la ocupación en planta.",
  windows_doors:     "Sustitución de carpintería interior, manteniendo el mismo dimensionado de huecos. No se intervienen elementos estructurales ni se altera la disposición de las piezas habitables.",
  multiple:          "Conjunto de actuaciones de reforma menor sin afectación estructural ni cambios de distribución, todas ellas dentro del régimen del artículo 169 bis.1.a) de la Ley 7/2002.",
};


// ---------- Official Declaración Responsable PDF text ----------
// Faithful to the 9-page form. The wizard pre-fills every field it can; the rest
// the user prints, fills by hand or with a PDF editor, and signs.
function generateDR(data, fees) {
  const today = new Date().toLocaleDateString("es-ES", {day: "2-digit", month: "long", year: "numeric"});
  const codes = getSectionACodes(data.project_type);
  const codesText = codes.length
    ? codes.map(c => `  [X] ${c} — ${SECTION_A_DESCRIPTIONS[c] || ""}`).join("\n\n")
    : "[architect: marcar el código de la actuación correspondiente en la sección A del impreso oficial]";

  return {
    title: "DECLARACIÓN RESPONSABLE PARA EJECUCIÓN DE OBRAS",
    body: `
EXCMO. AYUNTAMIENTO DE MARBELLA
DIR3: LA0013641 — LICENCIAS
Delegación de Ordenación del Territorio, Vivienda y Urbanizaciones

Actuaciones incluidas en el art. 169 bis. 1.a) y b) de la Ley 7/2002, de
17 de diciembre, de Ordenación Urbanística de Andalucía.

------------------------------------------------------------------
DECLARANTE
------------------------------------------------------------------
Nombre y apellidos o razón social:
  ${data.owner_type === "company"
    ? (data.company_name || "[Company name]")
    : (data.owner_name || "[Full name]")}

Teléfono:                ${data.phone || "[Phone]"}
DNI / NIE / NIF:         ${data.owner_type === "company" ? (data.company_cif || "[CIF]") : (data.owner_id || "[DNI/NIE/Passport]")}

${data.owner_type === "company" ? `Representante: ${data.owner_name || "[Administrator]"}
Teléfono:                ${data.phone || "[Phone]"}
DNI / NIE / NIF:         ${data.owner_id || "[DNI/NIE]"}\n` : ""}
Domicilio a efectos de notificaciones:
  ${data.property_address || "[Property address]"}

Localidad: Marbella
Provincia: Málaga       C. Postal: 29600       Correo electrónico: ${data.owner_email || "[Email]"}

Preferencias de notificación:   [X] Medios electrónicos     [ ] Soporte papel

------------------------------------------------------------------
DATOS DE LA OBRA
------------------------------------------------------------------
Dirección:              ${data.property_address || "[Property address]"}
Ref. catastral:         ${data.catastral_reference || "[Catastral reference]"}
Presupuesto de Ejecución Material: ${fees.pem.toLocaleString("es-ES")} € (sin IVA)
Cambio de uso o actividad: [ ] Sí   [X] No

Descripción de la obra:

${PROJECT_TYPE_ES[data.project_type] || "[Descripción]"}

${data.project_description ? `Detalle adicional aportado por el promotor:\n${data.project_description}\n` : ""}
------------------------------------------------------------------
SECCIÓN A — Obras que NO requieren documentación técnica
------------------------------------------------------------------
Marcar el/los apartado(s) que corresponden a la actuación:

${codesText}

------------------------------------------------------------------
DOCUMENTACIÓN ADMINISTRATIVA APORTADA
------------------------------------------------------------------
[X] Documentación que acredita la personalidad del declarante
[X] Documento justificativo del abono de la Tasa por Licencia Urbanística
[X] Documento justificativo del abono del ICIO
[X] Aval / fianza para la gestión de residuos de la construcción

------------------------------------------------------------------
DECLARACIÓN RESPONSABLE
------------------------------------------------------------------
El abajo firmante DECLARA BAJO SU RESPONSABILIDAD que los datos reseñados
son ciertos, así como todos los documentos que se adjuntan, y específicamente:

Primero. — Que las obras objeto de la presente declaración se encuentran
  entre las definidas en el art. 169 bis.1.a) de la Ley 7/2002, siendo
  obras de escasa entidad constructiva y sencillez técnica, y NO requieren
  proyecto según lo previsto en la Ley de Ordenación de la Edificación.

Segundo. — Que las obras cumplen las determinaciones y requisitos
  establecidos en el instrumento de planeamiento aplicable y la normativa
  urbanística y sectorial aplicables.
  Situación de la edificación: [X] Legal, cumpliendo la Normativa de aplicación.

Cuarto. — [X] Que la edificación NO se encuentra catalogada ni dispone de
  protección de carácter ambiental o histórico-artístico.

Quinto. — Que me comprometo a ejecutar las obras (o exigir a quien las
  ejecute) el cumplimiento de la legislación vigente en materia de
  prevención de riesgos laborales y gestión de residuos.

------------------------------------------------------------------
CONSENTIMIENTO DE PROTECCIÓN DE DATOS
------------------------------------------------------------------
[X] AUTORIZO al Ayuntamiento de Marbella a consultar o recabar documentos
    e información que estime oportunos en relación a este procedimiento.

------------------------------------------------------------------
FIRMA
------------------------------------------------------------------
En Marbella, a ${today}.

EL DECLARANTE${data.owner_type === "company" ? " O SU REPRESENTANTE LEGAL" : ""}:

Fdo.: ${data.owner_name || "[Owner signature]"}
${data.owner_type === "company" ? `Por: ${data.company_name || ""} (CIF ${data.company_cif || ""})` : ""}

Sr/a. Alcalde/sa del Excmo. Ayuntamiento de Marbella

------------------------------------------------------------------
NOTA — Esta es una versión texto del impreso oficial generada por el portal
Marbella Permits. Para el envío telemático puede usarse este documento o
descargar el PDF oficial vacío desde la Sede Electrónica del Ayuntamiento
(sede.malaga.es/marbella) y transcribir los mismos datos.
    `.trim(),
  };
}


// ---------- Presupuesto template (Spanish, without VAT) ----------
function generatePresupuesto(data, fees) {
  const today = new Date().toLocaleDateString("es-ES");
  const lines = [
    "PRESUPUESTO DE EJECUCIÓN MATERIAL",
    "",
    `Promotor:       ${data.owner_name || "[Promotor]"}`,
  ];
  if (data.owner_type === "company") {
    lines.push(`Empresa:        ${data.company_name || ""} (CIF ${data.company_cif || ""})`);
  }
  lines.push(`Inmueble:       ${data.property_address || ""}`);
  lines.push(`Ref. catastral: ${data.catastral_reference || ""}`);
  lines.push(`Fecha:          ${today}`);
  lines.push("");
  lines.push("---------------------------------------------------------");
  lines.push("DESCRIPCIÓN                                  IMPORTE (€)");
  lines.push("---------------------------------------------------------");
  if (Number(data.demolition_pct) > 0) {
    lines.push(`Demoliciones y retirada de escombros        ${fees.demolition_eur.toLocaleString("es-ES")}`);
  }
  const desc = PROJECT_TYPE_ES[data.project_type] || "Obras";
  const truncDesc = desc.length > 42 ? desc.slice(0, 42) + "…" : desc.padEnd(42);
  lines.push(`${truncDesc}  ${fees.rest_eur.toLocaleString("es-ES")}`);
  lines.push("---------------------------------------------------------");
  lines.push(`TOTAL PRESUPUESTO EJECUCIÓN MATERIAL (sin IVA): ${fees.pem.toLocaleString("es-ES")} €`);
  lines.push("");
  lines.push("[architect/owner: detallar partidas por capítulo si la obra lo requiere].");
  lines.push("");
  lines.push(`Firmado por: ${data.owner_name || "[Promotor]"}`);
  lines.push(`A día ${today}.`);
  return lines.join("\n");
}


// ---------- Email to oficinaliquidadora@marbella.es ----------
function generateLicenseEmail(data, fees) {
  return {
    to: "oficinaliquidadora@marbella.es",
    subject: `Solicitud carta de pago — DR ${data.property_address || ""}`,
    body: `
Estimados/as,

Adjunto a este correo la documentación necesaria para la tramitación de la
Declaración Responsable de Obras correspondientes al inmueble situado en
${data.property_address || "[Property address]"}, con referencia catastral
${data.catastral_reference || "[Catastral reference]"}.

Solicitamos la emisión de la correspondiente carta de pago para poder
proceder al abono de la tasa por licencia urbanística y del ICIO.

Datos del declarante:
  Nombre/Razón social: ${data.owner_type === "company" ? (data.company_name || "") : (data.owner_name || "")}
  ${data.owner_type === "company" ? `CIF:                 ${data.company_cif || ""}\n  Representante:       ${data.owner_name || ""} (${data.owner_id || ""})` : `DNI/NIE/Pasaporte:   ${data.owner_id || ""}`}
  Email de contacto:   ${data.owner_email || ""}

Presupuesto de Ejecución Material (sin IVA): ${fees.pem.toLocaleString("es-ES")} €.

Documentos adjuntos:
  1. Declaración Responsable de Obras (firmada).
  2. Presupuesto sin IVA, en español.
  3. Plano de situación.
  4. Copia DNI / NIE / Pasaporte del declarante.
  ${data.owner_type === "company" ? "5. Escrituras de representación de la empresa.\n  6. Copia del CIF de la empresa." : ""}

Quedamos a la espera de la carta de pago para proceder con el abono en
la cuenta correspondiente del Patronato (Unicaja ES59 2103 1001 5702 3000 0222).

Muchas gracias por su atención.

Atentamente,
${data.owner_name || "[Owner]"}
${data.owner_email || "[Email]"}
    `.trim(),
  };
}


// ---------- Email to caja@marbella.es ----------
function generateWasteEmail(data, fees) {
  return {
    to: "caja@marbella.es",
    subject: `Solicitud carta de pago — Fianza residuos ${data.property_address || ""}`,
    body: `
Estimados/as,

Hemos abonado la fianza por gestión de residuos de construcción y demolición
correspondiente a la Declaración Responsable de Obras del inmueble:

  Dirección:      ${data.property_address || ""}
  Ref. catastral: ${data.catastral_reference || ""}

Cálculo de la fianza:
  PEM total:                                ${fees.pem.toLocaleString("es-ES")} €
  Demoliciones (PEM × ${(Number(data.demolition_pct) || 0)}%):           ${fees.demolition_eur.toLocaleString("es-ES")} €
  Resto del proyecto:                       ${fees.rest_eur.toLocaleString("es-ES")} €
  Fianza (2% demolición + 1% resto):        ${fees.waste_deposit.toLocaleString("es-ES")} €

Adjunto el justificante de pago realizado a la cuenta del Ayuntamiento:
  Entidad: BBVA
  IBAN:    ES73 0182 5918 4502 0150 6063
  Titular: Ayuntamiento de Marbella (NIF P2906900B)
  Concepto: "Fianza ${fees.waste_deposit.toLocaleString("es-ES")} € — ${data.property_address || ""}"

Solicitamos la emisión de la correspondiente carta de pago para anexar al
expediente de la Declaración Responsable.

Muchas gracias.

Atentamente,
${data.owner_name || "[Owner]"}
${data.owner_email || "[Email]"}
    `.trim(),
  };
}


// ---------- Carta de Autorización ----------
// Matches the real format observed in the user's uploaded "Carta de autorización.docx"
// — short, one paragraph, signed by the owner.
function generateAuthorizationLetter(data) {
  const today = new Date().toLocaleDateString("es-ES", {day: "numeric", month: "long", year: "numeric"});
  const ownerNoun = data.owner_type === "company" ? "como administrador de" : "como propietario/a del inmueble";
  const ownerEntity = data.owner_type === "company"
    ? `${data.company_name || "[Empresa]"} con NIF ${data.company_cif || "[NIF]"}`
    : `el inmueble situado en ${data.property_address || "[Dirección]"}`;
  const idLabel = (data.owner_id || "").toUpperCase().startsWith("X") ? "NIE" :
                  /^\d/.test(data.owner_id || "") ? "DNI" : "pasaporte";

  return `
${today}

Carta de autorización

Yo D./Dña. ${data.owner_name || "[Owner full name]"} con número de ${idLabel} ${data.owner_id || "[ID]"} ${ownerNoun} ${ownerEntity}, autorizo a [Name of authorised representative] con NIE/DNI [Representative's NIE/DNI] a representar a ${data.owner_type === "company" ? (data.company_name || "[Empresa]") : "mi persona"} en nombre de la solicitud de la licencia de Declaración Responsable y a gestionar todas las comunicaciones con el Ayuntamiento.


Firmado:

${data.owner_name || "[Owner signature]"}
${data.owner_type === "company" ? `${data.company_name || ""}, ${data.company_cif || ""}` : ""}
  `.trim();
}


// ---------- Step-by-step submission checklist (ENGLISH for the user) ----------
function generateChecklistEN(data, fees) {
  return `
MARBELLA PERMITS — YOUR SUBMISSION CHECKLIST

This dossier has everything you need to file your Declaración Responsable
with Marbella town hall. Follow the steps in order. Your time invested:
roughly 75 minutes spread across 2 weeks (most of it is waiting for the
town hall to reply).

--------------------------------------------------------------------
STEP 1 — Print and sign the Declaración Responsable
--------------------------------------------------------------------
  • Open "01-declaracion-responsable.pdf"
  • Print it. Review every field. The wizard pre-filled what it could —
    fill in any gaps and CHECK that the Section-A box(es) match the
    actual work (the wizard auto-marked the right code(s) for your
    project type).
  • Sign on the signature line at the bottom of the last page.
  • Scan the signed document back to PDF (or photograph and convert).

  ⚠ If you prefer the OFFICIAL blank PDF version of the form, download
    it free from sede.malaga.es/marbella and transcribe the same data.

--------------------------------------------------------------------
STEP 2 — Gather your supporting documents
--------------------------------------------------------------------
  You need ALL of these in one folder before contacting the town hall:

  ☐ Signed Declaración Responsable (from step 1)
  ☐ Presupuesto in Spanish, sin IVA (file 02-presupuesto.txt — open in Word,
    review, save as PDF)
  ☐ Plano de situación (location plan)
    → Get it free from https://www1.sedecatastro.gob.es/
       Enter your catastral reference: ${data.catastral_reference || "[your ref]"}
       Download the "Consulta descriptiva y gráfica" PDF (the page with
       the parcel map and outline)
  ☐ Copy of your DNI / NIE / Passport (clear scan or photo, both sides)
  ${data.owner_type === "company" ? `☐ Escrituras de representación of the company\n  ☐ Copy of the company CIF certificate (modelo 036/037)\n` : ""}

--------------------------------------------------------------------
STEP 3 — Email the town hall to request the carta de pago (license)
--------------------------------------------------------------------
  Open "03-email-licencia.txt" and copy its content into a new email.

  To:      oficinaliquidadora@marbella.es
  Attach:  All the documents from step 2.

  → Wait. The town hall replies within 5–10 working days with a
    "carta de pago" PDF — a payment slip with a specific reference number
    in the top-right corner.

--------------------------------------------------------------------
STEP 4 — Pay the license fee at the bank
--------------------------------------------------------------------
  Amount:   €${fees.license_fee.toLocaleString("en-GB")}   (PEM × 4.72%)

  Bank:     Unicaja Banco
  Branch:   Sucursal Alta Renta, C/ Fernando Camino nº 2, 29016 Málaga
  Titular:  Patronato Recaudación Provincial de Málaga
  IBAN:     ES59 2103 1001 5702 3000 0222
  SWIFT:    UCJAES2M
  Gastos:   OUR  (you pay the wire fees if sending from abroad)

  Concept (write EXACTLY): the identification number printed on the
    top-right corner of the "carta de pago" they sent you, followed by
    "${data.owner_type === "company" ? (data.company_name || "[Company name]") : (data.owner_name || "[Your name]")}"

  Where to pay:
    • Online via your Spanish bank's transfer form
    • In person at any Unicaja branch
    • International wire (use SWIFT UCJAES2M)

  → Keep the receipt (justificante de pago) — you'll attach it later.

--------------------------------------------------------------------
STEP 5 — Calculate and pay the waste deposit (fianza)
--------------------------------------------------------------------
  This runs in parallel with steps 3–4 (the order doesn't matter; both
  must be done before the final submission).

  Amount:   €${fees.waste_deposit.toLocaleString("en-GB")}
  Formula:  ${fees.waste_formula}

  Bank:     BBVA
  Titular:  Ayuntamiento de Marbella (NIF P2906900B)
  IBAN:     ES73 0182 5918 4502 0150 6063
  SWIFT:    BBVAESMMXXX

  Concept (write EXACTLY):
    "Fianza ${fees.waste_deposit.toLocaleString("es-ES")} € — ${data.property_address || ""}"

  → Keep the receipt.

--------------------------------------------------------------------
STEP 6 — Request the waste-deposit carta de pago
--------------------------------------------------------------------
  Open "04-email-residuos.txt". Copy the content into a new email.

  To:      caja@marbella.es
  Attach:  The bank receipt from step 5.

  → Wait. They reply with the carta de pago for waste, which you'll add
    to your main file.

--------------------------------------------------------------------
STEP 7 — Submit through the sede electrónica
--------------------------------------------------------------------
  Before you start: you need either a Spanish digital certificate (FNMT),
  Cl@ve PIN, or an authorised representative who has one. If you don't
  have any of these and your property is owned by a Spanish company,
  use the company's administrator certificate.

  Step-by-step navigation:

  1. Open https://www.marbella.es
  2. Click "Sede electrónica" (top menu)
  3. Click "Trámites" (second box on the page)
  4. Click "Instancia General"
  5. Click "Acceder con Certificado Digital"
  6. Fill the instancia form. Your data comes straight from the DR.
     IMPORTANT: in the "Delegación" dropdown choose LICENCIAS
     (NOT urbanismo, NOT obras, NOT proyectos — it's LICENCIAS).
  7. Attach ALL of these files:
       ☐ Signed Declaración Responsable
       ☐ Presupuesto in Spanish
       ☐ Plano de situación
       ☐ DNI/NIE/Passport copies
       ☐ Bank receipt for license fee
       ☐ Carta de pago for license (from step 3)
       ☐ Bank receipt for waste deposit
       ☐ Carta de pago for waste deposit (from step 6)
       ${data.owner_type === "company" ? "☐ Escrituras de representación\n       ☐ CIF\n" : ""}
  8. Click "Presentar" and SAVE the digital justificante (acuse de recibo)
     that the sede generates — that's your legal proof of submission.

  Need help? Call +34 690 380 502 — that's the human in the local
  team who originally documented this process.

  ✓ You can legally start the work the moment you've submitted.

--------------------------------------------------------------------
WHAT IF SOMETHING GOES WRONG?
--------------------------------------------------------------------
  • Town hall doesn't reply to step 3 within 10 working days:
    → Reply to your own email politely: "Buenos días, escribo de nuevo
       para solicitar la carta de pago de la DR del inmueble [address]…"
  • They send a "requerimiento" asking for more documents:
    → Read what they ask for. Send what they need.
       If the question is about the scope, your DR (step 1) covers most cases.
  • They reject your case as needing "proyecto técnico":
    → The work has scope you didn't realise — get an architect involved.
       Email hello@marbellapermits.com and we'll refer you to a partner.

--------------------------------------------------------------------
TIMELINE
--------------------------------------------------------------------
  Day 0:     Steps 1–2 — print, sign, gather (30 minutes)
  Day 1:     Steps 3 + 5 (10 minutes — emails + plan the bank wires)
  Day 5–10:  Cartas de pago arrive → step 4 + step 6 (30 min at bank/wire)
  Day 12:    Step 7 — submit (20 min)

  Total elapsed time: ~2 weeks.
  Your time invested: ~75 minutes total.
`.trim();
}
