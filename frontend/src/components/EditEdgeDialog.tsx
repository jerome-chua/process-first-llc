import { TableEdge } from "@/types/TableEdge";
import { TableNode } from "@/types/TableNode";
import { useState } from "react";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DialogFooter, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";


interface Props {
  edge: TableEdge;
  nodes: TableNode[];
  onSave: (edge: TableEdge) => void;
}

export function EditEdgeDialog({ edge, nodes, onSave }: Props) {
  const [formData, setFormData] = useState<TableEdge>({
    id: edge.id,
    upstream: edge.upstream,
    downstream: edge.downstream,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="label" className="text-right">
            Upstream
          </Label>
          <Select
            value={formData.upstream}
            onValueChange={(upstreamNodeId: string) =>
              setFormData({ ...formData, upstream: upstreamNodeId })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={formData.upstream} />
            </SelectTrigger>
            <SelectContent>
              {nodes.map((node) => (
                <SelectItem
                  className="cursor-pointer col-span-3"
                  key={node.id}
                  value={node.id}
                >
                  {node.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-2 cursor-pointer">
          <Label htmlFor="type" className="text-right">
            Downstream
          </Label>
          <Select
            value={formData.downstream}
            onValueChange={(downstreamNodeId: string) =>
              setFormData({ ...formData, downstream: downstreamNodeId })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={formData.downstream} />
            </SelectTrigger>
            <SelectContent>
              {nodes.map((node) => (
                <SelectItem
                  className="cursor-pointer col-span-3"
                  key={node.id}
                  value={node.id}
                >
                  {node.label}
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
