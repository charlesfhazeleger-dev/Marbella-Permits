// Eligibility rules + fee calculation for the B2C Marbella Permits wizard.
// Sourced from the user's uploaded "COMO SOLICITAR LICENCIA" and Meisho Hills example.
//
// ⚠️ Numbers are sourced directly from the user's operational documents. Verify
// against the current Marbella ordenanza fiscal before charging customers.

const RULES = {
  // Hard limits for the "simple DR" track
  maxBudgetEUR: 100000,
  maxDistributionM2: 100,

  // Jan 2026 Marbella instrucción urbanística: works under this threshold,
  // in the scope of "revestimientos, pintura o determinadas instalaciones
  // interiores", are EXEMPT — no permit, no fee — except in protected zones.
  // Source: marbella.es, 26 Jan 2026.
  exemptBudgetEUR: 10000,
  exemptProjectTypes: ["interior_paint", "windows_doors"],

  // Fees
  licenseRate: 0.0472,   // 4% + 0.72% per the uploaded process doc
  wasteDemolitionRate: 0.02,
  wasteRestRate: 0.01,

  // Our service fee
  servicePriceEUR: 99,
  earlyAccessPriceEUR: 49,

  // Marbella bank accounts — verified from the uploaded official certificates
  // (Cuenta Patronato para DR.pdf + CUENTA AYTO. BBVA PAGO TASAS.pdf)
  bankAccounts: {
    license: {
      bank: "Unicaja Banco",
      branch: "Sucursal Alta Renta, C/ Fernando Camino nº 2, 29016 Málaga",
      titular: "Patronato Recaudación Provincial de Málaga",
      iban_print: "ES59 2103 1001 5702 3000 0222",
      iban_electronic: "ES5921031001570230000222",
      swift: "UCJAES2M",
      gastos: "OUR",
      conceptFormat: "Use the IDENTIFICATION NUMBER printed on the top-right of the 'carta de pago' the town hall sent you, plus the declarant's name or company name.",
    },
    wasteDeposit: {
      bank: "BBVA",
      titular: "Ayuntamiento de Marbella",
      titular_nif: "P2906900B",
      iban: "ES73 0182 5918 4502 0150 6063",
      swift: "BBVAESMMXXX",
      conceptFormat: 'Fianza [amount] € – [property address]',
    },
  },

  // Town hall contact points
  contacts: {
    license: {
      email: "oficinaliquidadora@marbella.es",
      purpose: "Declaración Responsable + license fee 'carta de pago'",
    },
    waste: {
      email: "caja@marbella.es",
      purpose: "Waste-deposit fianza 'carta de pago'",
    },
  },

  // Sede electrónica navigation path (from "DR AND TAX PAYMENTS MAIL" doc)
  sedeFlow: {
    url: "https://www.marbella.es",
    steps: [
      "Open https://www.marbella.es",
      "Click 'Sede electrónica' (top menu)",
      "Click 'Trámites' (second box)",
      "Click 'Instancia General'",
      "Click 'Acceder con Certificado Digital' (need a Spanish digital certificate or Cl@ve PIN)",
      "Fill in the instancia — your details come straight from the DR. In 'Delegación' choose LICENCIAS (NOT urbanismo, obras, or proyectos)",
      "Attach every file in this dossier",
      "Click 'Presentar' and save the digital justificante (acuse de recibo) it generates",
    ],
    helpPhone: "+34 690 380 502",
  },
};


// Project types we can handle — mapped to the official Section-A codes in the
// DR form so we can auto-check the right boxes when generating the document.
// References: official "Declaracion_responsable_obras_1.pdf", section A.
const COVERED_PROJECT_TYPES = [
  { value: "kitchen_replace",   label: "Kitchen replacement (same layout)",        section_a_codes: ["A.1", "A.3"] },
  { value: "bathroom_redo",     label: "Bathroom renovation (no wall changes)",     section_a_codes: ["A.1", "A.3"] },
  { value: "interior_paint",    label: "Interior painting / finishes",              section_a_codes: ["A.1"] },
  { value: "facade_paint",      label: "Façade painting (no structural)",           section_a_codes: ["A.10"] },
  { value: "terrace_refurb",    label: "Terrace / patio refurbishment",             section_a_codes: ["A.8", "A.14"] },
  { value: "pool_work",         label: "Pool maintenance / re-tiling",              section_a_codes: ["A.7"] },
  { value: "windows_doors",     label: "Window / door replacement (same openings)", section_a_codes: ["A.11"] },
  { value: "multiple",          label: "Multiple of the above",                     section_a_codes: ["A.1", "A.3"] },
];

