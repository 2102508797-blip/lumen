# AI Chat Assistant Setup Guide

Your smart-calendar-app now includes an integrated AI chat assistant! Follow these steps to enable full functionality.

## 📋 What's New

- **Chat Interface Component** - Modern, responsive chat UI with message history
- **API Integration** - Backend API endpoint for AI conversations
- **AI Assistant Page** - Dedicated page at `/dashboard/ai` with chat and productivity tips
- **Mock Responses** - Works without API key (basic responses)
- **OpenAI Integration** - Optional: Connect to ChatGPT for advanced responses

## 🚀 Quick Start (Works Out of the Box)

The chat feature works immediately without any setup:

1. Navigate to your dashboard
2. Go to the **AI Assistant** page
3. Start typing messages!

The app includes built-in mock responses for common productivity questions.

## 🔐 Setup with OpenAI (Optional - For Advanced AI Responses)

To enable ChatGPT-powered responses, follow these steps:

### Step 1: Get Your OpenAI API Key

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign up or log in to your OpenAI account
3. Click "Create new secret key"
4. Copy the key (you won't be able to see it again)

### Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
touch .env.local
```

Add your API key:

```
OPENAI_API_KEY=sk-your-key-here
```

⚠️ **Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

### Step 3: Restart Your Development Server

```bash
npm run dev
# or
pnpm dev
```

## 🔐 Setup with Gemini (Google Generative API) - Optional

To enable responses from Google's Gemini (Generative Language) models, follow these steps:

### Step 1: Get a Google API Key or Service Account

1. Go to Google Cloud Console and enable the Generative AI (Generative Language) API for your project.
2. Create an API key or configure a service account with the appropriate permissions.
3. Copy the key (or configure your service account credentials in your environment).

### Step 2: Configure Environment Variables

Add to your `.env.local` (project root):

```
GEMINI_API_KEY=your-gemini-api-key-here
USE_GEMINI=true
```

Notes:
- The implementation uses the Generative Language REST endpoint and expects `GEMINI_API_KEY` to be a usable API key. If you use service account credentials or a different auth flow, adapt the server route accordingly.
- If both `USE_GEMINI=true` and `USE_OPENAI=true` are set, `USE_GEMINI` takes precedence in the current implementation.

### Step 3: Restart Your Development Server

```bash
npm run dev
# or
pnpm dev
```

If Gemini returns quota or billing errors, the server will surface a helpful `insufficient_quota` message and fall back to mock responses when appropriate.

## 📁 File Structure

```
components/dashboard/
├── chat-interface.tsx          # Main chat UI component
├── calendar-view.tsx
├── navigation.tsx
└── time-blocking-modal.tsx

app/
├── api/
│   └── chat/
│       └── route.ts            # Chat API endpoint
└── dashboard/
    ├── ai/
    │   └── page.tsx           # AI Assistant page
    ├── page.tsx
    └── ...
```

## 💬 How to Use

### Chat Features

- **Send Messages**: Type in the input field and press Enter or click Send
- **Conversation History**: Messages are maintained in the current session
- **Loading State**: Shows "Thinking..." while waiting for a response
- **Timestamps**: Each message shows when it was sent
- **Responsive Design**: Works on mobile and desktop

### Types of Questions

The AI can help with:

- ✓ Time management strategies
- ✓ Productivity techniques
- ✓ Time blocking best practices
- ✓ Schedule optimization
- ✓ Task organization
- ✓ Motivation and focus tips
- ✓ Breaking down large projects

### Example Prompts

Try asking:

- "How should I structure my time blocking?"
- "What are productivity tips for deep work?"
- "I'm overwhelmed with tasks, what should I do?"
- "How can I optimize my daily schedule?"
- "What's the Pomodoro Technique?"

## 🔧 Customization

### Change the System Prompt

Edit `/app/api/chat/route.ts` to modify the assistant's personality:

```typescript
const SYSTEM_PROMPT = `Your custom instructions here...`
```

### Change the AI Model

In the same file, modify the model parameter:

```typescript
model: "gpt-4",  // or "gpt-4-turbo", etc.
```

### Adjust Response Parameters

```typescript
{
  temperature: 0.7,      // 0-2, higher = more creative
  max_tokens: 500,       // Longer/shorter responses
}
```

## 🐛 Troubleshooting

### "I couldn't process that request"

- Check if `OPENAI_API_KEY` is set in `.env.local`
- Verify the API key is valid and has credits
- Check browser console for error messages

### Slow Responses

- API calls typically take 1-2 seconds
- This is normal behavior
- Check your internet connection

### No Response at All

- Reload the page
- Check that the server is running (`npm run dev`)
- Verify `/api/chat` endpoint is accessible

## 🛡️ Security Notes

- API keys should never be exposed in frontend code
- Always use `.env.local` for sensitive credentials
- The `.env.local` file is in `.gitignore` by default
- Be mindful of API costs (OpenAI charges per token)

## 💰 Cost Considerations

OpenAI API pricing (as of 2024):

- **GPT-3.5-turbo**: ~$0.0005-0.0015 per 1K tokens (cheapest, fast)
- **GPT-4**: ~$0.03-0.06 per 1K tokens (more powerful, slower)

A typical conversation uses 500-1000 tokens per exchange.

## 📚 More Resources

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Chat Completions Guide](https://platform.openai.com/docs/guides/gpt)
- [Prompt Engineering Tips](https://platform.openai.com/docs/guides/prompt-engineering)

## 🎉 You're All Set!

Your AI chat assistant is ready to go. Start a conversation in `/dashboard/ai` and enjoy personalized productivity advice!
