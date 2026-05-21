// Marbella Permits — i18n module.
// One file, five languages. Translations live below in TRANSLATIONS by language code.
// Customer-facing strings only — Spanish-language LEGAL documents (the DR form,
// presupuesto, the email bodies sent to the ayuntamiento, the carta de
// autorización) stay in Spanish regardless of UI language.

const SUPPORTED_LANGS = ["en", "es", "nl", "fr", "de"];
const LANG_LABELS = { en: "English", es: "Español", nl: "Nederlands", fr: "Français", de: "Deutsch" };
const LANG_STORAGE_KEY = "mp_lang";

let _currentLang = "en";

function tGet() { return _currentLang; }

function tSet(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  _currentLang = lang;
  try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch (e) {}
  document.documentElement.lang = lang;
  _sweepStaticHtml();
  // If the wizard's render() is defined, re-render to refresh dynamic strings.
  if (typeof render === "function") render();
}

function t(key, fallback) {
  const lang = TRANSLATIONS[_currentLang] || {};
  const en = TRANSLATIONS.en || {};
  if (lang[key] != null) return lang[key];
  if (en[key] != null) return en[key];
  return fallback != null ? fallback : key;
}

function tInit() {
  let chosen = null;
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) chosen = stored;
  } catch (e) {}
  if (!chosen) {
    const browser = (navigator.language || "en").slice(0, 2).toLowerCase();
    if (SUPPORTED_LANGS.includes(browser)) chosen = browser;
  }
  _currentLang = chosen || "en";
  document.documentElement.lang = _currentLang;
  _sweepStaticHtml();
}

function _sweepStaticHtml() {
  // 1. textContent for elements with [data-i18n="key"]
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const txt = t(key);
    if (txt) el.textContent = txt;
  });
  // 2. placeholder attribute for elements with [data-i18n-placeholder="key"]
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    const txt = t(key);
    if (txt) el.setAttribute("placeholder", txt);
  });
  // 3. innerHTML for elements with [data-i18n-html="key"] — used when the
  //    translation contains inline HTML like <strong>.
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const key = el.getAttribute("data-i18n-html");
    const txt = t(key);
    if (txt) el.innerHTML = txt;
  });
  // 4. Update the language-switcher dropdown if present.
  const sel = document.getElementById("mp-lang-switch");
  if (sel) sel.value = _currentLang;
}

// Build a <select> element for the language switcher. Caller decides where to mount it.
function buildLangSwitcher() {
  const sel = document.createElement("select");
  sel.id = "mp-lang-switch";
  sel.setAttribute("aria-label", "Language");
  for (const code of SUPPORTED_LANGS) {
    const opt = document.createElement("option");
    opt.value = code; opt.textContent = LANG_LABELS[code];
    sel.appendChild(opt);
  }
  sel.value = _currentLang;
  sel.addEventListener("change", e => tSet(e.target.value));
  return sel;
}

// ===== Core / shared strings =====
const EN = { "lang.label": "Language", "nav.start_wizard": "Start wizard", "ui.back": "Back", "ui.next": "Next" };
const ES = { "lang.label": "Idioma", "nav.start_wizard": "Iniciar asistente", "ui.back": "Atrás", "ui.next": "Siguiente" };
const NL = { "lang.label": "Taal", "nav.start_wizard": "Start de assistent", "ui.back": "Terug", "ui.next": "Volgende" };
const FR = { "lang.label": "Langue", "nav.start_wizard": "Lancer l'assistant", "ui.back": "Retour", "ui.next": "Suivant" };
const DE = { "lang.label": "Sprache", "nav.start_wizard": "Assistent starten", "ui.back": "Zurück", "ui.next": "Weiter" };

