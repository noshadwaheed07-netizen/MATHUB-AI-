# Secure AI setup

The frontend does not contain a provider API key. Deploy `backend/worker.js` as a Cloudflare Worker and configure:
- `OPENAI_API_KEY` as a Worker secret.
- `ALLOWED_ORIGIN` as the exact scheme + host of your GitHub Pages origin.
- `OPENAI_MODEL` as a model identifier enabled for your API account.

Then copy the Worker HTTPS URL into MATHHUB → AI Intelligence Centre → Secure connection. Test the endpoint and send a chat message. API usage may incur charges. Before public release, add authentication, per-user rate limits, abuse monitoring and privacy controls. The Worker starter is not a complete production security system.
