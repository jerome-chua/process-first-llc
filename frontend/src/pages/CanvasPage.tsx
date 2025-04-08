import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  Node,
  useEdgesState,
  useNodesState,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DataTable } from "@/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitCompareArrows, LayersIcon, PlusIcon } from "lucide-react";
import {
  cn,
  mapTableEdgesToFlowEdges,
  mapTableNodesToFlowNodes,
} from "@/lib/utils";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { initialTableNodes } from "@/__mocks__/mockNodes";
import { initialTableEdges } from "@/__mocks__/mockEdges";
import { TableNode } from "@/types/TableNode";
import { TableEdge } from "@/types/TableEdge";
import { useState } from "react";
import { edgeColumns, nodeColumns } from "@/constants";
import { Tab } from "@/types/Tab";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddEdgeDialog } from "@/AddEdgeDialog";

const getTabTriggerClasses = (additionalCn = "") =>
  cn(
    "data-[state=active]:bg-indigo-200 data-[state=active]:text-black-foreground cursor-pointer",
    additionalCn
  );

export const CanvasPage = () => {
  const [tableNodes, setTableNodes] = useState<TableNode[]>(initialTableNodes);
  const [tableEdges, setTableEdges] = useState<TableEdge[]>(initialTableEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    mapTableNodesToFlowNodes(tableNodes)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
    mapTableEdgesToFlowEdges(tableEdges)
  );

  const [tab, setTab] = useState<Tab>(Tab.NODE);

  const onAddNode = () => {
    const id = nanoid();
    const label = "New Node";
    const newTableNode = {
      id,
      label,
      type: "type1" as const,
    };
    setTableNodes((prev) => [newTableNode, ...prev]);

    const newFlowNode: Node = {
      id,
      type: "input", // to change & have to be careful with our own "type"
      data: { label, type: "type1" },
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

  const onAddEdge = () => {
    const id = nanoid();
    const newTableEdge: TableEdge = {
      id,
      upstream: "",
      downstream: "",
    };
    setTableEdges((prev) => [newTableEdge, ...prev]);

    const newFlowEdge: Edge = {
      id,
      source: "",
      target: "",
    };
    setEdges((edges: Edge[]) => [newFlowEdge, ...edges]);
  };

  const onTabChange = (value: string) => {
    setTab(value as Tab);
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

      <Tabs value={tab} onValueChange={onTabChange} className="w-full">
        <div className="flex justify-between items-center">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value={Tab.NODE} className={getTabTriggerClasses()}>
              <LayersIcon className="h-4 w-4 mr-2" />
              Nodes
            </TabsTrigger>
            <TabsTrigger value={Tab.EDGE} className={getTabTriggerClasses()}>
              <GitCompareArrows className="h-4 w-4 mr-2" />
              Edges
            </TabsTrigger>
          </TabsList>
          {tab === Tab.NODE ? (
            <Button
              variant="outline"
              className="px-4 cursor-pointer border-indigo-600 text-indigo-600 hover:bg-indigo-700 hover:text-white transition-colors duration-2 00 ease-in-out"
              onClick={onAddNode}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add node
            </Button>
          ) : (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="px-4 cursor-pointer border-indigo-600 text-indigo-600 hover:bg-indigo-700 hover:text-white transition-colors duration-2 00 ease-in-out"
                    // onClick={onAddEdge}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add edge
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Edge</DialogTitle>
                    <DialogDescription>
                      Select 2 nodes to create an edge. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <AddEdgeDialog nodes={nodes} onSave={onAddEdge} />
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        <TabsContent value={Tab.NODE}>
          <DataTable
            columns={nodeColumns}
            data={tableNodes}
            onRowAction={handleNodeAction}
          />
        </TabsContent>

        <TabsContent value={Tab.EDGE}>
          <DataTable columns={edgeColumns} data={tableEdges} />
        </TabsContent>
      </Tabs>
    </>
  );
};