// Section-A descriptions (Spanish, from the official form)
const SECTION_A_DESCRIPTIONS = {
  "A.1":  "Revestimientos y acabados (pintura, revocos, enlucidos, aplacados, solados, impermeabilizaciones...) en paramentos verticales y horizontales, tanto interiores como exteriores de la edificación que en su conjunto no supera los 500 m² de superficie, que no requieren medios para trabajar en altura.",
  "A.3":  "Instalaciones interiores de edificaciones (electricidad, agua, saneamiento, gas, telecomunicaciones, climatización, sistemas de seguridad...) que afectan a una sola vivienda o local, con superficie inferior a 300 m².",
  "A.7":  "Obras de mantenimiento y conservación de piscinas y pistas deportivas.",
  "A.8":  "Reparación puntual de cubiertas planas, así como de terrazas y balcones que no requieren medios para trabajar en altura.",
  "A.10": "Limpieza, raspado, pintura y acabados de fachadas o medianeras, así como reparación de enlucidos en paramentos, colocación de aplacados, modificación de revestimientos y/o sustitución de molduras de fachadas, zócalos y elementos similares, que no requieren medios para trabajos en altura, ni suponen una variación esencial de la composición general exterior.",
  "A.11": "Colocación nueva de carpinterías interiores, incluso variando la dimensión de los huecos, que no altera el número ni la disposición de las piezas habitables.",
  "A.14": "Acondicionamiento de espacios libres de parcela consistentes en obras de ajardinamiento, pavimentación, soleras de patios, aceras perimetrales, colocación de bordillos en terrenos de uso privado que no afecta a ningún servicio o instalación pública ni a conductos generales, ni implica movimientos de tierras o alteración de la rasante natural del terreno.",
};

// Helper: get the section-A codes for a given project type
function getSectionACodes(project_type) {
  const t = COVERED_PROJECT_TYPES.find(p => p.value === project_type);
  return t ? t.section_a_codes : [];
}

// Detect EXEMPT cases per Marbella's Jan 2026 instrucción urbanística.
function isExempt(data) {
  const budget = Number(data.budget_eur) || 0;
  if (budget >= RULES.exemptBudgetEUR) return false;
  if (!RULES.exemptProjectTypes.includes(data.project_type)) return false;
  if (data.in_historic_zone === "yes") return false;
  if (data.in_coastal_zone === "yes") return false;
  if (data.has_wall_changes === "yes") return false;
  if (data.has_structural === "yes") return false;
  if (data.has_new_openings === "yes") return false;
  return true;
}

// Eligibility check — runs every time the user changes input
function checkEligibility(data) {
  if (isExempt(data)) {
    return { eligible: true, exempt: true, blockers: [] };
  }
  const reasons = [];

  if (data.has_wall_changes === "yes") {
    reasons.push({
      code: "WALL_CHANGES",
      message: "Moving or removing walls requires a stamped architect's project. Not in scope.",
    });
  }
  if (data.has_structural === "yes") {
    reasons.push({
      code: "STRUCTURAL",
      message: "Structural changes (load-bearing elements, foundations) require a full project.",
    });
  }
  if (data.has_new_openings === "yes") {
    reasons.push({
      code: "NEW_OPENINGS",
      message: "New façade openings need a stamped architect's project.",
    });
  }
  if (Number(data.budget_eur) > RULES.maxBudgetEUR) {
    reasons.push({
      code: "BUDGET_OVER_100K",
      message: `Project budget €${Number(data.budget_eur).toLocaleString()} exceeds the simple-DR ceiling of €${RULES.maxBudgetEUR.toLocaleString()}.`,
    });
  }
  if (Number(data.distribution_changes_m2 || 0) > RULES.maxDistributionM2) {
    reasons.push({
      code: "DISTRIBUTION_OVER_100M2",
      message: `Distribution changes of ${data.distribution_changes_m2} m² exceed the 100 m² simple-DR ceiling.`,
    });
  }
  if (data.in_historic_zone === "yes") {
    reasons.push({
      code: "HISTORIC_ZONE",
      message: "Properties in historic zones require additional Cultura authorisation — not in scope.",
    });
  }
  if (data.in_coastal_zone === "yes") {
    reasons.push({
      code: "COASTAL_ZONE",
      message: "Properties in the coastal zone require Costas authorisation — not in scope for the simple track.",
    });
  }

  return {
    eligible: reasons.length === 0,
    exempt: false,
    blockers: reasons,
  };
}

// Fee calculation — pure functions over numeric inputs
function calculateFees(data) {
  const pem = Number(data.budget_eur) || 0;
  const demoShare = Math.min(1, Math.max(0, Number(data.demolition_pct) / 100 || 0));
  const demoEUR = pem * demoShare;
  const restEUR = pem - demoEUR;

  const licenseFee = +(pem * RULES.licenseRate).toFixed(2);
  const wasteDeposit = +(demoEUR * RULES.wasteDemolitionRate + restEUR * RULES.wasteRestRate).toFixed(2);
  const townHallTotal = +(licenseFee + wasteDeposit).toFixed(2);

  return {
    pem,
    demolition_eur: demoEUR,
    rest_eur: restEUR,
    license_fee: licenseFee,
    license_formula: `PEM (€${pem.toLocaleString()}) × ${(RULES.licenseRate * 100).toFixed(2)}% = €${licenseFee.toLocaleString()}`,
    waste_deposit: wasteDeposit,
    waste_formula:
      `${(typeof t === "function" ? t("wiz.formula.demoshare") : "Demolition share")} (€${demoEUR.toLocaleString()}) × ${(RULES.wasteDemolitionRate * 100).toFixed(1)}% ` +
      `+ ${(typeof t === "function" ? t("wiz.formula.rest") : "Rest")} (€${restEUR.toLocaleString()}) × ${(RULES.wasteRestRate * 100).toFixed(1)}% = €${wasteDeposit.toLocaleString()}`,
    town_hall_total: townHallTotal,
    service_fee: RULES.servicePriceEUR,
    grand_total: +(townHallTotal + RULES.servicePriceEUR).toFixed(2),
  };
}
