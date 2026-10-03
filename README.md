# Nav Bharat Quotations

A local, mobile-first solar quotation workspace for **NAV BHARAT ENTERPRISES**. Plain HTML, CSS and JavaScript. No account, backend, hosting deployment, cloud sync, remote fonts, analytics or runtime CDN.

## Open it

Open `index.html` directly in a modern browser, including without an internet connection. The file embeds all application code, styles, jsPDF **3.0.3** and jsPDF-AutoTable **5.0.2**. You can copy this one HTML file to another device; its saved data does **not** travel with it.

For a stable browser storage origin, you can optionally serve this directory locally:

```sh
cd '/Users/mj/Projects/Nav Bharat Quotations'
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8765`. This is a local server, not a public deployment. Browser storage for `file:` URLs varies by browser. Moving the HTML, switching browsers/ports, private browsing or clearing browser data may make saved records inaccessible. When storage is blocked or corrupt, the app warns and uses session-only memory without overwriting the corrupt record.

## Git and Netlify handoff

The local repository uses `main`. Do not commit downloaded PDFs, JSON backups, credentials, `node_modules`, generated `dist`, or `.netlify` account state; `.gitignore` excludes these. Repository access does not grant access to the owner’s browser data. Treat the repository as private when creating the remote because source company/contact/bank defaults are embedded in the app. Publishing the app makes those defaults visible in its HTML; do not embed confidential credentials or customer records.

Netlify settings are committed in `netlify.toml`:

- Build: `npm run deploy:build`
- Publish directory: `dist`
- Node: `24`

The deployment build regenerates the app, runs the full test suite and recreates `dist` containing **only `index.html` and the public `og-image.png`**. Source, tests, backups, sample PDFs and archives are not published. Verify locally with:

```sh
npm ci
npm run deploy:build
```

After creating the intended private GitHub repository, push `main` and connect that exact repository to the intended Netlify account. This preparation does not create a remote, push, link a Netlify account, or deploy the site. Keep the same permanent production origin on updates. The storage key remains `navbharat.v1`; never clear or rewrite browser data during deployment. A Netlify rollback restores app files, not browser data.

### Owner trial handoff

Use one primary device/browser; verify defaults in Configure and select Save defaults. Create a quote, review it, explicitly Save quotation, inspect View PDF and download to share. Export a JSON backup daily and before every app update, and keep copies of sent PDFs. Restore replaces data, not merges it. Login, shared storage and automatic cloud backups are not included in this trial.

## Share preview image

`assets/og-image.png` is an original 1200 × 630 branded image using the existing solar mark, green/cream/gold palette and quotation illustration. No customer information or price is included. `scripts/render-og.py` regenerates it using Pillow and local Georgia/Arial fonts on macOS; hosting uses the checked-in PNG and does not need Python or those fonts.

The static HTML head includes Open Graph and large-image Twitter card metadata. The build uses Netlify's `URL` for production and `DEPLOY_PRIME_URL` for preview contexts. Optionally set `SITE_URL` to the permanent production address to override it. A local build without a site address leaves the image path relative; actual crawler preview requires the deployed image and publicly reachable HTML. `dist` publishes only the app and this image. Shared-link appearance has not yet been verified on a live deployment.

## DCR / Non-DCR panel type

Capacity remains a numeric kW value. A separate **Default panel type** selector alongside it offers **DCR** and **Non-DCR** in Configure. Save defaults applies the selected type only to future quotations; existing saved quotations and the current draft retain their own values. The System & pricing step has the same lead-specific choice, and Review, saved cards and the actual PDF show it when selected. Existing backups missing this field load with no classification selected—no old records are silently labelled DCR or Non-DCR.

Changing panel type does not change equipment descriptions, total price or estimated subsidy. The operator must review those fields for the selected type; a quotation-type change prompts manual price review and clears final-review acknowledgement. Backup/restore retains the field and rejects invalid classifications. Verified with **93 passing tests** after the full deployment build, including an actual four-page PDF containing the selected type.

