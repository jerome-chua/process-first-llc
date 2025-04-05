import { useCallback, useState } from "react";
import { applyEdgeChanges, applyNodeChanges, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DataTable } from "@/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitCompareArrows, LayersIcon } from "lucide-react";

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Input Node" },
    position: { x: 250, y: 25 },
  },

  {
    id: "2",
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: "3",
    type: "output",
    data: { label: "Output Node" },
    position: { x: 250, y: 250 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3", animated: true },
];

export const CanvasPage = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  return (
    <>
      <Tabs defaultValue="node" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger
            value="node"
            className="data-[state=active]:bg-indigo-200 data-[state=active]:text-black-foreground"
          >
            <LayersIcon className="h-4 w-4 mr-2" />
            Nodes
          </TabsTrigger>
          <TabsTrigger
            value="edge"
            className="data-[state=active]:bg-indigo-200 data-[state=active]:text-black-foreground"
          >
            <GitCompareArrows className="h-4 w-4 mr-2" />
            Edges
          </TabsTrigger>
        </TabsList>
        <TabsContent value="node">
          <DataTable columns={[]} data={[]} />
        </TabsContent>
        <TabsContent value="edge">
          <DataTable columns={[]} data={[]} />
        </TabsContent>
      </Tabs>

      <div className="h-screen w-screen p-12">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        />
      </div>
    </>
  );
};
