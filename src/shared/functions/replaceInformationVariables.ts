import type { Driver } from "@/shared/models/driver"

export const replaceInformationVariables = (message: string, driver: Driver): string =>
  message
    .replaceAll("FIRSTNAME", driver.first_name)
    .replaceAll("LASTNAME", driver.last_name)
    .replaceAll("EMAIL", driver.email)