## Workflow

1. **Customer:** Enter name and address, with optional contact and electricity consumer details. Leads start blank. The default quotation date is the actual device-local date. Numbers reserve the next local sequence as `sequence/year`; abandoned drafts may leave gaps. You can edit the number, but duplicate saved numbers are rejected.
2. **System & price:** Review capacity, GST-inclusive vendor total, manually estimated subsidy, equipment and optional battery, payment split, system estimates, terms and documents. Edit quantities/specifications, include or exclude items, and add quote-specific custom items. Equipment changes do not automatically recalculate price. Payment shares must total 100%.
3. **Review:** Check the live escaped preview and acknowledge reference-value review. Save locally or select **View PDF** to inspect the actual current quotation. The viewer provides **Download PDF** and **Open PDF**. Editing fields invalidates earlier review confirmation.
4. **Saved quotations:** View the saved PDF without entering the editor, edit explicitly, or use More options to copy to a new customer or delete with confirmation. Duplicating clears all personal customer fields and assigns a fresh number/date. A JSON backup includes settings, saved quotes, the next sequence and current draft. Restore validates its structure and saved quotation values, then requires explicit confirmation before replacing local data.
5. **Configure:** Edit company, source tagline, bank details, default prices, equipment and terms. Defaults apply to new quotes; old quotes retain snapshots. The separate **Apply company & bank to current quote** action updates these fields without overwriting its equipment or price. **Apply defaults to current quote** replaces system/pricing/terms only after confirmation.

## Notification cleanup and workspace identity

Success notifications dismiss after **four seconds**, and navigation to home/Configure, Back/Continue and successful PDF opening clears feedback from the previous screen. New notifications cancel the previous timer; an old callback cannot erase a newer message. Errors remain readable until navigation or a new notification replaces them. Storage failures remain visible in the persistent save status/footer; navigation cleanup runs before saving so a fresh persistence error is not discarded.

The workspace replaces the NB letter tile with an original flat **solar panel and sun** SVG and a typographic **Nav Bharat / Enterprises** lockup. It uses the existing green/cream/gold palette, locally available Georgia and system fonts, and no remote assets. The customer PDF identity and original artwork are unchanged.

Verification: **86 tests passed** in the rebuilt offline artifact. Real Chromium checks reproduced Save → home → Configure, Back and timed success expiry. The wordmark and icon fit without horizontal overflow at **320, 390, 768 and 1280px**. A fresh headless Chromium/CDP render was inspected with a measured **390 × 844 CSS-pixel viewport** and equal document width; the initial command-line screenshot was rejected because its layout width did not match its crop. Physical-phone behavior remains unverified.

## Focused quotation workspace

The quotation editor is a focused task, not a dashboard. Its header has **← Quotations** and a persistence status; below it are the current title, noninteractive **Step N of 3**, and a small **Help** disclosure. There are no global tabs or clickable step tabs while editing. **Back / Continue** move between steps and return to the top of the next screen. Bottom actions stay available, with scroll clearance for the final fields and the wrapped Save / View PDF controls on narrow phones.

**← Quotations** autosaves and returns to the quotation workspace. That screen contains **New quotation**, **Resume draft**, saved quotation history and **Configure**. The app opens on this home workspace, including after reload, instead of opening the editor automatically. Resuming preserves the current step within the open session; the step is UI-only, so Resume after reload starts at Customer. The draft, saved records, settings and reserved quotation number are retained. Creating a new quotation requires confirmation before replacing the draft; saved quotations remain. Configure still uses explicit Save defaults. Backup/export and restore controls are under a collapsed **Backup & restore** disclosure, with device-only storage guidance there rather than a large repeated warning above each editing task.

System & pricing brings the input fields directly below the title. Capacity, GST-inclusive total and estimated subsidy remain independent manual inputs. The calculated **Estimated effective cost** is a compact summary, and payment percentages use one three-column row on phones. **Reference values — check before sharing** is collapsed by default; reference-value validation, final-review acknowledgement, vendor dues and PDF behavior are unchanged. Help is context-specific and collapsed by default on every step.

