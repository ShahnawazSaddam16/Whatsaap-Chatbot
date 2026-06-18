# WhatsApp Chatbot with Groq AI

A production-ready WhatsApp chatbot built with Node.js, Express, and Groq AI (LLaMA 3). Handles incoming WhatsApp messages via the WhatsApp Cloud API and responds intelligently using Groq's fast inference engine.

---

## Project Structure

```
whatsapp-chatbot/
├── src/
│   ├── config/
│   │   ├── env.js               # Environment variable config
│   │   └── groq.js              # Groq client initialization
│   ├── controllers/
│   │   ├── webhookController.js # Webhook verification & message intake
│   │   └── healthController.js  # Health check endpoint
│   ├── middlewares/
│   │   ├── errorHandler.js      # Global error handler
│   │   └── validator.js         # Request validation
│   ├── routes/
│   │   ├── webhook.js           # /webhook routes
│   │   └── health.js            # /health routes
│   ├── services/
│   │   ├── groqService.js       # Groq AI chat completions
│   │   ├── whatsappService.js   # WhatsApp Cloud API calls
│   │   └── messageHandler.js    # Message routing & commands
│   ├── utils/
│   │   ├── conversationStore.js # In-memory conversation history
│   │   └── logger.js            # Simple console logger
│   └── app.js                   # Express app entry point
├── .env.example                 # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- A Meta Developer account with WhatsApp Cloud API access
- A Groq account with an API key
- A publicly accessible HTTPS URL (use [ngrok](https://ngrok.com) for local development)

---

## Setup Guide

### 1. Clone and Install

```bash
git clone https://github.com/your-username/whatsapp-chatbot.git
cd whatsapp-chatbot
npm install
```

### 2. Configure Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
PORT=3000
NODE_ENV=development

WHATSAPP_API_URL=https://graph.facebook.com/v19.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama3-70b-8192
GROQ_MAX_TOKENS=1024
GROQ_TEMPERATURE=0.7

SYSTEM_PROMPT=You are a helpful WhatsApp assistant. Be concise, friendly, and helpful.
```

---

## Getting API Keys

### Groq API Key

1. Sign up at [https://console.groq.com](https://console.groq.com)
2. Go to **API Keys** in the dashboard
3. Click **Create API Key**
4. Copy the key into `GROQ_API_KEY`

Available models for `GROQ_MODEL`:
- `llama3-70b-8192` (recommended — best quality)
- `llama3-8b-8192` (faster, lighter)
- `mixtral-8x7b-32768` (large context window)
- `gemma-7b-it`

### WhatsApp Cloud API Keys

1. Go to [https://developers.facebook.com](https://developers.facebook.com) and log in
2. Click **My Apps** → **Create App** → choose **Business**
3. Add the **WhatsApp** product to your app
4. Go to **WhatsApp → API Setup**
5. Copy your **Phone Number ID** → `WHATSAPP_PHONE_NUMBER_ID`
6. Copy your **Temporary Access Token** → `WHATSAPP_ACCESS_TOKEN`
   - For production, generate a **System User Token** from Business Manager
7. Set `WHATSAPP_VERIFY_TOKEN` to any secure random string (you'll use this when configuring the webhook)
8. Copy your **WhatsApp Business Account ID** → `WHATSAPP_BUSINESS_ACCOUNT_ID`

---

## Running the Server

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will start on `http://localhost:3000`.

---

## Configuring the Webhook (Meta Developer Portal)

WhatsApp needs to reach your server over HTTPS. For local development, use ngrok:

### Step 1 — Expose localhost with ngrok

```bash
# Install ngrok
npm install -g ngrok

# Expose port 3000
ngrok http 3000
```

Copy the generated HTTPS URL (e.g. `https://abc123.ngrok-free.app`).

### Step 2 — Set up webhook in Meta Dashboard

1. Go to **WhatsApp → Configuration** in your Meta App
2. Click **Edit** next to Webhook
3. Set **Callback URL** to: `https://your-ngrok-url.ngrok-free.app/webhook`
4. Set **Verify Token** to the same value as `WHATSAPP_VERIFY_TOKEN` in your `.env`
5. Click **Verify and Save**
6. Under **Webhook Fields**, subscribe to: `messages`

### Step 3 — Add a test phone number

1. Go to **WhatsApp → API Setup**
2. Add your personal number as a test recipient
3. Send a WhatsApp message to the test number provided

---

## Available Chat Commands

Users can send these commands in the WhatsApp chat:

| Command | Action |
|---------|--------|
| `/reset` | Clear conversation history |
| `/clear` | Clear conversation history |
| `/start` | Start a new conversation |
| `/help` | Show available commands |

Any other message is sent to Groq AI and the response is returned.

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/` | Service info |
| `GET` | `/health` | Health check |
| `GET` | `/webhook` | Webhook verification (Meta handshake) |
| `POST` | `/webhook` | Incoming WhatsApp messages |

---

## Environment Variable Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | `development` or `production` |
| `WHATSAPP_API_URL` | Yes | WhatsApp Graph API base URL |
| `WHATSAPP_PHONE_NUMBER_ID` | Yes | Your WhatsApp phone number ID |
| `WHATSAPP_ACCESS_TOKEN` | Yes | WhatsApp API access token |
| `WHATSAPP_VERIFY_TOKEN` | Yes | Your custom webhook verify token |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Yes | WhatsApp Business Account ID |
| `GROQ_API_KEY` | Yes | Groq API key |
| `GROQ_MODEL` | No | Groq model name (default: `llama3-70b-8192`) |
| `GROQ_MAX_TOKENS` | No | Max response tokens (default: 1024) |
| `GROQ_TEMPERATURE` | No | Response creativity 0-1 (default: 0.7) |
| `SYSTEM_PROMPT` | No | AI personality/behavior instructions |

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `express` | HTTP server framework |
| `groq-sdk` | Official Groq AI client |
| `axios` | HTTP client for WhatsApp API |
| `dotenv` | Load environment variables |
| `morgan` | HTTP request logger |
| `nodemon` | Auto-restart in development |

---

## Deploying to Production

### Environment

Set `NODE_ENV=production` and use a long-lived WhatsApp System User Token (not the temporary one).

### Recommended Platforms

- **Railway** — `railway up`
- **Render** — connect GitHub repo, set env vars, deploy
- **Heroku** — `git push heroku main`
- **VPS (Ubuntu)** — use PM2 for process management:

```bash
npm install -g pm2
pm2 start src/app.js --name whatsapp-chatbot
pm2 save
pm2 startup
```

---

## Troubleshooting

**Webhook verification fails**
- Ensure `WHATSAPP_VERIFY_TOKEN` matches exactly what you entered in Meta dashboard
- Confirm your server is publicly accessible via HTTPS

**Messages not received**
- Check that you subscribed to the `messages` webhook field
- Verify your access token hasn't expired

**Groq errors**
- Confirm `GROQ_API_KEY` is valid
- Check [Groq status page](https://status.groq.com) for outages

---

## License

MIT
