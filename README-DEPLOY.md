# MATHHUB 50.0 — AI Academic Intelligence

## GitHub Pages deployment
1. Keep your currently installed MATHHUB and its backup. Do not clear browser storage or uninstall the old app during testing.
2. Create a separate GitHub repository for MATHHUB 50.0.
3. Extract this ZIP and upload the contents of this folder to the repository root (index.html, manifest.webmanifest, sw.js, icons, backend folder, and docs).
4. In GitHub: Settings → Pages → Deploy from a branch → main → /(root).
5. Open the published URL in Chrome on Android. Test first in a normal browser tab before installing.
6. Install only after validating the records, navigation, backup/restore and offline launch.

## Data compatibility
This version writes to `mathHub50Data`, leaving the previous `mathHubData` storage key untouched. It does not automatically migrate legacy records. Export your old MATHHUB backup and keep it safe. This build is a separate application and will not erase the previous app's data.

## AI connection
The AI chat requires the separately deployed Cloudflare Worker in `backend/worker.js`. Follow `AI-SETUP.md`. Do not put API keys in GitHub or the frontend. Local tools are not generative AI.

## Scope and limitations
The 30 capability workspaces are included. Many local capabilities provide functioning record creation, review, calculations, summaries and planning. Advanced AI analyses that require a language model are clearly marked as requiring a secure backend; some insights are rule-based estimates, not validated predictions. Configure official course lists, grading scales, degree requirements and deadlines from verified university documents before relying on them.
