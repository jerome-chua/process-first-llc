import { Checkbox } from "@radix-ui/react-checkbox";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, TrashIcon } from "lucide-react";
import { Button } from "./components/ui/button";
import { TableNode } from "./types/TableNode";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Input } from "./components/ui/input";

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
    cell: ({ row }) => (
      <div className="text-left">
        <Input type="text" placeholder={row.getValue("label")} />
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: () => <div className="text-left">Type</div>,
    cell: ({ row, table }) => {
      const handleTypeChange = (value: string) => {
        const updatedNode = {
          ...row.original,
          type: value,
        };
        table.options.meta?.onRowAction("edit", updatedNode);
      };

      return (
        <>
          <Select
            onValueChange={handleTypeChange}
            defaultValue={row.getValue("type")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={row.getValue("type")} />
            </SelectTrigger>
            <SelectContent>
              {NODE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      return (
        <div className="flex items-center">
          <Button
            onClick={() =>
              table.options.meta?.onRowAction("edit", row.original)
            }
            className="cursor-pointer mr-2"
            variant="outline"
          >
            <Pencil className="w-4 h-4 text-gray-600" />
          </Button>
          <Button
            onClick={() =>
              table.options.meta?.onRowAction("delete", row.original)
            }
            className="cursor-pointer"
            variant="outline"
          >
            <TrashIcon className="w-4 h-4 text-red-300" />
          </Button>
        </div>
      );
    },
  },
];
