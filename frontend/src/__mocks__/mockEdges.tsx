import { TableEdge } from "@/types/TableEdge";
import { nanoid } from "nanoid";
import { initialTableNodes } from "./mockNodes";

export const initialTableEdges: TableEdge[] = [
  {
    id: nanoid(),
    upstream: initialTableNodes[0].id,
    downstream: initialTableNodes[1].id,
  },
];
