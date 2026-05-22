// Marbella Permits B2C wizard — main app logic.
// Vanilla JS, file://-safe (no ES modules). rules.js + templates.js load before this.

const STORAGE_KEY = "mp_b2c_wizard_v1";

const STEPS = [
  { id: "welcome",     label: "Start" },
  { id: "owner",       label: "About you" },
  { id: "property",    label: "Property" },
  { id: "work",        label: "The work" },
  { id: "eligibility", label: "Eligibility" },
  { id: "fees",        label: "Cost summary" },
  { id: "dossier",     label: "Dossier" },
];

let state = loadState();

function emptyState() {
  return {
    step: "welcome",
    data: {
      owner_name: "",
      owner_email: "",
      phone: "",
      owner_type: "individual",       // individual | company
      owner_id: "",                   // DNI/NIE/Passport
      company_name: "",
      company_cif: "",
      property_address: "",
      catastral_reference: "",
      property_type: "villa",
      project_type: "",
      project_description: "",
      budget_eur: "",
      demolition_pct: "0",
      has_wall_changes: "no",
      has_structural: "no",
      has_new_openings: "no",
      in_historic_zone: "no",
      in_coastal_zone: "no",
      distribution_changes_m2: "0",
      start_estimate: "this_month",
    },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return JSON.parse(raw);
  } catch (e) {
    return emptyState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetState() {
  state = emptyState();
  saveState();
  navigate("welcome");
}

// ---------- helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function fmtEUR(n) {
  return Number(n).toLocaleString("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
}

function projectTypeLabel(type) {
  if (!type) return "—";
  return t("wiz.ptype." + type, type.replace(/_/g, " "));
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function toast(msg, type = "") {
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ---------- routing ----------
function stepIndex(id) {
  return STEPS.findIndex(s => s.id === id);
}

function navigate(stepId) {
  state.step = stepId;
  saveState();
  render();
}

function next() {
  const i = stepIndex(state.step);
  // EXEMPT cases skip the fees step — they don't pay anything.
  if (state.data._exempt && STEPS[i].id === "eligibility") {
    return navigate("dossier");
  }
  if (state.data._exempt && STEPS[i].id === "dossier") {
    return; // already at the end
  }
  if (i < STEPS.length - 1) navigate(STEPS[i + 1].id);
}

function prev() {
  const i = stepIndex(state.step);
  if (i > 0) navigate(STEPS[i - 1].id);
}

// ---------- input binding ----------
function bind(field, el, opts = {}) {
  const value = state.data[field] ?? "";
  el.value = value;
  el.addEventListener("input", () => {
    state.data[field] = el.value;
    saveState();
    if (opts.onChange) opts.onChange();
  });
  el.addEventListener("change", () => {
    state.data[field] = el.value;
    saveState();
    if (opts.onChange) opts.onChange();
  });
}

function bindRadio(field, container, opts = {}) {
  const inputs = $$('input[type="radio"]', container);
  inputs.forEach(input => {
    const label = input.closest("label");
    const checked = state.data[field] === input.value;
    input.checked = checked;
    if (label) label.classList.toggle("selected", checked);
    input.addEventListener("change", () => {
      state.data[field] = input.value;
      $$('input[type="radio"][name="' + input.name + '"]', container).forEach(other => {
        const otherLabel = other.closest("label");
        if (otherLabel) otherLabel.classList.toggle("selected", other.value === input.value);
      });
      saveState();
      if (opts.onChange) opts.onChange();
    });
  });
}

// ---------- step renderers ----------
const STEP_LABEL_KEYS = {
  welcome: "wiz.step.start",
  owner: "wiz.step.owner",
  property: "wiz.step.property",
  work: "wiz.step.work",
  eligibility: "wiz.step.eligibility",
  fees: "wiz.step.fees",
  dossier: "wiz.step.dossier",
};

function renderStepper() {
  const i = stepIndex(state.step);
  return `
    <div class="stepper">
      ${STEPS.map((s, idx) => {
        const cls = idx < i ? "done" : (idx === i ? "active" : "");
        return `<div class="step-pill ${cls}"><span class="step-num">${idx + 1}</span>${t(STEP_LABEL_KEYS[s.id], s.label)}</div>`;
      }).join("")}
    </div>
  `;
}

function renderWelcome(c) {
  c.innerHTML = `
    ${renderStepper()}
    <div class="card">
      <h1>${t("wiz.welcome.title")}</h1>
      <p class="subtitle">${t("wiz.welcome.subtitle")}</p>
      <div class="banner info">
        <strong>${t("wiz.welcome.cover_title")}</strong>${t("wiz.welcome.cover_body")}
      </div>
      <div class="banner warn">
        <strong>${t("wiz.welcome.nodo_title")}</strong>${t("wiz.welcome.nodo_body")}
      </div>
      <div class="action-row" style="justify-content: flex-end;">
        <button class="btn btn-primary" id="start-btn">${t("wiz.welcome.start")}</button>
      </div>
    </div>
  `;
  $("#start-btn").addEventListener("click", () => next());
}

function renderOwner(c) {
  c.innerHTML = `
    ${renderStepper()}
    <div class="card">
      <h1>${t("wiz.owner.title")}</h1>
      <p class="subtitle">${t("wiz.owner.subtitle")}</p>

      <div class="form-grid-2">
        <div class="form-row">
          <label for="owner_name">${t("wiz.owner.name")}</label>
          <input id="owner_name" type="text" autocomplete="name" />
        </div>
        <div class="form-row">
          <label for="owner_email">${t("wiz.owner.email")}</label>
          <input id="owner_email" type="email" autocomplete="email" />
        </div>
      </div>
      <div class="form-row">
        <label for="phone">${t("wiz.owner.phone")}</label>
        <input id="phone" type="tel" autocomplete="tel" placeholder="+34 600 000 000 or +44 7700 900000" />
        <span class="hint">${t("wiz.owner.phone_hint")}</span>
      </div>

      <div class="form-row">
        <label>${t("wiz.owner.applying_as")}</label>
        <div class="radio-cards" id="owner_type_radio">
          <label><input type="radio" name="owner_type" value="individual" />${t("wiz.owner.individual")}</label>
          <label><input type="radio" name="owner_type" value="company" />${t("wiz.owner.company")}</label>
        </div>
      </div>

      <div class="form-row">
        <label for="owner_id">${t("wiz.owner.id")}</label>
        <input id="owner_id" type="text" />
        <span class="hint">${t("wiz.owner.id_hint")}</span>
      </div>

      <div id="company-section" style="display: none;">
        <div class="form-grid-2">
          <div class="form-row">
            <label for="company_name">${t("wiz.owner.company_name")}</label>
            <input id="company_name" type="text" autocomplete="organization" />
          </div>
          <div class="form-row">
            <label for="company_cif">${t("wiz.owner.cif")}</label>
            <input id="company_cif" type="text" />
          </div>
        </div>
      </div>

      <div class="action-row">
        <button class="btn btn-ghost" id="back-btn">${t("wiz.btn.back")}</button>
        <button class="btn btn-primary" id="next-btn">${t("wiz.btn.next")}</button>
      </div>
    </div>
  `;
  bind("owner_name", $("#owner_name"));
  bind("owner_email", $("#owner_email"));
  bind("phone", $("#phone"));
  bind("owner_id", $("#owner_id"));
  bind("company_name", $("#company_name"));
  bind("company_cif", $("#company_cif"));
  bindRadio("owner_type", $("#owner_type_radio"), {
    onChange: () => {
      $("#company-section").style.display = state.data.owner_type === "company" ? "" : "none";
    },
  });
  $("#company-section").style.display = state.data.owner_type === "company" ? "" : "none";

  $("#back-btn").addEventListener("click", () => prev());
  $("#next-btn").addEventListener("click", () => {
    if (!state.data.owner_name || !state.data.owner_email) {
      return toast(t("wiz.owner.err"), "error");
    }
    next();
  });
}

function renderProperty(c) {
  c.innerHTML = `
    ${renderStepper()}
    <div class="card">
      <h1>${t("wiz.prop.title")}</h1>
      <p class="subtitle">${t("wiz.prop.subtitle")}</p>

      <div class="form-row">
        <label for="property_address">${t("wiz.prop.address")}</label>
        <input id="property_address" type="text" placeholder="${escapeHtml(t("wiz.prop.address_ph"))}" />
      </div>

      <div class="form-row">
        <label for="catastral_reference">${t("wiz.prop.catastral")}</label>
        <input id="catastral_reference" type="text" maxlength="20" placeholder="${escapeHtml(t("wiz.prop.catastral_ph"))}" />
        <span class="hint">
          ${t("wiz.prop.catastral_hint")}
          <a href="https://www1.sedecatastro.gob.es/" target="_blank" rel="noopener">sedecatastro.gob.es</a>.
        </span>
      </div>

      <div class="form-row">
        <label>${t("wiz.prop.type")}</label>
        <div class="radio-cards" id="property_type_radio">
          <label><input type="radio" name="property_type" value="villa" />${t("wiz.prop.villa")}</label>
          <label><input type="radio" name="property_type" value="townhouse" />${t("wiz.prop.townhouse")}</label>
          <label><input type="radio" name="property_type" value="apartment" />${t("wiz.prop.apartment")}</label>
          <label><input type="radio" name="property_type" value="commercial" />${t("wiz.prop.commercial")}</label>
        </div>
      </div>

      <div class="form-grid-2">
        <div class="form-row">
          <label>${t("wiz.prop.historic_q")}</label>
          <div class="radio-cards" id="in_historic_zone_radio">
            <label><input type="radio" name="in_historic_zone" value="no" />${t("wiz.common.no")}</label>
            <label><input type="radio" name="in_historic_zone" value="yes" />${t("wiz.common.yes")}</label>
          </div>
        </div>
        <div class="form-row">
          <label>${t("wiz.prop.coastal_q")}</label>
          <div class="radio-cards" id="in_coastal_zone_radio">
            <label><input type="radio" name="in_coastal_zone" value="no" />${t("wiz.common.no")}</label>
            <label><input type="radio" name="in_coastal_zone" value="yes" />${t("wiz.common.yes")}</label>
          </div>
        </div>
      </div>

      <div class="action-row">
        <button class="btn btn-ghost" id="back-btn">${t("wiz.btn.back")}</button>
        <button class="btn btn-primary" id="next-btn">${t("wiz.btn.next")}</button>
      </div>
    </div>
  `;
  bind("property_address", $("#property_address"));
  bind("catastral_reference", $("#catastral_reference"));
  bindRadio("property_type", $("#property_type_radio"));
  bindRadio("in_historic_zone", $("#in_historic_zone_radio"));
  bindRadio("in_coastal_zone", $("#in_coastal_zone_radio"));

  $("#back-btn").addEventListener("click", () => prev());
  $("#next-btn").addEventListener("click", () => {
    if (!state.data.property_address || !state.data.catastral_reference) {
      return toast(t("wiz.prop.err_addr"), "error");
    }
    if (state.data.catastral_reference.length < 14) {
      return toast(t("wiz.prop.err_cat"), "error");
    }
    next();
  });
}

function renderWork(c) {
  c.innerHTML = `
    ${renderStepper()}
    <div class="card">
      <h1>${t("wiz.work.title")}</h1>
      <p class="subtitle">${t("wiz.work.subtitle")}</p>

      <div class="form-row">
        <label for="project_type">${t("wiz.work.type")}</label>
        <select id="project_type">
          <option value="">${t("wiz.work.select")}</option>
          ${COVERED_PROJECT_TYPES.map(pt => `<option value="${pt.value}">${escapeHtml(t("wiz.ptype." + pt.value, pt.label))}</option>`).join("")}
        </select>
      </div>

      <div class="form-row">
        <label for="project_description">${t("wiz.work.desc")}</label>
        <textarea id="project_description" placeholder="${escapeHtml(t("wiz.work.desc_ph"))}"></textarea>
        <span class="hint">${t("wiz.work.desc_hint")}</span>
      </div>

      <div class="form-grid-2">
        <div class="form-row">
          <label for="budget_eur">${t("wiz.work.budget")}</label>
          <input id="budget_eur" type="number" min="0" step="100" placeholder="28000" />
          <span class="hint">${t("wiz.work.budget_hint")}</span>
        </div>
        <div class="form-row">
          <label for="demolition_pct">${t("wiz.work.demo")}</label>
          <input id="demolition_pct" type="number" min="0" max="100" step="5" placeholder="0" />
          <span class="hint">${t("wiz.work.demo_hint")}</span>
        </div>
      </div>

      <div class="form-row">
        <label>${t("wiz.work.walls_q")}</label>
        <div class="radio-cards" id="has_wall_changes_radio">
          <label><input type="radio" name="has_wall_changes" value="no" />${t("wiz.common.no")}</label>
          <label><input type="radio" name="has_wall_changes" value="yes" />${t("wiz.common.yes")}</label>
        </div>
      </div>

      <div class="form-row">
        <label>${t("wiz.work.structural_q")}</label>
        <div class="radio-cards" id="has_structural_radio">
          <label><input type="radio" name="has_structural" value="no" />${t("wiz.common.no")}</label>
          <label><input type="radio" name="has_structural" value="yes" />${t("wiz.common.yes")}</label>
        </div>
      </div>

      <div class="form-row">
        <label>${t("wiz.work.openings_q")}</label>
        <div class="radio-cards" id="has_new_openings_radio">
          <label><input type="radio" name="has_new_openings" value="no" />${t("wiz.common.no")}</label>
          <label><input type="radio" name="has_new_openings" value="yes" />${t("wiz.common.yes")}</label>
        </div>
      </div>

      <div class="action-row">
        <button class="btn btn-ghost" id="back-btn">${t("wiz.btn.back")}</button>
        <button class="btn btn-primary" id="next-btn">${t("wiz.work.check_btn")}</button>
      </div>
    </div>
  `;
  bind("project_type", $("#project_type"));
  bind("project_description", $("#project_description"));
  bind("budget_eur", $("#budget_eur"));
  bind("demolition_pct", $("#demolition_pct"));
  bindRadio("has_wall_changes", $("#has_wall_changes_radio"));
  bindRadio("has_structural", $("#has_structural_radio"));
  bindRadio("has_new_openings", $("#has_new_openings_radio"));

  $("#back-btn").addEventListener("click", () => prev());
  $("#next-btn").addEventListener("click", () => {
    if (!state.data.project_type || !state.data.budget_eur) {
      return toast(t("wiz.work.err"), "error");
    }
    next();
  });
}

// Map an eligibility blocker (from rules.js) to a translated message.
function blockerMessage(b) {
  if (b.code === "BUDGET_OVER_100K") {
    return tf("wiz.blocker.BUDGET_OVER_100K", {
      budget: Number(state.data.budget_eur).toLocaleString(),
      max: (typeof RULES !== "undefined" ? RULES.maxBudgetEUR : 100000).toLocaleString(),
    });
  }
  if (b.code === "DISTRIBUTION_OVER_100M2") {
    return tf("wiz.blocker.DISTRIBUTION_OVER_100M2", { m2: state.data.distribution_changes_m2 });
  }
  return t("wiz.blocker." + b.code, b.message);
}

function renderEligibility(c) {
  const result = checkEligibility(state.data);

  // Three possible outcomes: EXEMPT (no permit), eligible-for-DR, not-eligible.
  let subtitleHtml, cardClass, cardTitle, cardBody, nextBtnHtml;
  if (result.exempt) {
    subtitleHtml = t("wiz.elig.exempt.subtitle");
    cardClass = "ok";
    cardTitle = t("wiz.elig.exempt.card_title");
    cardBody = `
      <p>${t("wiz.elig.exempt.body1")}</p>
      <p style="margin-top: 1rem;">${t("wiz.elig.exempt.body2")}</p>
    `;
    nextBtnHtml = `<button class="btn btn-primary" id="next-btn">${t("wiz.elig.exempt.next")}</button>`;
  } else if (result.eligible) {
    subtitleHtml = t("wiz.elig.ok.subtitle");
    cardClass = "ok";
    cardTitle = t("wiz.elig.ok.card_title");
    cardBody = `<p>${t("wiz.elig.ok.body")}</p>`;
    nextBtnHtml = `<button class="btn btn-primary" id="next-btn">${t("wiz.elig.ok.next")}</button>`;
  } else {
    subtitleHtml = t("wiz.elig.no.subtitle");
    cardClass = "no";
    cardTitle = t("wiz.elig.no.card_title");
    cardBody = `
      <p>${t("wiz.elig.no.intro")}</p>
      <ul>
        ${result.blockers.map(b => `<li><strong>${escapeHtml(b.code)}:</strong> ${escapeHtml(blockerMessage(b))}</li>`).join("")}
      </ul>
      <p style="margin-top: 1rem;">${t("wiz.elig.no.whatnow")}</p>
    `;
    nextBtnHtml = `<button class="btn btn-ghost" id="reset-btn" style="opacity: 0.7;">${t("wiz.elig.no.reset")}</button>`;
  }

  c.innerHTML = `
    ${renderStepper()}
    <div class="card">
      <h1>${t("wiz.elig.title")}</h1>
      <p class="subtitle">${subtitleHtml}</p>

      <div class="elig-card ${cardClass}">
        <h3>${cardTitle}</h3>
        ${cardBody}
      </div>

      <div class="action-row">
        <button class="btn btn-ghost" id="back-btn">${t("wiz.elig.back")}</button>
        ${nextBtnHtml}
      </div>
    </div>
  `;
  // Store the exempt flag in state so downstream steps know to skip fees + DR.
  state.data._exempt = !!result.exempt;
  saveState();
  $("#back-btn").addEventListener("click", () => prev());
  const nextBtn = $("#next-btn");
  if (nextBtn) nextBtn.addEventListener("click", () => next());
  const resetBtn = $("#reset-btn");
  if (resetBtn) resetBtn.addEventListener("click", () => {
    if (confirm(t("wiz.elig.reset_confirm"))) resetState();
  });
}

function renderFees(c) {
  const fees = calculateFees(state.data);

  c.innerHTML = `
    ${renderStepper()}
    <div class="card">
      <h1>${t("wiz.fees.title")}</h1>
      <p class="subtitle">${t("wiz.fees.subtitle")}</p>

      <div class="cost-grid">
        <div class="cost-card">
          <div class="cost-label">${t("wiz.fees.pem")}</div>
          <div class="cost-amount">${fmtEUR(fees.pem)}</div>
          <div class="cost-formula">${t("wiz.fees.pem_sub")}</div>
        </div>
        <div class="cost-card">
          <div class="cost-label">${t("wiz.fees.license")}</div>
          <div class="cost-amount">${fmtEUR(fees.license_fee)}</div>
          <div class="cost-formula">${escapeHtml(fees.license_formula)}</div>
        </div>
        <div class="cost-card">
          <div class="cost-label">${t("wiz.fees.waste")}</div>
          <div class="cost-amount">${fmtEUR(fees.waste_deposit)}</div>
          <div class="cost-formula">${escapeHtml(fees.waste_formula)}</div>
        </div>
        <div class="cost-card">
          <div class="cost-label">${t("wiz.fees.service")}</div>
          <div class="cost-amount">${fmtEUR(fees.service_fee)}</div>
          <div class="cost-formula">${t("wiz.fees.service_sub")}</div>
        </div>
      </div>

      <div class="banner ok">
        <strong>${t("wiz.fees.total_label")}</strong> ${fmtEUR(fees.grand_total)}.<br>
        ${tf("wiz.fees.total_body", { townhall: fmtEUR(fees.town_hall_total) })}
      </div>

      <div class="banner info">
        <strong>${t("wiz.fees.waste_about_title")}</strong>${t("wiz.fees.waste_about_body")}
      </div>

      <div class="action-row">
        <button class="btn btn-ghost" id="back-btn">${t("wiz.btn.back")}</button>
        <button class="btn btn-primary" id="next-btn">${t("wiz.fees.generate_btn")}</button>
      </div>
    </div>
  `;
  $("#back-btn").addEventListener("click", () => prev());
  $("#next-btn").addEventListener("click", () => next());
}

// ---------- deterministic in-wizard "stuck on a step" helper ----------
// Native <details> accordion mirroring the downloaded booklet, fully localized
// from the existing pdf.cl.* / tr.* strings. No JS wiring, no backend, no cost.
function renderStepHelp(data, fees) {
  const e = escapeHtml;
  const list = items => `<ul class="help-list">${items.map(i => `<li>${e(i)}</li>`).join("")}</ul>`;
  const p = (txt, cls) => `<p${cls ? ` class="${cls}"` : ""}>${e(txt)}</p>`;
  const note = (kind, title, body) =>
    `<div class="banner ${kind}" style="margin:0.6rem 0;">${title ? `<strong>${e(title)}</strong> ` : ""}${e(body)}</div>`;
  const bank = (title, rows) =>
    `<div class="help-bank"><div class="help-bank-title">${e(title)}</div>${
      rows.map(([l, v]) => `<div class="help-bank-row"><span>${e(l)}</span><strong>${e(v)}</strong></div>`).join("")
    }</div>`;
  const step = (n, title, inner) =>
    `<details class="help-step"><summary><span class="help-step-n">${n}</span>${e(title)}</summary><div class="help-step-body">${inner}</div></details>`;

  const ownerLabel = data.owner_type === "company"
    ? (data.company_name || "[your company]")
    : (data.owner_name || "[your name]");
  const intl = t("pdf.cl.intl_note");

  // Step 2 documents
  const docs2 = [
    t("pdf.cl.s2.d1"), t("pdf.cl.s2.d2"),
    tf("pdf.cl.s2.d3", { ref: data.catastral_reference || "[your reference]" }),
    t("pdf.cl.s2.d4"),
  ];
  if (data.owner_type === "company") docs2.push(t("pdf.cl.s2.d_company"));
  // Step 7 documents
  const docs7 = [
    t("pdf.cl.s7.fd1"), t("pdf.cl.s7.fd2"), t("pdf.cl.s7.fd3"), t("pdf.cl.s7.fd4"),
    t("pdf.cl.s7.fd5"), t("pdf.cl.s7.fd6"), t("pdf.cl.s7.fd7"), t("pdf.cl.s7.fd8"),
  ];
  if (data.owner_type === "company") { docs7.push(t("pdf.cl.s7.fd_company1")); docs7.push(t("pdf.cl.s7.fd_company2")); }

  const steps = [
    step(1, t("pdf.cl.s1.title"),
      p(t("pdf.cl.find_file") + " 01-form-to-sign.pdf") + p(t("pdf.cl.do_in_order")) +
      list([t("pdf.cl.s1.b1"), t("pdf.cl.s1.b2"), t("pdf.cl.s1.b3"), t("pdf.cl.s1.b4"), t("pdf.cl.s1.b5"), t("pdf.cl.s1.b6")]) +
      note("ok", t("pdf.cl.done"), t("pdf.cl.s1.done"))),
    step(2, t("pdf.cl.s2.title"),
      p(t("pdf.cl.s2.intro")) + list(docs2) + note("ok", t("pdf.cl.done"), t("pdf.cl.s2.done"))),
    step(3, t("pdf.cl.s3.title"),
      p(t("pdf.cl.find_file_folder") + " 03-first-email.pdf") + p(t("pdf.cl.do_in_order")) +
      list([t("pdf.cl.s3.b1"), t("pdf.cl.s3.b2"), t("pdf.cl.s3.b3"), t("pdf.cl.s3.b4"), t("pdf.cl.s3.b5"), t("pdf.cl.s3.b6")]) +
      note("info", t("pdf.cl.s3.wait_title"), t("pdf.cl.s3.wait_body")) + note("ok", t("pdf.cl.done"), t("pdf.cl.s3.done"))),
    step(4, t("pdf.cl.s4.title"),
      p(t("pdf.cl.s4.intro")) + p(t("pdf.cl.amount_to_pay")) +
      `<div class="help-amount">${e(fmtEUR(fees.license_fee))}</div>` +
      bank(t("pdf.cl.s4.bank_title"), [
        [t("pdf.cl.bank.name"), "Unicaja Banco"],
        [t("pdf.cl.bank.account"), "ES59 2103 1001 5702 3000 0222"],
        [t("pdf.cl.bank.intl"), "UCJAES2M  " + intl],
        [t("pdf.cl.bank.concept"), tf("pdf.cl.s4.concept", { owner: ownerLabel })],
      ]) +
      note("info", t("pdf.cl.s4.where_title"), t("pdf.cl.s4.where_body")) +
      note("warn", t("pdf.cl.keep_receipt_title"), t("pdf.cl.s4.keep_receipt_body")) +
      note("ok", t("pdf.cl.done"), t("pdf.cl.s4.done"))),
    step(5, t("pdf.cl.s5.title"),
      p(t("pdf.cl.s5.intro")) + p(t("pdf.cl.amount_to_pay")) +
      `<div class="help-amount">${e(fmtEUR(fees.waste_deposit))}</div>` +
      p(tf("pdf.cl.s5.calc", { formula: fees.waste_formula })) +
      bank(t("pdf.cl.s5.bank_title"), [
        [t("pdf.cl.bank.name"), "BBVA"],
        [t("pdf.cl.bank.holder"), "Ayuntamiento de Marbella"],
        [t("pdf.cl.bank.account"), "ES73 0182 5918 4502 0150 6063"],
        [t("pdf.cl.bank.intl"), "BBVAESMMXXX  " + intl],
        [t("pdf.cl.bank.concept"), `"Fianza ${fees.waste_deposit.toLocaleString("es-ES")} € — ${data.property_address || "[your address]"}"`],
      ]) +
      note("warn", t("pdf.cl.keep_receipt_title"), t("pdf.cl.s5.keep_receipt_body")) +
      note("ok", t("pdf.cl.done"), t("pdf.cl.s5.done"))),
    step(6, t("pdf.cl.s6.title"),
      p(t("pdf.cl.s6.intro")) + p(t("pdf.cl.find_file_short") + " 04-second-email.pdf") + p(t("pdf.cl.do_in_order")) +
      list([t("pdf.cl.s6.b1"), t("pdf.cl.s6.b2"), t("pdf.cl.s6.b3"), t("pdf.cl.s6.b4"), t("pdf.cl.s6.b5")]) +
      note("ok", t("pdf.cl.done"), t("pdf.cl.s6.done"))),
    step(7, t("pdf.cl.s7.title"),
      note("warn", t("pdf.cl.s7.need_title"), t("pdf.cl.s7.need_body")) +
      p(t("pdf.cl.s7.ready")) +
      list([t("pdf.cl.s7.b1"), t("pdf.cl.s7.b2"), t("pdf.cl.s7.b3"), t("pdf.cl.s7.b4"), t("pdf.cl.s7.b5"), t("pdf.cl.s7.b6"), t("pdf.cl.s7.b7")]) +
      note("error", t("pdf.cl.s7.dept_title"), t("pdf.cl.s7.dept_body")) +
      p(t("pdf.cl.s7.attach")) + list(docs7) +
      p(t("pdf.cl.s7.submit")) +
      note("ok", t("pdf.cl.s7.proof_title"), t("pdf.cl.s7.proof_body")) +
      p(t("pdf.cl.s7.youre_done"))),
  ].join("");

  const trouble = step("!", t("pdf.cl.tr.header"),
    `<p><strong>${e(t("pdf.cl.tr.h1"))}</strong></p>` + p(t("pdf.cl.tr.b1")) +
    `<p><strong>${e(t("pdf.cl.tr.h2"))}</strong></p>` + p(t("pdf.cl.tr.b2")) +
    `<p><strong>${e(t("pdf.cl.tr.h3"))}</strong></p>` + p(t("pdf.cl.tr.b3")) +
    `<p><strong>${e(t("pdf.cl.tr.h4"))}</strong></p>` + p(t("pdf.cl.tr.b4")) +
    note("info", "", t("pdf.cl.help")));

  // Self-contained styles so the helper renders correctly even if a stale app.css
  // is deployed. Identical to the .help-* rules in app.css; harmless if both load.
  const HELP_CSS = `<style>
  .help-panel{border:1px solid var(--mp-rule,#E6E2DC);border-radius:6px;background:var(--mp-paper,#FAF8F4);margin:1.5rem 0;overflow:hidden}
  .help-panel>summary{cursor:pointer;padding:1rem 1.25rem;font-weight:600;font-family:var(--mp-serif,Georgia,serif);font-size:1.05rem;list-style:none;display:flex;align-items:center;gap:.55rem}
  .help-panel>summary::-webkit-details-marker{display:none}
  .help-panel>summary::before{content:"\\25B8";color:var(--mp-terracotta,#C8512C)}
  .help-panel[open]>summary::before{content:"\\25BE"}
  .help-panel-intro{padding:0 1.25rem .75rem;color:var(--mp-ink-2,#3A3A3A);font-size:.9rem}
  .help-steps{padding:0 1.25rem 1.25rem}
  .help-step{border:1px solid var(--mp-rule,#E6E2DC);border-radius:4px;background:var(--mp-paper-2,#fff);margin-bottom:.5rem}
  .help-step>summary{cursor:pointer;padding:.75rem 1rem;font-weight:500;list-style:none;display:flex;align-items:center;gap:.6rem}
  .help-step>summary::-webkit-details-marker{display:none}
  .help-step>summary::before{content:"+";color:var(--mp-terracotta,#C8512C);font-weight:700;width:.9rem;display:inline-block;text-align:center}
  .help-step[open]>summary::before{content:"\\2013"}
  .help-step-n{font-family:var(--mp-serif,Georgia,serif);font-weight:700;color:var(--mp-terracotta,#C8512C);min-width:1.1rem}
  .help-step-body{padding:.25rem 1rem 1rem;font-size:.92rem;color:var(--mp-ink-2,#3A3A3A)}
  .help-step-body p{margin:.5rem 0}
  .help-list{margin:.4rem 0;padding-left:1.25rem}.help-list li{margin-bottom:.3rem}
  .help-bank{background:var(--mp-paper,#FAF8F4);border:1px solid var(--mp-rule,#E6E2DC);border-left:3px solid var(--mp-terracotta,#C8512C);border-radius:4px;padding:.75rem 1rem;margin:.6rem 0}
  .help-bank-title{font-weight:600;margin-bottom:.4rem}
  .help-bank-row{display:flex;justify-content:space-between;gap:1rem;font-size:.88rem;padding:.15rem 0}
  .help-bank-row span{color:var(--mp-mute,#6B6B6B)}.help-bank-row strong{text-align:right;word-break:break-word}
  .help-amount{font-family:var(--mp-serif,Georgia,serif);font-size:1.3rem;font-weight:700;color:var(--mp-terracotta,#C8512C);margin:.3rem 0}
  </style>`;
  // Inline "Ask" button — only when the AI assistant is actually configured/loaded.
  const askBtn = (typeof window !== "undefined" && typeof window.mpAssistantOpen === "function")
    ? `<button type="button" class="btn btn-ghost" id="mpa-inline" style="margin:0 0 .5rem;">💬 ${e(t("wiz.help.ask", "Ask about your permit"))}</button>`
    : "";

  return `
    ${HELP_CSS}
    ${askBtn}
    <details class="help-panel" open>
      <summary>${e(t("wiz.help.panel_title", "Stuck on a step? Open the step-by-step helper"))}</summary>
      <div class="help-panel-intro">${e(t("wiz.help.intro", "Click a step to open it. This is the same guide as your downloaded PDF. If you're still stuck after reading, call or email us."))}</div>
      <div class="help-steps">${steps}${trouble}</div>
    </details>
  `;
}

function renderDossier(c) {
  const exempt = !!state.data._exempt;
  const fees = exempt ? null : calculateFees(state.data);
  const dr = exempt ? null : generateDR(state.data, fees);

  if (exempt) {
    c.innerHTML = `
      ${renderStepper()}
      <div class="card">
        <h1>${t("wiz.exempt.title")}</h1>
        <p class="subtitle">${t("wiz.exempt.subtitle")}</p>

        <div class="banner ok">
          ${t("wiz.exempt.pack_banner")}
        </div>

        <div class="dossier-list">
          <ul>
            <li>${t("wiz.exempt.f01")}</li>
            <li>${t("wiz.exempt.f02")}</li>
          </ul>
        </div>

        <div class="action-row" style="justify-content: flex-start;">
          <button class="btn btn-primary" id="download-btn">${t("wiz.exempt.download")}</button>
        </div>

        <div class="banner info" style="margin-top: 2rem;">
          ${t("wiz.exempt.heads_up")}
        </div>

        <div class="action-row">
          <button class="btn btn-ghost" id="back-btn">${t("wiz.exempt.back")}</button>
          <button class="btn btn-ghost" id="reset-btn">${t("wiz.dos.startover")}</button>
        </div>
      </div>
    `;
    $("#download-btn").addEventListener("click", () => downloadExemptDossier(state.data));
    $("#back-btn").addEventListener("click", () => navigate("eligibility"));
    $("#reset-btn").addEventListener("click", () => {
      if (confirm(t("wiz.dos.startover_confirm"))) resetState();
    });
    return;
  }

  const checklist = generateChecklistEN(state.data, fees);

  c.innerHTML = `
    ${renderStepper()}
    <div class="card">
      <h1>${t("wiz.dos.title")}</h1>
      <p class="subtitle">${t("wiz.dos.subtitle")}</p>

      <div class="banner ok">
        ${t("wiz.dos.pack_banner")}
      </div>

      <div class="dossier-list">
        <ul>
          <li>${t("wiz.dos.f00")}</li>
          <li>${t("wiz.dos.f01")}</li>
          <li>${t("wiz.dos.f02")}</li>
          <li>${t("wiz.dos.f03")}</li>
          <li>${t("wiz.dos.f04")}</li>
          <li>${t("wiz.dos.f05")}</li>
        </ul>
      </div>

      <div class="action-row" style="justify-content: flex-start;">
        <button class="btn btn-primary" id="download-btn">${t("wiz.dos.download")}</button>
        <button class="btn btn-ghost" id="preview-btn">${t("wiz.dos.preview")}</button>
      </div>

      <div id="dr-preview" style="display: none; margin-top: 1.5rem;">
        <h3 style="margin-bottom: 0.5rem;">${t("wiz.dos.preview_title")}</h3>
        <pre class="preview">${escapeHtml(dr.body)}</pre>
      </div>

      ${renderStepHelp(state.data, fees)}

      <div class="banner info" style="margin-top: 2rem;">
        <strong>${t("wiz.dos.next_title")}</strong>${t("wiz.dos.next_body")}
      </div>

      <div class="action-row">
        <button class="btn btn-ghost" id="back-btn">${t("wiz.dos.back")}</button>
        <button class="btn btn-ghost" id="reset-btn">${t("wiz.dos.startover")}</button>
      </div>
    </div>
  `;

  $("#download-btn").addEventListener("click", () => downloadDossier(state.data, fees));
  $("#preview-btn").addEventListener("click", () => {
    const el = $("#dr-preview");
    el.style.display = el.style.display === "none" ? "block" : "none";
  });
  $("#back-btn").addEventListener("click", () => prev());
  $("#reset-btn").addEventListener("click", () => {
    if (confirm(t("wiz.dos.startover_confirm"))) resetState();
  });
  const askInline = $("#mpa-inline");
  if (askInline) askInline.addEventListener("click", () => { if (window.mpAssistantOpen) window.mpAssistantOpen(); });
}

// ---------- dossier packaging ----------
function newPdf() {
  const { jsPDF } = window.jspdf;
  return new jsPDF({ unit: "mm", format: "a4" });
}

function pdfBlob(pdf) { return pdf.output("blob"); }

// ----- 00: Start-here cover -----
function renderStartHere(data, fees) {
  const pdf = newPdf();
  const b = new PdfBuilder(pdf);
  b.pageHeader("00 · Start here");
  b.spacer(8);
  b.eyebrow("Your Marbella renovation permit");
  b.title("Open file 06 next. It walks you through everything.");
  b.body("This pack contains 7 files. One of them — file 06 — is your step-by-step guide. The other 6 are the documents you'll need at each step. Open file 06 first.", { size: 12 });

  b.h3("What you'll do");
  b.bullet([
    "Print and sign one form (10 minutes)",
    "Send two short emails to the town hall (5 minutes)",
    "Make two bank transfers when the town hall sends you the bills (15 minutes)",
    "Upload everything to the town hall's online system (20 minutes)",
  ]);
  b.body("Total time: about 1 hour of your attention, spread over 2 weeks while the town hall replies.", { italic: true });

  b.h3("Your project");
  b.table([
    ["Property",      data.property_address || "—"],
    ["Owner",         data.owner_name || "—"],
    ["Reference",     data.catastral_reference || "—"],
    ["What",          data.project_type ? (data.project_type.replace(/_/g, " ")) : "—"],
    ["Cost of work",  `€${Number(data.budget_eur || 0).toLocaleString("en-GB")}`],
  ]);

  b.callout("If you get stuck",
    "Call +34 690 380 502 or email hello@marbellapermits.com. Don't try to figure it out alone if something is confusing — most of the things that go wrong are easy to fix if you ask early.",
    "info");

  b.h3("The 7 files in this pack");
  b.bullet([
    "00-start-here.pdf — this page (cover)",
    "01-declaracion-responsable.pdf — the official form to print and sign",
    "02-presupuesto.pdf — the cost breakdown (in Spanish, that's normal)",
    "03-email-licencia.pdf — first email to copy and send",
    "04-email-residuos.pdf — second email to copy and send",
    "05-carta-autorizacion.pdf — permission letter (only if someone else submits for you)",
    "06-checklist-en.pdf — your main step-by-step guide. OPEN THIS NEXT.",
  ]);

  b.callout("One thing to know",
    "We are not lawyers or gestores. We give you the documents and instructions. You sign them and submit them. That's the line.",
    "warn");

  b.pageFooter();
  return pdfBlob(pdf);
}

// ----- 01: Declaración Responsable -----
function renderDR(data, fees) {
  const pdf = newPdf();
  const b = new PdfBuilder(pdf);
  b.pageHeader("01 · Declaración Responsable");
  b.spacer(4);

  // Title
  b.pdf.setFont("helvetica", "bold"); b.pdf.setFontSize(15);
  b.pdf.setTextColor(...PDF_BRAND.ink);
  b.pdf.text("DECLARACIÓN RESPONSABLE PARA EJECUCIÓN DE OBRAS", b.marginL, b.y + 7, { maxWidth: b.contentW });
  b.y += 16;
  b.pdf.setFont("helvetica", "normal"); b.pdf.setFontSize(9);
  b.pdf.setTextColor(...PDF_BRAND.mute);
  b.pdf.text("Excmo. Ayuntamiento de Marbella · DIR3: LA0013641 — LICENCIAS", b.marginL, b.y + 3);
  b.y += 5;
  b.pdf.text("Delegación de Ordenación del Territorio, Vivienda y Urbanizaciones", b.marginL, b.y + 3);
  b.y += 5;
  b.pdf.text("Actuaciones incluidas en el art. 169 bis.1.a) y b) de la Ley 7/2002, de 17 de diciembre.",
    b.marginL, b.y + 3);
  b.y += 10;

  // DECLARANTE
  b.h2("Declarante");
  const declarante = data.owner_type === "company"
    ? data.company_name || "[Company name]"
    : data.owner_name || "[Full name]";
  b.table([
    ["Nombre / razón social", declarante],
    ["Teléfono",              data.phone || "[Phone]"],
    ["DNI / NIE / NIF",       data.owner_type === "company" ? (data.company_cif || "[CIF]") : (data.owner_id || "[DNI/NIE]")],
    ...(data.owner_type === "company" ? [
      ["Representante",       data.owner_name || "[Administrador]"],
      ["DNI / NIE",           data.owner_id || ""],
    ] : []),
    ["Domicilio",             data.property_address || "[Property address]"],
    ["Localidad",             "Marbella · 29600 · Málaga"],
    ["Correo electrónico",    data.owner_email || "[Email]"],
  ]);
  b.body("Preferencias de notificación:  [X] Medios electrónicos    [ ] Soporte papel");

  // DATOS DE LA OBRA
  b.h2("Datos de la obra");
  b.table([
    ["Dirección",         data.property_address || "[Property address]"],
    ["Ref. catastral",    data.catastral_reference || "[Catastral reference]"],
    ["PEM (sin IVA)",     `€${Number(fees.pem).toLocaleString("es-ES")}`],
    ["Cambio de uso",     "[ ] Sí    [X] No"],
  ]);
  b.h3("Descripción de la obra");
  const desc = (typeof PROJECT_TYPE_ES !== "undefined" && PROJECT_TYPE_ES[data.project_type]) || "[Descripción]";
  b.body(desc);
  if (data.project_description) {
    b.body("Detalle adicional aportado por el promotor:", { italic: true, color: "mute" });
    b.body(data.project_description);
  }

  // SECCIÓN A
  b.h2("Sección A — Obras que NO requieren documentación técnica");
  const codes = (typeof getSectionACodes === "function") ? getSectionACodes(data.project_type) : [];
  if (codes.length) {
    b.body("Marcar el/los apartado(s) que corresponden a la actuación:", { italic: true });
    for (const code of codes) {
      const description = (typeof SECTION_A_DESCRIPTIONS !== "undefined") ? (SECTION_A_DESCRIPTIONS[code] || "") : "";
      b.callout(`[X] ${code}`, description, "ok");
    }
  } else {
    b.callout("Atención", "Marcar manualmente el código de la actuación en la sección A del impreso oficial.", "warn");
  }

  // DOCUMENTACIÓN ADMINISTRATIVA
  b.h2("Documentación administrativa aportada");
  b.checklist([
    "Documentación que acredita la personalidad del declarante",
    "Documento justificativo del abono de la Tasa por Licencia Urbanística",
    "Documento justificativo del abono del ICIO",
    "Aval / fianza para la gestión de residuos de la construcción",
  ]);

  // DECLARACIÓN RESPONSABLE
  b.h2("Declaración responsable");
  b.body("El abajo firmante DECLARA BAJO SU RESPONSABILIDAD que los datos reseñados son ciertos, así como todos los documentos que se adjuntan, y específicamente:");
  b.h3("Primero");
  b.body("Que las obras se encuentran entre las definidas en el art. 169 bis.1.a) de la Ley 7/2002, siendo obras de escasa entidad constructiva y sencillez técnica, y NO requieren proyecto según lo previsto en la Ley de Ordenación de la Edificación.");
  b.h3("Segundo");
  b.body("Que las obras cumplen las determinaciones y requisitos del planeamiento aplicable. Situación de la edificación: [X] Legal, cumpliendo la Normativa de aplicación.");
  b.h3("Cuarto");
  b.body("[X] Que la edificación NO se encuentra catalogada ni dispone de protección de carácter ambiental o histórico-artístico.");
  b.h3("Quinto");
  b.body("Que me comprometo a ejecutar las obras (o exigir a quien las ejecute) el cumplimiento de la legislación vigente en materia de prevención de riesgos laborales y gestión de residuos.");

  b.h2("Consentimiento de protección de datos");
  b.body("[X] AUTORIZO al Ayuntamiento de Marbella a consultar o recabar documentos e información que estime oportunos en relación a este procedimiento.");

  b.h2("Firma");
  const today = new Date().toLocaleDateString("es-ES", {day: "2-digit", month: "long", year: "numeric"});
  b.body(`En Marbella, a ${today}.`);
  b.signatureBox(`Fdo.: ${data.owner_name || "[Owner]"}` + (data.owner_type === "company" ? ` · Por ${data.company_name || ""} (CIF ${data.company_cif || ""})` : ""));
  b.body("Sr/a. Alcalde/sa del Excmo. Ayuntamiento de Marbella", { italic: true, color: "mute" });

  b.pageFooter("01 · Declaración Responsable · Marbella Permits");
  return pdfBlob(pdf);
}

// ----- 02: Presupuesto -----
function renderPresupuesto(data, fees) {
  const pdf = newPdf();
  const b = new PdfBuilder(pdf);
  b.pageHeader("02 · Presupuesto");
  b.spacer(4);
  b.title("Presupuesto de Ejecución Material");
  b.body("Sin IVA · En español · Para presentar con la Declaración Responsable", { italic: true, color: "mute" });
  b.spacer(2);

  b.h3("Datos del proyecto");
  b.table([
    ["Promotor",       data.owner_name || "[Promotor]"],
    ...(data.owner_type === "company" ? [["Empresa", `${data.company_name || ""}  (CIF ${data.company_cif || ""})`]] : []),
    ["Inmueble",       data.property_address || ""],
    ["Ref. catastral", data.catastral_reference || ""],
    ["Fecha",          new Date().toLocaleDateString("es-ES")],
  ]);

  b.h3("Desglose");
  // mini table
  const rows = [];
  if (Number(data.demolition_pct) > 0) {
    rows.push(["Demoliciones y retirada de escombros", `€${fees.demolition_eur.toLocaleString("es-ES")}`]);
  }
  const desc = (typeof PROJECT_TYPE_ES !== "undefined" && PROJECT_TYPE_ES[data.project_type]) || "Obras";
  rows.push([desc, `€${fees.rest_eur.toLocaleString("es-ES")}`]);
  b.table(rows.map(([l, v]) => [l, v]).slice(0));

  b.hr();
  b.pdf.setFont("helvetica", "bold"); b.pdf.setFontSize(12);
  b.pdf.setTextColor(...PDF_BRAND.terracotta);
  b.pdf.text(`TOTAL PEM (sin IVA): €${fees.pem.toLocaleString("es-ES")}`, b.marginL, b.y + 6);
  b.y += 12;

  b.callout(t("pdf.presu.note_title"), t("pdf.presu.note_body"), "info");

  b.signatureBox(`Firmado por: ${data.owner_name || "[Promotor]"} · ${new Date().toLocaleDateString("es-ES")}`);
  b.pageFooter("02 · Presupuesto · Marbella Permits");
  return pdfBlob(pdf);
}

// ----- 03/04: Emails as styled PDFs -----
function renderEmailPdf(emailObj, fileLabel, instructions) {
  const pdf = newPdf();
  const b = new PdfBuilder(pdf);
  b.pageHeader(fileLabel);
  b.spacer(4);
  b.title(t("pdf.email.title"));
  b.body(instructions, { color: "mute", italic: true });
  b.spacer(2);
  b.emailHeader(emailObj.to, emailObj.subject);
  b.spacer(2);
  b.h3(t("pdf.email.body_label"));
  b.emailBody(emailObj.body);
  b.callout(t("pdf.email.before_title"), t("pdf.email.before_body"), "info");
  b.pageFooter(`${fileLabel} · Marbella Permits`);
  return pdfBlob(pdf);
}

// ----- 05: Carta de Autorización -----
function renderCartaAutorizacion(data) {
  const pdf = newPdf();
  const b = new PdfBuilder(pdf);
  b.pageHeader("05 · Carta de Autorización");
  b.spacer(4);
  b.callout(t("pdf.carta.when_title"), t("pdf.carta.when_body"), "info");

  b.pdf.setFont("helvetica", "normal"); b.pdf.setFontSize(10);
  b.pdf.setTextColor(...PDF_BRAND.mute);
  const today = new Date().toLocaleDateString("es-ES", {day: "numeric", month: "long", year: "numeric"});
  b.pdf.text(today, b.pageW - b.marginR, b.y + 3, { align: "right" });
  b.y += 8;

  b.pdf.setFont("helvetica", "bold"); b.pdf.setFontSize(16);
  b.pdf.setTextColor(...PDF_BRAND.ink);
  b.pdf.text("Carta de Autorización", b.pageW / 2, b.y + 8, { align: "center" });
  b.y += 16;

  const idLabel = (data.owner_id || "").toUpperCase().startsWith("X") ? "NIE" :
                  /^\d/.test(data.owner_id || "") ? "DNI" : "pasaporte";
  const ownerNoun = data.owner_type === "company" ? "como administrador de" : "como propietario/a del inmueble";
  const ownerEntity = data.owner_type === "company"
    ? `${data.company_name || "[Empresa]"} con NIF ${data.company_cif || "[NIF]"}`
    : `situado en ${data.property_address || "[Dirección]"}`;
  const paragraph = `Yo D./Dña. ${data.owner_name || "[Owner full name]"} con número de ${idLabel} ${data.owner_id || "[ID]"}, ${ownerNoun} ${ownerEntity}, autorizo a [Nombre del representante autorizado] con NIE/DNI [NIE/DNI del representante] a representar a ${data.owner_type === "company" ? (data.company_name || "[Empresa]") : "mi persona"} en nombre de la solicitud de la licencia de Declaración Responsable y a gestionar todas las comunicaciones con el Ayuntamiento de Marbella.`;
  b.body(paragraph, { size: 11 });

  b.signatureBox(`Fdo.: ${data.owner_name || "[Owner]"}` + (data.owner_type === "company" ? ` · ${data.company_name || ""}` : ""));

  b.callout(t("pdf.carta.brackets_title"), t("pdf.carta.brackets_body"), "warn");

  b.pageFooter("05 · Carta de Autorización · Marbella Permits");
  return pdfBlob(pdf);
}

// ----- 06: Checklist (the big one) — IKEA-simple instruction book -----
function renderChecklist(data, fees) {
  const pdf = newPdf();
  const b = new PdfBuilder(pdf);
  // Slight body-size bump for older readers.
  const BODY = { size: 11 };
  const HELP_LINE = t("pdf.cl.help");
  const ownerLabel = data.owner_type === "company"
    ? (data.company_name || "[your company]")
    : (data.owner_name || "[your name]");

  // ============= COVER PAGE =============
  b.pageHeader(t("pdf.cl.header"));
  b.spacer(4);
  b.eyebrow(t("pdf.cl.eyebrow"));
  b.title(t("pdf.cl.title"));
  b.body(t("pdf.cl.intro"), BODY);
  b.body(t("pdf.cl.intro2"), { ...BODY, italic: true, color: "mute" });

  b.h3(t("pdf.cl.your_project"));
  b.table([
    [t("pdf.cl.tbl.property"), data.property_address || "—"],
    [t("pdf.cl.tbl.what"),     projectTypeLabel(data.project_type)],
    [t("pdf.cl.tbl.cost"),     `€${Number(data.budget_eur || 0).toLocaleString("en-GB")}`],
  ]);

  b.h3(t("pdf.cl.next2weeks"));
  b.bullet([
    t("pdf.cl.tl1"),
    t("pdf.cl.tl2"),
    t("pdf.cl.tl3"),
    t("pdf.cl.tl4"),
  ]);
  b.body(t("pdf.cl.total_attention"), BODY);

  b.callout(t("pdf.cl.steps_callout_title"), t("pdf.cl.steps_callout_body"), "info");

  b.callout(t("pdf.cl.rule_title"), t("pdf.cl.rule_body"), "warn");

  b.body(HELP_LINE, { italic: true, color: "mute" });

  // ============= STEP 1 =============
  b.newPage(); b.pageHeader(tf("pdf.cl.step_of", { n: 1, total: 7 }));
  b.stepNumber(1, t("pdf.cl.s1.title"));
  b.spacer(2);
  b.body(t("pdf.cl.find_file"), BODY);
  b.body("01-form-to-sign.pdf", { bold: true, size: 13 });

  b.spacer(2);
  b.body(t("pdf.cl.do_in_order"), BODY);
  b.bullet([
    t("pdf.cl.s1.b1"),
    t("pdf.cl.s1.b2"),
    t("pdf.cl.s1.b3"),
    t("pdf.cl.s1.b4"),
    t("pdf.cl.s1.b5"),
    t("pdf.cl.s1.b6"),
  ]);

  b.callout(t("pdf.cl.done"), t("pdf.cl.s1.done"), "ok");

  // ============= STEP 2 =============
  b.newPage(); b.pageHeader(tf("pdf.cl.step_of", { n: 2, total: 7 }));
  b.stepNumber(2, t("pdf.cl.s2.title"));
  b.spacer(2);
  b.body(t("pdf.cl.s2.intro"), BODY);
  b.spacer(2);
  const docs = [
    t("pdf.cl.s2.d1"),
    t("pdf.cl.s2.d2"),
    tf("pdf.cl.s2.d3", { ref: data.catastral_reference || "[your reference]" }),
    t("pdf.cl.s2.d4"),
  ];
  if (data.owner_type === "company") {
    docs.push(t("pdf.cl.s2.d_company"));
  }
  b.checklist(docs);

  b.callout(t("pdf.cl.done"), t("pdf.cl.s2.done"), "ok");

  // ============= STEP 3 =============
  b.newPage(); b.pageHeader(tf("pdf.cl.step_of", { n: 3, total: 7 }));
  b.stepNumber(3, t("pdf.cl.s3.title"));
  b.spacer(2);
  b.body(t("pdf.cl.find_file_folder"), BODY);
  b.body("03-first-email.pdf", { bold: true, size: 13 });

  b.body(t("pdf.cl.do_in_order"), BODY);
  b.bullet([
    t("pdf.cl.s3.b1"),
    t("pdf.cl.s3.b2"),
    t("pdf.cl.s3.b3"),
    t("pdf.cl.s3.b4"),
    t("pdf.cl.s3.b5"),
    t("pdf.cl.s3.b6"),
  ]);

  b.callout(t("pdf.cl.s3.wait_title"), t("pdf.cl.s3.wait_body"), "info");

  b.callout(t("pdf.cl.done"), t("pdf.cl.s3.done"), "ok");

  // ============= STEP 4 =============
  b.newPage(); b.pageHeader(tf("pdf.cl.step_of", { n: 4, total: 7 }));
  b.stepNumber(4, t("pdf.cl.s4.title"));
  b.spacer(2);
  b.body(t("pdf.cl.s4.intro"), BODY);

  b.body(t("pdf.cl.amount_to_pay"), BODY);
  b.body(`€${fees.license_fee.toLocaleString("en-GB")}`, { bold: true, size: 16, color: "terracotta" });

  b.body(t("pdf.cl.s4.bank_intro"), BODY);
  b.bankCard({
    title: t("pdf.cl.s4.bank_title"),
    rows: [
      [t("pdf.cl.bank.name"),    "Unicaja Banco"],
      [t("pdf.cl.bank.account"), "ES59 2103 1001 5702 3000 0222"],
      [t("pdf.cl.bank.intl"),    "UCJAES2M  " + t("pdf.cl.intl_note")],
      [t("pdf.cl.bank.concept"), tf("pdf.cl.s4.concept", { owner: ownerLabel })],
    ],
  });

  b.callout(t("pdf.cl.s4.where_title"), t("pdf.cl.s4.where_body"), "info");

  b.callout(t("pdf.cl.keep_receipt_title"), t("pdf.cl.s4.keep_receipt_body"), "warn");

  b.callout(t("pdf.cl.done"), t("pdf.cl.s4.done"), "ok");

  // ============= STEP 5 =============
  b.newPage(); b.pageHeader(tf("pdf.cl.step_of", { n: 5, total: 7 }));
  b.stepNumber(5, t("pdf.cl.s5.title"));
  b.spacer(2);
  b.body(t("pdf.cl.s5.intro"), BODY);

  b.body(t("pdf.cl.amount_to_pay"), BODY);
  b.body(`€${fees.waste_deposit.toLocaleString("en-GB")}`, { bold: true, size: 16, color: "terracotta" });
  b.body(tf("pdf.cl.s5.calc", { formula: fees.waste_formula }), { size: 9, color: "mute" });

  b.body(t("pdf.cl.s5.bank_intro"), BODY);
  b.bankCard({
    title: t("pdf.cl.s5.bank_title"),
    rows: [
      [t("pdf.cl.bank.name"),    "BBVA"],
      [t("pdf.cl.bank.holder"),  "Ayuntamiento de Marbella"],
      [t("pdf.cl.bank.account"), "ES73 0182 5918 4502 0150 6063"],
      [t("pdf.cl.bank.intl"),    "BBVAESMMXXX  " + t("pdf.cl.intl_note")],
      [t("pdf.cl.bank.concept"), `"Fianza ${fees.waste_deposit.toLocaleString("es-ES")} € — ${data.property_address || "[your address]"}"`],
    ],
  });

  b.callout(t("pdf.cl.keep_receipt_title"), t("pdf.cl.s5.keep_receipt_body"), "warn");

  b.callout(t("pdf.cl.done"), t("pdf.cl.s5.done"), "ok");

  // ============= STEP 6 =============
  b.newPage(); b.pageHeader(tf("pdf.cl.step_of", { n: 6, total: 7 }));
  b.stepNumber(6, t("pdf.cl.s6.title"));
  b.spacer(2);
  b.body(t("pdf.cl.s6.intro"), BODY);

  b.body(t("pdf.cl.find_file_short"), BODY);
  b.body("04-second-email.pdf", { bold: true, size: 13 });

  b.body(t("pdf.cl.do_in_order"), BODY);
  b.bullet([
    t("pdf.cl.s6.b1"),
    t("pdf.cl.s6.b2"),
    t("pdf.cl.s6.b3"),
    t("pdf.cl.s6.b4"),
    t("pdf.cl.s6.b5"),
  ]);

  b.callout(t("pdf.cl.done"), t("pdf.cl.s6.done"), "ok");

  // ============= STEP 7 =============
  b.newPage(); b.pageHeader(tf("pdf.cl.step_of", { n: 7, total: 7 }));
  b.stepNumber(7, t("pdf.cl.s7.title"));
  b.spacer(2);

  b.callout(t("pdf.cl.s7.need_title"), t("pdf.cl.s7.need_body"), "warn");

  b.body(t("pdf.cl.s7.ready"), BODY);
  b.bullet([
    t("pdf.cl.s7.b1"),
    t("pdf.cl.s7.b2"),
    t("pdf.cl.s7.b3"),
    t("pdf.cl.s7.b4"),
    t("pdf.cl.s7.b5"),
    t("pdf.cl.s7.b6"),
    t("pdf.cl.s7.b7"),
  ]);

  b.callout(t("pdf.cl.s7.dept_title"), t("pdf.cl.s7.dept_body"), "error");

  b.body(t("pdf.cl.s7.attach"), BODY);
  const finalDocs = [
    t("pdf.cl.s7.fd1"),
    t("pdf.cl.s7.fd2"),
    t("pdf.cl.s7.fd3"),
    t("pdf.cl.s7.fd4"),
    t("pdf.cl.s7.fd5"),
    t("pdf.cl.s7.fd6"),
    t("pdf.cl.s7.fd7"),
    t("pdf.cl.s7.fd8"),
  ];
  if (data.owner_type === "company") {
    finalDocs.push(t("pdf.cl.s7.fd_company1"));
    finalDocs.push(t("pdf.cl.s7.fd_company2"));
  }
  b.checklist(finalDocs);

  b.body(t("pdf.cl.s7.submit"), { bold: true });

  b.callout(t("pdf.cl.s7.proof_title"), t("pdf.cl.s7.proof_body"), "ok");

  b.body(t("pdf.cl.s7.youre_done"), { bold: true, size: 13 });
  b.body(HELP_LINE, { italic: true, color: "mute" });

  // ============= IF SOMETHING GOES WRONG =============
  b.newPage(); b.pageHeader(t("pdf.cl.tr.header"));
  b.h2(t("pdf.cl.tr.header"));
  b.spacer(2);

  b.h3(t("pdf.cl.tr.h1"));
  b.body(t("pdf.cl.tr.b1"), BODY);

  b.h3(t("pdf.cl.tr.h2"));
  b.body(t("pdf.cl.tr.b2"), BODY);

  b.h3(t("pdf.cl.tr.h3"));
  b.body(t("pdf.cl.tr.b3"), BODY);

  b.h3(t("pdf.cl.tr.h4"));
  b.body(t("pdf.cl.tr.b4"), BODY);

  b.spacer(4);
  b.body(tf("pdf.cl.tr.closing", { help: HELP_LINE }), { italic: true });

  // ============= GLOSSARY =============
  b.newPage(); b.pageHeader(t("pdf.cl.gl.header"));
  b.h2(t("pdf.cl.gl.title"));
  b.spacer(2);

  b.body(t("pdf.cl.gl.intro"), BODY);
  b.spacer(2);

  const glossary = [
    ["Ayuntamiento",          t("pdf.cl.gl.ayuntamiento")],
    ["Declaración Responsable", t("pdf.cl.gl.dr")],
    ["Carta de pago",         t("pdf.cl.gl.carta_pago")],
    ["Sede electrónica",      t("pdf.cl.gl.sede")],
    ["Justificante de pago",  t("pdf.cl.gl.justificante")],
    ["Acuse de recibo",       t("pdf.cl.gl.acuse")],
    ["Fianza",                t("pdf.cl.gl.fianza")],
    ["Presupuesto",           t("pdf.cl.gl.presupuesto")],
    ["Plano de situación",    t("pdf.cl.gl.plano")],
    ["NIE",                   t("pdf.cl.gl.nie")],
    ["Subsanación",           t("pdf.cl.gl.subsanacion")],
    ["Requerimiento",         t("pdf.cl.gl.requerimiento")],
    ["Trámite",               t("pdf.cl.gl.tramite")],
    ["Delegación",            t("pdf.cl.gl.delegacion")],
    ["PEM",                   t("pdf.cl.gl.pem")],
    ["ICIO",                  t("pdf.cl.gl.icio")],
    ["Visado",                t("pdf.cl.gl.visado")],
  ];
  for (const [term, def] of glossary) {
    b.pdf.setFont("helvetica", "bold");
    b.pdf.setFontSize(10);
    b.pdf.setTextColor(...PDF_BRAND.ink);
    b._ensure(7);
    b.pdf.text(term, b.marginL, b.y + 4);
    b.pdf.setFont("helvetica", "normal");
    b.pdf.setTextColor(...PDF_BRAND.ink2);
    const defLines = b.pdf.splitTextToSize(def, b.contentW - 55);
    for (let i = 0; i < defLines.length; i++) {
      b.pdf.text(defLines[i], b.marginL + 55, b.y + 4 + i * 5);
    }
    b.y += Math.max(7, defLines.length * 5 + 2);
  }

  b.spacer(4);
  b.body(HELP_LINE, { italic: true, color: "mute" });
  b.pageFooter("Marbella Permits · marbellapermits.com");
  return pdfBlob(pdf);
}


// Generate a self-certification PDF for EXEMPT works (Jan 2026 instruction).
function renderSelfCertification(data) {
  const pdf = newPdf();
  const b = new PdfBuilder(pdf);
  b.pageHeader("01 · Self-certification");
  b.spacer(4);
  b.eyebrow("Marbella · Exempt from prior control");
  b.title("Auto-declaración de obra exenta");
  b.body("Conforme a la instrucción urbanística aprobada por la Junta de Gobierno Local del Excmo. Ayuntamiento de Marbella el 26 de enero de 2026, las obras descritas en este documento se encuentran exentas de control previo (no requieren licencia ni Declaración Responsable) por cumplir los siguientes requisitos: presupuesto inferior a 10.000 €, naturaleza de revestimientos, pintura o instalación interior menor, y ubicación fuera de ámbitos con especial protección.", { color: "ink" });

  b.h3("Datos del declarante");
  b.table([
    ["Nombre", data.owner_name || "[Promotor]"],
    ...(data.owner_type === "company" ? [["Empresa", `${data.company_name || ""}  (CIF ${data.company_cif || ""})`]] : []),
    ["Documento", data.owner_id || ""],
    ["Email", data.owner_email || ""],
  ]);

  b.h3("Inmueble");
  b.table([
    ["Dirección", data.property_address || ""],
    ["Ref. catastral", data.catastral_reference || ""],
  ]);

  b.h3("Descripción de la obra");
  const desc = (typeof PROJECT_TYPE_ES !== "undefined" && PROJECT_TYPE_ES[data.project_type]) || "Obras menores";
  b.body(desc);
  b.body(`Presupuesto declarado: €${Number(data.budget_eur).toLocaleString("es-ES")} (sin IVA).`, { bold: true });

  b.callout("Compromisos del declarante",
    "El firmante se compromete a: (1) ejecutar las obras dentro del alcance declarado; (2) cumplir la legislación de prevención de riesgos laborales y gestión de residuos; (3) iniciar la tramitación correspondiente si el alcance creciera por encima de los umbrales de exención.",
    "info");

  b.signatureBox(`Fdo.: ${data.owner_name || "[Owner]"}  ·  ${new Date().toLocaleDateString("es-ES")}`);
  b.body("Este documento es una auto-declaración del titular. No sustituye a la inspección urbanística ni a la verificación municipal en caso de denuncia o procedimiento de oficio.",
    { italic: true, size: 9, color: "mute" });

  b.pageFooter("01 · Self-certification · Marbella Permits");
  return pdfBlob(pdf);
}

function renderExemptGuide(data) {
  const pdf = newPdf();
  const b = new PdfBuilder(pdf);
  b.pageHeader(t("pdf.eg.header"));
  b.spacer(2);
  b.eyebrow(t("pdf.eg.eyebrow"));
  b.title(t("pdf.eg.title"));
  b.body(t("pdf.eg.intro"), { color: "ink2" });

  b.h2(t("pdf.eg.keep_title"));
  b.checklist([
    t("pdf.eg.keep1"),
    t("pdf.eg.keep2"),
    t("pdf.eg.keep3"),
    t("pdf.eg.keep4"),
  ]);

  b.h2(t("pdf.eg.complaint_title"));
  b.body(t("pdf.eg.complaint_body"));

  b.h2(t("pdf.eg.stops_title"));
  b.callout(t("pdf.eg.stops_callout_title"), t("pdf.eg.stops_callout_body"), "warn");
  b.body(t("pdf.eg.stops_body"));

  b.h2(t("pdf.eg.resale_title"));
  b.body(t("pdf.eg.resale_body"));

  b.pageFooter(t("pdf.eg.footer"));
  return pdfBlob(pdf);
}

async function downloadExemptDossier(data) {
  toast(t("wiz.exempt.toast_generating"));
  const zip = new JSZip();
  zip.file("01-self-certification.pdf", renderSelfCertification(data));
  zip.file("02-what-to-keep.pdf", renderExemptGuide(data));

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `marbella-exempt-${(data.property_address || "case").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  toast(t("wiz.exempt.toast_done"), "success");
}


async function downloadDossier(data, fees) {
  toast(t("wiz.dos.toast_generating"));
  const zip = new JSZip();

  // 00 — The step-by-step instruction book. This IS the cover. Open this first.
  zip.file("00-START-HERE-instructions.pdf", renderChecklist(data, fees));
  // 01 — Declaración Responsable (form to sign)
  zip.file("01-form-to-sign.pdf", renderDR(data, fees));
  // 02 — Presupuesto (cost breakdown)
  zip.file("02-cost-breakdown.pdf", renderPresupuesto(data, fees));
  // 03 — License email
  const licenseEmail = generateLicenseEmail(data, fees);
  zip.file("03-first-email.pdf",
    renderEmailPdf(licenseEmail, t("pdf.email.license_header"), t("pdf.email.license_instr")));
  // 04 — Waste email
  const wasteEmail = generateWasteEmail(data, fees);
  zip.file("04-second-email.pdf",
    renderEmailPdf(wasteEmail, t("pdf.email.waste_header"), t("pdf.email.waste_instr")));
  // 05 — Authorisation letter (optional)
  zip.file("05-permission-letter-optional.pdf", renderCartaAutorizacion(data));

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `marbella-permit-${(data.property_address || "case").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  toast(t("wiz.dos.toast_done"), "success");
}

// ---------- main render ----------
const renderers = {
  welcome: renderWelcome,
  owner: renderOwner,
  property: renderProperty,
  work: renderWork,
  eligibility: renderEligibility,
  fees: renderFees,
  dossier: renderDossier,
};

function render() {
  const c = $("#wizard");
  const fn = renderers[state.step] || renderWelcome;
  fn(c);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", render);
// Render immediately if already loaded
if (document.readyState !== "loading") render();
