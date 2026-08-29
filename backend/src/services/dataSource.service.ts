import { db } from "../prisma/db.js";

interface CreateDataSourceInput {
  profileId: number;
  platform: string;
  username?: string;
  profileUrl?: string;
  externalId?: string;
}

interface UpdateDataSourceInput {
  status?: string;
  username?: string;
  profileUrl?: string;
  externalId?: string;
}

/**
 * Get all data sources belonging to a monitoring profile.
 */
export async function getDataSources(profileId: number) {
  return db.orm.public.DataSource
    .where({ profileId })
    .all();
}

/**
 * Get one data source.
 */
export async function getDataSourceById(id: number) {
  return db.orm.public.DataSource.first({ id });
}

/**
 * Connect a platform.
 *
 * Because the schema has:
 * @@unique([profileId, platform])
 *
 * we first check whether this platform is already connected.
 */
export async function connectDataSource(
  input: CreateDataSourceInput
) {
  const {
    profileId,
    platform,
    username,
    profileUrl,
    externalId,
  } = input;

  // Make sure the monitoring profile exists.
  const profile = await db.orm.public.MonitoringProfile.first({
    id: profileId,
  });

  if (!profile) {
    throw new Error("Monitoring profile not found.");
  }

  // Check if this platform already exists for this profile.
  const existing = await db.orm.public.DataSource.first({
    profileId,
    platform,
  });

  if (existing) {
    // If already present, reconnect/update it.
    return db.orm.public.DataSource
      .where({ id: existing.id })
      .update({
        status: "CONNECTED",
        username: username ?? existing.username,
        profileUrl: profileUrl ?? existing.profileUrl,
        externalId: externalId ?? existing.externalId,
        lastSyncedAt: new Date(),
      });
  }

  // Create a new connection.
  return db.orm.public.DataSource.create({
    profileId,
    platform,
    status: "CONNECTED",
    username: username ?? null,
    profileUrl: profileUrl ?? null,
    externalId: externalId ?? null,
    lastSyncedAt: new Date(),
  });
}

/**
 * Update a data source.
 */
export async function updateDataSource(
  id: number,
  input: UpdateDataSourceInput
) {
  const existing = await getDataSourceById(id);

  if (!existing) {
    throw new Error("Data source not found.");
  }

  return db.orm.public.DataSource
    .where({ id })
    .update({
      ...(input.status !== undefined
        ? { status: input.status }
        : {}),
      ...(input.username !== undefined
        ? { username: input.username }
        : {}),
      ...(input.profileUrl !== undefined
        ? { profileUrl: input.profileUrl }
        : {}),
      ...(input.externalId !== undefined
        ? { externalId: input.externalId }
        : {}),
      ...(input.status === "CONNECTED"
        ? { lastSyncedAt: new Date() }
        : {}),
    });
}

/**
 * Disconnect a platform.
 *
 * We DON'T delete the database row.
 * We simply change its status.
 */
export async function disconnectDataSource(id: number) {
  const existing = await getDataSourceById(id);

  if (!existing) {
    throw new Error("Data source not found.");
  }

  return db.orm.public.DataSource
    .where({ id })
    .update({
      status: "DISCONNECTED",
    });
}

/**
 * Permanently delete a data source.
 */
export async function deleteDataSource(id: number) {
  const existing = await getDataSourceById(id);

  if (!existing) {
    throw new Error("Data source not found.");
  }

  return db.orm.public.DataSource
    .where({ id })
    .delete();
}