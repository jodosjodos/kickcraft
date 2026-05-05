import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  User,
  VerifyEmailRequest,
} from "@/types/api/auth";

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const MOCK_USER: User = {
  id: "mock-user-1",
  email: "user@kickcraft.rw",
  name: "Mugisha Eric",
  role: "user",
  phone: "+250788000001",
};

const MOCK_ADMIN: User = {
  id: "mock-admin-1",
  email: "admin@kickcraft.rw",
  name: "Admin",
  role: "admin",
};

// TODO: replace with real API call
export async function login(data: LoginRequest): Promise<User> {
  await delay(800);
  if (data.email === MOCK_ADMIN.email) return MOCK_ADMIN;
  return MOCK_USER;
}

// TODO: replace with real API call
export async function register(data: RegisterRequest): Promise<User> {
  await delay(900);
  return {
    id: `user-${Date.now()}`,
    email: data.email,
    name: data.name,
    phone: data.phone,
    role: "user",
  };
}

// TODO: replace with real API call
export async function logout(): Promise<void> {
  await delay(300);
}

// TODO: replace with real API call
export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<void> {
  await delay(700);
  void data;
}

// TODO: replace with real API call
export async function resetPassword(
  data: ResetPasswordRequest
): Promise<void> {
  await delay(700);
  void data;
}

// TODO: replace with real API call
export async function verifyEmail(data: VerifyEmailRequest): Promise<void> {
  await delay(600);
  void data;
}

// TODO: replace with real API call
export async function getMe(): Promise<User> {
  await delay(300);
  return MOCK_USER;
}
