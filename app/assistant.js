// Marbella Permits — AI assistant chat widget (frontend).
// Self-contained: floating launcher + chat panel, own styles, 5-language chrome.
// Talks to the backend in assistant-backend/ (Render). Sends the customer's CASE FACTS
// (project type, budget, computed fees, zone flags) but NO identity PII (no name, email,
// NIE, or phone). The 10-question cap is enforced on the server; this also shows a
// friendly local counter.
//
// ⚙️ SET THIS after you deploy the backend to Render, then re-upload this file:
const MP_ASSISTANT_URL = "https://marbella-permits-assistant.onrender.com";
const MP_ASSISTANT_LIMIT = 10;

(function () {
  if (!MP_ASSISTANT_URL) return; // hidden until a backend URL is configured

  // ---- localized chrome ----
  const UI = {
    en: { launch: "Ask about your permit", title: "Permit assistant", intro: "Ask about your permit steps. Guidance only — not legal advice.", ph: "Type your question…", send: "Send", left: "{n} of {m} questions left", none: "You've used all {m} questions. More help: +34 690 380 502 / hello@marbellapermits.com", thinking: "Thinking…", err: "Something went wrong. Please try again or contact us." },
    es: { launch: "Pregunta sobre tu licencia", title: "Asistente de licencias", intro: "Pregunta sobre los pasos de tu licencia. Solo orientación, no asesoramiento legal.", ph: "Escribe tu pregunta…", send: "Enviar", left: "{n} de {m} preguntas restantes", none: "Has usado tus {m} preguntas. Más ayuda: +34 690 380 502 / hello@marbellapermits.com", thinking: "Pensando…", err: "Algo salió mal. Inténtalo de nuevo o contáctanos." },
    nl: { launch: "Vraag over uw vergunning", title: "Vergunningsassistent", intro: "Stel een vraag over de stappen van uw vergunning. Alleen begeleiding — geen juridisch advies.", ph: "Typ uw vraag…", send: "Versturen", left: "{n} van {m} vragen over", none: "U hebt al uw {m} vragen gebruikt. Meer hulp: +34 690 380 502 / hello@marbellapermits.com", thinking: "Bezig…", err: "Er ging iets mis. Probeer opnieuw of neem contact op." },
    fr: { launch: "Une question sur votre permis", title: "Assistant permis", intro: "Posez une question sur les étapes de votre permis. Orientation seulement — pas un conseil juridique.", ph: "Saisissez votre question…", send: "Envoyer", left: "{n} sur {m} questions restantes", none: "Vous avez utilisé vos {m} questions. Plus d'aide : +34 690 380 502 / hello@marbellapermits.com", thinking: "Réflexion…", err: "Une erreur s'est produite. Réessayez ou contactez-nous." },
    de: { launch: "Frage zu Ihrer Genehmigung", title: "Genehmigungs-Assistent", intro: "Fragen Sie zu den Schritten Ihrer Genehmigung. Nur Orientierung — keine Rechtsberatung.", ph: "Geben Sie Ihre Frage ein…", send: "Senden", left: "{n} von {m} Fragen übrig", none: "Sie haben Ihre {m} Fragen aufgebraucht. Mehr Hilfe: +34 690 380 502 / hello@marbellapermits.com", thinking: "Denke nach…", err: "Etwas ist schiefgelaufen. Bitte erneut versuchen oder uns kontaktieren." },
  };
  function lang() { try { return (typeof tGet === "function" ? tGet() : "en"); } catch (e) { return "en"; } }
  function ui(k) { const L = UI[lang()] || UI.en; return (L[k] != null ? L[k] : UI.en[k]) || ""; }
  function fmt(s, o) { for (const k in o) s = s.split("{" + k + "}").join(o[k]); return s; }

  // ---- local daily counter (display + soft cap; server is the real cap) ----
  function dayKey() { return new Date().toISOString().slice(0, 10); }
  function used() { try { const o = JSON.parse(localStorage.getItem("mp_assistant") || "{}"); return o.day === dayKey() ? (o.n || 0) : 0; } catch (e) { return 0; } }
  function setUsed(n) { try { localStorage.setItem("mp_assistant", JSON.stringify({ day: dayKey(), n: n })); } catch (e) {} }
  function remaining() { return Math.max(0, MP_ASSISTANT_LIMIT - used()); }

  // ---- case facts (NO identity PII) ----
  function caseFacts() {
    const d = (typeof state !== "undefined" && state && state.data) ? state.data : {};
    let fees = null;
    try { if (typeof calculateFees === "function" && d.budget_eur) fees = calculateFees(d); } catch (e) {}
    return {
      project_type: d.project_type || null,
      budget_eur: d.budget_eur || null,
      demolition_pct: d.demolition_pct || null,
      exempt: !!d._exempt,
      in_historic_zone: d.in_historic_zone || "no",
      in_coastal_zone: d.in_coastal_zone || "no",
      property_address: d.property_address || null,
      license_fee: fees ? fees.license_fee : null,
      waste_deposit: fees ? fees.waste_deposit : null,
    };
  }

  // ---- styles ----
  const css = document.createElement("style");
  css.textContent = `
  .mpa-launch{position:fixed;right:1.25rem;bottom:1.25rem;z-index:90;background:var(--mp-ink,#1A1A1A);color:#fff;border:none;border-radius:999px;padding:.7rem 1.1rem;font:inherit;font-size:.9rem;font-weight:600;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.18)}
  .mpa-launch:hover{background:var(--mp-terracotta,#C8512C)}
  .mpa-panel{position:fixed;right:1.25rem;bottom:1.25rem;z-index:95;width:min(380px,calc(100vw - 2rem));height:min(560px,calc(100vh - 2rem));background:#fff;border:1px solid var(--mp-rule,#E6E2DC);border-radius:10px;box-shadow:0 16px 48px rgba(0,0,0,.22);display:none;flex-direction:column;overflow:hidden;font-family:var(--mp-sans,system-ui,sans-serif)}
  .mpa-panel.open{display:flex}
  .mpa-head{display:flex;align-items:center;justify-content:space-between;padding:.85rem 1rem;background:var(--mp-ink,#1A1A1A);color:#fff}
  .mpa-head b{font-family:var(--mp-serif,Georgia,serif);font-size:1rem}
  .mpa-x{background:none;border:none;color:#fff;font-size:1.3rem;cursor:pointer;line-height:1}
  .mpa-intro{padding:.6rem 1rem;font-size:.78rem;color:var(--mp-mute,#6B6B6B);border-bottom:1px solid var(--mp-rule,#E6E2DC)}
  .mpa-log{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.6rem}
  .mpa-msg{max-width:85%;padding:.6rem .8rem;border-radius:10px;font-size:.9rem;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}
  .mpa-user{align-self:flex-end;background:var(--mp-terracotta,#C8512C);color:#fff;border-bottom-right-radius:2px}
  .mpa-bot{align-self:flex-start;background:var(--mp-paper,#FAF8F4);color:var(--mp-ink,#1A1A1A);border:1px solid var(--mp-rule,#E6E2DC);border-bottom-left-radius:2px}
  .mpa-foot{border-top:1px solid var(--mp-rule,#E6E2DC);padding:.6rem}
  .mpa-row{display:flex;gap:.4rem}
  .mpa-row textarea{flex:1;resize:none;height:38px;max-height:90px;font:inherit;font-size:.9rem;padding:.5rem .6rem;border:1px solid var(--mp-rule,#E6E2DC);border-radius:6px}
  .mpa-row button{background:var(--mp-ink,#1A1A1A);color:#fff;border:none;border-radius:6px;padding:0 .9rem;font:inherit;font-weight:600;cursor:pointer}
  .mpa-row button:disabled{opacity:.45;cursor:not-allowed}
  .mpa-count{font-size:.72rem;color:var(--mp-mute,#6B6B6B);margin-top:.35rem;text-align:right}
  `;
  document.head.appendChild(css);

  // ---- build DOM ----
  const launch = document.createElement("button");
  launch.className = "mpa-launch";
  const panel = document.createElement("div");
  panel.className = "mpa-panel";
  panel.innerHTML =
    '<div class="mpa-head"><b class="mpa-title"></b><button class="mpa-x" aria-label="Close">&times;</button></div>' +
    '<div class="mpa-intro"></div>' +
    '<div class="mpa-log"></div>' +
    '<div class="mpa-foot"><div class="mpa-row"><textarea rows="1"></textarea><button class="mpa-send"></button></div><div class="mpa-count"></div></div>';
  document.body.appendChild(launch);
  document.body.appendChild(panel);

  const elLog = panel.querySelector(".mpa-log");
  const elTa = panel.querySelector("textarea");
  const elSend = panel.querySelector(".mpa-send");
  const elCount = panel.querySelector(".mpa-count");
  const history = [];

  function applyText() {
    launch.textContent = "💬 " + ui("launch");
    panel.querySelector(".mpa-title").textContent = ui("title");
    panel.querySelector(".mpa-intro").textContent = ui("intro");
    elTa.placeholder = ui("ph");
    elSend.textContent = ui("send");
    refreshCount();
  }
  function refreshCount() {
    const rem = remaining();
    if (rem <= 0) { elCount.textContent = fmt(ui("none"), { m: MP_ASSISTANT_LIMIT }); elTa.disabled = true; elSend.disabled = true; }
    else { elCount.textContent = fmt(ui("left"), { n: rem, m: MP_ASSISTANT_LIMIT }); elTa.disabled = false; elSend.disabled = false; }
  }
  function addMsg(text, who) {
    const m = document.createElement("div");
    m.className = "mpa-msg " + (who === "user" ? "mpa-user" : "mpa-bot");
    m.textContent = text;
    elLog.appendChild(m);
    elLog.scrollTop = elLog.scrollHeight;
    return m;
  }

  async function send() {
    const q = elTa.value.trim();
    if (!q || remaining() <= 0) return;
    elTa.value = "";
    addMsg(q, "user");
    history.push({ role: "user", content: q });
    elSend.disabled = true; elTa.disabled = true;
    const thinking = addMsg(ui("thinking"), "bot");
    try {
      const r = await fetch(MP_ASSISTANT_URL.replace(/\/$/, "") + "/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, lang: lang(), caseFacts: caseFacts(), history: history.slice(0, -1) }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.answer) {
        thinking.textContent = data.answer;
        history.push({ role: "assistant", content: data.answer });
        if (typeof data.remaining === "number") setUsed(MP_ASSISTANT_LIMIT - data.remaining);
        else setUsed(used() + 1);
      } else if (r.status === 429) {
        thinking.textContent = data.message || fmt(ui("none"), { m: MP_ASSISTANT_LIMIT });
        setUsed(MP_ASSISTANT_LIMIT);
      } else {
        thinking.textContent = (data && data.message) ? data.message : ui("err");
      }
    } catch (e) {
      thinking.textContent = ui("err");
    }
    refreshCount();
  }

  function openPanel() { panel.classList.add("open"); launch.style.display = "none"; applyText(); elTa.focus(); }
  launch.addEventListener("click", openPanel);
  panel.querySelector(".mpa-x").addEventListener("click", () => { panel.classList.remove("open"); launch.style.display = ""; });
  elSend.addEventListener("click", send);
  elTa.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } });

  // Let other parts of the app (e.g. the dossier step helper) open the chat.
  window.mpAssistantOpen = openPanel;
  window.mpAssistantLabel = ui("launch");

  applyText();
})();
