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

export const validateSignUp = (values: SignUpFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Username validation
  if (!values.username || values.username.trim().length === 0) {
    errors.username = "Benutzername fehlt!";
  } else if (values.username.trim().length < 3) {
    errors.username = "Benutzername ist zu kurz!";
  } else if (values.username.trim().length > 20) {
    errors.username = "Benutzername ist zu lang!";
  }

  // Email validation
  if (!values.email || values.email.trim().length === 0) {
    errors.email = "E-Mail fehlt!";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "E-Mail nicht gültig!";
  }

  // Password validation
  if (!values.password || values.password.trim().length === 0) {
    errors.password = "Passwort fehlt!";
  } else if (values.password.length < 8) {
    errors.password = "Passwort ist zu kurz!";
  } else if (
    !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{}|;:'",.<>/?`~\\])/.test(
      values.password
    )
  ) {
    errors.password = "Benutze Sonderzeichen und Zahlen!";
  }

  // Confirm password validation
  if (!values.confirmPassword) {
    errors.confirmPassword = "Passwort-Bestätigung fehlt!";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwörter stimmen nicht überein!";
  }

  // Role validation
  if (!values.role || !["user", "teacher"].includes(values.role)) {
    errors.role = "Ungültige Rolle!";
  }

  // School fields validation (only if teacher)
  if (values.role === "teacher") {
    if (!values.schoolName || values.schoolName.trim().length === 0) {
      errors.schoolName = "Schulname fehlt!";
    } else if (values.schoolName.trim().length < 2) {
      errors.schoolName = "Schulname ist zu kurz!";
    }

    if (!values.schoolLocation || values.schoolLocation.trim().length === 0) {
      errors.schoolLocation = "Schulort fehlt!";
    } else if (values.schoolLocation.trim().length < 2) {
      errors.schoolLocation = "Schulort ist zu kurz!";
    }
  }

  return errors;
};