// ===== Landing-page strings =====
const EN_LANDING = {
  "land.nav.how": "How it works",
  "land.nav.covered": "What's covered",
  "land.nav.pricing": "Pricing",
  "land.hero.eyebrow": "Marbella, Spain",
  "land.hero.title": "Your Marbella renovation paperwork. Done. In English.",
  "land.hero.lede": "Reforming a property in Marbella? We prepare every document the town hall requires, calculate the fees, and hand you a step-by-step submission pack — all in your language. Skip the gestor. Skip the panic.",
  "land.hero.cta_primary": "Get my permit pack →",
  "land.hero.cta_secondary": "See how it works",
  "land.stats.time": "~48 h",
  "land.stats.time_label": "From form to dossier in your inbox",
  "land.stats.price": "€99",
  "land.stats.price_label": "All-in price for a standard reform",
  "land.stats.lang": "5 languages",
  "land.stats.lang_label": "UI in EN/ES/NL/FR/DE. Submission docs in Spanish (required).",
  "land.problem.title": "The problem",
  "land.problem.body1": "You own a property in Marbella. You want to renovate the kitchen, repaint the façade, redo the bathrooms, refurbish the terrace. Spanish law requires you to file a Declaración Responsable de Obras with the town hall before work starts. Get this wrong and the town hall stops your project for weeks — or fines you when neighbours complain.",
  "land.problem.body2": "The process is documented entirely in Spanish, spread across three town-hall departments and two bank accounts, requires forms that don't exist in English, and changes more often than the website is updated. Most foreign owners pay a Spanish gestor €300–500 to do it for them. That's the entire problem we solve.",
  "land.how.title": "How it works",
  "land.how.intro": "Four steps. No Spanish required. No visits to a gestor's office.",
  "land.how.s1.title": "Tell us about the work",
  "land.how.s1.body": "A short form in your language: what you're renovating, where, how much it costs. Five minutes.",
  "land.how.s2.title": "We check eligibility",
  "land.how.s2.body": "If your project fits the simple-DR track (under €100k, no wall changes), we proceed. If not, we tell you and refer you to a partner architect.",
  "land.how.s3.title": "Documents generated",
  "land.how.s3.body": "Pre-filled Declaración Responsable, presupuesto template, the exact emails to send to the town hall, the waste-deposit calculation, the bank wire instructions.",
  "land.how.s4.title": "You submit, with our guide",
  "land.how.s4.body": "A numbered checklist tells you which email goes where, which bank account to wire to, what to attach. Step-by-step in your language. We don't submit on your behalf — you stay in control.",
  "land.cov.title": "What we cover (and what we don't)",
  "land.cov.intro": "We deliberately stay narrow. We only handle the simple end of the permit spectrum — the cases that don't legally require a stamped architect's project. That covers about 70% of foreign-buyer reforms in Marbella. If your project doesn't fit, we'll say so on day one, not surprise you on day three.",
  "land.cov.yes_title": "✓ We cover",
  "land.cov.no_title": "✗ We don't cover",
  "land.cov.out": "Out of scope? We'll connect you with a vetted partner architect. Your case still doesn't disappear into a Spanish maze.",
  "land.cov.yes1": "Kitchen replacement (same layout)",
  "land.cov.yes2": "Bathroom redo (no wall changes)",
  "land.cov.yes3": "Interior painting and finishes",
  "land.cov.yes4": "Façade painting (no structural)",
  "land.cov.yes5": "Terrace and patio refurbishment",
  "land.cov.yes6": "Pool maintenance / re-tiling",
  "land.cov.yes7": "Window and door replacement (same openings)",
  "land.cov.yes8": "Total project budget under €100,000",
  "land.cov.no1": "Moving or removing walls",
  "land.cov.no2": "Structural changes",
  "land.cov.no3": "Adding floors or square meters",
  "land.cov.no4": "New façade openings",
  "land.cov.no5": "Projects over €100,000",
  "land.cov.no6": "Anything requiring a stamped architect's project",
  "land.cov.no7": "Properties in historic or coastal zones (extra permits)",
  "land.pricing.title": "Pricing",
  "land.pricing.intro": "One transaction. No subscriptions. No surprises.",
  "land.pricing.amount": "€99",
  "land.pricing.per": "per permit",
  "land.pricing.f1": "Complete pre-filled Declaración Responsable",
  "land.pricing.f2": "Presupuesto template in Spanish",
  "land.pricing.f3": "Waste-deposit calculation",
  "land.pricing.f4": "Ready-to-send email texts (license + waste)",
  "land.pricing.f5": "Bank wire instructions",
  "land.pricing.f6": "Submission checklist in your language",
  "land.pricing.f7": "48-hour delivery",
  "land.pricing.note": "Town-hall fees (the license itself, the waste deposit) are paid directly by you to the ayuntamiento — typically 4.72% of project budget for the license plus 1–2% for waste. We don't add a markup. The €99 is for our work.",
  "land.wait.title": "Get on the early-access list",
  "land.wait.body": "We're launching the platform with the first 20 paying customers in Marbella. Tell us about your project — if you're a fit, we'll process your permit at the early-access price (€49 instead of €99) and you'll be done in 48 hours.",
  "land.wait.f.name": "Your name",
  "land.wait.f.email": "Email",
  "land.wait.f.property": "Property address (street, district)",
  "land.wait.f.work": "What kind of work?",
  "land.wait.f.budget": "Project budget (€)",
  "land.wait.f.timing": "When are you hoping to start?",
  "land.wait.f.work.choose": "— choose —",
  "land.wait.f.work.kitchen": "Kitchen replacement",
  "land.wait.f.work.bath": "Bathroom redo",
  "land.wait.f.work.paint": "Painting / finishes",
  "land.wait.f.work.facade": "Façade painting",
  "land.wait.f.work.terrace": "Terrace / patio refurbishment",
  "land.wait.f.work.pool": "Pool work",
  "land.wait.f.work.win": "Window / door replacement",
  "land.wait.f.work.multi": "Multiple of the above",
  "land.wait.f.work.other": "Something else (we'll figure it out)",
  "land.wait.f.t.now": "This month",
  "land.wait.f.t.soon": "Next 1–2 months",
  "land.wait.f.t.later": "Next 3–6 months",
  "land.wait.f.t.exp": "Just exploring",
  "land.wait.cta": "Request early access →",
  "land.wait.note": "No spam. We reply within 24h. GDPR-compliant.",
  "land.wait.success": "Got it. We'll write within 24 hours to confirm whether your project fits the platform.",
  "land.faq.title": "Frequently asked",
  "land.faq.q1": "Are you a gestor or a law firm?",
  "land.faq.a1": "Neither. We're software. We prepare your documents and tell you exactly what to do, but you (or your nominated representative) submit them and pay the town-hall fees. That's the deliberate line — it keeps us as software, keeps the price at €99, and keeps you in control of your own case.",
  "land.faq.q2": "What if my project is too big for the platform?",
  "land.faq.a2": "If your work involves moving walls, structural changes, or a budget above €100,000, Spanish law requires a stamped architect's project. We can't do that for you — but on the eligibility check, we'll tell you immediately and refer you to a vetted partner architect at a fair price. No wasted time.",
  "land.faq.q3": "Do I need a Spanish digital certificate?",
  "land.faq.a3": "Submitting to the town hall's electronic office (sede electrónica) requires either a digital certificate or Cl@ve PIN. Most owners use a gestor or company representative who already has one. We include instructions for both routes in the dossier. If you have a Spanish company that owns the property, your administrador's certificate works.",
  "land.faq.q4": "How fast can I expect a town-hall reply?",
  "land.faq.a4": "The Declaración Responsable is, by name, a 'declaration' — the work can legally start once you've submitted the complete file with proof of payment. The town hall has 6 months to inspect and object. In practice they reply within 4–8 weeks if there's a problem, or stay silent if not.",
  "land.faq.q5": "What about the waste deposit?",
  "land.faq.a5": "Spanish municipalities require a refundable deposit for construction waste, calculated as 2% of demolition costs + 1% of the rest. We compute the exact figure for your project, give you the bank account and the reference number, and walk you through how to recover the deposit at the end of the works.",
  "land.faq.q6": "Who's behind this?",
  "land.faq.a6": "A small team based in Marbella. We built this because we kept watching foreign owners pay €400 to a gestor to do something that takes us 30 minutes with the right templates. The price reflects that.",
  "land.foot.location": "Marbella, Spain",
};

