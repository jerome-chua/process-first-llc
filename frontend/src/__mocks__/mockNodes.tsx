import { TableNode } from "@/types/TableNode";
import { nanoid } from "nanoid";

export const initialTableNodes: TableNode[] = [
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
];
