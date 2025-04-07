import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DataTable } from "@/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitCompareArrows, LayersIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { initialNodes, mockSeedNodes } from "@/__mocks__/mockNodes";
import { initialEdges } from "@/__mocks__/mockEdges";

const getTabTriggerClasses = (additionalCn = "") =>
  cn(
    "data-[state=active]:bg-indigo-200 data-[state=active]:text-black-foreground cursor-pointer",
    additionalCn
  );

export const CanvasPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onAddNode = () => {
    const newNode = {
      id: nanoid(),
      type: "mindmap",
      data: { label: "New Node" },
      position: { x: 0, y: 50 },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <>
      <div className="h-[70vh] mb-8">
        <ReactFlow
          className="border-1 rounded-lg"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Controls position="center-right" />
          <Background
            id="1"
            gap={10}
            color="#f1f1f1"
            variant={BackgroundVariant.Dots}
          />
        </ReactFlow>
      </div>

      <Tabs defaultValue="node" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="node" className={getTabTriggerClasses()}>
              <LayersIcon className="h-4 w-4 mr-2" />
              Nodes
            </TabsTrigger>
            <TabsTrigger value="edge" className={getTabTriggerClasses()}>
              <GitCompareArrows className="h-4 w-4 mr-2" />
              Edges
            </TabsTrigger>
          </TabsList>
          <Button
            variant="outline"
            className="px-4 cursor-pointer border-indigo-600 text-indigo-600 hover:bg-indigo-700 hover:text-white transition-colors duration-2 00 ease-in-out"
            onClick={onAddNode}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add node
          </Button>
        </div>

        <TabsContent value="node">
          <DataTable columns={[]} data={mockSeedNodes.data} />
        </TabsContent>
        <TabsContent value="edge">
          <DataTable columns={[]} data={[]} />
        </TabsContent>
      </Tabs>
    </>
  );
};
