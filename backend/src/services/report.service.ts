import { db } from "../prisma/db.js";

interface CreateReportInput {
  userId: number;
  profileId: number;
  title: string;
  description?: string;
  fileUrl?: string;
}

interface UpdateReportInput {
  title?: string;
  description?: string | null;
  fileUrl?: string | null;
}

export async function createReport(
  input: CreateReportInput
) {
  const user = await db.orm.public.User.first({
    id: input.userId,
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const profile =
    await db.orm.public.MonitoringProfile.first({
      id: input.profileId,
    });

  if (!profile) {
    throw new Error("Monitoring profile not found.");
  }

  return db.orm.public.Report.create({
    userId: input.userId,
    profileId: input.profileId,
    title: input.title,
    description: input.description ?? null,
    fileUrl: input.fileUrl ?? null,
  });
}

export async function getReports(profileId: number) {
  return db.orm.public.Report
    .where({ profileId })
    .all();
}

export async function getReportById(id: number) {
  return db.orm.public.Report.first({
    id,
  });
}

export async function updateReport(
  id: number,
  input: UpdateReportInput
) {
  const existing = await getReportById(id);

  if (!existing) {
    throw new Error("Report not found.");
  }

  return db.orm.public.Report
    .where({ id })
    .update({
      ...(input.title !== undefined
        ? { title: input.title }
        : {}),

      ...(input.description !== undefined
        ? { description: input.description }
        : {}),

      ...(input.fileUrl !== undefined
        ? { fileUrl: input.fileUrl }
        : {}),
    });
}

export async function deleteReport(id: number) {
  const existing = await getReportById(id);

  if (!existing) {
    throw new Error("Report not found.");
  }

  return db.orm.public.Report
    .where({ id })
    .delete();
}