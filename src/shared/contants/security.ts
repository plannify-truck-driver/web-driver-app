export const PASSWORD_SECURITY = {
  MIN_LENGTH: {
    REGEX: /.{12,}/,
    ERROR: "validation.password.min-length",
  },
  MIN_LOWERCASE: {
    REGEX: /(?=(.*[a-z]){1,})/,
    ERROR: "validation.password.min-lowercase",
  },
  MIN_UPPERCASE: {
    REGEX: /(?=(.*[A-Z]){1,})/,
    ERROR: "validation.password.min-uppercase",
  },
  MIN_NUMBER: {
    REGEX: /(?=(.*\d){1,})/,
    ERROR: "validation.password.min-numbers",
  },
  MIN_SPECIAL: {
    REGEX: /(?=(.*[^a-zA-Z0-9]){1,})/,
    ERROR: "validation.password.min-symbols",
  },
}
