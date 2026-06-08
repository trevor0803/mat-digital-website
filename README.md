# MAT Digital — Custom Website Design Landing Page

A single-file, production-ready landing page for **MAT Digital LLC** featuring a
high-intent, multi-step lead form that POSTs clean JSON to a **GoHighLevel (GHL)
Inbound Webhook**.

- **No build step.** Everything is inline in `index.html` (HTML + CSS + JS).
- **Deploys clean on Vercel** as a static site (`vercel.json` included).
- **Distinctive, custom design** — bold typography, cohesive palette, smooth
  micro-animations, fully mobile-responsive.

---

## The offer (as presented on the page)

- Fully custom 1–10 page website designs — **$297 to start**, which covers the
  **first 60 days**
- **$125/month** after 60 days
- **7-day turnaround**
- Minimal onboarding — stock imagery available if the client has none
- 100% custom, **no templates**, built for SEO
- Full text/phone support with a **dedicated web developer** — no agency runaround

---

## The lead form

A multi-step form (one question per screen) with a progress bar, designed using
conversion best practices:

1. **Name + mobile phone** (+ optional email) — captured **first** so partial
   drop-offs still leave a reachable lead
2. Business name
3. Do you have a current website? **Yes/No** — choosing *Yes* reveals a URL field
4. Where do you service?
5. What services do you provide?
6. Do you need a logo? **Yes/No**

Then a **success screen** after submit.

Features: inline validation, **Enter-to-advance**, a **back button**, animated
progress bar, live US phone formatting, and an optional **partial-lead** capture
that fires after step 1 (see `SEND_PARTIAL_LEAD`).

### JSON payload sent to GHL

On submit, the form POSTs this JSON to `GHL_WEBHOOK_URL`:

```json
{
  "name": "Jordan Rivera",
  "phone": "(555) 123-4567",
  "email": "jordan@example.com",
  "business_name": "Rivera Roofing Co.",
  "has_website": "yes",
  "website_url": "riveraroofing.com",
  "service_area": "Austin, TX & surrounding areas",
  "services": "Residential roofing, repairs, gutter installation",
  "needs_logo": "no",
  "source": "MAT Digital Website Offer LP",
  "submitted_at": "2026-06-08T17:42:00.000Z"
}
```

| Key            | Notes                                                            |
| -------------- | --------------------------------------------------------------- |
| `name`         | Full name (required)                                             |
| `phone`        | Mobile phone (required)                                          |
| `email`        | Optional — empty string if not provided                         |
| `business_name`| Required                                                         |
| `has_website`  | `"yes"` or `"no"`                                                |
| `website_url`  | Present only when `has_website` is `"yes"`, else `""`            |
| `service_area` | Required                                                         |
| `services`     | Required                                                         |
| `needs_logo`   | `"yes"` or `"no"`                                                |
| `source`       | Always `"MAT Digital Website Offer LP"`                          |
| `submitted_at` | ISO 8601 timestamp                                              |

> **Partial leads:** when `SEND_PARTIAL_LEAD = true`, a payload is also POSTed
> right after step 1 with `source` = `"MAT Digital Website Offer LP (Partial)"`.
> GHL de-dupes contacts by phone, so the full submit updates the same contact.

---

## ⚙️ Setup: connect the GoHighLevel Inbound Webhook

The webhook URL lives in **one clearly-labeled constant** at the top of the
`<script>` block in `index.html`:

```js
const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/.../webhook-trigger/...";
```

### 1. Create the workflow + Inbound Webhook trigger

1. In GoHighLevel, go to **Automation → Workflows → + Create Workflow**
   (start from a *Blank Workflow*).
2. Click **+ Add New Trigger** → choose **Inbound Webhook**.
3. GHL generates a unique **Webhook URL**. Click **Copy URL**.
   *(Tip: to auto-map fields, you can submit the form once first so GHL
   captures a sample payload, then use **"Map fields automatically"** /
   the sample-payload picker.)*
4. **Save** the trigger.

### 2. Paste the URL into the page

Open `index.html`, find `GHL_WEBHOOK_URL`, and replace the placeholder with the
URL you copied. Commit + redeploy.

