# ChatInterface Component - Integration Guide

The `ChatInterface` component is a reusable React component that you can use anywhere in your application.

## 📦 Component Location

```
components/dashboard/chat-interface.tsx
```

## 🎯 Basic Usage

### Simple Integration

```tsx
import ChatInterface from "@/components/dashboard/chat-interface"

export default function MyPage() {
  return (
    <div className="h-screen">
      <ChatInterface />
    </div>
  )
}
```

### With Custom Callback

```tsx
"use client"

import ChatInterface from "@/components/dashboard/chat-interface"
import { useState } from "react"

export default function MyPage() {
  const handleUserMessage = (message: string) => {
    console.log("User sent:", message)
    // Do something with the message
  }

  return (
    <ChatInterface onSendMessage={handleUserMessage} />
  )
}
```

## 📋 Props

| Prop | Type | Optional | Description |
|------|------|----------|-------------|
| `onSendMessage` | `(message: string) => void` | Yes | Callback when user sends a message |

## 🎨 Styling & Layout

The component includes:

- Full responsive design (mobile to desktop)
- Dark/light mode support (uses CSS variables)
- Scrollable message area
- Auto-scroll to latest messages
- Smooth animations

### Container Requirements

The component works best in containers with:

```tsx
<div className="h-screen">  {/* or h-[calc(100vh-XXpx)] */}
  <ChatInterface />
</div>
```

## 💬 Message Flow

1. User types in the input field
2. Message is added to chat history immediately
3. API request is sent to `/api/chat`
4. Response is displayed with "Thinking..." loading state
5. Assistant message appears when response arrives

## 🔌 API Endpoint

The component expects a `/api/chat` endpoint that accepts:

```typescript
POST /api/chat

Request Body:
{
  message: string          // Current user message
  conversationHistory: [   // Previous messages
    {
      role: "user" | "assistant",
      content: string
    }
  ]
}

Response:
{
  response: string  // AI assistant's response
}
```

## 🎮 Advanced Usage

### Custom API Endpoint

To use a different API endpoint, modify the `handleSendMessage` function in `chat-interface.tsx`:

```typescript
// Change this line:
const response = await fetch("/api/chat", {
  // To:
  const response = await fetch("/api/your-custom-endpoint", {
```

### Embedded Chat Widget

```tsx
// In a sidebar
<div className="w-96 h-96">
  <ChatInterface />
</div>

// In a modal
<div className="fixed bottom-4 right-4 w-80 h-96 shadow-xl">
  <ChatInterface />
</div>

// In a full-page dialog
<div className="fixed inset-0 flex items-center justify-center">
  <div className="w-2/3 h-2/3">
    <ChatInterface />
  </div>
</div>
```

### With Error Handling

The component includes built-in error handling. If the API call fails, it will display:

```
"Sorry, I encountered an error. Please try again later or check your API configuration."
```

Check the browser console for detailed error messages.

## 🎯 Features

✓ Real-time messaging
✓ Persistent conversation history (within session)
✓ Loading states with animations
✓ Error handling with user-friendly messages
✓ Responsive design
✓ Auto-scrolling to latest messages
✓ Timestamp for each message
✓ User/Assistant visual distinction
✓ Keyboard support (Enter to send)
✓ Disabled state while loading

## 🔐 Security Notes

- Never expose API keys in the component
- Always use server-side environment variables
- API calls are made through your Next.js backend
- Messages are only stored in the browser session
- No data persists across page refreshes (unless you add localStorage)

## 🚀 Performance Tips

1. **Lazy load** the component if it's not immediately visible
2. **Limit message history** sent to API (only last N messages)
3. **Cache responses** for common questions
4. **Use streaming** for faster perceived response times

## 📱 Mobile Considerations

The component is fully responsive:

- Optimized input on mobile keyboards
- Touch-friendly buttons
- Adjusts message width for smaller screens
- Maintains usability on portrait/landscape

## 🔄 Extending the Component

### Add Message Persistence

```tsx
// In your component or wrapper
useEffect(() => {
  const saved = localStorage.getItem("chatMessages")
  if (saved) setMessages(JSON.parse(saved))
}, [])

useEffect(() => {
  localStorage.setItem("chatMessages", JSON.stringify(messages))
}, [messages])
```

### Add Suggested Questions

```tsx
// Before the input
<div className="grid grid-cols-2 gap-2 mb-4">
  {suggestedQuestions.map(q => (
    <button key={q} onClick={() => setInputValue(q)}>
      {q}
    </button>
  ))}
</div>
```

### Add Export/Download

```tsx
const downloadChat = () => {
  const text = messages
    .map(m => `${m.role}: ${m.content}`)
    .join("\n\n")
  // Download as file...
}
```

## 🐛 Common Issues

### Messages not sending?
- Ensure the API endpoint is working
- Check network tab in DevTools
- Verify API key is configured (if using OpenAI)

### Component not rendering?
- Make sure it's in a client component (`"use client"`)
- Check that the component has proper height
- Verify all props are correct types

### Styling looks wrong?
- Check that Tailwind CSS is configured
- Verify theme colors are defined in your CSS
- Check browser DevTools for CSS conflicts

## 📚 Related Files

- `/app/api/chat/route.ts` - Backend API endpoint
- `/app/dashboard/ai/page.tsx` - Example usage page
- `/styles/globals.css` - Theme definitions

---

**Need help?** Check the `CHAT_SETUP.md` file for more information.
