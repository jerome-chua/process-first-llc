import { TableNode } from "@/types/TableNode";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Edge, Node } from "@xyflow/react";
import { TableEdge } from "@/types/TableEdge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTabTriggerClasses = (additionalCn = "") =>
  cn(
    "data-[state=active]:bg-indigo-200 data-[state=active]:text-black-foreground cursor-pointer",
    additionalCn
  );

export const mapTableNodesToFlowNodes = (nodes: TableNode[]): Node[] => {
  return nodes.map((node: TableNode) => {
    return {
      id: node.id,
      type: "default",
      data: {
        label: node.label,
        type: node.type,
      },
      position: { x: Math.random() * 300, y: Math.random() * 300 },
    } as Node;
  });
};

export const mapTableEdgesToFlowEdges = (edges: TableEdge[]): Edge[] => {
  return edges.map((edge: TableEdge) => {
    return {
      id: edge.id,
      source: edge.upstream,
      target: edge.downstream,
      type: "default",
    } as Edge;
  });
};

export const mapTableEdgeToFlowEdge = (edge: TableEdge): Edge => ({
  id: edge.id,
  source: edge.upstream,
  target: edge.downstream,
});
