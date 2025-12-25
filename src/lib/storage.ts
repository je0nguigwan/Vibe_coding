import { Member, MemberPreferences, SessionState, SwipeValue, ChatMessage } from "@/lib/types";

const SESSION_KEY_PREFIX = "foodtinder.session.";
const CURRENT_KEY = "foodtinder.current";
const PREFS_BY_NAME = "foodtinder.prefs.byname";

type CurrentSession = {
  code: string;
  memberId: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function getSessionKey(code: string) {
  return `${SESSION_KEY_PREFIX}${code}`;
}

export function generateSessionCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getCurrentSession(): CurrentSession | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(CURRENT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CurrentSession;
  } catch {
    return null;
  }
}

export function setCurrentSession(current: CurrentSession) {
  if (!isBrowser()) return;
  window.localStorage.setItem(CURRENT_KEY, JSON.stringify(current));
}

export function getSession(code: string): SessionState | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(getSessionKey(code));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionState;
  } catch {
    return null;
  }
}

export function saveSession(session: SessionState) {
  if (!isBrowser()) return;
  window.localStorage.setItem(getSessionKey(session.code), JSON.stringify(session));
}

export function getSavedPreferencesByName(name: string): MemberPreferences | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(PREFS_BY_NAME);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Record<string, MemberPreferences>;
    return data[name] ?? null;
  } catch {
    return null;
  }
}

export function savePreferencesForName(name: string, prefs: MemberPreferences) {
  if (!isBrowser()) return;
  const raw = window.localStorage.getItem(PREFS_BY_NAME);
  const data = raw ? (JSON.parse(raw) as Record<string, MemberPreferences>) : {};
  data[name] = prefs;
  window.localStorage.setItem(PREFS_BY_NAME, JSON.stringify(data));
}

export function createSession(name: string, memberName: string) {
  const code = generateSessionCode();
  const member: Member = {
    id: crypto.randomUUID(),
    name: memberName,
    joinedAt: new Date().toISOString(),
  };
  const session: SessionState = {
    code,
    name,
    createdAt: new Date().toISOString(),
    members: [member],
    preferences: {},
    swipes: {},
    messages: [],
    directMessages: {},
  };
  saveSession(session);
  setCurrentSession({ code, memberId: member.id });
  return { session, member };
}

export function joinSession(code: string, memberName: string) {
  const session = getSession(code);
  if (!session) return null;
  const member: Member = {
    id: crypto.randomUUID(),
    name: memberName,
    joinedAt: new Date().toISOString(),
  };
  const updated = {
    ...session,
    members: [...session.members, member],
    directMessages: session.directMessages ?? {},
  };
  saveSession(updated);
  setCurrentSession({ code, memberId: member.id });
  return { session: updated, member };
}

export function savePreferences(code: string, memberId: string, prefs: MemberPreferences) {
  const session = getSession(code);
  if (!session) return;
  const updated = {
    ...session,
    preferences: {
      ...session.preferences,
      [memberId]: prefs,
    },
  };
  saveSession(updated);
}

export function saveSwipe(code: string, memberId: string, restaurantId: string, value: SwipeValue) {
  const session = getSession(code);
  if (!session) return;
  const memberSwipes = session.swipes[memberId] ?? {};
  const updated = {
    ...session,
    swipes: {
      ...session.swipes,
      [memberId]: {
        ...memberSwipes,
        [restaurantId]: value,
      },
    },
  };
  saveSession(updated);
}

export function addChatMessage(code: string, payload: Omit<ChatMessage, "id" | "createdAt">) {
  const session = getSession(code);
  if (!session) return;
  const message: ChatMessage = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const updated = {
    ...session,
    messages: [...session.messages, message],
  };
  saveSession(updated);
}

export function addDirectMessage(code: string, threadId: string, payload: Omit<ChatMessage, "id" | "createdAt">) {
  const session = getSession(code);
  if (!session) return;
  const message: ChatMessage = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const thread = session.directMessages?.[threadId] ?? [];
  const updated = {
    ...session,
    directMessages: {
      ...session.directMessages,
      [threadId]: [...thread, message],
    },
  };
  saveSession(updated);
}
