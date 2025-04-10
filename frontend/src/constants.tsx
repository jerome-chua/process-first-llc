import { Checkbox } from "@radix-ui/react-checkbox";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, TrashIcon } from "lucide-react";
import { Button } from "./components/ui/button";
import { TableNode } from "./types/TableNode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { TableEdge } from "./types/TableEdge";
import { EditNodeDialog } from "./components/EditNodeDialog";
import { EditEdgeDialog } from "./components/EditEdgeDialog";

export const NODE_TYPES = ["type1", "type2", "type3"];
export const PAGINATION_SIZES = [5, 10, 20, 30];

export const nodeColumns: ColumnDef<TableNode>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="text-left capitalize">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "label",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-left">{row.getValue("label")}</div>,
  },
  {
    accessorKey: "type",
    header: () => <div className="text-left">Type</div>,
    cell: ({ row }) => <div className="text-left">{row.getValue("type")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      return (
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer mr-2" variant="outline">
                <Pencil className="w-4 h-4 text-gray-600" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Node</DialogTitle>
                <DialogDescription>
                  Make changes to respective node here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <EditNodeDialog
                node={row.original}
                onSave={(updatedNode: TableNode) => {
                  table.options.meta?.onRowAction("update", updatedNode);
                }}
              />
            </DialogContent>
          </Dialog>
          <Button
            onClick={() =>
              table.options.meta?.onRowAction("delete", row.original)
            }
            className="cursor-pointer mr-4"
            variant="outline"
          >
            <TrashIcon className="w-4 h-4 text-red-300" />
          </Button>
        </div>
      );
    },
  },
];

interface EdgeColumnsProps {
  tableNodes: TableNode[];
}

export const edgeColumns = ({
  tableNodes,
}: EdgeColumnsProps): ColumnDef<TableEdge>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="text-left capitalize">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "upstream",
    header: () => <div className="text-left">Upstream</div>,
    cell: ({ row }) => {
      const upstreamNodeId = row.getValue("upstream");
      const upstreamNode = tableNodes.find(
        (node: TableNode) => node.id === upstreamNodeId
      );
      return <div className="text-left">{upstreamNode?.label}</div>;
    },
  },
  {
    accessorKey: "downstream",
    header: () => <div className="text-left">Downstream</div>,
    cell: ({ row }) => {
      const downstreamNodeId = row.getValue("downstream");
      const downstreamNode = tableNodes.find(
        (node: TableNode) => node.id === downstreamNodeId
      );
      return <div className="text-left">{downstreamNode?.label}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      return (
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer mr-2" variant="outline">
                <Pencil className="w-4 h-4 text-gray-600" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Edge</DialogTitle>
                <DialogDescription>
                  Make changes to respective edge here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <EditEdgeDialog
                edge={row.original}
                nodes={tableNodes ?? []}
                onSave={(updatedEdge: TableEdge) => {
                  table.options.meta?.onRowAction("update", updatedEdge);
                }}
              />
            </DialogContent>
          </Dialog>
          <Button
            onClick={() =>
              table.options.meta?.onRowAction("delete", row.original)
            }
            className="cursor-pointer mr-4"
            variant="outline"
          >
            <TrashIcon className="w-4 h-4 text-red-300" />
          </Button>
        </div>
      );
    },
  },
];