Focused-workspace verification (earlier navigation revision): **65 tests passed**, including the rebuilt offline artifact. Chromium layout checks passed at 320, 360, 390, 430, 700, 768, 1024 and 1280px with no horizontal overflow, aligned payment fields and reachable bottom actions. The first capacity input begins about 249px down the narrow phone screen. Workspace → Configure → workspace → Resume preserved the draft step; Back returned to the top. Narrow Review controls were checked with their wrapped action bar and additional scroll clearance. Original browser storage was restored and read-back verified after QA. Screenshot capture timed out; this is geometry/interaction verification, not screenshot or physical-phone sign-off.

## Pinned quotation header

On all three quotation steps, **← Quotations**, the save status, task title, **Step N of 3** and **Help** stay together at the top while the form scrolls underneath. The same green/cream header has an opaque surface and subtle divider, without changing its spacing or adding navigation. Workspace/history and Configure are not pinned. Equipment editors and the PDF viewer remain above the task header.

The actual header height is measured for scroll clearance and updated on resize; Help stays independently scrollable within the available viewport. Leaving the editor disconnects measurement and clears its scroll offset. The bottom Back/Continue/Save/View PDF actions retain their existing position.

Verification: **76 tests passed** after rebuilding the offline HTML. Real Chromium scrolling across all three steps at **320, 360, 390, 768 and 1280px** kept the complete header at viewport top with no horizontal overflow. Checks at 450px viewport height covered Help clearance, focused price-field visibility, bottom content clearance, equipment-panel layering and workspace exit/resume. QA-origin storage was restored with read-back verification; the normal app origin was not changed. Physical-phone and visual screenshot sign-off remain unverified.

## Three-part step progress

A slim, three-segment bar sits below the Step N of 3 / Help row, inside the pinned quotation header. The current segment is dark green, earlier segments are softer green, and upcoming segments are muted. It reflects the current navigation position, not a sent/accepted/completed quotation status. Continue and Back update it; workspace resume retains the in-session position. Segments are noninteractive, so no competing step tabs or validation bypass are introduced. Accessible progress text names the current step.

Latest verification: **79 tests passed** after rebuilding the offline HTML. Real Chromium checks at **320, 390, 768 and 1280px** across all three steps confirmed equal-width segments, 4px bar height, correct state colors, retained sticky positioning and no horizontal overflow. Quote and stored data remained unchanged during these checks. Physical-phone and screenshot visual sign-off remain unverified.

## Review PDF preview and startup home

The app starts on **Quotations**. Use **New quotation**, **Resume draft**, saved-card **Edit**, or **Configure** deliberately. Opening home does not discard a draft; a newly prepared empty draft is also persisted so repeated opens retain its reserved number.

On the final step, **View PDF** replaces the direct Download action. It builds the actual PDF from a cloned current working copy, not the last saved history record. Previewing neither implicitly saves a quotation nor overwrites a saved record. The viewer identifies **Current quotation**, offers **Open PDF** and **Download PDF**, and returns to the same Review step with **← Back to review**. Closing releases the object URL and restores focus. Existing final-review, required-field and unsupported-text validation remains in effect. **Save quotation** remains a separate action.

Verification: **81 tests passed** after rebuilding the offline HTML. Real Chromium checks confirmed home on initial open and reload, full draft and reserved-number preservation, deliberate Resume, separate current-versus-saved PDF previews, return to Review with focus restored, and no storage mutation from viewing/download. Viewer actions were reachable without horizontal overflow at **320, 390, 768 and 1280px**. The actual browser-downloaded PDF was independently parsed: **four pages**, current unsaved customer and price present, previous saved customer absent, test-payment markings retained. Physical-phone and screenshot visual sign-off remain unverified.

## Saved quotations and PDF viewing

