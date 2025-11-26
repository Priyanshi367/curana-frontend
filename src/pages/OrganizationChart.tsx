import React, { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageBanner from "@/components/PageBanner";
import bannerOrgChart from "@/assets/banner-org-chart.jpg";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Position,
  Handle
} from "reactflow";
import "reactflow/dist/style.css";

import dagre from "@dagrejs/dagre";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// ---------- Node UI ----------
type PNodeData = { name: string; role: string; department?: string; image?: string };

const PersonRFNode = ({ data }: { data: PNodeData }) => {
  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="inline-block align-top relative">
      {/* Handles to make edges render */}
      <Handle type="target" position={Position.Top} className="!bg-[hsl(var(--primary))] !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-[hsl(var(--primary))] !w-2 !h-2" />

      <Card className="px-4 py-4 rounded-2xl text-center bg-white border border-[hsl(var(--primary)/0.22)] max-w-[220px] min-w-[170px]">
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-full text-[11px] font-semibold
                           bg-[hsl(var(--primary)/0.10)] text-[hsl(var(--primary))] border border-[hsl(var(--primary)/0.25)]">
            {initials}
          </span>
          {data.image ? (
            <Avatar className="h-7 w-7 ring-1 ring-[hsl(var(--primary)/0.25)]">
              <AvatarImage src={data.image} alt={data.name} />
              <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
            </Avatar>
          ) : null}
        </div>

        <div className="mt-2">
          <div className="font-semibold text-[13px] leading-tight">{data.name}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">{data.role}</div>
          {data.department && (
            <span className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full
                             bg-[hsl(var(--primary)/0.10)] text-[hsl(var(--primary)/0.95)]
                             border border-[hsl(var(--primary)/0.25)]">
              {data.department}
            </span>
          )}
        </div>
      </Card>
    </div>
  );
};

const nodeTypes = { person: PersonRFNode };

// ---------- Data ----------
const raw = {
  nodes: [
    { id: "ceo", data: { name: "Dr. Robert Anderson", role: "Chief Executive Officer", department: "Executive" }, parent: null },
    { id: "cmo", data: { name: "Dr. Emily Chen", role: "Chief Medical Officer", department: "Medical" }, parent: "ceo" },
    // { id: "cfo", data: { name: "John Williams", role: "Chief Financial Officer", department: "Finance" }, parent: "ceo" },
    { id: "coo", data: { name: "Susan Davis", role: "Chief Operations Officer", department: "Operations" }, parent: "ceo" },

    { id: "cardio", data: { name: "Dr. Sarah Johnson", role: "Head of Cardiology", department: "Cardiology" }, parent: "cmo" },
    { id: "er", data: { name: "Dr. Michael Brown", role: "Head of Emergency", department: "Emergency" }, parent: "cmo" },
    { id: "peds", data: { name: "Dr. Lisa Martinez", role: "Head of Pediatrics", department: "Pediatrics" }, parent: "cmo" },

    // { id: "fin_mgr", data: { name: "Rachel Green", role: "Finance Manager", department: "Finance" }, parent: "cfo" },
    // { id: "billing", data: { name: "David Lee", role: "Billing Manager", department: "Finance" }, parent: "cfo" },

    { id: "fac", data: { name: "James Wilson", role: "Facilities Manager", department: "Operations" }, parent: "coo" },
    { id: "hr", data: { name: "Maria Garcia", role: "HR Manager", department: "Human Resources" }, parent: "coo" },
    { id: "it", data: { name: "Tom Anderson", role: "IT Manager", department: "Technology" }, parent: "coo" },

    { id: "cno", data: { name: "Patricia Taylor", role: "Chief Nursing Officer", department: "Nursing" }, parent: "ceo" },
    { id: "ns1", data: { name: "Jennifer White", role: "Nursing Supervisor", department: "Nursing" }, parent: "cno" },
    { id: "ns2", data: { name: "Robert Clark", role: "Nursing Supervisor", department: "Nursing" }, parent: "cno" }
  ]
};

// ---------- Layout (Dagre) ----------
const nodeWidth = 220;
const nodeHeight = 110;

function makeLayout(nodesIn: Node[], edgesIn: Edge[], direction: "TB" | "LR" = "TB") {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: direction, nodesep: 40, ranksep: 90, marginx: 20, marginy: 20 });
  g.setDefaultEdgeLabel(() => ({}));

  nodesIn.forEach((n) => g.setNode(n.id, { width: nodeWidth, height: nodeHeight }));
  edgesIn.forEach((e) => g.setEdge(e.source as string, e.target as string));
  dagre.layout(g);

  const nodes = nodesIn.map((n) => {
    const { x, y } = g.node(n.id);
    n.position = { x: x - nodeWidth / 2, y: y - nodeHeight / 2 };
    return n;
  });

  return { nodes, edges: edgesIn };
}

// ---------- Page ----------
export default function OrganizationChartFlow() {
  const { nodesInitial, edgesInitial } = useMemo(() => {
    const nodes: Node[] = raw.nodes.map((n) => ({
      id: n.id,
      type: "person",
      data: n.data,
      position: { x: 0, y: 0 },
      draggable: true,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top
    }));

    const edges: Edge[] = raw.nodes
      .filter((n) => n.parent)
      .map((n) => ({
        id: `${n.parent}-${n.id}`,
        source: n.parent as string,
        target: n.id,
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--primary) / 0.45)", strokeWidth: 1.5 }
      }));

    return { nodesInitial: nodes, edgesInitial: edges };
  }, []);

  const { nodes: laidNodes, edges: laidEdges } = useMemo(
    () => makeLayout(nodesInitial, edgesInitial, "TB"),
    [nodesInitial, edgesInitial]
  );

  const [nodes, , onNodesChange] = useNodesState(laidNodes);
  const [edges, , onEdgesChange] = useEdgesState(laidEdges);

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto">
        <PageBanner title="Organization Chart" backgroundImage={bannerOrgChart} />

        <div
          className="rounded-2xl overflow-hidden border border-[hsl(var(--primary)/0.15)]
                     bg-[linear-gradient(180deg,rgba(121,87,255,0.06),transparent)]"
          style={{ height: 680 }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            panOnScroll
            nodesDraggable
            nodesConnectable={false}
          >
            <Background gap={22} />
            <MiniMap pannable zoomable />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </DashboardLayout>
  );
}
