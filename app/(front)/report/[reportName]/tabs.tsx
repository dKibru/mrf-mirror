"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type BillingCodeMap, FilterByBillingCode } from "./columns";
import DownloadReport from "./download-report";
import type { MrfRequest } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";

export default function ReportTabs({
	children,
	uniqueBillingCodes,
	billingCodeMap,
	report,
}: {
	children: React.ReactNode;
	uniqueBillingCodes: string[];
	billingCodeMap: BillingCodeMap;
	report: MrfRequest;
}) {
	const router = useRouter();
	const pathName = usePathname();
	const defaultTab = pathName.endsWith("/chart")
		? "chart"
		: pathName.endsWith("/status")
		  ? "status"
		  : "";
	return (
		<Tabs
			defaultValue={defaultTab}
			onValueChange={(value) => router.push(`/report/${report.id}/${value}`)}
		>
			<div className="flex flex-col md:flex-row items-center order-2 md:order-1 w-full">
				<TabsList className="w-full md:w-auto">
					<TabsTrigger value="">Table</TabsTrigger>
					<TabsTrigger value="chart">Charts</TabsTrigger>
					<TabsTrigger value="status">Status Report</TabsTrigger>
				</TabsList>
				<div className="mt-2 md:mt-0 ml-auto flex items-center gap-2 order-1 md:order-2 w-full md:w-auto">
					<FilterByBillingCode
						billingCodes={uniqueBillingCodes.map((code) => ({
							code,
							label:
								code === undefined
									? "None"
									: `${code}: ${billingCodeMap[code].name}`,
							selected: true,
						}))}
					/>
					<DownloadReport reportId={report.id} status={report.status} />
				</div>
			</div>

			<div className="flex flex-col mt-2">{children}</div>
		</Tabs>
	);
}