Saved records are under **Saved quotations**, with an explicit **Saved** badge, quotation number, customer name, rooftop-solar capacity, quotation date and GST-inclusive price. Saved is a local record status, not a claim that the quotation was sent, accepted or completed. An unsaved new record remains **Current draft**. When the current editor belongs to an existing record, the workspace calls it **Current working copy**, distinguishes **Editing saved quotation** from **Unsaved changes**, and explains that View PDF uses the last saved version.

Each saved card has separate **View PDF** and **Edit** actions. View PDF regenerates the actual PDF from a cloned saved snapshot using the existing exporter and validations; it never loads that record into the editor, replaces the current draft, changes its step, updates settings or saves it again. A local blob-backed viewer provides **Open PDF** (fallback for browsers without embedded PDF support), **Download PDF** and **← Quotations**. Returning releases the object URL and restores focus to the card. Reference-review, missing-account and unsupported-text checks and explicit test-only payment markings are retained. IFSC format and the optional bank-confirmation checkbox do not block viewing or download. **New customer** and **Delete quotation** remain available under collapsed **More options**; deletion still requires confirmation.

The collapsed **Backup & restore** anchor is now **below all saved quotation cards**, above the footer. Existing backup format, restore validation and replacement confirmation are unchanged.

Latest verification: **70 tests passed** after rebuilding the self-contained HTML. Real Chromium checks at **320, 360, 390, 768 and 1280px** verified no horizontal overflow, backup placement, minimum 44px controls, bounded PDF-viewer layout and return focus. A real browser download was parsed independently: **four pages**, saved customer text present, unsaved draft customer absent, test payment markings retained. Viewing, opening in another tab and downloading left the unsaved working copy and stored state unchanged. QA used a separate local origin; its pre-test storage was restored and read-back checked, without touching the normal app origin. Screenshot capture again timed out. Embedded PDF appearance and physical-phone behavior remain unverified; Open PDF is available if the embedded viewer is blank.

## Owner-first equipment workflow

**System & price** starts with a compact equipment overview on every screen size. Standard master equipment is already copied into the quotation; no category needs opening to prepare a standard quote. Every category, including Solar PV Module, Hybrid Inverter and Battery, uses the same read-only summary with a subtle pencil **Edit** action beside its heading. Single-item summaries show quantity and inclusion; multi-item summaries show the included-item count. No quantity fields, checkboxes or separate specification actions appear in the overview. **Edit** opens a focused full-screen editor on phones (700px and below), or a bounded right-side panel on desktop. Every item has its own quantity and inclusion control. The inclusion switch sits at the top-right beside the item name; quantity and Edit details share the row below. A compact header pairs Back with the save status, with no repeated instruction paragraph. **Pencil + Edit details**, aligned beside the quantity field, replaces the same panel with the identified item’s description and warranty. Each item has a compact inclusion switch without a visible text label: off items use readable muted styling and disabled quantity/details controls, while the switch stays usable. Values are retained, switching on restores editing, and a compact bottom snackbar offers Undo without moving the header or item controls. Scroll padding keeps the last item reachable above the feedback, which is layered above switch hit areas. The switch has an accessible name and a 44px minimum tap target. **Back** (accessibly named Back to quantities or Back to quotation) autosaves and restores focus and scroll. There are no nested quote accordions, category rename/delete controls or duplicate category-inclusion controls. **+ Add item** beside the Equipment & scope heading opens a short form for category, specification, quantity and warranty. Choose an existing category or create a new quotation-only category. Nothing is added until **Add item** is submitted; backing out leaves no blank equipment behind. Master defaults stay unchanged. A quiet **+ Add item** is also available inside the group editor. Excluding an item retains its fields and offers **Undo**, which also preserves quantity/specification edits made after the inclusion change.

The reference earthing quantities remain independent: rod `3`, copper-bonded LA `1`, chemical bag `1`, pit cover `3`. Other unspecified parts retain `As Required`. The exact source `9/10 Panel` remains unchanged and shows a nonblocking **Quantity needs review** hint. Unit-bearing text and blank draft quantities are never reinterpreted. Quote field edits autosave and clear prior final-review acknowledgement. The panel reports **Saved** only after successful persistence; failures explicitly report session-only changes. Editor/navigation state is UI-only, not quotation or backup data.

