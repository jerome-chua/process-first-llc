import { useState } from "react";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { DialogFooter, DialogTrigger } from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { TableEdge } from "./types/TableEdge";
import { nanoid } from "nanoid";
import { Node } from "@xyflow/react";

interface Props {
  nodes: Node[];
  onSave: (newEdge: TableEdge) => void;
}

export function AddEdgeDialog({ nodes, onSave }: Props) {
  const [formData, setFormData] = useState<TableEdge>({
    id: nanoid(),
    upstream: "",
    downstream: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-2 cursor-pointer">
          <Label htmlFor="upstream" className="text-right">
            Upstream
          </Label>
          <Select
            value={formData.upstream}
            onValueChange={(value) =>
              setFormData({ ...formData, upstream: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select node" />
            </SelectTrigger>
            <SelectContent>
              {(nodes ?? []).map((node: Node) => (
                <SelectItem
                  className="cursor-pointer col-span-3"
                  key={node.id}
                  value={(node.data as any).label || ""}
                >
                  {(node.data as any).label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-2 cursor-pointer">
          <Label htmlFor="downstream" className="text-right">
            Downstream
          </Label>
          <Select
            value={formData.downstream}
            onValueChange={(selectedDownStreamNode) =>
              setFormData({ ...formData, downstream: selectedDownStreamNode })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select node" />
            </SelectTrigger>
            <SelectContent>
              {(nodes ?? []).map((node: Node) => (
                <SelectItem
                  className="cursor-pointer col-span-3"
                  key={node.id}
                  value={(node.data as any).label || ""}
                >
                  {(node.data as any).label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <DialogTrigger asChild>
          <Button type="submit" className="cursor-pointer hover:cursor-pointer">
            Save changes
          </Button>
        </DialogTrigger>
      </DialogFooter>
    </form>
  );
}
