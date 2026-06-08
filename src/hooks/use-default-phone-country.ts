import { getCountryForTimezone } from "countries-and-timezones"
import type { Country } from "react-phone-number-input"

export function useDefaultPhoneCountry(): Country | undefined {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const country = getCountryForTimezone(tz)
  return country?.id as Country | undefined
}