const ES_LANDING = {
  "land.nav.how": "Cómo funciona",
  "land.nav.covered": "Qué cubrimos",
  "land.nav.pricing": "Precio",
  "land.hero.eyebrow": "Marbella, España",
  "land.hero.title": "Tu papeleo de reforma en Marbella. Resuelto. En tu idioma.",
  "land.hero.lede": "¿Reformas un inmueble en Marbella? Preparamos cada documento que exige el ayuntamiento, calculamos las tasas y te entregamos un paquete listo para presentar — paso a paso, en tu idioma. Sin gestor. Sin agobio.",
  "land.hero.cta_primary": "Obtener mi paquete →",
  "land.hero.cta_secondary": "Ver cómo funciona",
  "land.stats.time": "~48 h",
  "land.stats.time_label": "Del formulario al dossier en tu correo",
  "land.stats.price": "€99",
  "land.stats.price_label": "Precio cerrado para una reforma estándar",
  "land.stats.lang": "5 idiomas",
  "land.stats.lang_label": "Interfaz en EN/ES/NL/FR/DE. Documentos de envío en español (obligatorio).",
  "land.problem.title": "El problema",
  "land.problem.body1": "Tienes una propiedad en Marbella. Quieres reformar la cocina, repintar la fachada, rehacer los baños, renovar la terraza. La ley exige presentar una Declaración Responsable de Obras al ayuntamiento antes de empezar. Equivocarte significa que paralizan tu obra durante semanas — o te multan cuando los vecinos se quejan.",
  "land.problem.body2": "El proceso está íntegramente en español, repartido entre tres departamentos del ayuntamiento y dos cuentas bancarias, exige formularios que no existen en inglés y cambia más a menudo que la web. La mayoría de propietarios extranjeros paga a un gestor €300–500 para que lo haga. Eso es exactamente lo que resolvemos.",
  "land.how.title": "Cómo funciona",
  "land.how.intro": "Cuatro pasos. Sin español obligatorio. Sin visitas a la gestoría.",
  "land.how.s1.title": "Cuéntanos la obra",
  "land.how.s1.body": "Un formulario breve en tu idioma: qué reformas, dónde, cuánto cuesta. Cinco minutos.",
  "land.how.s2.title": "Comprobamos elegibilidad",
  "land.how.s2.body": "Si tu proyecto encaja en la vía simple de DR (menos de €100.000, sin tocar muros), seguimos. Si no, te lo decimos y te derivamos a un arquitecto partner.",
  "land.how.s3.title": "Generamos los documentos",
  "land.how.s3.body": "Declaración Responsable rellenada, plantilla de presupuesto, los correos exactos para el ayuntamiento, el cálculo de la fianza de residuos, las instrucciones bancarias.",
  "land.how.s4.title": "Tú envías, con nuestra guía",
  "land.how.s4.body": "Un checklist numerado te indica qué correo va dónde, a qué cuenta transferir, qué adjuntar. Paso a paso en tu idioma. No enviamos por ti — tú mantienes el control.",
  "land.cov.title": "Qué cubrimos (y qué no)",
  "land.cov.intro": "Nos mantenemos deliberadamente estrechos. Solo cubrimos el extremo sencillo del espectro — los casos que legalmente NO requieren proyecto visado de arquitecto. Eso abarca ~70% de las reformas de propietarios extranjeros en Marbella. Si tu proyecto no encaja, te lo decimos el día 1, no el día 3.",
  "land.cov.yes_title": "✓ Cubrimos",
  "land.cov.no_title": "✗ No cubrimos",
  "land.cov.out": "¿Fuera de alcance? Te conectamos con un arquitecto partner verificado. Tu caso no se pierde en el laberinto burocrático.",
  "land.cov.yes1": "Sustitución de cocina (misma distribución)",
  "land.cov.yes2": "Reforma de baño (sin tocar muros)",
  "land.cov.yes3": "Pintura y acabados interiores",
  "land.cov.yes4": "Pintura de fachada (sin estructural)",
  "land.cov.yes5": "Renovación de terraza y patio",
  "land.cov.yes6": "Mantenimiento y alicatado de piscina",
  "land.cov.yes7": "Sustitución de ventanas y puertas (mismos huecos)",
  "land.cov.yes8": "Presupuesto total inferior a €100.000",
  "land.cov.no1": "Mover o eliminar muros",
  "land.cov.no2": "Cambios estructurales",
  "land.cov.no3": "Añadir plantas o metros cuadrados",
  "land.cov.no4": "Nuevos huecos en fachada",
  "land.cov.no5": "Proyectos por encima de €100.000",
  "land.cov.no6": "Cualquier obra que requiera proyecto visado",
  "land.cov.no7": "Inmuebles en zona histórica o costera (permisos extra)",
  "land.pricing.title": "Precio",
  "land.pricing.intro": "Una transacción. Sin suscripciones. Sin sorpresas.",
  "land.pricing.amount": "€99",
  "land.pricing.per": "por licencia",
  "land.pricing.f1": "Declaración Responsable rellenada",
  "land.pricing.f2": "Plantilla de presupuesto en español",
  "land.pricing.f3": "Cálculo de la fianza de residuos",
  "land.pricing.f4": "Textos de correo listos para enviar (licencia + residuos)",
  "land.pricing.f5": "Instrucciones de transferencia bancaria",
  "land.pricing.f6": "Checklist de envío en tu idioma",
  "land.pricing.f7": "Entrega en 48 horas",
  "land.pricing.note": "Las tasas del ayuntamiento (la licencia y la fianza de residuos) las pagas tú directamente al ayuntamiento — típicamente 4,72% del presupuesto para la licencia más 1–2% de fianza. No añadimos comisión. Los €99 son por nuestro trabajo.",
  "land.wait.title": "Apúntate al acceso anticipado",
  "land.wait.body": "Lanzamos la plataforma con los primeros 20 clientes de Marbella. Cuéntanos tu proyecto — si encaja, procesamos tu licencia al precio de acceso anticipado (€49 en lugar de €99) y la tendrás lista en 48 horas.",
  "land.wait.f.name": "Tu nombre",
  "land.wait.f.email": "Correo electrónico",
  "land.wait.f.property": "Dirección del inmueble (calle, zona)",
  "land.wait.f.work": "¿Qué tipo de obra?",
  "land.wait.f.budget": "Presupuesto (€)",
  "land.wait.f.timing": "¿Cuándo te gustaría empezar?",
  "land.wait.f.work.choose": "— elegir —",
  "land.wait.f.work.kitchen": "Sustitución de cocina",
  "land.wait.f.work.bath": "Reforma de baño",
  "land.wait.f.work.paint": "Pintura / acabados",
  "land.wait.f.work.facade": "Pintura de fachada",
  "land.wait.f.work.terrace": "Reforma de terraza / patio",
  "land.wait.f.work.pool": "Obras en piscina",
  "land.wait.f.work.win": "Sustitución de ventanas / puertas",
  "land.wait.f.work.multi": "Varias de las anteriores",
  "land.wait.f.work.other": "Otra cosa (lo vemos)",
  "land.wait.f.t.now": "Este mes",
  "land.wait.f.t.soon": "Próximos 1–2 meses",
  "land.wait.f.t.later": "Próximos 3–6 meses",
  "land.wait.f.t.exp": "Estoy explorando",
  "land.wait.cta": "Solicitar acceso anticipado →",
  "land.wait.note": "Sin spam. Respondemos en 24h. Cumplimos RGPD.",
  "land.wait.success": "Recibido. Te contactamos en 24 horas para confirmar si tu proyecto encaja en la plataforma.",
  "land.faq.title": "Preguntas frecuentes",
  "land.faq.q1": "¿Sois gestoría o despacho de abogados?",
  "land.faq.a1": "Ninguno. Somos software. Preparamos tus documentos y te decimos qué hacer, pero tú (o tu representante) envías y pagas las tasas al ayuntamiento. Es la línea deliberada — nos mantiene como software, mantiene el precio en €99 y te deja a ti el control del expediente.",
  "land.faq.q2": "¿Y si mi proyecto es demasiado grande?",
  "land.faq.a2": "Si tu obra implica mover muros, cambios estructurales o un presupuesto por encima de €100.000, la ley exige proyecto visado. Eso no lo hacemos — pero en la comprobación de elegibilidad te lo decimos inmediatamente y te derivamos a un arquitecto partner a precio justo. Sin tiempo perdido.",
  "land.faq.q3": "¿Necesito un certificado digital español?",
  "land.faq.a3": "Para enviar por la sede electrónica del ayuntamiento se necesita certificado digital o Cl@ve PIN. La mayoría de propietarios usa un gestor o representante de empresa que ya lo tiene. Incluimos instrucciones para ambas vías en el dossier. Si tu propiedad la tiene una sociedad española, sirve el certificado del administrador.",
  "land.faq.q4": "¿Cuánto tarda el ayuntamiento en contestar?",
  "land.faq.a4": "La Declaración Responsable es, por definición, una 'declaración' — la obra puede empezar legalmente desde que presentas el expediente completo con justificante de pago. El ayuntamiento dispone de 6 meses para inspeccionar y objetar. En la práctica responden en 4–8 semanas si hay algún problema, o guardan silencio si no.",
  "land.faq.q5": "¿Qué pasa con la fianza de residuos?",
  "land.faq.a5": "Los municipios españoles exigen una fianza recuperable por residuos de obra, calculada como 2% de demoliciones + 1% del resto. Calculamos la cifra exacta para tu proyecto, te damos cuenta y referencia, y te explicamos cómo recuperar la fianza al terminar la obra.",
  "land.faq.q6": "¿Quién hay detrás?",
  "land.faq.a6": "Un equipo pequeño en Marbella. Construimos esto porque veíamos a propietarios extranjeros pagar €400 a un gestor por algo que con las plantillas adecuadas nos lleva 30 minutos. El precio refleja eso.",
  "land.foot.location": "Marbella, España",
};

