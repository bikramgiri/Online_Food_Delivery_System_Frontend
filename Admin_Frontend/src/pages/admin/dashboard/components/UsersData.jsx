import React, { useState, useMemo } from "react";
import CardMenu from "../../../../components/card/CardMenu";
import Card from "../../../../components/card";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

const UsersData = ({ allOrders = [], allUsers = [] }) => {
  const [sorting, setSorting] = useState([]);

  // Memoize usersData to prevent recalculation on every render
  const usersData = useMemo(() => {
    return allUsers.map((user) => {
      const userOrders = allOrders.filter((order) => order.user._id === user._id);
      const totalOrders = userOrders.length || 0;
      const totalPaidAmount = userOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;

      return {
        name: user.username || "Unknown",
        phoneNumber: user.phoneNumber || "N/A",
        orders: totalOrders,
        paidAmount: totalPaidAmount,
      };
    });
  }, [allUsers, allOrders]);

  // Memoize columns to prevent recreation
  const columns = useMemo(() => [
    columnHelper.accessor("name", {
      id: "name",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-gray-600">Name</p>
      ),
      cell: (info) => (
        <p className="text-sm font-medium text-navy-700 dark:text-gray-500">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("phoneNumber", {
      id: "phoneNumber",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-gray-600">Phone Number</p>
      ),
      cell: (info) => (
        <p className="text-sm font-medium text-navy-700 dark:text-gray-500">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("orders", {
      id: "orders",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-gray-600">Total Orders</p>
      ),
      cell: (info) => (
        <p className="text-sm font-medium text-navy-700 dark:text-gray-500">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("paidAmount", {
      id: "paidAmount",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-gray-600">Total Amount</p>
      ),
      cell: (info) => (
        <p className="text-sm font-medium text-navy-700 dark:text-gray-500">
          Rs {info.getValue().toLocaleString()}
        </p>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: usersData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false, // Disable debug logging to stop infinite logs
  });

  return (
    <Card extra="w-full h-full sm:overflow-auto px-6">
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-black">
          Users Data
        </div>
      </header>
      <div className="mt-6 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer border-b-[2px] border-gray-300 pt-4 pb-2 pr-4 text-start"
                  >
                    <div className="items-center justify-between text-xs text-gray-500">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " ↑",
                        desc: " ↓",
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.slice(0, 4).map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 hover:bg-gray-200 dark:hover:bg-navy-800"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="min-w-[150px] py-3 pr-4"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default UsersData;