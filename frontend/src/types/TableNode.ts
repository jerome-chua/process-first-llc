export type TableNodeType = "type1" | "type2" | "type3";

export type TableNode = {
  id: string;
  label: string;
  type: TableNodeType;
  style?: {
    background: string;
    color: string;
    border: string;
  };
};
