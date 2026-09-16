import { db } from "../prisma/db.js";
import { mlClient } from "./mlClient.service.js";

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

export async function computeInfluenceNetworkWithML(profileId: number) {
  const profile = await db.orm.public.MonitoringProfile.first({
    id: profileId,
  });

  if (!profile) {
    throw new Error("Monitoring profile not found.");
  }

  let nodes = await getInfluenceNodes(profileId);
  let connections = await getInfluenceConnections(profileId);

  // If no nodes exist yet, synthesize initial graph from Posts and their @mentions
  if (nodes.length < 2) {
    const posts = await db.orm.public.Post.where({ profileId }).all();
    const createdNodesMap = new Map<string, number>();

    for (const n of nodes) {
      if (n.username) createdNodesMap.set(n.username.toLowerCase(), n.id);
    }

    for (const post of posts) {
      const authorHandle = post.authorHandle || (post.authorName ? `@${post.authorName.replace(/\s+/g, "_")}` : "@creator");
      const normalizedHandle = authorHandle.toLowerCase();

      let authorNodeId = createdNodesMap.get(normalizedHandle);
      if (!authorNodeId) {
        const newNode = await db.orm.public.InfluenceNode.create({
          profileId,
          name: post.authorName || authorHandle,
          username: authorHandle,
          category: "Creator",
          influenceScore: 60,
        });
        authorNodeId = newNode.id;
        createdNodesMap.set(normalizedHandle, authorNodeId);
      }

      const text = post.content || "";
      const mentions = text.match(/@[a-zA-Z0-9_]+/g) || [];
      for (const mention of mentions) {
        const normMention = mention.toLowerCase();
        let targetNodeId = createdNodesMap.get(normMention);
        if (!targetNodeId) {
          const targetNode = await db.orm.public.InfluenceNode.create({
            profileId,
            name: mention.replace("@", ""),
            username: mention,
            category: "Influencer",
            influenceScore: 40,
          });
          targetNodeId = targetNode.id;
          createdNodesMap.set(normMention, targetNodeId);
        }

        if (authorNodeId && targetNodeId && authorNodeId !== targetNodeId) {
          await createInfluenceConnection({
            fromNodeId: authorNodeId,
            toNodeId: targetNodeId,
            strength: (post.likes || 0) + 1,
            interactions: 1,
          });
        }
      }
    }

    nodes = await getInfluenceNodes(profileId);
    connections = await getInfluenceConnections(profileId);
  }

  if (!nodes.length) {
    return {
      nodes: [],
      edges: [],
      stats: { total_nodes: 0, total_edges: 0, num_communities: 0 },
    };
  }

  const nodesPayload = nodes.map((n) => ({
    id: String(n.id),
    name: n.name || n.username || `Node_${n.id}`,
    category: n.category || "Influencer",
  }));

  const edgesPayload = connections.map((c) => ({
    source: String(c.fromNodeId),
    target: String(c.toNodeId),
    weight: c.strength || 1.0,
    interactions: c.interactions || 1,
  }));

  const graphResult = await mlClient.analyzeNetworkGraph(nodesPayload, edgesPayload);
  const mlNodeMap = new Map(graphResult.nodes.map((item) => [item.id, item]));

  for (const node of nodes) {
    const mlData = mlNodeMap.get(String(node.id));
    if (mlData) {
      await db.orm.public.InfluenceNode.where({ id: node.id }).update({
        influenceScore: Number((mlData.pagerank * 100).toFixed(2)),
        xPosition: mlData.x,
        yPosition: mlData.y,
        category: `Cluster_${mlData.community_id}`,
      });
    }
  }

  const cytoscapeNodes = graphResult.nodes.map((n) => ({
    data: {
      id: n.id,
      label: n.name,
      category: n.category,
      score: Number((n.pagerank * 100).toFixed(2)),
      degree: n.degree_centrality,
      betweenness: n.betweenness_centrality,
      pagerank: n.pagerank,
      community: n.community_id,
    },
    position: {
      x: n.x,
      y: n.y,
    },
  }));

  const cytoscapeEdges = graphResult.edges.map((e, idx) => ({
    data: {
      id: `edge_${idx}`,
      source: e.source,
      target: e.target,
      strength: e.weight,
      interactions: e.interactions,
    },
  }));

  return {
    nodes: cytoscapeNodes,
    edges: cytoscapeEdges,
    stats: {
      total_nodes: graphResult.total_nodes,
      total_edges: graphResult.total_edges,
      num_communities: graphResult.num_communities,
    },
  };
}