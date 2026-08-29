import { db } from "../prisma/db.js";

export interface UpdateSettingsInput {
  appearance?: "LIGHT" | "DARK" | "SYSTEM";
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  weeklyReports?: boolean;
}

/**
 * Get settings for a user.
 *
 * If the user does not have settings yet,
 * default settings are created automatically.
 */
export async function getSettings(userId: number) {
  const settings = await db.orm.public.UserSettings.first({
    userId,
  });

  if (settings) {
    return settings;
  }

  return db.orm.public.UserSettings.create({
    userId,
    appearance: "SYSTEM",
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
  });
}

/**
 * Update user settings.
 *
 * If settings don't exist yet, they are created.
 */
export async function updateSettings(
  userId: number,
  input: UpdateSettingsInput
) {
  const existingSettings =
    await db.orm.public.UserSettings.first({
      userId,
    });

  if (!existingSettings) {
    return db.orm.public.UserSettings.create({
      userId,
      appearance: input.appearance ?? "SYSTEM",
      emailNotifications:
        input.emailNotifications ?? true,
      pushNotifications:
        input.pushNotifications ?? true,
      weeklyReports:
        input.weeklyReports ?? true,
    });
  }

  return db.orm.public.UserSettings
    .where({ userId })
    .update(input);
}