const NL_LANDING = {
  "land.nav.how": "Hoe het werkt",
  "land.nav.covered": "Wat we dekken",
  "land.nav.pricing": "Prijs",
  "land.hero.eyebrow": "Marbella, Spanje",
  "land.hero.title": "Uw Marbella-renovatiepapieren. Geregeld. In uw eigen taal.",
  "land.hero.lede": "Renoveert u een woning in Marbella? Wij stellen elk document op dat het gemeentehuis vereist, berekenen de leges en leveren u een stap-voor-stap indienpakket — alles in uw taal. Geen gestor. Geen paniek.",
  "land.hero.cta_primary": "Mijn vergunningspakket →",
  "land.hero.cta_secondary": "Bekijk hoe het werkt",
  "land.stats.time": "~48 u",
  "land.stats.time_label": "Van formulier naar dossier in uw inbox",
  "land.stats.price": "€99",
  "land.stats.price_label": "Vaste prijs voor een standaardrenovatie",
  "land.stats.lang": "5 talen",
  "land.stats.lang_label": "Interface in EN/ES/NL/FR/DE. Indieningsdocumenten in het Spaans (verplicht).",
  "land.problem.title": "Het probleem",
  "land.problem.body1": "U bezit een woning in Marbella. U wilt de keuken vernieuwen, de gevel opnieuw schilderen, de badkamers verbouwen, het terras opknappen. De Spaanse wet vereist dat u vóór de start van de werken een Declaración Responsable de Obras indient bij het gemeentehuis. Doet u dit verkeerd, dan legt het gemeentehuis uw project weken stil — of u krijgt een boete zodra de buren klagen.",
  "land.problem.body2": "Het hele proces is in het Spaans, verdeeld over drie gemeentediensten en twee bankrekeningen, vereist formulieren die niet in andere talen bestaan en verandert vaker dan de website wordt bijgewerkt. De meeste buitenlandse eigenaren betalen een Spaanse gestor €300–500 om dit voor hen te doen. Precies dat probleem lossen wij op.",
  "land.how.title": "Hoe het werkt",
  "land.how.intro": "Vier stappen. Geen Spaans nodig. Geen bezoek aan een gestor-kantoor.",
  "land.how.s1.title": "Vertel ons over de werken",
  "land.how.s1.body": "Een kort formulier in uw taal: wat u renoveert, waar, en wat het kost. Vijf minuten werk.",
  "land.how.s2.title": "Wij controleren of het kan",
  "land.how.s2.body": "Past uw project op het eenvoudige DR-spoor (onder €100k, geen muurwerk), dan gaan we door. Zo niet, dan zeggen we dat en verwijzen we u naar een partner-architect.",
  "land.how.s3.title": "Documenten gegenereerd",
  "land.how.s3.body": "Voorbereide Declaración Responsable, presupuesto-sjabloon, de exacte e-mails voor het gemeentehuis, de berekening van de afvalwaarborg en de overschrijvingsinstructies.",
  "land.how.s4.title": "U dient in, met onze gids",
  "land.how.s4.body": "Een genummerde checklist vertelt u welke mail waarheen gaat, naar welke bankrekening u overmaakt en wat u bijvoegt. Stap voor stap, in uw taal. Wij dienen niet voor u in — u houdt de controle.",
  "land.cov.title": "Wat we dekken (en wat niet)",
  "land.cov.intro": "We blijven bewust beperkt. We behandelen alleen het eenvoudige uiteinde van het vergunningsspectrum — de gevallen die wettelijk GEEN gestempeld architectenproject vereisen. Dat dekt ongeveer 70% van de renovaties van buitenlandse eigenaren in Marbella. Past uw project niet, dan zeggen we dat dag één, niet dag drie.",
  "land.cov.yes_title": "✓ We dekken",
  "land.cov.no_title": "✗ We dekken niet",
  "land.cov.out": "Buiten bereik? Wij koppelen u aan een geverifieerde partner-architect. Uw zaak verdwijnt niet in een Spaans doolhof.",
  "land.cov.yes1": "Keukenvervanging (zelfde indeling)",
  "land.cov.yes2": "Badkamerverbouwing (geen muurwijziging)",
  "land.cov.yes3": "Binnenschilderwerk en afwerking",
  "land.cov.yes4": "Gevelschilderwerk (niet structureel)",
  "land.cov.yes5": "Terras- en patiorenovatie",
  "land.cov.yes6": "Zwembadonderhoud / hertegelen",
  "land.cov.yes7": "Vervanging van ramen en deuren (zelfde openingen)",
  "land.cov.yes8": "Totaalbudget onder €100.000",
  "land.cov.no1": "Muren verplaatsen of verwijderen",
  "land.cov.no2": "Structurele wijzigingen",
  "land.cov.no3": "Verdiepingen of vierkante meters toevoegen",
  "land.cov.no4": "Nieuwe geveldoorvoeren",
  "land.cov.no5": "Projecten boven €100.000",
  "land.cov.no6": "Alles wat een gestempeld architectenproject vereist",
  "land.cov.no7": "Panden in historische of kustzones (extra vergunningen)",
  "land.pricing.title": "Prijs",
  "land.pricing.intro": "Eén transactie. Geen abonnement. Geen verrassingen.",
  "land.pricing.amount": "€99",
  "land.pricing.per": "per vergunning",
  "land.pricing.f1": "Voorbereide Declaración Responsable",
  "land.pricing.f2": "Presupuesto-sjabloon in het Spaans",
  "land.pricing.f3": "Berekening van de afvalwaarborg",
  "land.pricing.f4": "Klaar-voor-verzending e-mailteksten (licentie + afval)",
  "land.pricing.f5": "Overschrijvingsinstructies",
  "land.pricing.f6": "Indien-checklist in uw taal",
  "land.pricing.f7": "Levering binnen 48 uur",
  "land.pricing.note": "De gemeenteheffingen (de licentie zelf en de afvalwaarborg) betaalt u rechtstreeks aan het ayuntamiento — doorgaans 4,72% van het projectbudget voor de licentie plus 1–2% voor afval. Wij rekenen geen opslag. De €99 is voor ons werk.",
  "land.wait.title": "Schrijf in voor vroege toegang",
  "land.wait.body": "Wij lanceren met de eerste 20 betalende klanten in Marbella. Vertel ons over uw project — past het, dan verwerken wij uw vergunning tegen vroege-toegang-tarief (€49 in plaats van €99) en bent u klaar binnen 48 uur.",
  "land.wait.f.name": "Uw naam",
  "land.wait.f.email": "E-mail",
  "land.wait.f.property": "Adres (straat, wijk)",
  "land.wait.f.work": "Wat voor werk?",
  "land.wait.f.budget": "Projectbudget (€)",
  "land.wait.f.timing": "Wanneer wilt u starten?",
  "land.wait.f.work.choose": "— kies —",
  "land.wait.f.work.kitchen": "Keukenvervanging",
  "land.wait.f.work.bath": "Badkamerverbouwing",
  "land.wait.f.work.paint": "Schilderwerk / afwerking",
  "land.wait.f.work.facade": "Gevelschilderwerk",
  "land.wait.f.work.terrace": "Terras / patio",
  "land.wait.f.work.pool": "Zwembadwerk",
  "land.wait.f.work.win": "Ramen / deuren",
  "land.wait.f.work.multi": "Meerdere van bovenstaande",
  "land.wait.f.work.other": "Iets anders (we kijken samen)",
  "land.wait.f.t.now": "Deze maand",
  "land.wait.f.t.soon": "Komende 1–2 maanden",
  "land.wait.f.t.later": "Komende 3–6 maanden",
  "land.wait.f.t.exp": "Alleen oriënterend",
  "land.wait.cta": "Vroege toegang aanvragen →",
  "land.wait.note": "Geen spam. Antwoord binnen 24u. AVG-conform.",
  "land.wait.success": "Ontvangen. We schrijven u binnen 24 uur om te bevestigen of uw project bij ons past.",
  "land.faq.title": "Veelgestelde vragen",
  "land.faq.q1": "Zijn jullie een gestor of advocatenkantoor?",
  "land.faq.a1": "Geen van beide. Wij zijn software. Wij stellen uw documenten op en vertellen u precies wat u moet doen, maar u (of uw aangewezen vertegenwoordiger) dient ze in en betaalt de gemeenteheffingen. Dat is de bewuste grens — het houdt ons software, houdt de prijs op €99 en u in de regie van uw eigen dossier.",
  "land.faq.q2": "Wat als mijn project te groot is voor het platform?",
  "land.faq.a2": "Als uw werk muren verplaatst, structurele wijzigingen omvat of een budget boven €100.000 heeft, vereist de Spaanse wet een gestempeld architectenproject. Dat kunnen wij niet voor u doen — maar in de elegibiliteitscheck zeggen we het direct en verwijzen we u naar een geverifieerde partner-architect tegen een eerlijke prijs. Geen verloren tijd.",
  "land.faq.q3": "Heb ik een Spaans digitaal certificaat nodig?",
  "land.faq.a3": "Indienen bij de sede electrónica vereist een digitaal certificaat of Cl@ve-PIN. De meeste eigenaren gebruiken een gestor of bedrijfsvertegenwoordiger die er al een heeft. We voegen instructies voor beide routes bij. Heeft een Spaanse vennootschap het pand, dan volstaat het certificaat van de administrador.",
  "land.faq.q4": "Hoe snel reageert het gemeentehuis?",
  "land.faq.a4": "De Declaración Responsable is per definitie een 'verklaring' — de werken mogen wettelijk starten zodra u het volledige dossier met betaalbewijs hebt ingediend. Het ayuntamiento heeft zes maanden om te inspecteren en bezwaar te maken. In de praktijk reageren ze binnen 4–8 weken bij een probleem, of zwijgen als alles in orde is.",
  "land.faq.q5": "Hoe zit het met de afvalwaarborg?",
  "land.faq.a5": "Spaanse gemeenten eisen een terugbetaalbare waarborg voor bouwafval, berekend als 2% van de sloopkosten + 1% van de rest. We berekenen het exacte bedrag, geven u de bankrekening en het referentienummer en leggen uit hoe u de waarborg na de werken terugvordert.",
  "land.faq.q6": "Wie zit hierachter?",
  "land.faq.a6": "Een klein team in Marbella. We bouwden dit omdat we steeds zagen hoe buitenlandse eigenaren €400 aan een gestor betaalden voor iets wat met de juiste sjablonen 30 minuten kost. De prijs weerspiegelt dat.",
  "land.foot.location": "Marbella, Spanje",
};

