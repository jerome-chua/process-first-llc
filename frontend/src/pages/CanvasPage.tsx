import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  Node,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DataTable } from "@/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitCompareArrows, LayersIcon, PlusIcon } from "lucide-react";
import { cn, mapTableNodesToFlowNodes } from "@/lib/utils";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { initialTableNodes } from "@/__mocks__/mockNodes";
import { initialTableEdges } from "@/__mocks__/mockEdges";
import { TableNode } from "@/types/TableNode";
import { TableEdge } from "@/types/TableEdge";
import { useState } from "react";
import { nodeColumns } from "@/constants";

const getTabTriggerClasses = (additionalCn = "") =>
  cn(
    "data-[state=active]:bg-indigo-200 data-[state=active]:text-black-foreground cursor-pointer",
    additionalCn
  );

export const CanvasPage = () => {
  const [tableNodes, setTableNodes] = useState<TableNode[]>(initialTableNodes);
  const [tableEdges, setTableEdges] = useState<TableEdge[]>(initialTableEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    mapTableNodesToFlowNodes(tableNodes)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(tableEdges);

  const onAddNode = () => {
    const id = nanoid();
    const newTableNode = {
      id,
      label: "New Node",
      type: "type1" as const,
    };
    setTableNodes((prev) => [newTableNode, ...prev]);

    const newFlowNode = {
      id,
      type: "input", // to change
      data: { label: "New Node" },
      position: { x: Math.random() * 200, y: Math.random() * 200 },
    };
    setNodes((nds: Node[]) => [newFlowNode, ...nds]);
  };

  const handleNodeAction = (
    actionType: string,
    updatedNodeData: TableNode
  ): void => {
    switch (actionType) {
      case "delete":
        setTableNodes(
          tableNodes.filter((node: TableNode) => node.id !== updatedNodeData.id)
        );
        setNodes(nodes.filter((node: Node) => node.id !== updatedNodeData.id));
        break;
      case "update":
        setTableNodes(
          tableNodes.map((node: TableNode) =>
            node.id === updatedNodeData.id ? updatedNodeData : node
          )
        );
        setNodes(
          nodes.map((node: Node) =>
            node.id === updatedNodeData.id
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    label: updatedNodeData.label,
                    type: updatedNodeData.type,
                  },
                }
              : node
          )
        );
        break;
    }
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
          <DataTable
            columns={nodeColumns}
            data={tableNodes}
            onRowAction={handleNodeAction}
          />
        </TabsContent>
        <TabsContent value="edge">
          <DataTable columns={[]} data={tableEdges} />
        </TabsContent>
      </Tabs>
    </>
  );
};
