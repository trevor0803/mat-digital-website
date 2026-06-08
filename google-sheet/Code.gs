/**
 * MAT Digital — Lead capture → Google Sheet
 * ---------------------------------------------------------------
 * A Google Apps Script Web App that appends every website form
 * submission as a new row in your "MAT Digital — Website Leads" sheet.
 *
 * SETUP (one time, ~2 minutes):
 *  1. Go to https://script.google.com  →  New project.
 *  2. Delete the starter code, paste THIS whole file in, and Save.
 *  3. Click Deploy → New deployment → type "Web app".
 *       - Execute as:  Me
 *       - Who has access:  Anyone
 *     Deploy, then authorize when prompted.
 *  4. Copy the "Web app URL" (ends in /exec).
 *  5. Paste it into index.html → const SHEET_WEBHOOK_URL = "...".
 *     Commit + redeploy the site.
 *
 * The spreadsheet ID below is already set to the sheet that was
 * created for you. To use a different sheet, change SHEET_ID
 * (it's the long string in the sheet's URL between /d/ and /edit).
 */

const SHEET_ID = '1KtbYh8IqjyIHCHWmgYX0l3iXIfr7IeNBnpvGNOom5go';

const HEADERS = [
  'submitted_at', 'name', 'phone', 'email', 'business_name',
  'has_website', 'website_url', 'service_area', 'services',
  'needs_logo', 'source', 'received_at'
];

function doPost(e) {
  try {
    // The site posts a JSON string as text/plain; fall back to form params.
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); }
      catch (parseErr) { data = (e.parameter || {}); }
    } else {
      data = (e && e.parameter) || {};
    }

    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

    // Ensure the header row exists (no-op if it already does).
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    var row = HEADERS.map(function (key) {
      if (key === 'received_at') return new Date();
      return (data[key] !== undefined && data[key] !== null) ? data[key] : '';
    });
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('MAT Digital lead endpoint is live.');
}
