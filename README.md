# Marbella Permits

A self-service web app that helps foreign property owners in Marbella prepare a
*Declaración Responsable de Obras* (minor-works permit) for simple renovations.

- **Landing page:** `index.html`
- **Wizard:** `app/index.html`
- **Languages:** landing, wizard and the generated PDF instructions are available
  in English, Spanish, Dutch, French and German. The legal documents that go to
  the town hall stay in Spanish by law.

Static HTML/CSS/JS. No build step, no server. All paths are relative, so it works
from a repo subpath (username.github.io/repo/) or a custom domain.

## File map
```
.
├── index.html              landing page (EN/ES/NL/FR/DE)
├── app/
│   ├── index.html          the wizard
│   ├── app.js              wizard logic + dossier/PDF generation
│   ├── app.css             styles
│   ├── rules.js            eligibility rules + fee calculation
│   ├── templates.js        Spanish document templates
│   ├── pdf-builder.js      PDF layout helpers (jsPDF)
│   ├── i18n.js             i18n engine + landing-page strings
│   ├── i18n-wiz.js         English wizard/PDF strings (source of truth)
│   └── wiz_es/nl/fr/de.js  translated wizard/PDF strings
├── brand/favicon.svg
├── .nojekyll               extra safety; not required (no underscore files)
└── .gitignore
```

## Before going live
- **Waitlist form:** in `index.html`, replace `https://formspree.io/f/REPLACE_ME`
  with a real Formspree form ID (falls back to a `mailto:` link until you do).
- **Verify the numbers:** fee rates + bank/IBAN details live in `app/rules.js`.
