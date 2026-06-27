export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthSession {
  user: AuthUser;
}

export interface StoredUser extends AuthUser {
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export type AuthErrorCode =
  | "invalid_email"
  | "password_too_short"
  | "passwords_mismatch"
  | "email_taken"
  | "invalid_credentials"
  | "name_required";

export interface AuthResult {
  success: boolean;
  error?: AuthErrorCode;
}
