# Standard Contractor Paid-Traffic Lander

Use this as the default for MAT Digital contractor/home-service paid-traffic landers unless the client brief explicitly changes it. The full MAT Factory import rules remain the source of truth.

## Page Structure
Build one static HTML page in this order:
1. Sticky header: logo, short nav, tap-to-call phone.
2. Split hero: dark photo background, confident headline/trust points left, estimate form right and visible above the fold.
3. Four-item trust strip.
4. Service cards using real client/project photos.
5. Dark Why Us block with numbered points.
6. Asymmetric real-photo gallery; first tile spans two rows on desktop.
7. Reviews only when the user provides or explicitly confirms real reviews. Never invent reviews, ratings, star counts, customer names, or awards.
8. FAQ using native `<details>/<summary>` only.
9. Final CTA.
10. Sticky mobile CTA bar.

Use one strong accent color consistently on every CTA and provide real responsive breakpoints in the page CSS.

## Default Lead Flow
The default contractor lead flow is:

**Service → Timeline → Tell us about your project → Contact + ZIP**

### Step 1 — Service
Keep the first option question short and relevant to the client. Do not list every possible service just because the company offers it.

Every option-button question must have at least two visible buttons.

### Step 2 — Timeline
Default visible options:
- As Soon As Possible
- Within 1–3 Months
- Within 3–6 Months
- Just Planning

### Step 3 — Project Description
Use one short-answer/notes field with an id and matching label, such as:

**Tell us about your project**

Do not add a second comments/additional-information field by default.

### Step 4 — Contact Information
Collect only:
- First name — `id="firstName"`
- Last name — `id="lastName"`
- Mobile phone — `id="phone"`
- Email — `id="email"`
- Project ZIP code — use a clear id such as `projectZip`

Use ZIP rather than city/location by default.

## Live Mock Survey Behavior
The public lander should look and feel like a real multi-step survey rather than showing every step stacked at once.

Default behavior:
- Show one survey step at a time.
- Provide visible **Next** and **Back** navigation between steps.
- Keep navigation controls structurally outside the option-button containers.
- Do not use JavaScript for the stepper. Use CSS/native HTML behavior such as fragment targets, `:target`, `:has()`, radio/checkbox state, or another import-safe approach.
- All questions, option buttons, contact fields and consent text must still exist directly in the raw HTML so MAT Factory can parse them even when only one step is visible in the browser.
- The live mockup does not need to submit; MAT Factory replaces/rewires the form after import.

## Estimate Request Wording
The visitor is requesting an estimate/follow-up. Do not imply that an instant estimate is delivered after submission unless that workflow truly exists.

Preferred CTA language:
- **Request a Free Estimate**
- **Request Estimate**
- **Submit My Request**

Avoid **Get My Estimate**, **Receive My Estimate**, and **Where should we send your estimate?** when the client is actually following up later.

Hero headlines should describe the service or customer need accurately. Do not imply that planning, pricing, scheduling, project organization, approval, or another outcome has already happened before the contractor reviews the lead.

## Static HTML / Import Safety
- Static HTML only. No React, Vue, client-rendered shells, or JavaScript-dependent UI.
- No critical `<script>` tags. MAT Factory strips scripts.
- Put the complete survey/form in one clearly labelled container such as `id="estimate"`, with nothing unrelated inside it.
- Keep that form container limited to the form itself and roughly under half the page.
- Do not wire form submission; MAT Factory replaces/rewires the survey after import.
- Contact ids must literally identify the fields: `firstName`, `lastName`, `phone`, `email`.
- Extra fields need an id and matching `<label for>`.

## Survey Option Rules
For every multiple-choice survey question:
- Put the question text in `<h1>`–`<h4>`.
- Keep question text under 140 characters.
- Provide at least 2 visible `<button>` options or the question is silently discarded.
- Keep visible option labels under 80 characters.
- Visible button text is the answer recorded by MAT Factory; do not depend on `data-value`.
- Do not start option labels with `continue`, `next`, `back`, `submit`, `finish`, `send`, `start`, `→`, or `←`.
- Maximum 8 survey questions.
- Keep navigation controls structurally separate from option containers.

## SMS Consent
Keep the full SMS disclosure in raw HTML inside `label class="consent"`.

The checkbox should be optional and unchecked by default unless a specific campaign requires otherwise. Include:
- The business name and message purpose.
- Recurring automated/manual SMS wording when applicable.
- Message frequency varies.
- Message and data rates may apply.
- Reply STOP to opt out.
- Reply HELP for help.
- Consent is not a condition of purchase.
- Links to Privacy Policy and Terms.

Use relative policy URLs (`/privacy`, `/terms`) when the lander and legal pages live in the same project/domain.

## Imported Factory Form Styling
The lander must style both the raw mockup and the real MAT Factory component. Prefix every Factory selector with the form container id so the rules win against Factory defaults.

Required selectors:
- `#estimate .fx-card`
- `#estimate .fx-prog`
- `#estimate .fx-prog span.on`
- `#estimate .fx-step`
- `#estimate .fx-card h3`
- `#estimate .fx-opts`
- `#estimate .fx-opt`
- `#estimate .fx-form`
- `#estimate .fx-field input, #estimate .fx-field textarea`
- `#estimate .fx-btn`
- `#estimate .fx-consent`
- `#estimate .fx-back`

Match these to the raw card: radius, shadow, borders, typography, spacing and CTA shape/color.

## Images
- Use real client/project imagery whenever available.
- Supported extensions: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.gif`, `.svg`.
- Maximum 30 images per page.
- Avoid tiny decorative files under 900 bytes.
- Do not present stock or generated imagery as completed client work.

## Production Requirement
The import URL must be publicly reachable. Use a public production/custom-domain URL, not an SSO-protected preview URL.
