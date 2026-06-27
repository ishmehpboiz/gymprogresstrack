import type {
  AuthErrorCode,
  AuthResult,
  AuthSession,
  AuthUser,
  LoginInput,
  SignupInput,
  StoredUser,
} from "@/types/auth";

const USERS_KEY = "gym_users";
const SESSION_KEY = "gym_session";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readUsers(): StoredUser[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function createId(): string {
  return crypto.randomUUID();
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toAuthUser(user: StoredUser): AuthUser {
  return { id: user.id, email: user.email, name: user.name };
}

export function getSession(): AuthSession | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function saveSession(user: AuthUser): AuthSession {
  const session: AuthSession = { user };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function signup(input: SignupInput): AuthResult {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (!name) return { success: false, error: "name_required" };
  if (!isValidEmail(email)) return { success: false, error: "invalid_email" };
  if (password.length < 8) return { success: false, error: "password_too_short" };

  const users = readUsers();
  if (users.some((u) => u.email === email)) {
    return { success: false, error: "email_taken" };
  }

  const newUser: StoredUser = {
    id: createId(),
    name,
    email,
    password,
  };

  writeUsers([...users, newUser]);
  saveSession(toAuthUser(newUser));
  return { success: true };
}

export function login(input: LoginInput): AuthResult {
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (!isValidEmail(email)) return { success: false, error: "invalid_email" };

  const user = readUsers().find((u) => u.email === email && u.password === password);
  if (!user) return { success: false, error: "invalid_credentials" };

  saveSession(toAuthUser(user));
  return { success: true };
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function authErrorMessage(code: AuthErrorCode): string {
  const messages: Record<AuthErrorCode, string> = {
    invalid_email: "Enter a valid email address.",
    password_too_short: "Password must be at least 8 characters.",
    passwords_mismatch: "Passwords do not match.",
    email_taken: "An account with this email already exists.",
    invalid_credentials: "Incorrect email or password.",
    name_required: "Name is required.",
  };
  return messages[code];
}
