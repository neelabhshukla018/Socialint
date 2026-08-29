import { db } from "../prisma/db.js";

export type CreateProfileInput = {
  clerkId: string;
  email: string;
  name?: string;
  username?: string;

  profileType: "PERSON" | "BRAND" | "CAMPAIGN";
  profileName: string;
  identifier: string;
};

export async function createProfile(input: CreateProfileInput) {
  // Find or create the application user.
  const existingUser = await db.orm.public.User.first({
    clerkId: input.clerkId,
  });

  const user =
    existingUser ??
    (await db.orm.public.User.create({
      clerkId: input.clerkId,
      email: input.email,
      name: input.name,
      username: input.username,
    }));

  const profile = await db.orm.public.MonitoringProfile.create({
    userId: user.id,
    name: input.profileName,
    type: input.profileType,
    identifier: input.identifier,
  });

  return {
    user,
    profile,
  };
}
export async function getProfiles(clerkId: string) {
  const user = await db.orm.public.User.first({
    clerkId,
  });

  if (!user) {
    return [];
  }

  return db.orm.public.MonitoringProfile
    .where({
      userId: user.id,
    })
    .all();
}