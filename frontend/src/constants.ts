import { ColumnDef } from "@tanstack/react-table";

export type Node = {
    name: string
    type: "type1" | "type2" | "type3"
  }

export const columns: ColumnDef<Node>[] = [
  {
    accessorKey: "nodeName",
    header: "Name",
  },
  {
    accessorKey: "nodeType",
    header: "Type",
  },
]