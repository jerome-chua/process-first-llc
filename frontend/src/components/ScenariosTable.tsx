// 'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
  } from '@tremor/react';
  
  interface ElementData {
    Condition?: {
      [key: string]: string;
    };
    Setpoint?: {
      [key: string]: string;
    };
  }
  
  interface Props {
    data?: {
      scenario: string;
      kpi_value: number;
      elements: Record<string, ElementData>;  
    };
  }
  
  export default function ScenariosTable({ data }: Props) {
    if (!data?.elements) {
      return (
        <div className="p-4 text-center text-gray-500">
          No scenario data available
        </div>
      );
    }

    const tableData = Object.entries(data.elements).map(([index, element]) => {
      const airTemp = element.Setpoint?.["Air.temperature"] || "0K";
      const fuelTemp = element.Setpoint?.["Fuel.temperature"] || "0K";
      const coldFluidTemp = element.Setpoint?.["HEX-100.cold_fluid_temperature"] || "0K";
      const heatTransferCoeff = element.Condition?.["HEX-100.global_heat_transfer_coefficient"] || "0";

      return {
        scenario: `S${index}`,
        heatTransferCoeff,
        airTemp,
        fuelTemp,
        coldFluidTemp
      };
    });

    return (
      <>
        <div className="sm:flex sm:items-center sm:justify-between sm:space-x-10">
        </div>
        <Table className="mt-8">
          <TableHead>
            <TableRow className="border-b border-tremor-border dark:border-dark-tremor-border">
              <TableHeaderCell className="text-center text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Scenario
              </TableHeaderCell>
              <TableHeaderCell className="text-center text-tremor-content-strong dark:text-dark-tremor-content-strong">
                HEX-100 Heat Transfer Coefficient
              </TableHeaderCell>
              <TableHeaderCell className="text-center text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Air Temperature
              </TableHeaderCell>
              <TableHeaderCell className="text-center text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Fuel Temperature
              </TableHeaderCell>
              <TableHeaderCell className="text-center text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Cold Fluid Temperature
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow 
                key={row.scenario}
                className={`
                  ${row.scenario === "S0" || row.scenario === "S47" ? "font-semibold" : ""}
                  ${index % 2 === 0 ? "bg-gray-50" : ""}
                `}
              >
                <TableCell 
                  className={`text-center font-medium ${
                    row.scenario === "S0" 
                      ? "text-emerald-500" 
                      : row.scenario === "S47" 
                      ? "text-red-500" 
                      : "text-tremor-content-strong dark:text-dark-tremor-content-strong"
                  }`}
                >
                  {row.scenario}
                </TableCell>
                <TableCell className="text-center">{row.heatTransferCoeff}</TableCell>
                <TableCell className="text-center">{row.airTemp}</TableCell>
                <TableCell className="text-center">{row.fuelTemp}</TableCell>
                <TableCell className="text-center">{row.coldFluidTemp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  }