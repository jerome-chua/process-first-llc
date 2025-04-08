import { TableNode } from "@/types/TableNode";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Edge, Node } from "@xyflow/react";
import { TableEdge } from "@/types/TableEdge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mapTableNodesToFlowNodes = (nodes: TableNode[]): Node[] => {
  return nodes.map((node: TableNode) => {
    return {
      id: node.id,
      type: "input",
      data: {
        label: node.label,
      },
      position: { x: Math.random() * 300, y: Math.random() * 300 },
    } as Node;
  });
};

export const mapTableEdgesToFlowEdges = (edges: TableEdge[]): Edge[] => {
  return edges.map((node: TableEdge) => {
    return {
      id: node.id,
      source: node.upstream,
      target: node.downstream,
    } as Edge;
  });
};
