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

# MAT Factory-ready landing survey on the same project/domain.
rm -rf estimate
mkdir -p estimate
cp kcn-construction-survey-lander/index.html estimate/index.html
node scripts/apply-standard-estimate-survey.js estimate/index.html

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
