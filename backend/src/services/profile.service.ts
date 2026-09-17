import { db } from "../prisma/db.js";

export type CreateProfileInput = {
  clerkId: string;
  email: string;
  name?: string;
  username?: string;

  profileType: "PERSON" | "BRAND" | "CAMPAIGN";
  profileName: string;
  identifier: string;
  description?: string;
};

export type UpdateProfileInput = {
  name?: string;
  type?: "PERSON" | "BRAND" | "CAMPAIGN";
  identifier?: string;
  description?: string;
  isActive?: boolean;
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

  // If this is the user's first profile, ensure it's marked active.
  // If user already has profiles, deactivate existing ones so the newly created profile becomes the active one.
  const existingProfiles = await db.orm.public.MonitoringProfile
    .where({ userId: user.id })
    .all();

  for (const p of existingProfiles) {
    if (p.isActive) {
      await db.orm.public.MonitoringProfile.where({ id: p.id }).update({ isActive: false });
    }
  }

  const profile = await db.orm.public.MonitoringProfile.create({
    userId: user.id,
    name: input.profileName,
    type: input.profileType,
    identifier: input.identifier,
    description: input.description ?? null,
    isActive: true,
  });

  return {
    user,
    profile: {
      ...profile,
      dataSources: [],
    },
  };
}

export async function getProfiles(clerkId: string) {
  const user = await db.orm.public.User.first({
    clerkId,
  });

  if (!user) {
    return [];
  }

  const profiles = await db.orm.public.MonitoringProfile
    .where({
      userId: user.id,
    })
    .all();

  // Attach connected data sources to each profile
  const profilesWithSources = await Promise.all(
    profiles.map(async (p) => {
      const dataSources = await db.orm.public.DataSource
        .where({
          profileId: p.id,
        })
        .all();

      return {
        ...p,
        dataSources,
      };
    })
  );

  return profilesWithSources;
}

export async function getProfileById(id: number) {
  const profile = await db.orm.public.MonitoringProfile.first({
    id,
  });

  if (!profile) return null;

  const dataSources = await db.orm.public.DataSource
    .where({
      profileId: id,
    })
    .all();

  return {
    ...profile,
    dataSources,
  };
}

export async function updateProfile(id: number, input: UpdateProfileInput) {
  const existing = await db.orm.public.MonitoringProfile.first({
    id,
  });

  if (!existing) {
    throw new Error("Profile not found.");
  }

  await db.orm.public.MonitoringProfile
    .where({ id })
    .update({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.type !== undefined ? { type: input.type } : {}),
      ...(input.identifier !== undefined ? { identifier: input.identifier } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    });

  return getProfileById(id);
}

export async function setActiveProfile(id: number, clerkId: string) {
  const user = await db.orm.public.User.first({
    clerkId,
  });

  if (!user) {
    throw new Error("User not found.");
  }

  // Deactivate all user's profiles
  const profiles = await db.orm.public.MonitoringProfile
    .where({ userId: user.id })
    .all();

  for (const p of profiles) {
    await db.orm.public.MonitoringProfile.where({ id: p.id }).update({
      isActive: p.id === id,
    });
  }

  return getProfileById(id);
}

export async function deleteProfile(id: number) {
  const existing = await db.orm.public.MonitoringProfile.first({
    id,
  });

  if (!existing) {
    throw new Error("Profile not found.");
  }

  // Clean up related data sources first
  await db.orm.public.DataSource.where({ profileId: id }).delete();

  // Clean up related posts
  await db.orm.public.Post.where({ profileId: id }).delete();

  // Delete profile
  await db.orm.public.MonitoringProfile.where({ id }).delete();

  return true;
}