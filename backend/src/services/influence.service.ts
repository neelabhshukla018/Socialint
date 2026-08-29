import { db } from "../prisma/db.js";

interface CreateNodeInput {
  profileId: number;
  name: string;
  username?: string;
  category?: string;
  influenceScore?: number;
  xPosition?: number;
  yPosition?: number;
}

interface CreateConnectionInput {
  fromNodeId: number;
  toNodeId: number;
  strength?: number;
  interactions?: number;
}

export async function createInfluenceNode(
  input: CreateNodeInput
) {
  const profile =
    await db.orm.public.MonitoringProfile.first({
      id: input.profileId,
    });

  if (!profile) {
    throw new Error("Monitoring profile not found.");
  }

  return db.orm.public.InfluenceNode.create({
    profileId: input.profileId,
    name: input.name,
    username: input.username ?? null,
    category: input.category ?? null,
    influenceScore: input.influenceScore ?? 0,
    xPosition: input.xPosition ?? null,
    yPosition: input.yPosition ?? null,
  });
}

export async function getInfluenceNodes(
  profileId: number
) {
  return db.orm.public.InfluenceNode
    .where({ profileId })
    .all();
}

export async function getInfluenceNodeById(
  id: number
) {
  return db.orm.public.InfluenceNode.first({
    id,
  });
}

export async function updateInfluenceNode(
  id: number,
  data: Record<string, unknown>
) {
  const existing =
    await getInfluenceNodeById(id);

  if (!existing) {
    throw new Error("Influence node not found.");
  }

  return db.orm.public.InfluenceNode
    .where({ id })
    .update(data);
}

export async function deleteInfluenceNode(
  id: number
) {
  const existing =
    await getInfluenceNodeById(id);

  if (!existing) {
    throw new Error("Influence node not found.");
  }

  return db.orm.public.InfluenceNode
    .where({ id })
    .delete();
}

/* ---------------- CONNECTIONS ---------------- */

export async function createInfluenceConnection(
  input: CreateConnectionInput
) {
  const fromNode =
    await db.orm.public.InfluenceNode.first({
      id: input.fromNodeId,
    });

  const toNode =
    await db.orm.public.InfluenceNode.first({
      id: input.toNodeId,
    });

  if (!fromNode || !toNode) {
    throw new Error(
      "One or both influence nodes were not found."
    );
  }

  if (fromNode.profileId !== toNode.profileId) {
    throw new Error(
      "Nodes must belong to the same monitoring profile."
    );
  }

  const existing =
    await db.orm.public.InfluenceConnection.first({
      fromNodeId: input.fromNodeId,
      toNodeId: input.toNodeId,
    });

  if (existing) {
    return db.orm.public.InfluenceConnection
      .where({ id: existing.id })
      .update({
        strength: input.strength ?? existing.strength,
        interactions:
          input.interactions ??
          existing.interactions,
      });
  }

  return db.orm.public.InfluenceConnection.create({
    fromNodeId: input.fromNodeId,
    toNodeId: input.toNodeId,
    strength: input.strength ?? 0,
    interactions: input.interactions ?? 0,
  });
}

export async function getInfluenceConnections(
  profileId: number
) {
  const nodes = await getInfluenceNodes(profileId);

  const nodeIds = nodes.map((node) => node.id);

  const connections =
    await db.orm.public.InfluenceConnection.all();

  return connections.filter(
    (connection) =>
      nodeIds.includes(connection.fromNodeId) &&
      nodeIds.includes(connection.toNodeId)
  );
}

export async function deleteInfluenceConnection(
  id: number
) {
  const existing =
    await db.orm.public.InfluenceConnection.first({
      id,
    });

  if (!existing) {
    throw new Error(
      "Influence connection not found."
    );
  }

  return db.orm.public.InfluenceConnection
    .where({ id })
    .delete();
}