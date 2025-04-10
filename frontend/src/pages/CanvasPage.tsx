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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitCompareArrows, LayersIcon, PlusIcon } from "lucide-react";
import {
  getTabTriggerClasses,
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
import { AddEdgeDialog } from "@/components/AddEdgeDialog";
import { DataTable } from "@/components/DataTable";

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
      type: "default",
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
        setTableEdges(
          tableEdges.filter(
            (tableEdge: TableEdge) =>
              tableEdge.upstream !== updatedNodeData.id &&
              tableEdge.downstream !== updatedNodeData.id
          )
        );

        setEdges(
          edges.filter(
            (edge: Edge) =>
              edge.source !== updatedNodeData.id &&
              edge.target !== updatedNodeData.id
          )
        );

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

  const handleEdgeAction = (
    actionType: string,
    updatedEdgeData: TableEdge
  ): void => {
    console.log("see: ", updatedEdgeData);
    switch (actionType) {
      case "delete":
        setTableEdges(
          tableEdges.filter((edge: TableEdge) => edge.id !== updatedEdgeData.id)
        );
        setEdges(edges.filter((edge: Edge) => edge.id !== updatedEdgeData.id));
        break;
      // TODO: Jerome - need to ensure nodes are affected when edit happens/delete happens
      case "update":
        setTableEdges(
          tableEdges.map((edge: TableEdge) =>
            edge.id === updatedEdgeData.id ? updatedEdgeData : edge
          )
        );
        setEdges(
          edges.map((edge: Edge) =>
            edge.id === updatedEdgeData.id
              ? ({
                  ...edge,
                  source: updatedEdgeData.upstream,
                  target: updatedEdgeData.downstream,
                } as Edge)
              : edge
          )
        );
        break;
    }
  };

  const onSaveNewEdge = (newTableEdge: TableEdge) => {
    setTableEdges((prev) => [newTableEdge, ...prev]);

    const upstreamNode = nodes.find(
      (node) => node.id === newTableEdge.upstream
    );
    const downstreamNode = nodes.find(
      (node) => node.id === newTableEdge.downstream
    );

    if (upstreamNode && downstreamNode) {
      const newFlowEdge: Edge = {
        id: newTableEdge.id,
        source: upstreamNode.id,
        target: downstreamNode.id,
      };
      setEdges((edges: Edge[]) => [newFlowEdge, ...edges]);
    } else {
      console.error("Could not find node IDs for the selected nodes");
    }
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
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add edge
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Edge</DialogTitle>
                    <DialogDescription>
                      Select 2 nodes for an edge to be created. Click save when
                      you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <AddEdgeDialog nodes={nodes} onSave={onSaveNewEdge} />
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
          <DataTable
            columns={edgeColumns({ tableNodes })}
            data={tableEdges}
            onRowAction={handleEdgeAction}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};
