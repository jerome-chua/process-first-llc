import { TableNode } from "@/types/TableNode";
import { nanoid } from "nanoid";

export const initialTableNodes: TableNode[] = [
  {
    id: nanoid(),
    label: "chemNode1",
    type: "type1",
  },
  {
    id: nanoid(),
    label: "chemNode2",
    type: "type2",
  },
  {
    id: nanoid(),
    label: "chemNode3",
    type: "type3",
  },
  {
    id: nanoid(),
    label: "chemNode4",
    type: "type1",
  },
];
