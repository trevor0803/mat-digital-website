#!/bin/sh
set -eu

KCN_PROJECT_ID="prj_YL76QbsISFuHoaxl379pbrUs78Dq"

if [ "${VERCEL_PROJECT_ID:-}" != "$KCN_PROJECT_ID" ]; then
  echo "No project-specific staging required for VERCEL_PROJECT_ID=${VERCEL_PROJECT_ID:-unknown}."
  exit 0
fi

echo "Staging KCN Construction for Vercel project $KCN_PROJECT_ID"

# Put the full KCN website at the project root for this build only.
cp kcn-construction/index.html index.html
cp kcn-construction/privacy.html privacy.html
cp kcn-construction/terms.html terms.html

# The design source MAT Factory imports from.
#
# This exists because the standalone kcn-construction-survey-lander Vercel
# project does not rebuild on a push to this repo. Its URL therefore serves
# whatever was deployed by hand months ago, while this file moves on — and
# importing from it silently replaced a current lander with an old design that
# still looked plausible. Same business, same colours, different page.
#
# Anything served from this repo is current by construction. Import from:
#   https://kcn-construction-dmv.vercel.app/import-source
#
# Raw, before the auto-advance pass: the factory strips the form and mounts its
# own survey, so the mock-survey behaviour is noise it would throw away anyway.
rm -rf import-source
mkdir -p import-source
cp kcn-construction-survey-lander/index.html import-source/index.html

# MAT Factory-ready paid-traffic lander. Keep the source static HTML and apply
# only CSS/native-HTML mock-survey behavior; no script tags are added to output.
rm -rf estimate
mkdir -p estimate
cp kcn-construction-survey-lander/index.html estimate/index.html
node scripts/kcn-estimate-auto-advance.js estimate/index.html

# The full KCN site is a history-based SPA. Create physical entry points so
# direct visits and refreshes work on every public route without changing the URL.
for route in services projects about service-areas contact; do
  rm -rf "$route"
  mkdir -p "$route"
  cp kcn-construction/index.html "$route/index.html"
done

for slug in \
  kitchen-remodeling \
  bathroom-remodeling \
  home-additions \
  commercial-remodeling \
  roofing-exterior \
  plumbing-services \
  flooring-tile \
  drywall-painting
do
  mkdir -p "services/$slug"
  cp kcn-construction/index.html "services/$slug/index.html"
done

echo "KCN Construction staging complete."