Each quotation persists its own initial copied equipment baseline. **Changed for this quotation** appears only for actual differences and clears when reverted; it never compares an old quotation with today’s master defaults. Legacy quotations capture their existing migrated equipment safely as the baseline. New-customer copies get a baseline from their copied scope, while an already-pending price reminder remains pending. Relevant quantity, specification, inclusion, custom-item or capacity changes show **Check total price**; warranty-only edits do not. The reminder survives draft reloads. Change the manual total or choose **I checked — current total is valid** to acknowledge the current scope, without resetting the equipment baseline. This reminder is nonblocking and never prices anything automatically.

**Configure** retains the structural itemwise table (Particulars, Items / specification, Qty, Warranty), **Manage equipment / Done** on desktop and local category disclosures on phones. It can rename/exclude categories and add/remove items or categories; removing the last item removes its category after confirmation. Changes there require explicit **Save defaults** and do not alter the current quote. Applying defaults to the current quote still requires confirmation and preserves its original baseline. Review and PDF continue to use independent included item rows; the standard four-page PDF design is unchanged.

Older v1 browser data and JSON backups are upgraded on load/restore. Recognized original combined descriptions are expanded into their original subitems. Matching quantity lists are assigned in item order; unspecified `As Required` values stay explicit per item. A single custom numeric group quantity is kept on the first part, leaving other quantities blank rather than duplicating a count. Unknown/custom combined descriptions remain one editable item: they are not split at commas because brand specifications can contain commas. Customer data, prices, record identity and history are preserved. Review migrated equipment before sharing a quotation; backup before replacing the app file. New backups retain the item arrays.

`Itemwise Sample Quotation.pdf` was downloaded in a real browser after changing the copper-bonded LA quantity to `2` and Elbow PVC quantity to `12 pieces`; these are test values, not recommended project quantities.

## IFSC and bank details

IFSC is printed exactly as entered; there is no length/format validation and the optional bank-confirmation checkbox does not block **View PDF**, **Download PDF** or applying company details. Bank account name and number must still be present. Startup no longer substitutes a fictional bank for the original source IFSC. Existing drafts and saved quotations are not rewritten; any test details already present remain until edited explicitly.

The explicit test-bank helper remains available to development tests. The exact fictional bank combination still produces **TEST ONLY - NOT FOR PAYMENT** markings. Removing validation does not verify entered payment details.

Verification after this change: **73 tests passed**, including actual PDF generation with the source IFSC unchanged and confirmation unchecked, saved-record PDF viewing, startup bank preservation and the rebuilt offline artifact.

## Review before use

- Source 5 kW, **Rs. 4,85,000** including GST and **Rs. 98,000** subsidy are clearly marked editable reference values. They are not live market offers or statutory subsidy calculations. The sample indicative effective cost is **Rs. 3,87,000**; the vendor is still due the full GST-inclusive price.
- Subsidy is always conditional on eligibility, inspection and approval, paid directly to the customer; no payment timeline or approval promise is made. No loan interest-rate claim is included.
- The source tagline “Government Approved Vendor” is editable, not independently certified. The original proposal's solar photographs and four-mark identity strip are retained from the client-supplied PDF; their presence is not independent verification of approval or affiliation.
- Bank details, including the source IFSC, are preserved as entered. The optional bank-confirmation checkbox is a preparer’s note, not online bank verification and not an export requirement. Editing company fields clears that note.
- The browser stores personal data in unencrypted localStorage; backups contain the same information. Keep device access controlled, store backups securely, and back up regularly. No storage-capacity or retention guarantee is possible.
- PDFs use English/basic Latin text with safe punctuation and **Rs.** instead of a rupee glyph. Non-Latin characters are not supported by the bundled standard PDF font. PDF export is blocked with an explicit warning when unsupported characters are present; use English/transliterated quotation details and inspect the downloaded PDF. Long descriptions/terms paginate, repeat table headings and carry `Page X of Y` footers.

