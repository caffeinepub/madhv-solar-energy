# MADHV Solar Energy

## Current State
WhatsApp chatbot exists as a floating button (bottom-right). It opens a panel with festival messages, marketing images, quick-reply buttons, and a text input. Users must manually open the chat.

## Requested Changes (Diff)

### Add
- Auto-open the chatbot after 4 seconds on first page visit (stored in sessionStorage so it doesn't re-open on every interaction)
- A prominent "💬 Start Personal Chat" button inside the chatbot that opens WhatsApp directly with a personalized pre-filled message
- Auto-open notification badge animation to draw attention

### Modify
- Chatbot floating button pulses/glows to indicate "new message" when auto-popup triggers
- When the chatbot auto-opens, show a special "tap to chat" CTA message at the top

### Remove
Nothing removed.

## Implementation Plan
1. In WhatsAppChatbot.tsx: add sessionStorage flag `madhav_chat_shown` to control auto-open once per session
2. useEffect on mount: after 4 seconds, if flag not set, setIsOpen(true) and set flag
3. Add a `isAutoOpened` state to show a special intro message when auto-opened
4. Add a full-width "💬 Send Personal Message on WhatsApp" button that opens wa.me with a personal Gujarati+English greeting pre-filled
5. Keep all existing functionality intact
