import { TableNode } from "@/types/TableNode";
import { nanoid } from "nanoid";

// Node style configurations
export const nodeStyles = {
  type1: {
    background: 'white',
    color: 'black',
    border: '1px solid #4338ca'
  },
  type2: {
    background: 'white',
    color: 'black',
    border: '1px solid #d97706'
  },
  type3: {
    background: 'white',
    color: 'black',
    border: '1px solid #059669'
  }
} as const;

export const initialTableNodes: TableNode[] = [
  {
    id: nanoid(),
    label: "Air Preheater",
    type: "type1",
    style: nodeStyles.type1
  },
  {
    id: nanoid(),
    label: "Fuel Feed System",
    type: "type2",
    style: nodeStyles.type2
  },
  {
    id: nanoid(),
    label: "Combustion Chamber",
    type: "type3",
    style: nodeStyles.type3
  },
  {
    id: nanoid(),
    label: "Heat Exchanger",
    type: "type1",
    style: nodeStyles.type1
  },
];
