import { db } from "../prisma/db.js";
export async function createReport(input) {
    const user = await db.orm.public.User.first({
        id: input.userId,
    });
    if (!user) {
        throw new Error("User not found.");
    }
    const profile = await db.orm.public.MonitoringProfile.first({
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
export async function getReports(profileId) {
    return db.orm.public.Report
        .where({ profileId })
        .all();
}
export async function getReportById(id) {
    return db.orm.public.Report.first({
        id,
    });
}
export async function updateReport(id, input) {
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
export async function deleteReport(id) {
    const existing = await getReportById(id);
    if (!existing) {
        throw new Error("Report not found.");
    }
    return db.orm.public.Report
        .where({ id })
        .delete();
}
