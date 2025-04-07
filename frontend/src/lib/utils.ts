import { TableNode } from "@/types/TableNode";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Node } from "@xyflow/react";

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
    };
  });
};
