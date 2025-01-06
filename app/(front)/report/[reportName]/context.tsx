"use client";
import type { MrfRequest, MrfRequestStatus, ReportStatus } from "@/lib/types";
import React, { createContext } from "react";
import type { BillingCodeMap, ReportRow } from "./columns";
import { boolean } from "zod";

export type BillingCode = {
	code: string;
	label: string;
	selected: boolean;
};
type FilterContextType = {
	isAllowedAmount?: boolean;
	report?: MrfRequest;
	reportStatuses: ReportStatus[];
	billingCodeMap?: BillingCodeMap;
	tableData: ReportRow[];
	billingCodes: BillingCode[];
	toggleBillingCode: (code: string) => void;
	markAllAsActive: () => void;
	setBillingCodes: (billingCodes: BillingCode[]) => void;
	markAllAsInActive: () => void;
};
export const FilterContext = createContext<FilterContextType>({
	reportStatuses: [],
	tableData: [],
	billingCodes: [],
	toggleBillingCode: (code: string) => {},
	markAllAsActive: () => {},
	setBillingCodes: (billingCodes: BillingCode[]) => {},
	markAllAsInActive: () => {},
});

export const FilterProvider: React.FC<{
	isAllowedAmount: boolean;
	tableData: ReportRow[];
	children: React.ReactNode;
	billingCodeMap: BillingCodeMap;
	billingCodes: BillingCode[];
	reportStatuses: ReportStatus[];
	report: MrfRequest;
}> = (props) => {
	const [billingCodes, setBillingCodes] = React.useState<BillingCode[]>(
		props.billingCodes,
	);

	const toggleBillingCode = (code: string) => {
		const newBillingCodes = billingCodes.map((c) => {
			if (c.code === code) {
				return { ...c, selected: !c.selected };
			}
			return c;
		});
		setBillingCodes(newBillingCodes);
	};
	const markAllAsActive = () => {
		setBillingCodes(billingCodes.map((c) => ({ ...c, selected: true })));
	};

	const markAllAsInActive = () => {
		setBillingCodes(billingCodes.map((c) => ({ ...c, selected: false })));
	};

	return (
		<FilterContext.Provider
			value={{
				report: props.report,
				reportStatuses: props.reportStatuses,
				tableData: props.tableData,
				billingCodeMap: props.billingCodeMap,
				billingCodes,
				toggleBillingCode,
				setBillingCodes,
				markAllAsInActive,
				markAllAsActive,
				isAllowedAmount: props.isAllowedAmount,
			}}
		>
			{props.children}
		</FilterContext.Provider>
	);
};
