import { isPasswordStrong } from "./isPasswordStrong"

export const generateStrongPassword = (): string => {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numbers = "0123456789"
  const specials = "!@#$%^&*_"

  let password: string = ""

  do {
    password = Array.from({ length: Math.round(Math.random() * 6 + 12) }, () => {
      const type = Math.floor(Math.random() * 3)
      switch (type) {
        case 0:
          return letters[Math.floor(Math.random() * letters.length)]
        case 1:
          return numbers[Math.floor(Math.random() * numbers.length)]
        case 2:
          return specials[Math.floor(Math.random() * specials.length)]
        default:
          return letters[Math.floor(Math.random() * letters.length)]
      }
    }).join("")
  } while (!isPasswordStrong(password))

  return password
}
