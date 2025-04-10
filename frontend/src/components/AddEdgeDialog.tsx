import { useState } from "react";
import { nanoid } from "nanoid";
import { Node } from "@xyflow/react";
import { TableEdge } from "@/types/TableEdge";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { DialogFooter } from "./ui/dialog";

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
    console.log("formData: ", formData);
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
                  value={node.id || ""}
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
                  value={node.id || ""}
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
          <Button
            type="submit"
            className="cursor-pointer hover:cursor-pointer"
            disabled={!(formData.downstream && formData.upstream)}
          >
            Save changes
          </Button>
        </DialogTrigger>
      </DialogFooter>
    </form>
  );
}
