import { PASSWORD_SECURITY } from "../contants/security"

export const isPasswordStrong = (password: string): boolean => {
  return (
    PASSWORD_SECURITY.MIN_LENGTH.REGEX.test(password) &&
    PASSWORD_SECURITY.MIN_UPPERCASE.REGEX.test(password) &&
    PASSWORD_SECURITY.MIN_LOWERCASE.REGEX.test(password) &&
    PASSWORD_SECURITY.MIN_NUMBER.REGEX.test(password) &&
    PASSWORD_SECURITY.MIN_SPECIAL.REGEX.test(password)
  )
}
