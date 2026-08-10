# Standard Contractor Estimate Survey

Use this as the default survey structure for MAT Digital contractor/home-service landing pages unless a project specifically requires something different.

## Step 1 — Service
Keep the first question fast and limited to about 4–5 choices plus a catch-all option.

Example:
- Kitchen
- Bathroom
- Home Addition
- Flooring / Tiling
- Something Else

Adapt the primary service labels to the client, but do not overload this step with every service the company offers.

## Step 2 — Contact Information
Collect only:
- First name
- Last name
- Mobile phone
- Email
- Project ZIP code

Do not use city/location instead of ZIP by default.

## Step 3 — Project Description
Use one short-answer field:

**Tell us about what you're looking for.**

A sentence or two is enough. Do not add separate project-size, timeline, condition, or additional-information questions by default. Do not add a second comments/additional-info box because this project-description field already covers that information.

## SMS Consent
If SMS follow-up is used, keep the consent checkbox optional, unchecked by default, and accompanied by the required disclosure, Privacy Policy, and Terms links.

## MAT Factory Import Rules
Keep the full MAT Factory brief as the source of truth. In particular:
- Every option-button question needs at least 2 options or the question is discarded.
- The importer records each button's visible text as the answer; do not depend on `data-value`.
- Option labels must not begin with continue, next, back, submit, finish, send, start, →, or ←.
- Questions stay under 140 characters and option labels under 80 characters.
- Contact field IDs must clearly contain firstName/fname, lastName/lname, phone/mobile/tel, and email.
- Keep the form in its own labeled estimate/survey container and keep SMS consent wording directly in raw HTML.

## Default Rule
The default contractor lead form is three steps: **Service → Contact + ZIP → Short project description**. Add more questions only when they are operationally necessary or the client explicitly requests them.