const FR_LANDING = {
  "land.nav.how": "Comment ça marche",
  "land.nav.covered": "Ce que nous couvrons",
  "land.nav.pricing": "Tarif",
  "land.hero.eyebrow": "Marbella, Espagne",
  "land.hero.title": "Vos démarches de rénovation à Marbella. Réglées. Dans votre langue.",
  "land.hero.lede": "Vous rénovez un bien à Marbella ? Nous préparons chaque document exigé par la mairie, calculons les taxes et vous remettons un dossier prêt à déposer — pas à pas, dans votre langue. Sans gestor. Sans stress.",
  "land.hero.cta_primary": "Obtenir mon dossier →",
  "land.hero.cta_secondary": "Voir comment ça marche",
  "land.stats.time": "~48 h",
  "land.stats.time_label": "Du formulaire au dossier dans votre boîte",
  "land.stats.price": "€99",
  "land.stats.price_label": "Prix fixe pour une rénovation standard",
  "land.stats.lang": "5 langues",
  "land.stats.lang_label": "Interface en EN/ES/NL/FR/DE. Documents de dépôt en espagnol (obligatoire).",
  "land.problem.title": "Le problème",
  "land.problem.body1": "Vous possédez un bien à Marbella. Vous voulez rénover la cuisine, repeindre la façade, refaire les salles de bain, restaurer la terrasse. La loi espagnole impose de déposer une Declaración Responsable de Obras à la mairie avant le démarrage des travaux. Une erreur, et la mairie suspend votre chantier pendant des semaines — ou vous inflige une amende dès qu'un voisin se plaint.",
  "land.problem.body2": "Tout le processus est en espagnol, réparti entre trois services municipaux et deux comptes bancaires, exige des formulaires qui n'existent pas en d'autres langues, et change plus souvent que la mise à jour du site. La plupart des propriétaires étrangers paient un gestor espagnol €300–500 pour s'en occuper. C'est exactement le problème que nous résolvons.",
  "land.how.title": "Comment ça marche",
  "land.how.intro": "Quatre étapes. Pas besoin d'espagnol. Aucune visite chez un gestor.",
  "land.how.s1.title": "Décrivez les travaux",
  "land.how.s1.body": "Un court formulaire dans votre langue : ce que vous rénovez, où, et le budget. Cinq minutes.",
  "land.how.s2.title": "Nous vérifions l'éligibilité",
  "land.how.s2.body": "Si votre projet entre dans la voie DR simple (moins de €100k, sans toucher aux murs), on continue. Sinon, on vous le dit et on vous oriente vers un architecte partenaire.",
  "land.how.s3.title": "Documents générés",
  "land.how.s3.body": "Declaración Responsable pré-remplie, modèle de presupuesto, courriels exacts à envoyer à la mairie, calcul de la caution déchets, instructions de virement.",
  "land.how.s4.title": "Vous déposez, avec notre guide",
  "land.how.s4.body": "Une checklist numérotée vous dit quel courriel envoyer où, vers quel compte virer, quoi joindre. Pas à pas dans votre langue. Nous ne déposons pas à votre place — vous gardez le contrôle.",
  "land.cov.title": "Ce que nous couvrons (et ce que non)",
  "land.cov.intro": "Nous restons volontairement étroits. Nous traitons uniquement le bout simple du spectre — les cas qui n'exigent PAS légalement un projet d'architecte visé. Cela représente ~70% des rénovations de propriétaires étrangers à Marbella. Si votre projet ne rentre pas, nous vous le disons dès le jour 1, pas au jour 3.",
  "land.cov.yes_title": "✓ Nous couvrons",
  "land.cov.no_title": "✗ Nous ne couvrons pas",
  "land.cov.out": "Hors périmètre ? Nous vous mettons en relation avec un architecte partenaire vérifié. Votre dossier ne se perd pas dans le labyrinthe espagnol.",
  "land.cov.yes1": "Remplacement de cuisine (même configuration)",
  "land.cov.yes2": "Rénovation de salle de bain (sans déplacer de mur)",
  "land.cov.yes3": "Peinture et finitions intérieures",
  "land.cov.yes4": "Peinture de façade (non structurel)",
  "land.cov.yes5": "Rénovation de terrasse / patio",
  "land.cov.yes6": "Entretien / carrelage de piscine",
  "land.cov.yes7": "Remplacement de fenêtres et portes (mêmes ouvertures)",
  "land.cov.yes8": "Budget total inférieur à €100 000",
  "land.cov.no1": "Déplacer ou supprimer des murs",
  "land.cov.no2": "Modifications structurelles",
  "land.cov.no3": "Ajouter des étages ou des m²",
  "land.cov.no4": "Nouvelles ouvertures de façade",
  "land.cov.no5": "Projets au-delà de €100 000",
  "land.cov.no6": "Tout ce qui exige un projet d'architecte visé",
  "land.cov.no7": "Biens en zone historique ou côtière (permis supplémentaires)",
  "land.pricing.title": "Tarif",
  "land.pricing.intro": "Une seule transaction. Sans abonnement. Sans surprise.",
  "land.pricing.amount": "€99",
  "land.pricing.per": "par permis",
  "land.pricing.f1": "Declaración Responsable pré-remplie complète",
  "land.pricing.f2": "Modèle de presupuesto en espagnol",
  "land.pricing.f3": "Calcul de la caution déchets",
  "land.pricing.f4": "Textes de courriel prêts à envoyer (licence + déchets)",
  "land.pricing.f5": "Instructions de virement bancaire",
  "land.pricing.f6": "Checklist de dépôt dans votre langue",
  "land.pricing.f7": "Livraison sous 48 heures",
  "land.pricing.note": "Les taxes municipales (la licence et la caution déchets) sont payées directement par vous à la mairie — généralement 4,72% du budget pour la licence plus 1–2% pour les déchets. Aucune marge ajoutée de notre part. Les €99 couvrent notre travail.",
  "land.wait.title": "Inscrivez-vous à l'accès anticipé",
  "land.wait.body": "Nous lançons la plateforme avec les 20 premiers clients de Marbella. Décrivez-nous votre projet — s'il correspond, nous traitons votre permis au tarif d'accès anticipé (€49 au lieu de €99) et c'est bouclé en 48 heures.",
  "land.wait.f.name": "Votre nom",
  "land.wait.f.email": "Email",
  "land.wait.f.property": "Adresse du bien (rue, quartier)",
  "land.wait.f.work": "Quel type de travaux ?",
  "land.wait.f.budget": "Budget (€)",
  "land.wait.f.timing": "Quand souhaitez-vous démarrer ?",
  "land.wait.f.work.choose": "— choisir —",
  "land.wait.f.work.kitchen": "Remplacement de cuisine",
  "land.wait.f.work.bath": "Rénovation de salle de bain",
  "land.wait.f.work.paint": "Peinture / finitions",
  "land.wait.f.work.facade": "Peinture de façade",
  "land.wait.f.work.terrace": "Terrasse / patio",
  "land.wait.f.work.pool": "Travaux de piscine",
  "land.wait.f.work.win": "Fenêtres / portes",
  "land.wait.f.work.multi": "Plusieurs des options ci-dessus",
  "land.wait.f.work.other": "Autre (on regarde)",
  "land.wait.f.t.now": "Ce mois-ci",
  "land.wait.f.t.soon": "Dans 1–2 mois",
  "land.wait.f.t.later": "Dans 3–6 mois",
  "land.wait.f.t.exp": "Je me renseigne",
  "land.wait.cta": "Demander l'accès anticipé →",
  "land.wait.note": "Pas de spam. Réponse sous 24h. Conforme RGPD.",
  "land.wait.success": "Bien reçu. Nous vous écrivons sous 24 heures pour confirmer si votre projet correspond à la plateforme.",
  "land.faq.title": "Questions fréquentes",
  "land.faq.q1": "Êtes-vous un gestor ou un cabinet d'avocats ?",
  "land.faq.a1": "Ni l'un ni l'autre. Nous sommes un logiciel. Nous préparons vos documents et vous indiquons exactement quoi faire, mais c'est vous (ou votre représentant désigné) qui les déposez et payez les taxes municipales. C'est la frontière délibérée — cela nous maintient comme logiciel, garde le prix à €99 et vous laisse maître de votre dossier.",
  "land.faq.q2": "Et si mon projet est trop grand pour la plateforme ?",
  "land.faq.a2": "Si vos travaux impliquent de déplacer des murs, des modifications structurelles ou un budget supérieur à €100 000, la loi espagnole exige un projet d'architecte visé. Nous ne pouvons pas le réaliser — mais lors du contrôle d'éligibilité, nous vous le disons immédiatement et vous orientons vers un architecte partenaire vérifié à prix juste. Pas de temps perdu.",
  "land.faq.q3": "Ai-je besoin d'un certificat numérique espagnol ?",
  "land.faq.a3": "Le dépôt par la sede electrónica nécessite un certificat numérique ou un Cl@ve PIN. La plupart des propriétaires passent par un gestor ou un représentant de société qui en dispose déjà. Nous fournissons les instructions pour les deux voies. Si une société espagnole détient le bien, le certificat de l'administrateur fonctionne.",
  "land.faq.q4": "Sous quel délai la mairie répond-elle ?",
  "land.faq.a4": "La Declaración Responsable est par définition une « déclaration » — les travaux peuvent légalement débuter dès le dépôt complet avec preuve de paiement. La mairie dispose de 6 mois pour inspecter et objecter. En pratique, elle répond sous 4–8 semaines en cas de problème, ou reste silencieuse sinon.",
  "land.faq.q5": "Et la caution déchets ?",
  "land.faq.a5": "Les communes espagnoles exigent une caution remboursable pour les déchets de chantier, calculée comme 2% des démolitions + 1% du reste. Nous calculons le montant exact pour votre projet, vous fournissons le compte bancaire et le numéro de référence, et vous expliquons comment récupérer la caution en fin de travaux.",
  "land.faq.q6": "Qui se cache derrière ?",
  "land.faq.a6": "Une petite équipe basée à Marbella. Nous avons construit cet outil parce que nous voyions des propriétaires étrangers payer €400 à un gestor pour ce qui nous prend 30 minutes avec les bons modèles. Le prix le reflète.",
  "land.foot.location": "Marbella, Espagne",
};

