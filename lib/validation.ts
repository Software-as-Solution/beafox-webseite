// Validation schemas for BeAFox Website (matching app validation)

export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "teacher";
  schoolName?: string;
  schoolLocation?: string;
}

export type SignUpValidationMessages = {
  usernameMissing: string;
  usernameTooShort: string;
  usernameTooLong: string;
  emailMissing: string;
  emailInvalid: string;
  passwordMissing: string;
  passwordTooShort: string;
  passwordWeak: string;
  confirmPasswordMissing: string;
  confirmPasswordMismatch: string;
  roleInvalid: string;
  schoolNameMissing: string;
  schoolNameTooShort: string;
  schoolLocationMissing: string;
  schoolLocationTooShort: string;
};

export const defaultSignUpValidationMessages: SignUpValidationMessages = {
  usernameMissing: "Benutzername fehlt!",
  usernameTooShort: "Benutzername ist zu kurz!",
  usernameTooLong: "Benutzername ist zu lang!",
  emailMissing: "E-Mail fehlt!",
  emailInvalid: "E-Mail nicht gültig!",
  passwordMissing: "Passwort fehlt!",
  passwordTooShort: "Passwort ist zu kurz!",
  passwordWeak: "Benutze Sonderzeichen und Zahlen!",
  confirmPasswordMissing: "Passwort-Bestätigung fehlt!",
  confirmPasswordMismatch: "Passwörter stimmen nicht überein!",
  roleInvalid: "Ungültige Rolle!",
  schoolNameMissing: "Schulname fehlt!",
  schoolNameTooShort: "Schulname ist zu kurz!",
  schoolLocationMissing: "Schulort fehlt!",
  schoolLocationTooShort: "Schulort ist zu kurz!",
};

export const validateSignUp = (
  values: SignUpFormData,
  messages: SignUpValidationMessages = defaultSignUpValidationMessages
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Username validation
  if (!values.username || values.username.trim().length === 0) {
    errors.username = messages.usernameMissing;
  } else if (values.username.trim().length < 3) {
    errors.username = messages.usernameTooShort;
  } else if (values.username.trim().length > 20) {
    errors.username = messages.usernameTooLong;
  }

  // Email validation
  if (!values.email || values.email.trim().length === 0) {
    errors.email = messages.emailMissing;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = messages.emailInvalid;
  }

  // Password validation
  if (!values.password || values.password.trim().length === 0) {
    errors.password = messages.passwordMissing;
  } else if (values.password.length < 8) {
    errors.password = messages.passwordTooShort;
  } else if (
    !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{}|;:'",.<>/?`~\\])/.test(
      values.password
    )
  ) {
    errors.password = messages.passwordWeak;
  }

  // Confirm password validation
  if (!values.confirmPassword) {
    errors.confirmPassword = messages.confirmPasswordMissing;
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = messages.confirmPasswordMismatch;
  }

  // Role validation
  if (!values.role || !["user", "teacher"].includes(values.role)) {
    errors.role = messages.roleInvalid;
  }

  // School fields validation (only if teacher)
  if (values.role === "teacher") {
    if (!values.schoolName || values.schoolName.trim().length === 0) {
      errors.schoolName = messages.schoolNameMissing;
    } else if (values.schoolName.trim().length < 2) {
      errors.schoolName = messages.schoolNameTooShort;
    }

    if (!values.schoolLocation || values.schoolLocation.trim().length === 0) {
      errors.schoolLocation = messages.schoolLocationMissing;
    } else if (values.schoolLocation.trim().length < 2) {
      errors.schoolLocation = messages.schoolLocationTooShort;
    }
  }

  return errors;
};
