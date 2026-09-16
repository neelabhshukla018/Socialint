"""
Network Router for SocialInt AI Service
Constructs interaction graphs, computes PageRank, centrality, and detects communities using NetworkX.
"""

from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from fastapi import APIRouter
import networkx as nx

router = APIRouter(prefix="/api/network", tags=["Network"])


class GraphNodeInput(BaseModel):
    id: str
    name: str
    category: Optional[str] = "Influencer"
    initial_followers: Optional[int] = 1000


class GraphEdgeInput(BaseModel):
    source: str
    target: str
    weight: Optional[float] = 1.0
    interactions: Optional[int] = 1


class GraphAnalysisRequest(BaseModel):
    nodes: List[GraphNodeInput] = Field(..., min_length=1)
    edges: List[GraphEdgeInput] = Field(default_factory=list)


class AnalyzedNode(BaseModel):
    id: str
    name: str
    category: str
    influence_score: float # 0 to 100
    pagerank: float
    degree_centrality: float
    betweenness_centrality: float
    community_id: int
    x: float
    y: float


class AnalyzedEdge(BaseModel):
    source: str
    target: str
    weight: float
    interactions: int


class GraphAnalysisResponse(BaseModel):
    total_nodes: int
    total_edges: int
    num_communities: int
    nodes: List[AnalyzedNode]
    edges: List[AnalyzedEdge]


@router.post("/analyze", response_model=GraphAnalysisResponse)
async def analyze_graph(payload: GraphAnalysisRequest):
    """
    Constructs a directed graph using NetworkX.
    Computes PageRank, degree centrality, betweenness centrality, and community partitions.
    Calculates 2D layout coordinates for Cytoscape.js rendering.
    """
    G = nx.DiGraph()

    # Add nodes
    node_meta: Dict[str, GraphNodeInput] = {}
    for n in payload.nodes:
        node_meta[n.id] = n
        G.add_node(n.id, name=n.name, category=n.category or "Influencer")

    # Add edges
    for e in payload.edges:
        if e.source in node_meta and e.target in node_meta:
            G.add_edge(e.source, e.target, weight=e.weight or 1.0, interactions=e.interactions or 1)

    # If isolated graph or no edges, add self loops or fallback
    n_nodes = len(G.nodes)
    if n_nodes == 0:
        return GraphAnalysisResponse(
            total_nodes=0, total_edges=0, num_communities=0, nodes=[], edges=[]
        )

    # 1. PageRank
    try:
        if len(G.edges) > 0:
            pagerank_scores = nx.pagerank(G, weight="weight", alpha=0.85, max_iter=100)
        else:
            pagerank_scores = {node: 1.0 / n_nodes for node in G.nodes}
    except Exception as ex:
        print(f"[Network] PageRank warning: {ex}")
        pagerank_scores = {node: 1.0 / n_nodes for node in G.nodes}

    # 2. Degree Centrality
    degree_scores = nx.degree_centrality(G)

    # 3. Betweenness Centrality
    try:
        betweenness_scores = nx.betweenness_centrality(G, weight="weight")
    except Exception:
        betweenness_scores = {node: 0.0 for node in G.nodes}

    # 4. Community Detection (Undirected projection)
    G_undirected = G.to_undirected()
    community_map: Dict[str, int] = {}
    try:
        from networkx.algorithms.community import greedy_modularity_communities
        communities = list(greedy_modularity_communities(G_undirected))
        for c_id, comm_nodes in enumerate(communities):
            for node_id in comm_nodes:
                community_map[node_id] = c_id
    except Exception:
        community_map = {node: 0 for node in G.nodes}

    num_communities = max(community_map.values()) + 1 if community_map else 1

    # 5. Spring Layout for 2D visualization (Cytoscape coordinates)
    try:
        positions = nx.spring_layout(G_undirected, seed=42, k=1.5 / (n_nodes**0.5) if n_nodes > 1 else 1.0)
    except Exception:
        positions = {node: (0.0, 0.0) for node in G.nodes}

    # Format nodes
    analyzed_nodes: List[AnalyzedNode] = []
    for node_id, meta in node_meta.items():
        pr = pagerank_scores.get(node_id, 0.0)
        deg = degree_scores.get(node_id, 0.0)
        bet = betweenness_scores.get(node_id, 0.0)

        # Composite Influence Score normalized to 0-100
        raw_influence = (pr * 50.0) + (deg * 30.0) + (bet * 20.0)
        # Scaled smoothly
        influence_score = round(min(100.0, max(5.0, raw_influence * 100.0)), 1)

        pos = positions.get(node_id, (0.0, 0.0))
        # Scale pos to canvas dimensions (e.g. -300 to +300)
        scaled_x = round(float(pos[0]) * 350.0, 1)
        scaled_y = round(float(pos[1]) * 250.0, 1)

        analyzed_nodes.append(
            AnalyzedNode(
                id=node_id,
                name=meta.name,
                category=meta.category or "Influencer",
                influence_score=influence_score,
                pagerank=round(float(pr), 5),
                degree_centrality=round(float(deg), 4),
                betweenness_centrality=round(float(bet), 4),
                community_id=community_map.get(node_id, 0),
                x=scaled_x,
                y=scaled_y
            )
        )

    # Sort nodes by influence score descending
    analyzed_nodes.sort(key=lambda n: n.influence_score, reverse=True)

    analyzed_edges = [
        AnalyzedEdge(
            source=e.source,
            target=e.target,
            weight=round(e.weight or 1.0, 2),
            interactions=e.interactions or 1
        )
        for e in payload.edges
        if e.source in node_meta and e.target in node_meta
    ]

    return GraphAnalysisResponse(
        total_nodes=len(analyzed_nodes),
        total_edges=len(analyzed_edges),
        num_communities=num_communities,
        nodes=analyzed_nodes,
        edges=analyzed_edges
    )
