import { TableNode } from "@/types/TableNode";
import { Node } from "@xyflow/react";
import { nanoid } from "nanoid";

export const mockSeedNodes = {
  data: [
    {
      id: nanoid(),
      label: "chemicalNode1",
      type: "type1",
    },
    {
      id: nanoid(),
      label: "chemicalNode3",
      type: "type3",
    },
    {
      id: nanoid(),
      label: "chemicalNode2",
      type: "type2",
    },
    {
      id: nanoid(),
      label: "testing",
      type: "type1",
    },
  ] as TableNode[],
};

export const transformSeedDataToRFNodes = (nodes: TableNode[]): Node[] => {
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

export const initialNodes: Node[] = transformSeedDataToRFNodes(
  mockSeedNodes.data
);