### 3. Map the incoming fields → contact

Add the actions you want after the trigger. To store the lead, add a
**Create/Update Contact** action and map the inbound webhook fields using the
`{{inboundWebhookRequest.<key>}}` references:

| GHL Contact field        | Map from inbound webhook value                |
| ------------------------ | --------------------------------------------- |
| First / Full Name        | `{{inboundWebhookRequest.name}}`              |
| Phone                    | `{{inboundWebhookRequest.phone}}`             |
| Email                    | `{{inboundWebhookRequest.email}}`             |
| Company / Business Name  | `{{inboundWebhookRequest.business_name}}`     |
| Custom: Has Website      | `{{inboundWebhookRequest.has_website}}`       |
| Custom: Website URL      | `{{inboundWebhookRequest.website_url}}`       |
| Custom: Service Area     | `{{inboundWebhookRequest.service_area}}`      |
| Custom: Services         | `{{inboundWebhookRequest.services}}`          |
| Custom: Needs Logo       | `{{inboundWebhookRequest.needs_logo}}`        |
| Source / Attribution     | `{{inboundWebhookRequest.source}}`            |
| Custom: Submitted At      | `{{inboundWebhookRequest.submitted_at}}`     |

> Create the **Custom Fields** first (Settings → Custom Fields) for any keys you
> want stored that aren't standard contact fields (has_website, website_url,
> service_area, services, needs_logo, submitted_at).

### 4. Notify yourself

Add follow-up actions in the same workflow, e.g.:
- **Send Internal Notification** (SMS/email to your dedicated developer) using
  `{{inboundWebhookRequest.name}}` / `{{inboundWebhookRequest.phone}}`.
- **Send SMS** to the lead confirming you received their request.

---

## Log leads to a Google Sheet (optional)

Every submission can *also* be appended to a Google Sheet — independent of
GoHighLevel — using a small Google Apps Script Web App. The script lives in
[`google-sheet/Code.gs`](google-sheet/Code.gs) and the sheet constant is at the
top of the `<script>` in `index.html`:

```js
const SHEET_WEBHOOK_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
```

**Setup (one time, ~2 minutes):**

1. Open <https://script.google.com> → **New project**.
2. Delete the starter code, paste in all of `google-sheet/Code.gs`, and **Save**.
   *(The `SHEET_ID` is already set to the sheet that was created for you:
   `MAT Digital — Website Leads`.)*
3. **Deploy → New deployment → Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
   Deploy, then **Authorize** when prompted.
4. Copy the **Web app URL** (ends in `/exec`).
5. Paste it into `SHEET_WEBHOOK_URL` in `index.html`, commit, and redeploy.

Each row captures: `submitted_at, name, phone, email, business_name,
has_website, website_url, service_area, services, needs_logo, source,
received_at`. Partial leads (after step 1) are logged too, marked
`(Partial)` in the `source` column.

> **Why text/plain + no-cors?** Apps Script Web Apps don't answer CORS
> preflight requests, so the form sends the JSON as a `text/plain`
> fire-and-forget request — which the browser allows without a preflight.
> The script parses the JSON body either way.

---

## Local preview

It's a static file — just open `index.html` in a browser, or serve it:

```bash
npx serve .
# or
python -m http.server 3000
```

---

## Deploy

### Vercel (static, no build)

This repo ships with `vercel.json` configured for static hosting:

- **Framework preset:** Other (`framework: null`)
- **Build command:** none
- **Output directory:** project root (`.`)

```bash
vercel --prod
```

### GitHub

```bash
git init
git add -A
git commit -m "Initial commit"
gh repo create mat-digital-website --public --source=. --remote=origin --push
```

---

## Customizing

- **Phone/contact:** update the copy in the hero, FAQ, and footer as needed.
- **Colors:** all design tokens are CSS variables in `:root` at the top of the
  `<style>` block (`--brand`, `--lime`, `--violet`, etc.).
- **Form questions:** each step is a `.fstep` block in the form; validation lives
  in `validateStep()`.
- **Partial leads:** toggle `SEND_PARTIAL_LEAD` (top of the `<script>`).

---

© MAT Digital LLC — Custom website design.