## PDF design

The exporter preserves the original four-page sequence for a standard quotation: branded photographic cover; four-column system configuration with investment summary; system details, terms, documents, payment terms and financing; validity, payment modes, bank details and signatures. Spacing, typography, alignment and the original blue/yellow hierarchy are polished, not replaced by a generic report. Long descriptions and added terms may create continuation pages rather than shrink or omit content. The on-screen review is a data check, not a pixel-identical PDF preview.

`assets/` contains cover artwork derived from the client-supplied original. `src/pdf-assets.js` embeds it for offline use; `build.cjs` bundles it into `index.html`. No images load from external URLs. `scripts/prepare-pdf-assets.py` is an optional regeneration utility requiring the original PDF, Pillow and PyMuPDF; ordinary builds use the checked-in assets. `Polished Sample Quotation.pdf` was downloaded through the real browser export flow using clearly synthetic customer/bank data.

## Development and verification

```sh
npm ci
npm run build
npm test
```

`build.cjs` bundles the pinned library distributions and source into the self-contained final `index.html`. Distributions and complete MIT license files are retained in `vendor/`; versions are locked in `package-lock.json`. Development dependencies are not required to use the final HTML.

Source:
- `src/core.js` — defaults, validation, local date, totals, quote store and backup validation.
- `src/pdf.js` — real jsPDF/AutoTable generation, account completeness and document validation.
- `src/app.js` — wizard, history, settings, escaping and download controls.
- `src/style.css` — responsive green/cream app with navy PDF-brand preview.
- `src/equipment.css` — compact quote overview, responsive focused editor, retained Configure table and accessible controls.
- `tests/*.test.cjs` — Node behavior tests and jsdom UI integration tests.
- `tests/output/long-quotation.pdf` — generated long-content test artifact with synthetic test customer data only.

The features were developed in test-first vertical slices: blank quote/validation, persistence/duplicate/delete, backup/restore, real PDF/bank gate, wizard flow, storage/review robustness and bank-only updates. Each new slice was run failing before its implementation, then the regression suite was rerun.

Tests expose/use `QuoteCore`, `QuotePDF` and `window.App` (including `store`, `quote`, `step`, `view`, `render`) in the browser. `core.js` and `pdf.js` also export CommonJS APIs for Node.

The project was originally developed without deployment or Git history; repository preparation is documented above. No deployment is performed by local build or tests. The owner-first workflow was implemented in failing-test-first vertical slices. The regression suite covers the focused workspace and existing quotation behavior, including the bundled offline artifact, baseline/legacy metadata validation, price-reminder persistence, independent item quantities, inclusion Undo, custom items, focused specification/back navigation, storage failure, Configure isolation, customer duplication, migrations/backups, bank validation, unsupported-character blocking and standard four-page PDF output. Obsolete quote-table expectations were replaced with focused-editor behavior; the retained table/disclosure tests now exercise Configure rather than dropping structural or responsive coverage.

Real Chromium QA used ego-browser at **320, 360, 390, 430, 700, 768, 1024 and 1280px**: no horizontal page or panel overflow, no clipped visible quick-quantity fields, phone panels spanning the viewport and desktop panels bounded to 580px. Overview and editor inclusion targets measured at least 44px high and wide. Native battery clicks and native field fills were exercised; geometry and most navigation actions used real-browser DOM handlers because ego-browser’s first click after automatic scrolling sometimes reported pointer interception (a subsequent observed in-view click succeeded). Browser checks passed battery exclusion/Undo, independent earthing quantity/specification editing, focused back navigation, reload persistence, unchanged-total confirmation and Configure isolation. The pre-test browser storage was restored exactly and read-back verified. Screenshot capture timed out through both the screenshot helper and direct CDP; no screenshots are claimed. Physical-phone testing remains unverified.
