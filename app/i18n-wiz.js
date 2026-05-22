// Marbella Permits — wizard + PDF translations.
// Loaded AFTER i18n.js. Extends the global TRANSLATIONS object with the
// wizard UI and the customer-facing PDF instruction text in all 5 languages.
//
// DESIGN RULE (unchanged): the Spanish LEGAL documents that go to the town hall
// — the Declaración Responsable form body, the presupuesto figures, the email
// bodies, the carta de autorización, the self-certification legal text — stay in
// Spanish regardless of UI language. Only the customer-facing wrappers,
// instructions, the step-by-step booklet and the glossary definitions translate.
//
// Keys are stable. EN is the source of truth; missing keys fall back to EN via t().

// Interpolation helper: tf("key", {amount: 1200}) replaces {amount} in the string.
function tf(key, params, fallback) {
  let s = t(key, fallback);
  if (params) {
    for (const k in params) {
      s = s.split("{" + k + "}").join(String(params[k]));
    }
  }
  return s;
}

// ===================== ENGLISH (source of truth) =====================
const WIZ_EN = {
  // ---- stepper labels ----
  "wiz.step.start": "Start",
  "wiz.step.owner": "About you",
  "wiz.step.property": "Property",
  "wiz.step.work": "The work",
  "wiz.step.eligibility": "Eligibility",
  "wiz.step.fees": "Cost summary",
  "wiz.step.dossier": "Dossier",

  // ---- shared buttons / words ----
  "wiz.btn.back": "← Back",
  "wiz.btn.next": "Next →",
  "wiz.common.yes": "Yes",
  "wiz.common.no": "No",

  // ---- project type labels (mirrors rules.js COVERED_PROJECT_TYPES) ----
  "wiz.ptype.kitchen_replace": "Kitchen replacement (same layout)",
  "wiz.ptype.bathroom_redo": "Bathroom renovation (no wall changes)",
  "wiz.ptype.interior_paint": "Interior painting / finishes",
  "wiz.ptype.facade_paint": "Façade painting (no structural)",
  "wiz.ptype.terrace_refurb": "Terrace / patio refurbishment",
  "wiz.ptype.pool_work": "Pool maintenance / re-tiling",
  "wiz.ptype.windows_doors": "Window / door replacement (same openings)",
  "wiz.ptype.multiple": "Multiple of the above",

  // ---- eligibility blocker messages (keyed by code from rules.js) ----
  "wiz.blocker.WALL_CHANGES": "Moving or removing walls requires a stamped architect's project. Not in scope.",
  "wiz.blocker.STRUCTURAL": "Structural changes (load-bearing elements, foundations) require a full project.",
  "wiz.blocker.NEW_OPENINGS": "New façade openings need a stamped architect's project.",
  "wiz.blocker.BUDGET_OVER_100K": "Project budget €{budget} exceeds the simple-DR ceiling of €{max}.",
  "wiz.blocker.DISTRIBUTION_OVER_100M2": "Distribution changes of {m2} m² exceed the 100 m² simple-DR ceiling.",
  "wiz.blocker.HISTORIC_ZONE": "Properties in historic zones require additional Cultura authorisation — not in scope.",
  "wiz.blocker.COASTAL_ZONE": "Properties in the coastal zone require Costas authorisation — not in scope for the simple track.",

  // ---- fee formula fragments (used in rules.js calculateFees) ----
  "wiz.formula.demoshare": "Demolition share",
  "wiz.formula.rest": "Rest",

  // ---- welcome step ----
  "wiz.welcome.title": "Get your Marbella renovation permit, in 10 minutes.",
  "wiz.welcome.subtitle": "This wizard prepares the complete dossier you need to file a <em>Declaración Responsable</em> with Marbella town hall. It takes about 10 minutes. At the end you'll get a ZIP with every document, every email text to send, and a step-by-step checklist in your language.",
  "wiz.welcome.cover_title": "What we cover:",
  "wiz.welcome.cover_body": " kitchen and bathroom redos (without moving walls), painting, terrace and pool work, window/door replacements. Total budget under €100,000. Anything bigger needs an architect — we'll tell you on the eligibility step.",
  "wiz.welcome.nodo_title": "What we don't do:",
  "wiz.welcome.nodo_body": " we don't submit on your behalf. You stay in control. We hand you everything, ready to send, with step-by-step instructions.",
  "wiz.welcome.start": "Start →",

  // ---- owner step ----
  "wiz.owner.title": "About you",
  "wiz.owner.subtitle": "Just the basics so we can pre-fill your documents.",
  "wiz.owner.name": "Your full name",
  "wiz.owner.email": "Email",
  "wiz.owner.phone": "Phone (international format)",
  "wiz.owner.phone_hint": "Required on the official form. International number is fine.",
  "wiz.owner.applying_as": "Are you applying as…",
  "wiz.owner.individual": "Individual",
  "wiz.owner.company": "Spanish company (S.L. / S.A.)",
  "wiz.owner.id": "DNI / NIE / Passport number",
  "wiz.owner.id_hint": "If you're a foreigner, this is your NIE. Foreigners without an NIE must obtain one before filing — we'll explain in the dossier.",
  "wiz.owner.company_name": "Company name",
  "wiz.owner.cif": "CIF",
  "wiz.owner.err": "Please enter your name and email",

  // ---- property step ----
  "wiz.prop.title": "The property",
  "wiz.prop.subtitle": "Where the work will happen.",
  "wiz.prop.address": "Full property address",
  "wiz.prop.address_ph": "e.g. Calle Almendros 14, Nueva Andalucía, Marbella",
  "wiz.prop.catastral": "Catastral reference",
  "wiz.prop.catastral_hint": "14–20 characters. Find it on your IBI tax bill, or look it up free at",
  "wiz.prop.catastral_ph": "e.g. 8765432UF3486N0001GH",
  "wiz.prop.type": "Property type",
  "wiz.prop.villa": "Villa / detached house",
  "wiz.prop.townhouse": "Townhouse",
  "wiz.prop.apartment": "Apartment",
  "wiz.prop.commercial": "Commercial / other",
  "wiz.prop.historic_q": "Is the property in a historic / protected zone?",
  "wiz.prop.coastal_q": "Is the property in the coastal zone (within 100m of the sea)?",
  "wiz.prop.err_addr": "Please enter address and catastral reference",
  "wiz.prop.err_cat": "Catastral reference should be 14–20 characters",

  // ---- work step ----
  "wiz.work.title": "The work",
  "wiz.work.subtitle": "Tell us what you're planning. We'll check whether it fits the simple track.",
  "wiz.work.type": "What kind of work?",
  "wiz.work.select": "— select —",
  "wiz.work.desc": "Brief description (any specifics worth mentioning)",
  "wiz.work.desc_ph": "e.g. Replacing the kitchen units with new ones in the same layout. New worktop. Re-tiling the splashback.",
  "wiz.work.desc_hint": "Optional. We'll incorporate this in the Spanish description on the form.",
  "wiz.work.budget": "Project budget (€, without VAT)",
  "wiz.work.budget_hint": "PEM = Presupuesto de Ejecución Material. Cost of the works themselves, no VAT.",
  "wiz.work.demo": "Approximately what % is demolition?",
  "wiz.work.demo_hint": "Rough estimate. 0% if no walls or surfaces will be torn out.",
  "wiz.work.walls_q": "Will the work involve <strong>moving or removing any walls</strong>?",
  "wiz.work.structural_q": "Any <strong>structural changes</strong> (beams, columns, floors)?",
  "wiz.work.openings_q": "Any <strong>new openings in the façade</strong> (windows, doors, balconies)?",
  "wiz.work.check_btn": "Check eligibility →",
  "wiz.work.err": "Please pick a project type and enter a budget",

  // ---- eligibility step ----
  "wiz.elig.title": "Eligibility check",
  "wiz.elig.exempt.subtitle": "Good news — Marbella's January 2026 urban-planning instruction exempts your work from any permit requirement.",
  "wiz.elig.exempt.card_title": "✓ Exempt — no permit needed",
  "wiz.elig.exempt.body1": "<strong>You can legally start the work immediately.</strong> Marbella's January 2026 <em>instrucción urbanística</em> exempts simple works under €10,000 (painting, finishes, certain interior installations) from any prior permit or fee, provided the property is not in a protected zone.",
  "wiz.elig.exempt.body2": "We can generate a free self-certification PDF for your records — useful for resale due diligence, neighbour disputes, or if the town hall ever asks how the work was authorised.",
  "wiz.elig.exempt.next": "Generate self-certification →",
  "wiz.elig.ok.subtitle": "Your project fits the simple Declaración Responsable track. Let's calculate the fees.",
  "wiz.elig.ok.card_title": "✓ Eligible for the simple DR track",
  "wiz.elig.ok.body": "You can proceed without a stamped architect's project. We'll generate everything you need to file with Marbella town hall yourself.",
  "wiz.elig.ok.next": "See cost summary →",
  "wiz.elig.no.subtitle": "Your project doesn't fit the simple track. Here's why.",
  "wiz.elig.no.card_title": "✗ Not eligible for the simple track",
  "wiz.elig.no.intro": "The blockers below mean Spanish law requires a stamped architect's project (obra mayor or visado-stamped obra menor):",
  "wiz.elig.no.whatnow": "<strong>What now?</strong> We can refer you to a vetted partner architect, or you can adjust the scope of your project so it fits the simple track. Email <a href=\"mailto:hello@marbellapermits.com\">hello@marbellapermits.com</a> for a referral.",
  "wiz.elig.no.reset": "Reset wizard",
  "wiz.elig.back": "← Back, adjust the project",
  "wiz.elig.reset_confirm": "Reset all your answers and start over?",

  // ---- fees step ----
  "wiz.fees.title": "Cost summary",
  "wiz.fees.subtitle": "What you'll pay Marbella town hall, plus our €99 service fee.",
  "wiz.fees.pem": "Project budget (PEM)",
  "wiz.fees.pem_sub": "Your declared figure",
  "wiz.fees.license": "License fee (ICIO + tasa)",
  "wiz.fees.waste": "Waste deposit (fianza)",
  "wiz.fees.service": "Marbella Permits service",
  "wiz.fees.service_sub": "Flat fee, paid once",
  "wiz.fees.total_label": "Total cost of permitting:",
  "wiz.fees.total_body": "Town-hall fees ({townhall}) go to Marbella directly — you wire them at the bank. Our €99 is for preparing your complete dossier.",
  "wiz.fees.waste_about_title": "About the waste deposit:",
  "wiz.fees.waste_about_body": " it's a refundable fianza. After the works finish, you can recover it from the ayuntamiento upon proof of correct waste disposal.",
  "wiz.fees.generate_btn": "Generate my dossier →",

  // ---- dossier step (full DR pack) ----
  "wiz.dos.title": "Your dossier is ready",
  "wiz.dos.subtitle": "Download the ZIP. Everything you need to file is inside, with step-by-step instructions in your language.",
  "wiz.dos.pack_banner": "<strong>✓ Pack contains 6 files</strong> — your step-by-step instruction book + 5 documents you'll use along the way. <strong>Open file 00 first.</strong> It tells you when to use the others.",
  "wiz.dos.f00": "<strong>00-START-HERE-instructions.pdf</strong> — Your step-by-step guide. Open this first; it tells you when to use the rest.",
  "wiz.dos.f01": "<strong>01-form-to-sign.pdf</strong> — The official form for you to print, sign, and scan.",
  "wiz.dos.f02": "<strong>02-cost-breakdown.pdf</strong> — Cost breakdown in Spanish (the town hall needs this).",
  "wiz.dos.f03": "<strong>03-first-email.pdf</strong> — Text of the first email to send to the town hall.",
  "wiz.dos.f04": "<strong>04-second-email.pdf</strong> — Text of the second email to send to the town hall.",
  "wiz.dos.f05": "<strong>05-permission-letter-optional.pdf</strong> — Permission letter (only if someone else submits for you).",
  "wiz.dos.download": "↓ Download dossier (.zip)",
  "wiz.dos.preview": "Preview the DR",
  "wiz.dos.preview_title": "Preview — Declaración Responsable",
  "wiz.dos.next_title": "What happens next?",
  "wiz.dos.next_body": " Open the instruction book (file 00). It walks you through every email, every bank wire, every upload — in order, in your language. Total of your time: about 75 minutes spread over 2 weeks.",
  "wiz.dos.back": "← Back to cost summary",
  "wiz.dos.startover": "Start over",
  "wiz.dos.startover_confirm": "Start over with a new project? Your current answers will be cleared.",
  "wiz.dos.toast_generating": "Generating dossier…",
  "wiz.dos.toast_done": "Dossier downloaded",

  // ---- dossier step (exempt pack) ----
  "wiz.exempt.title": "Your self-certification is ready",
  "wiz.exempt.subtitle": "No permit needed. No fee. Just a short PDF for your records.",
  "wiz.exempt.pack_banner": "<strong>✓ Pack contains 2 files</strong> — a self-certification PDF citing the January 2026 Marbella instruction that exempts your work, and a short guide in your language explaining what to keep on file.",
  "wiz.exempt.f01": "<strong>01-self-certification.pdf</strong> — A formal self-declaration that your work is exempt under Marbella's 2026 instrucción urbanística. Sign, date, keep on file.",
  "wiz.exempt.f02": "<strong>02-what-to-keep.pdf</strong> — Short guide: what to do if a neighbour complains, what to keep for resale due diligence, when to upgrade to a full DR (if scope grows).",
  "wiz.exempt.download": "↓ Download self-certification (.zip)",
  "wiz.exempt.heads_up": "<strong>Heads up:</strong> exemption applies only as long as the work stays within the declared scope. If you move walls, change distribution, or the budget grows above €10,000, you'll need a Declaración Responsable. Come back to the wizard and we'll generate one.",
  "wiz.exempt.back": "← Back to eligibility",
  "wiz.exempt.toast_generating": "Generating self-certification…",
  "wiz.exempt.toast_done": "Self-certification downloaded",

  // ---- in-wizard step helper (deterministic, no backend) ----
  "wiz.help.panel_title": "Stuck on a step? Open the step-by-step helper",
  "wiz.help.intro": "Click a step to open it. This is the same guide as your downloaded PDF — use whichever you prefer. If you're still stuck after reading, call or email us.",
  "wiz.help.ask": "Ask about your permit",

  // ===================== PDF: instruction booklet (00-START-HERE) =====================
  "pdf.cl.header": "Marbella Permits · Step-by-step guide",
  "pdf.cl.eyebrow": "You're in the right place — start reading from here",
  "pdf.cl.title": "How to get your Marbella renovation permit.",
  "pdf.cl.intro": "This is everything. You don't need to look anywhere else first. Read this guide from start to finish. Each step has its own page and tells you what to do next.",
  "pdf.cl.intro2": "If something is unclear, call or email us — don't guess.",
  "pdf.cl.your_project": "Your project",
  "pdf.cl.tbl.property": "Property",
  "pdf.cl.tbl.what": "What",
  "pdf.cl.tbl.cost": "Cost",
  "pdf.cl.next2weeks": "What happens in the next 2 weeks",
  "pdf.cl.tl1": "Today: you print and sign one form (5 minutes).",
  "pdf.cl.tl2": "Today: you send 2 emails to the town hall (5 minutes).",
  "pdf.cl.tl3": "Days 5–10: the town hall sends 2 bills. You pay them at your bank (15 minutes).",
  "pdf.cl.tl4": "Day 12: you upload everything online and you're done (20 minutes).",
  "pdf.cl.total_attention": "Total time of YOUR attention: about 1 hour. Most of the 2 weeks is just waiting for the town hall.",
  "pdf.cl.steps_callout_title": "There are 7 steps. Each gets its own page.",
  "pdf.cl.steps_callout_body": "Don't skip ahead. Don't do steps out of order (except steps 3+5 and 4+6, which run in parallel — we'll tell you). When you finish a step, the page tells you which page to turn to next.",
  "pdf.cl.rule_title": "Important rule from the town hall",
  "pdf.cl.rule_body": "The town hall gives you ONLY ONE chance to fix mistakes. If your application is incomplete and you don't fix it the first time they ask, your case is thrown out and you start over. That's why every step in this guide has a small checklist — don't skip them.",
  "pdf.cl.help": "Stuck? Call +34 690 380 502 or email hello@marbellapermits.com.",
  "pdf.cl.step_of": "Step {n} of {total}",
  "pdf.cl.find_file": "In the same folder as this guide, find the file called:",
  "pdf.cl.find_file_folder": "In your dossier folder, find the file called:",
  "pdf.cl.find_file_short": "In your folder, find the file called:",
  "pdf.cl.do_in_order": "Do these things in order:",
  "pdf.cl.done": "Done?",

  // step 1
  "pdf.cl.s1.title": "Print and sign one form",
  "pdf.cl.s1.b1": "Open the file. Print it on regular paper.",
  "pdf.cl.s1.b2": "Read it through. Most fields are already filled in (your name, address, etc.).",
  "pdf.cl.s1.b3": "Find the line that says 'Fdo.: ' near the bottom. Sign there with a pen.",
  "pdf.cl.s1.b4": "Write today's date next to your signature.",
  "pdf.cl.s1.b5": "Take a clear photo of the signed page with your phone, OR scan it.",
  "pdf.cl.s1.b6": "Save the photo or scan as a PDF on your computer. Name it something like 'signed-form.pdf'.",
  "pdf.cl.s1.done": "You should now have a signed PDF on your computer. Turn to the next page for step 2.",

  // step 2
  "pdf.cl.s2.title": "Collect 4 documents in one folder",
  "pdf.cl.s2.intro": "Make a new folder on your computer. Call it something like 'Marbella permit'. Put these 4 files in it:",
  "pdf.cl.s2.d1": "The signed PDF you just made in step 1.",
  "pdf.cl.s2.d2": "A copy of your passport (or NIE / DNI). A clear photo on your phone works fine. Save as PDF.",
  "pdf.cl.s2.d3": "A map of your property. Get it free here: https://www1.sedecatastro.gob.es/ — enter the reference {ref}, then click 'Consulta descriptiva y gráfica' and download the PDF.",
  "pdf.cl.s2.d4": "A cost breakdown. Open file 02-cost-breakdown.pdf — it's a template in Spanish. You can use it as-is, or copy the text into Word and save as a new PDF.",
  "pdf.cl.s2.d_company": "Two extras (because the owner is a company): the company's escrituras de representación, and a copy of the CIF certificate (modelo 036/037).",
  "pdf.cl.s2.done": "You should now have 4 PDF files (or 6 if a company owns the property) in one folder. Turn to the next page for step 3.",

  // step 3
  "pdf.cl.s3.title": "Send the first email to the town hall",
  "pdf.cl.s3.b1": "Open the PDF. You'll see the text of an email.",
  "pdf.cl.s3.b2": "Open your email program (Gmail, Outlook, Apple Mail, whatever you use).",
  "pdf.cl.s3.b3": "Start a new email.",
  "pdf.cl.s3.b4": "Copy the text from the PDF — including the To and Subject lines — into your email.",
  "pdf.cl.s3.b5": "Attach the 4 files from your folder (step 2).",
  "pdf.cl.s3.b6": "Send.",
  "pdf.cl.s3.wait_title": "Now you wait",
  "pdf.cl.s3.wait_body": "The town hall replies in 5 to 10 working days. They send you a PDF called 'carta de pago' — that's a bill with a reference number you'll need in step 4. Check your email (including spam folder) once a day.",
  "pdf.cl.s3.done": "Email is sent. Turn to the next page for step 4 — but don't start step 4 until the bill arrives in your email.",

  // step 4
  "pdf.cl.s4.title": "Pay the first bill at your bank",
  "pdf.cl.s4.intro": "The town hall just sent you a PDF called 'carta de pago'. It's a bill. Look at the top-right corner — there's a long reference number. You'll need it.",
  "pdf.cl.amount_to_pay": "Amount to pay:",
  "pdf.cl.s4.bank_intro": "Use these bank details (write or copy exactly):",
  "pdf.cl.s4.bank_title": "First bill — bank details",
  "pdf.cl.bank.name": "Bank name",
  "pdf.cl.bank.account": "Account number",
  "pdf.cl.bank.intl": "International code",
  "pdf.cl.bank.holder": "Account holder",
  "pdf.cl.bank.concept": "Concept",
  "pdf.cl.intl_note": "(only needed if wiring from abroad)",
  "pdf.cl.s4.concept": "The long reference number from the top-right of the bill, then a space, then: {owner}",
  "pdf.cl.s4.where_title": "Where to pay",
  "pdf.cl.s4.where_body": "You have 3 options. (1) Log into your Spanish bank's online banking and make a transfer. (2) Walk into any Unicaja branch with the bill PDF — they will do it for you. (3) From abroad, ask your bank for an international SWIFT transfer using the code above.",
  "pdf.cl.keep_receipt_title": "Keep the receipt",
  "pdf.cl.s4.keep_receipt_body": "Your bank gives you a receipt or confirmation. Save it as a PDF. You'll attach it later in step 7.",
  "pdf.cl.s4.done": "Paid and receipt saved. Turn to the next page for step 5 — you can start step 5 even before doing step 4 if you want, the order doesn't matter.",

  // step 5
  "pdf.cl.s5.title": "Pay the refundable deposit (this one is different)",
  "pdf.cl.s5.intro": "This is a refundable deposit for construction waste. You get it back at the end of the works. For this one, the town hall does NOT send a bill first — you calculate the amount yourself and pay, THEN tell them.",
  "pdf.cl.s5.calc": "(How we calculated this: {formula})",
  "pdf.cl.s5.bank_intro": "Use these bank details (different bank from step 4):",
  "pdf.cl.s5.bank_title": "Refundable deposit — bank details",
  "pdf.cl.s5.keep_receipt_body": "Save the bank receipt as a PDF. You'll need it for step 6 right now, and again in step 7.",
  "pdf.cl.s5.done": "Paid and receipt saved. Turn to the next page for step 6.",

  // step 6
  "pdf.cl.s6.title": "Send the second email to the town hall",
  "pdf.cl.s6.intro": "Now tell the town hall you paid the deposit so they can issue the matching bill (called 'carta de pago' again — same word, different bill).",
  "pdf.cl.s6.b1": "Open the PDF. You'll see the text of an email.",
  "pdf.cl.s6.b2": "Copy the text — including the To and Subject lines — into a new email in your email program.",
  "pdf.cl.s6.b3": "Attach the bank receipt you got in step 5.",
  "pdf.cl.s6.b4": "Send.",
  "pdf.cl.s6.b5": "Wait for the town hall to reply with another PDF bill. Usually 2–5 days.",
  "pdf.cl.s6.done": "Email sent and you're waiting for their reply. Turn to the next page for step 7 — but don't start step 7 until both town-hall bills are in your inbox.",

  // step 7
  "pdf.cl.s7.title": "Upload everything to the town hall website",
  "pdf.cl.s7.need_title": "Before you start, you need ONE of these",
  "pdf.cl.s7.need_body": "Option A: A Spanish digital certificate on your computer (FNMT). Option B: A Cl@ve PIN linked to your NIE. Option C: A Spanish company you own — use the administrator certificate. Option D: Someone you trust who has Option A or B — give them the permission letter (file 05-permission-letter-optional.pdf) and ask them to do this step for you. If you don't have any of these, call us at +34 690 380 502 and we'll talk you through getting one.",
  "pdf.cl.s7.ready": "When you're ready, follow these steps one by one:",
  "pdf.cl.s7.b1": "Open your web browser and go to: www.marbella.es",
  "pdf.cl.s7.b2": "On the home page, look at the top menu and click 'Sede electrónica'.",
  "pdf.cl.s7.b3": "On the next page, find the section called 'Trámites' (second box on the page). Click it.",
  "pdf.cl.s7.b4": "Look for 'Instancia General'. Click it.",
  "pdf.cl.s7.b5": "Click the button 'Acceder con Certificado Digital'.",
  "pdf.cl.s7.b6": "Your browser will ask you to choose a certificate. Pick the one for the property owner.",
  "pdf.cl.s7.b7": "A form opens. Most fields fill in from your certificate. Fill the rest from your dossier.",
  "pdf.cl.s7.dept_title": "VERY IMPORTANT — pick the right department",
  "pdf.cl.s7.dept_body": "There's a dropdown called 'Delegación'. You must choose LICENCIAS. NOT 'urbanismo'. NOT 'obras'. NOT 'proyectos'. Only LICENCIAS. If you pick the wrong one, your file goes to the wrong office and gets ignored.",
  "pdf.cl.s7.attach": "Then attach ALL of these files (check each one off):",
  "pdf.cl.s7.fd1": "The signed form (from step 1)",
  "pdf.cl.s7.fd2": "The cost breakdown PDF (from step 2)",
  "pdf.cl.s7.fd3": "The property map PDF (from step 2)",
  "pdf.cl.s7.fd4": "Your passport / NIE / DNI copy (from step 2)",
  "pdf.cl.s7.fd5": "The bank receipt from step 4 (first payment)",
  "pdf.cl.s7.fd6": "The first bill from the town hall (from step 3)",
  "pdf.cl.s7.fd7": "The bank receipt from step 5 (deposit)",
  "pdf.cl.s7.fd8": "The second bill from the town hall (from step 6)",
  "pdf.cl.s7.fd_company1": "Company escrituras (from step 2)",
  "pdf.cl.s7.fd_company2": "Company CIF certificate (from step 2)",
  "pdf.cl.s7.submit": "Click 'Presentar' (Submit) at the bottom.",
  "pdf.cl.s7.proof_title": "Save the proof",
  "pdf.cl.s7.proof_body": "After you click Submit, the website shows you a small PDF called 'acuse de recibo' or 'justificante'. It has a long receipt number on it. SAVE THIS PDF. That is your legal proof that you submitted. You can legally start the works the moment you see it.",
  "pdf.cl.s7.youre_done": "That's it. You're done.",

  // troubleshooting
  "pdf.cl.tr.header": "If something goes wrong",
  "pdf.cl.tr.h1": "The town hall hasn't replied to your first email",
  "pdf.cl.tr.b1": "If it's been more than 10 working days (2 weeks) since you sent the email in step 3, reply to your own email so it shows up at the top of their inbox again. Write a short polite message in Spanish: 'Buenos días, le escribo de nuevo para solicitar la carta de pago. Gracias.' If still no reply after another week, call us.",
  "pdf.cl.tr.h2": "The town hall sends a message asking for more documents",
  "pdf.cl.tr.b2": "This is called a 'requerimiento'. Read what they ask for. Send only what they need. Don't argue. Don't send extra documents not asked for. You have ONE chance to fix things — don't waste it.",
  "pdf.cl.tr.h3": "The town hall says you need a proper architect's project",
  "pdf.cl.tr.b3": "This means the work is bigger than what our wizard can handle. Email us at hello@marbellapermits.com — we'll connect you with a partner architect at a fair price.",
  "pdf.cl.tr.h4": "You picked the wrong 'Delegación' in step 7",
  "pdf.cl.tr.b4": "This happens. Don't panic. Send a new instancia (start step 7 again), this time picking LICENCIAS. Attach a small note saying 'Reemite el expediente — anterior presentado en Delegación incorrecta'. Both will sit in the system; the wrong one gets dismissed eventually.",
  "pdf.cl.tr.closing": "If something happens that isn't on this page: {help}",

  // glossary
  "pdf.cl.gl.header": "Words you'll see",
  "pdf.cl.gl.title": "Spanish words you'll see — what they mean",
  "pdf.cl.gl.intro": "The town hall uses Spanish administrative words. Here's what they actually mean in plain English. Keep this page handy.",
  "pdf.cl.gl.ayuntamiento": "Town hall.",
  "pdf.cl.gl.dr": "The official form you sign saying you're going to do the work. Sometimes shortened to 'DR'.",
  "pdf.cl.gl.carta_pago": "A bill (in PDF form) the town hall sends you. There are two — one for the licence fee, one for the deposit.",
  "pdf.cl.gl.sede": "The town hall's online portal. Where you upload the final dossier in step 7.",
  "pdf.cl.gl.justificante": "The receipt your bank gives you after a payment.",
  "pdf.cl.gl.acuse": "The digital receipt the online portal gives you AFTER you click Submit. It's your legal proof.",
  "pdf.cl.gl.fianza": "Refundable deposit for construction waste. You get it back at the end of the works.",
  "pdf.cl.gl.presupuesto": "Cost breakdown of the works, without VAT, in Spanish.",
  "pdf.cl.gl.plano": "A map of your property. You download it for free from the Spanish cadastre website.",
  "pdf.cl.gl.nie": "The Spanish ID number foreigners get. Required if the property owner isn't a Spanish national.",
  "pdf.cl.gl.subsanacion": "Fixing mistakes in your application. You get only ONE chance.",
  "pdf.cl.gl.requerimiento": "A letter from the town hall asking for more documents or clarifications. Means subsanación is needed.",
  "pdf.cl.gl.tramite": "A bureaucratic procedure. The whole permit process is one trámite.",
  "pdf.cl.gl.delegacion": "Department of the town hall. There are many — make sure you pick LICENCIAS in step 7.",
  "pdf.cl.gl.pem": "Cost of the work, without VAT (the same number we asked you for in the wizard).",
  "pdf.cl.gl.icio": "The tax on construction work. Roughly 3.5% of the PEM. Included in the first bill.",
  "pdf.cl.gl.visado": "An architect's project stamp. Only needed for bigger work — not your case.",

  // ===================== PDF: email wrapper (03/04) =====================
  "pdf.email.title": "Email to copy and send",
  "pdf.email.body_label": "Body — copy verbatim",
  "pdf.email.before_title": "Before sending",
  "pdf.email.before_body": "Attach the supporting documents listed in step 2 of the instruction book (file 00). Make sure all attachments are PDFs, clearly named, under 10 MB each.",
  "pdf.email.license_header": "03 · First email — to the town hall (oficinaliquidadora)",
  "pdf.email.license_instr": "Open your email program. Paste the To, Subject and Body below. Attach the documents from step 2 of the instruction book.",
  "pdf.email.waste_header": "04 · Second email — to the town hall (caja)",
  "pdf.email.waste_instr": "Send this AFTER you've paid the refundable deposit (step 5 of the instruction book). Attach the bank receipt.",

  // ===================== PDF: carta de autorización (05) wrappers =====================
  "pdf.carta.when_title": "When to use this",
  "pdf.carta.when_body": "Only if you want someone else (a property manager, gestor, or lawyer) to submit the Declaración Responsable on your behalf via the Spanish sede electrónica. They'll need to attach this letter signed by you.",
  "pdf.carta.brackets_title": "Highlighted brackets are placeholders",
  "pdf.carta.brackets_body": "Replace [Nombre del representante autorizado] and [NIE/DNI del representante] with the actual details of the person you're authorising. Print, sign, scan.",

  // ===================== PDF: presupuesto (02) note =====================
  "pdf.presu.note_title": "Architect / owner note",
  "pdf.presu.note_body": "If your case requires a partidas-by-capítulo breakdown (movimiento de tierras, estructura, etc.), append it as an annex. For Section-A works this single-line breakdown is usually accepted.",

  // ===================== PDF: exempt guide (02-what-to-keep) =====================
  "pdf.eg.header": "02 · What to keep on file",
  "pdf.eg.eyebrow": "Guide in your language",
  "pdf.eg.title": "Your work is exempt. Here's what to do next.",
  "pdf.eg.intro": "Under Marbella's January 2026 instrucción urbanística, simple works under €10,000 — painting, finishes, certain interior installations — don't need a permit. You can start tomorrow. But there are still a few things worth doing to protect yourself.",
  "pdf.eg.keep_title": "Keep these on file",
  "pdf.eg.keep1": "The signed self-certification PDF (file 01)",
  "pdf.eg.keep2": "An itemised invoice from the contractor showing total cost",
  "pdf.eg.keep3": "Before / after photos of the work",
  "pdf.eg.keep4": "Receipts for any waste disposal",
  "pdf.eg.complaint_title": "If a neighbour complains",
  "pdf.eg.complaint_body": "The town hall can still inspect even when the work is exempt. If they ask, hand them: the self-certification (file 01), the contractor invoice, and the photos. The inspection confirms the work fits the exempt category. No penalties apply if your scope matches the declaration.",
  "pdf.eg.stops_title": "When the exemption stops applying",
  "pdf.eg.stops_callout_title": "Upgrade to a Declaración Responsable if any of these become true",
  "pdf.eg.stops_callout_body": "Budget grows above €10,000. Any wall changes. Any new openings in the façade. Any plumbing or electrical work that affects shared installations. Property is or becomes part of a historic-protection area.",
  "pdf.eg.stops_body": "In any of those cases, come back to marbellapermits.com and re-run the wizard. We'll produce a full DR pack for you.",
  "pdf.eg.resale_title": "Resale due diligence",
  "pdf.eg.resale_body": "When you eventually sell the property, the buyer's lawyer may ask whether any renovation work was done and whether it was authorised. Hand them this self-certification — it shows the work was legally exempt, with the article reference. That's exactly what they need to clear due diligence.",
  "pdf.eg.footer": "02 · What to keep on file · Marbella Permits",
};

// ===================== Placeholders for the four translations =====================
// These are filled with the localized strings below. Any key missing from a
// language automatically falls back to WIZ_EN through t().
const WIZ_ES = {};
const WIZ_NL = {};
const WIZ_FR = {};
const WIZ_DE = {};

// Merge wizard/PDF strings into the global TRANSLATIONS object created in i18n.js.
if (typeof TRANSLATIONS !== "undefined") {
  Object.assign(TRANSLATIONS.en, WIZ_EN);
  Object.assign(TRANSLATIONS.es, WIZ_ES);
  Object.assign(TRANSLATIONS.nl, WIZ_NL);
  Object.assign(TRANSLATIONS.fr, WIZ_FR);
  Object.assign(TRANSLATIONS.de, WIZ_DE);
}
