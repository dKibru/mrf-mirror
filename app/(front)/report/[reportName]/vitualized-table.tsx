"use client";

import * as React from "react";
import { createRoot } from "react-dom/client";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table";

export function ReactTableVirtualized() {
	// The scrollable element for your list
	const parentRef = React.useRef<HTMLDivElement>(null);

	// The virtualizer
	const rowVirtualizer = useVirtualizer({
		count: 10000,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 35,
	});

	return (
		<>
			{/* The scrollable element for your list */}
			<div
				ref={parentRef}
				style={{
					height: `400px`,
					overflow: "auto", // Make it scroll!
				}}
			>
				{/* The large inner element to hold all of the items */}
				<div
					style={{
						height: `${rowVirtualizer.getTotalSize()}px`,
						width: "100%",
						position: "relative",
					}}
				>
					{/* Only the visible items in the virtualizer, manually positioned to be in view */}
					{rowVirtualizer.getVirtualItems().map((virtualItem) => (
						<div
							key={virtualItem.key}
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								height: `${virtualItem.size}px`,
								transform: `translateY(${virtualItem.start}px)`,
							}}
						>
							Row {virtualItem.index}
						</div>
					))}
				</div>
			</div>
		</>
	);
}

// // import type { Person } from './makeData'
// // import './index.css'
// // import { faker } from '@faker-js/faker'

// export type Person = {
// 	id: number;
// 	firstName: string;
// 	lastName: string;
// 	age: number;
// 	visits: number;
// 	progress: number;
// 	status: "relationship" | "complicated" | "single";
// 	createdAt: Date;
// };

// const range = (len: number) => {
// 	const arr: number[] = [];
// 	for (let i = 0; i < len; i++) {
// 		arr.push(i);
// 	}
// 	return arr;
// };

// const newPerson = (index: number): Person => {
// 	return {
// 		id: index + 1,
// 		firstName: `Abebe ${Math.random()}`,
// 		lastName: "last name",
// 		age: Math.floor(Math.random() * 100),
// 		visits: 12,
// 		progress: 20,
// 		createdAt: new Date(),
// 		status: "complicated",
// 	};
// };

// export function makeData(...lens: number[]) {
// 	const makeDataLevel = (depth = 0): Person[] => {
// 		const len = lens[depth]!;
// 		return range(len).map((d): Person => {
// 			return {
// 				...newPerson(d),
// 			};
// 		});
// 	};

// 	return makeDataLevel();
// }

// export function ReactTableVirtualized() {
// 	const [sorting, setSorting] = React.useState<SortingState>([]);

// 	const columns = React.useMemo<Array<ColumnDef<Person>>>(
// 		() => [
// 			{
// 				accessorKey: "id",
// 				header: "ID",
// 				size: 60,
// 			},
// 			{
// 				accessorKey: "firstName",
// 				cell: (info) => info.getValue(),
// 			},
// 			{
// 				accessorFn: (row) => row.lastName,
// 				id: "lastName",
// 				cell: (info) => info.getValue(),
// 				header: () => <span>Last Name</span>,
// 			},
// 			{
// 				accessorKey: "age",
// 				header: () => "Age",
// 				size: 50,
// 			},
// 			{
// 				accessorKey: "visits",
// 				header: () => <span>Visits</span>,
// 				size: 50,
// 			},
// 			{
// 				accessorKey: "status",
// 				header: "Status",
// 			},
// 			{
// 				accessorKey: "progress",
// 				header: "Profile Progress",
// 				size: 80,
// 			},
// 			{
// 				accessorKey: "createdAt",
// 				header: "Created At",
// 				cell: (info) => info.getValue<Date>().toLocaleString(),
// 			},
// 		],
// 		[],
// 	);

// 	const [data, setData] = React.useState(() => makeData(10_000));

// 	const table = useReactTable({
// 		data,
// 		columns,
// 		state: {
// 			sorting,
// 		},
// 		onSortingChange: setSorting,
// 		getCoreRowModel: getCoreRowModel(),
// 		getSortedRowModel: getSortedRowModel(),
// 		debugTable: true,
// 	});

// 	const { rows } = table.getRowModel();

// 	const parentRef = React.useRef<HTMLDivElement>(null);

// 	const virtualizer = useVirtualizer({
// 		count: rows.length,
// 		getScrollElement: () => parentRef.current,
// 		estimateSize: () => 34,
// 		overscan: 20,
// 	});

// 	console.log({ data });

// 	// return <div>....</div>;

// 	return (
// 		<div ref={parentRef} className="container">
// 			<div style={{ height: `${virtualizer.getTotalSize()}px` }}>
// 				<table>
// 					<thead>
// 						{table.getHeaderGroups().map((headerGroup) => (
// 							<tr key={headerGroup.id}>
// 								{headerGroup.headers.map((header) => {
// 									return (
// 										<th
// 											key={header.id}
// 											colSpan={header.colSpan}
// 											style={{ width: header.getSize() }}
// 										>
// 											{header.isPlaceholder ? null : (
// 												<div
// 													{...{
// 														className: header.column.getCanSort()
// 															? "cursor-pointer select-none"
// 															: "",
// 														onClick: header.column.getToggleSortingHandler(),
// 													}}
// 												>
// 													{flexRender(
// 														header.column.columnDef.header,
// 														header.getContext(),
// 													)}
// 													{{
// 														asc: " 🔼",
// 														desc: " 🔽",
// 													}[header.column.getIsSorted() as string] ?? null}
// 												</div>
// 											)}
// 										</th>
// 									);
// 								})}
// 							</tr>
// 						))}
// 					</thead>
// 					<tbody>
// 						{virtualizer.getVirtualItems().map((virtualRow, index) => {
// 							const row = rows[virtualRow.index];
// 							console.log({ row });
// 							return (
// 								<tr
// 									key={row.id}
// 									style={{
// 										height: `${virtualRow.size}px`,
// 										transform: `translateY(${
// 											virtualRow.start - index * virtualRow.size
// 										}px)`,
// 									}}
// 								>
// 									{row.getVisibleCells().map((cell) => {
// 										return (
// 											<td key={cell.id}>
// 												{flexRender(
// 													cell.column.columnDef.cell,
// 													cell.getContext(),
// 												)}
// 											</td>
// 										);
// 									})}
// 								</tr>
// 							);
// 						})}
// 					</tbody>
// 				</table>
// 			</div>
// 		</div>
// 	);
// }