const DE_LANDING = {
  "land.nav.how": "So funktioniert es",
  "land.nav.covered": "Was wir abdecken",
  "land.nav.pricing": "Preis",
  "land.hero.eyebrow": "Marbella, Spanien",
  "land.hero.title": "Ihre Marbella-Renovierungsunterlagen. Erledigt. In Ihrer Sprache.",
  "land.hero.lede": "Sie renovieren eine Immobilie in Marbella? Wir bereiten jedes Dokument vor, das die Stadtverwaltung verlangt, berechnen die Gebühren und übergeben Ihnen ein Schritt-für-Schritt-Einreichungspaket — alles in Ihrer Sprache. Kein Gestor. Keine Panik.",
  "land.hero.cta_primary": "Mein Genehmigungspaket →",
  "land.hero.cta_secondary": "Wie es funktioniert",
  "land.stats.time": "~48 Std.",
  "land.stats.time_label": "Vom Formular zum Dossier in Ihrem Postfach",
  "land.stats.price": "99 €",
  "land.stats.price_label": "Festpreis für eine Standardrenovierung",
  "land.stats.lang": "5 Sprachen",
  "land.stats.lang_label": "Oberfläche in EN/ES/NL/FR/DE. Einreichungsunterlagen auf Spanisch (vorgeschrieben).",
  "land.problem.title": "Das Problem",
  "land.problem.body1": "Sie besitzen eine Immobilie in Marbella. Sie möchten die Küche renovieren, die Fassade neu streichen, die Bäder erneuern, die Terrasse aufarbeiten. Das spanische Recht verlangt, dass Sie vor Baubeginn eine Declaración Responsable de Obras bei der Stadtverwaltung einreichen. Machen Sie das falsch, stoppt das Rathaus Ihr Projekt für Wochen — oder verhängt eine Strafe, sobald sich Nachbarn beschweren.",
  "land.problem.body2": "Der gesamte Prozess ist auf Spanisch, verteilt auf drei Ämter und zwei Bankkonten, verlangt Formulare, die in anderen Sprachen nicht existieren, und ändert sich häufiger, als die Website aktualisiert wird. Die meisten ausländischen Eigentümer zahlen einem spanischen Gestor 300–500 €, der das übernimmt. Genau dieses Problem lösen wir.",
  "land.how.title": "So funktioniert es",
  "land.how.intro": "Vier Schritte. Kein Spanisch erforderlich. Kein Besuch bei einem Gestor.",
  "land.how.s1.title": "Beschreiben Sie die Arbeiten",
  "land.how.s1.body": "Ein kurzes Formular in Ihrer Sprache: was Sie renovieren, wo, und das Budget. Fünf Minuten.",
  "land.how.s2.title": "Wir prüfen die Eignung",
  "land.how.s2.body": "Passt Ihr Projekt in den einfachen DR-Pfad (unter 100.000 €, keine Wandänderungen), geht es weiter. Falls nicht, sagen wir es Ihnen und verweisen Sie an einen Partnerarchitekten.",
  "land.how.s3.title": "Dokumente generiert",
  "land.how.s3.body": "Vorausgefüllte Declaración Responsable, Presupuesto-Vorlage, die genauen E-Mails an die Stadtverwaltung, Berechnung der Abfallkaution, Überweisungsanweisungen.",
  "land.how.s4.title": "Sie reichen ein, mit unserer Anleitung",
  "land.how.s4.body": "Eine nummerierte Checkliste sagt Ihnen, welche E-Mail wohin geht, auf welches Konto Sie überweisen, was Sie anhängen. Schritt für Schritt in Ihrer Sprache. Wir reichen nicht in Ihrem Namen ein — Sie behalten die Kontrolle.",
  "land.cov.title": "Was wir abdecken (und was nicht)",
  "land.cov.intro": "Wir bleiben bewusst eng. Wir bearbeiten ausschließlich das einfache Ende des Spektrums — Fälle, die rechtlich KEIN gestempeltes Architektenprojekt erfordern. Das deckt rund 70% der Renovierungen ausländischer Eigentümer in Marbella ab. Passt Ihr Projekt nicht, sagen wir es am Tag eins, nicht am Tag drei.",
  "land.cov.yes_title": "✓ Wir decken ab",
  "land.cov.no_title": "✗ Wir decken nicht ab",
  "land.cov.out": "Außerhalb des Bereichs? Wir vermitteln Sie an einen geprüften Partnerarchitekten. Ihr Fall verschwindet nicht im spanischen Behörden-Labyrinth.",
  "land.cov.yes1": "Küchenaustausch (gleicher Grundriss)",
  "land.cov.yes2": "Badrenovierung (ohne Wandverschiebung)",
  "land.cov.yes3": "Innenanstrich und Oberflächen",
  "land.cov.yes4": "Fassadenanstrich (nicht strukturell)",
  "land.cov.yes5": "Terrassen- und Patio-Renovierung",
  "land.cov.yes6": "Poolwartung / Neufliesung",
  "land.cov.yes7": "Fenster- und Türenaustausch (gleiche Öffnungen)",
  "land.cov.yes8": "Gesamtbudget unter 100.000 €",
  "land.cov.no1": "Wände verschieben oder entfernen",
  "land.cov.no2": "Strukturelle Änderungen",
  "land.cov.no3": "Stockwerke oder Quadratmeter hinzufügen",
  "land.cov.no4": "Neue Fassadenöffnungen",
  "land.cov.no5": "Projekte über 100.000 €",
  "land.cov.no6": "Alles, was ein gestempeltes Architektenprojekt erfordert",
  "land.cov.no7": "Immobilien in historischen oder Küstenzonen (zusätzliche Genehmigungen)",
  "land.pricing.title": "Preis",
  "land.pricing.intro": "Eine Transaktion. Kein Abonnement. Keine Überraschungen.",
  "land.pricing.amount": "99 €",
  "land.pricing.per": "pro Genehmigung",
  "land.pricing.f1": "Vorausgefüllte Declaración Responsable",
  "land.pricing.f2": "Presupuesto-Vorlage auf Spanisch",
  "land.pricing.f3": "Berechnung der Abfallkaution",
  "land.pricing.f4": "Versandfertige E-Mail-Texte (Lizenz + Abfall)",
  "land.pricing.f5": "Banküberweisungsanweisungen",
  "land.pricing.f6": "Einreichungs-Checkliste in Ihrer Sprache",
  "land.pricing.f7": "Lieferung innerhalb von 48 Stunden",
  "land.pricing.note": "Die Gebühren der Stadtverwaltung (die Lizenz selbst, die Abfallkaution) zahlen Sie direkt an das Ayuntamiento — typisch 4,72% des Projektbudgets für die Lizenz plus 1–2% für Abfall. Wir schlagen nichts auf. Die 99 € sind für unsere Arbeit.",
  "land.wait.title": "Sichern Sie sich frühen Zugang",
  "land.wait.body": "Wir starten die Plattform mit den ersten 20 zahlenden Kunden in Marbella. Erzählen Sie uns von Ihrem Projekt — passt es, bearbeiten wir Ihre Genehmigung zum Frühzugriff-Preis (49 € statt 99 €) und Sie sind in 48 Stunden fertig.",
  "land.wait.f.name": "Ihr Name",
  "land.wait.f.email": "E-Mail",
  "land.wait.f.property": "Adresse der Immobilie (Straße, Bezirk)",
  "land.wait.f.work": "Welche Art von Arbeiten?",
  "land.wait.f.budget": "Projektbudget (€)",
  "land.wait.f.timing": "Wann möchten Sie starten?",
  "land.wait.f.work.choose": "— auswählen —",
  "land.wait.f.work.kitchen": "Küchenaustausch",
  "land.wait.f.work.bath": "Badrenovierung",
  "land.wait.f.work.paint": "Anstrich / Oberflächen",
  "land.wait.f.work.facade": "Fassadenanstrich",
  "land.wait.f.work.terrace": "Terrasse / Patio",
  "land.wait.f.work.pool": "Poolarbeiten",
  "land.wait.f.work.win": "Fenster / Türen",
  "land.wait.f.work.multi": "Mehrere der genannten",
  "land.wait.f.work.other": "Etwas anderes (wir schauen es uns an)",
  "land.wait.f.t.now": "Diesen Monat",
  "land.wait.f.t.soon": "In 1–2 Monaten",
  "land.wait.f.t.later": "In 3–6 Monaten",
  "land.wait.f.t.exp": "Ich informiere mich",
  "land.wait.cta": "Frühzugriff anfordern →",
  "land.wait.note": "Kein Spam. Antwort innerhalb von 24 Std. DSGVO-konform.",
  "land.wait.success": "Erhalten. Wir melden uns innerhalb von 24 Stunden, um zu bestätigen, ob Ihr Projekt zur Plattform passt.",
  "land.faq.title": "Häufige Fragen",
  "land.faq.q1": "Sind Sie ein Gestor oder eine Anwaltskanzlei?",
  "land.faq.a1": "Weder noch. Wir sind Software. Wir bereiten Ihre Dokumente vor und sagen Ihnen genau, was zu tun ist, aber Sie (oder Ihr bestellter Vertreter) reichen sie ein und zahlen die kommunalen Gebühren. Das ist die bewusste Grenze — sie hält uns als Software, hält den Preis bei 99 € und Sie behalten die Kontrolle über Ihren eigenen Fall.",
  "land.faq.q2": "Was, wenn mein Projekt zu groß für die Plattform ist?",
  "land.faq.a2": "Wenn Ihre Arbeiten Wandverschiebungen, strukturelle Änderungen oder ein Budget über 100.000 € umfassen, verlangt das spanische Recht ein gestempeltes Architektenprojekt. Das können wir nicht leisten — aber bei der Eignungsprüfung sagen wir es Ihnen sofort und verweisen Sie an einen geprüften Partnerarchitekten zu fairem Preis. Keine verlorene Zeit.",
  "land.faq.q3": "Benötige ich ein spanisches digitales Zertifikat?",
  "land.faq.a3": "Die Einreichung über die sede electrónica der Stadtverwaltung erfordert ein digitales Zertifikat oder Cl@ve-PIN. Die meisten Eigentümer nutzen einen Gestor oder Unternehmensvertreter, der bereits eines besitzt. Wir geben Anleitungen für beide Wege im Dossier. Gehört die Immobilie einer spanischen Gesellschaft, funktioniert das Administradorzertifikat.",
  "land.faq.q4": "Wie schnell antwortet die Stadtverwaltung?",
  "land.faq.a4": "Die Declaración Responsable ist per Definition eine 'Erklärung' — die Arbeiten dürfen rechtlich beginnen, sobald die vollständige Akte mit Zahlungsnachweis eingereicht wurde. Die Stadtverwaltung hat 6 Monate für Prüfung und Einspruch. In der Praxis antwortet sie bei Problemen in 4–8 Wochen, sonst schweigt sie.",
  "land.faq.q5": "Und die Abfallkaution?",
  "land.faq.a5": "Spanische Gemeinden verlangen eine rückerstattbare Kaution für Bauabfall, berechnet als 2% der Abbruchkosten + 1% des Rests. Wir berechnen den exakten Betrag für Ihr Projekt, geben Ihnen Bankkonto und Verwendungszweck und erklären, wie Sie die Kaution nach Abschluss zurückholen.",
  "land.faq.q6": "Wer steckt dahinter?",
  "land.faq.a6": "Ein kleines Team in Marbella. Wir haben das gebaut, weil wir immer wieder sahen, wie ausländische Eigentümer 400 € an einen Gestor zahlten für etwas, das uns mit den richtigen Vorlagen 30 Minuten kostet. Der Preis spiegelt das wider.",
  "land.foot.location": "Marbella, Spanien",
};


// Keys are stable across versions. Add new keys at the bottom. NEVER rename
// existing keys without updating every render site.
//
// Conventions:
//   "section.subsection.purpose"  — namespaced keys
//   Plain strings on a single line where possible.
//
// Strings will be added per surface in follow-up edits:
//   • landing.*  — landing page
//   • wiz.*      — wizard UI
//   • pdf.*      — customer-facing PDF content
//   • err.*      — error messages
//
const TRANSLATIONS = {
  en: { ...EN, ...EN_LANDING },
  es: { ...ES, ...ES_LANDING },
  nl: { ...NL, ...NL_LANDING },
  fr: { ...FR, ...FR_LANDING },
  de: { ...DE, ...DE_LANDING },
};

// Run init on script load so language is set before any render.
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tInit);
  } else {
    tInit();
  }
}
