"use client";
import { DataTable, AllowedAmountDataTable } from "./data-table";
import { columns, allowedAmountColumns } from "./columns";
import { FilterContext } from "./context";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReportPage() {
	const filterContext = useContext(FilterContext);
	const router = useRouter();

	useEffect(() => {
		if (filterContext.report?.status !== "completed") {
			router.push(`/report/${filterContext.report?.id}/status`);
		}
	}, [filterContext.report?.status]);

	if (filterContext.isAllowedAmount)
		return (
			<AllowedAmountDataTable
				columns={allowedAmountColumns}
				data={filterContext.tableData}
			/>
		);

	return <DataTable columns={columns} data={filterContext.tableData} />;
}
