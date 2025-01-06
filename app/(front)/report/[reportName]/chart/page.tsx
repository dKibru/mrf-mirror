"use client";
import { useContext, useEffect } from "react";
import { AllowedAmountChart, ReportChart } from "./chart";
import { FilterContext } from "../context";
import { useRouter } from "next/navigation";

export default function ChartPage() {
	const filterContext = useContext(FilterContext);
	const router = useRouter();

	useEffect(() => {
		if (filterContext.report?.status !== "completed") {
			router.push(`/report/${filterContext.report?.id}/status`);
		}
	}, [filterContext.report?.status]);

	const negotiatedRatesPerBillingCode = filterContext.tableData.reduce(
		(acc, row) => {
			const billingCode = row.billing_code;
			if (!acc[billingCode]) {
				acc[billingCode] = {
					billing_code: billingCode,
					negotiated_rates: [],
				};
			}
			acc[billingCode].negotiated_rates.push(row.negotiated_rate);
			return acc;
		},
		{} as Record<string, { billing_code: string; negotiated_rates: string[] }>,
	);
	const allowedAmountPerBillingCode = filterContext.tableData.reduce(
		(acc, row) => {
			const billingCode = row.billing_code;
			if (!acc[billingCode]) {
				acc[billingCode] = {
					billing_code: billingCode,
					allowed_amounts: [],
				};
			}
			acc[billingCode].allowed_amounts.push(row?.allowed_amount ?? 0);
			return acc;
		},
		{} as Record<string, { billing_code: string; allowed_amounts: number[] }>,
	);
	const billedChargePerBillingCode = filterContext.tableData.reduce(
		(acc, row) => {
			const billingCode = row.billing_code;
			if (!acc[billingCode]) {
				acc[billingCode] = {
					billing_code: billingCode,
					billed_charges: [],
				};
			}
			acc[billingCode].billed_charges.push(row?.billed_charge ?? 0);
			return acc;
		},
		{} as Record<string, { billing_code: string; billed_charges: number[] }>,
	);

	if (!filterContext.billingCodeMap) return <div>Loading...</div>;
	if (filterContext.isAllowedAmount) {
		return (
			<AllowedAmountChart
				allowedAmountPerBillingCode={allowedAmountPerBillingCode}
				billedChargePerBillingCode={billedChargePerBillingCode}
				totalRows={filterContext.tableData.length}
				billingCodeMap={filterContext.billingCodeMap}
			/>
		);
	}
	return (
		<ReportChart
			negotiatedRatesPerBillingCode={negotiatedRatesPerBillingCode}
			totalRows={filterContext.tableData.length}
			billingCodeMap={filterContext.billingCodeMap}
		/>
	);
}
