import { NODE_TYPES } from "@/constants";
import { TableNode, TableNodeType } from "@/types/TableNode";
import { useState } from "react";
import { Button } from "./ui/button";
import { DialogFooter, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Props {
  node: TableNode;
  onSave: (node: TableNode) => void;
}

export function EditNodeDialog({ node, onSave }: Props) {
  const [formData, setFormData] = useState<TableNode>({
    id: node.id,
    label: node.label,
    type: node.type,
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
            Name
          </Label>
          <Input
            id="label"
            value={formData.label}
            className="col-span-3"
            onChange={(e) =>
              setFormData({ ...formData, label: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-2 cursor-pointer">
          <Label htmlFor="type" className="text-right">
            Type
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData({ ...formData, type: value as TableNodeType })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={formData.type} />
            </SelectTrigger>
            <SelectContent>
              {NODE_TYPES.map((type) => (
                <SelectItem
                  className="cursor-pointer col-span-3"
                  key={type}
                  value={type}
                >
                  {type}
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
