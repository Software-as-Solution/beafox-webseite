// ─── CHAT REDUCER ─────────────────────────────────────────
// Centralized state management for the chat phase. All transitions
// flow through this reducer for predictable, testable behavior.

import type { ChatAction, ChatState } from "./chatTypes";

export const initialChatState: ChatState = {
  status: "idle",
  messages: [],
  error: null,
  remaining: null,
  lastInput: null,
  quickReplies: [],
  shownCardIds: [],
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "addUserMessage":
      return {
        ...state,
        messages: [...state.messages, action.message],
        status: "streaming",
        error: null,
        lastInput: action.input,
        quickReplies: [],
      };

    case "streamStart":
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: action.assistantId,
            role: "assistant",
            content: "",
            timestamp: new Date(),
          },
        ],
      };

    case "streamText":
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.assistantId
            ? { ...m, content: action.text, model: action.model ?? m.model }
            : m,
        ),
      };

    case "streamMeta":
      return { ...state, remaining: action.remaining };

    case "streamEnd":
      return { ...state, status: "idle" };

    case "error":
      return {
        ...state,
        status: "error",
        error: action.message,
        messages: state.messages.filter(
          (m) => m.role === "user" || m.content.length > 0,
        ),
      };

    case "sessionLimit":
      return { ...state, status: "session_limited", error: null };

    case "clearError":
      return { ...state, error: null, status: "idle" };

    case "retryStart":
      return { ...state, status: "streaming", error: null };

    case "reset":
      return initialChatState;

    case "greetingStart":
      return {
        ...state,
        status: "greeting",
        messages: [],
        quickReplies: [],
        shownCardIds: [],
      };

    case "greetingMessage":
      return {
        ...state,
        messages: [...state.messages, action.message],
      };

    case "greetingDone":
      return {
        ...state,
        status: "idle",
        quickReplies: action.quickReplies,
      };

    case "addProactiveMessage":
      return {
        ...state,
        messages: [...state.messages, action.message],
      };

    case "addCard":
      return {
        ...state,
        messages: [...state.messages, action.message],
        shownCardIds: [...state.shownCardIds, action.cardId],
      };
  }
}
