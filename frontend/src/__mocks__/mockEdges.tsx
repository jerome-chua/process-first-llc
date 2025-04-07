import { TableEdge } from "@/types/TableEdge";
import { nanoid } from "nanoid";
import { initialTableNodes } from "./mockNodes";

export const initialTableEdges: TableEdge[] = [
  {
    id: nanoid(),
    source: initialTableNodes[0].id,
    target: initialTableNodes[1].id,
  },
];
