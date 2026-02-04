import { useTranslation } from "react-i18next"
import { PASSWORD_SECURITY } from "../contants/security"

interface PasswordComplexityMeterProps {
  password: string
}

export function PasswordComplexityMeter({ password }: PasswordComplexityMeterProps) {
  const { t } = useTranslation()

  const getPasswordStrengthIndicator = (password: string) => {
    const length: string | null = !PASSWORD_SECURITY.MIN_LENGTH.REGEX.test(password)
      ? PASSWORD_SECURITY.MIN_LENGTH.ERROR
      : null
    const uppercase: string | null = !PASSWORD_SECURITY.MIN_UPPERCASE.REGEX.test(password)
      ? PASSWORD_SECURITY.MIN_UPPERCASE.ERROR
      : null
    const lowercase: string | null = !PASSWORD_SECURITY.MIN_LOWERCASE.REGEX.test(password)
      ? PASSWORD_SECURITY.MIN_LOWERCASE.ERROR
      : null
    const number: string | null = !PASSWORD_SECURITY.MIN_NUMBER.REGEX.test(password)
      ? PASSWORD_SECURITY.MIN_NUMBER.ERROR
      : null
    const special: string | null = !PASSWORD_SECURITY.MIN_SPECIAL.REGEX.test(password)
      ? PASSWORD_SECURITY.MIN_SPECIAL.ERROR
      : null

    const check = [length, uppercase, lowercase, number, special].map((item) => ({
      name: item,
      value: item === null,
    }))

    const width: number = (check.filter((c) => c.value).length / check.length) * 100
    const firstCorrection: number = check.findIndex((c) => !c.value)
    const text: string | null =
      password.length === 0
        ? "validation.password.enter-password"
        : firstCorrection === -1
          ? null
          : check[firstCorrection].name

    return {
      width: width,
      text: text ?? "validation.password.strong-password",
      color: width === 0 ? "#7D7D7D" : width < 50 ? "#ea3939" : width < 100 ? "#EA9139" : "#46d53f",
    }
  }

  const indicator = getPasswordStrengthIndicator(password)

  return (
    <div className="flex flex-col gap-2">
      <div className="h-2 w-full rounded bg-[#D9D9D9] dark:bg-[#7D7D7D]">
        <div
          className="h-2 rounded transition-all duration-500 ease-in-out"
          style={{
            width: `${indicator.width}%`,
            backgroundColor: indicator.color,
          }}
        ></div>
      </div>
      <p
        className="text-sm"
        style={{
          color: indicator.color,
        }}
      >
        {t(indicator.text)}
      </p>
    </div>
  )
}
