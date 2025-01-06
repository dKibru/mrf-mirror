import Link from "next/link";
import { Copy, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getReport } from "../../../actions";
import { Copier } from "@/components/copier";
import type { BillingCodeMap, ReportRow } from "./columns";
import AutoRefresher from "./auto-refresher";
import { FilterProvider } from "./context";
import { MAX_ROWS_PER_DEMO_CSV } from "@/lib/config";
import ReportTabs from "./tabs";
import type { MrfRequest } from "@/lib/types";
import AllowedAmountLayout from "./allowed-amount-layout";

export default async function ReportLayout({
	params,
	children,
}: { params: { reportName: string }; children: React.ReactNode }) {
	const report = await getReport(params.reportName);

	if (!report) {
		return (
			<div className="text-center">
				<div className="mt-10  text-3xl">Report not found</div>
				<Link href="/try">
					<Button className="mt-6">Create New Request Instead</Button>
				</Link>
			</div>
		);
	}
	if (report.isAllowedAmount) {
		return (
			<AllowedAmountLayout report={report}>{children}</AllowedAmountLayout>
		);
	}
	const firstRow = report.report.data[0] ?? [];
	const tableData: ReportRow[] = report.report.data.map((row, i) => ({
		version: row[7],
		negotiation_arrangement: row[8],
		name: row[9],
		billing_code_type: row[10],
		billing_code_type_version: row[11],
		billing_code: row[12],
		description: row[13],
		billing_class: row[14],
		negotiated_type: row[15],
		negotiated_rate: row[16],
		service_code: row[17],
		expiration_date: row[18],
		billing_code_modifier: row[19],
		provider_group_npi: row[20],
		provider_group_tin_type: row[21],
		provider_group_tin_value: row[22],
		hash: row[23],
	}));
	const billingCodeMap: BillingCodeMap = report.report.data.reduce(
		(acc, row) => {
			const billingCode = row[12];
			const name = row[9];
			const description = row[13];

			// Check if the billing code already exists in the map
			if (!acc[billingCode]) {
				// If not, add it to the map with the name and description
				acc[billingCode] = {
					name: name,
					description: description,
				};
			}

			return acc;
		},
		{} as BillingCodeMap,
	);

	const uniqueBillingCodes = Array.from(
		new Set(tableData.map((row) => row.billing_code)),
	);

	const blurrableCell = report.status !== "completed" ? "blur-sm" : "";
	const isDemoContent = MAX_ROWS_PER_DEMO_CSV <= tableData.length;
	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
				<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
					<Breadcrumb className="flex">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link href="/try">Try</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link href="/reports">Reports</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Report {params.reportName}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>
				<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
					<FilterProvider
						report={report}
						isAllowedAmount={false}
						reportStatuses={report.reportStatuses}
						billingCodeMap={billingCodeMap}
						tableData={tableData}
						billingCodes={uniqueBillingCodes.map((code) => ({
							code,
							label: code === undefined ? "None" : code,
							selected: true,
						}))}
					>
						<div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
							<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
								<Card className="md:col-span-3" x-chunk="dashboard-05-chunk-0">
									<CardHeader className="pb-3">
										<CardTitle>Report</CardTitle>
										<CardDescription className="max-w-lg text-balance leading-relaxed">
											This is the report for the request {params.reportName}
										</CardDescription>
										{isDemoContent && (
											<CardDescription className="w-full bg-blue-600 p-2 text-white border-r-2 text-center">
												This is a demo content. If you want to see the real
												data, contact us at <br />
												<span>
													<Mail className="h-4 w-4 inline-block mr-2" />
													<a href="mailto:support@sparkosystems.com">
														support@sparkosystems.com
													</a>
												</span>
											</CardDescription>
										)}
									</CardHeader>
									<CardFooter>
										<Link href="/try">
											<Button>Create New Request</Button>
										</Link>
									</CardFooter>
								</Card>
								<AutoRefresher status={report.status} />
							</div>
							<ReportTabs
								billingCodeMap={billingCodeMap}
								report={report}
								uniqueBillingCodes={uniqueBillingCodes}
							>
								{children}
							</ReportTabs>
						</div>
						<div>
							<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
								<CardHeader className="flex flex-row items-start bg-muted/50">
									<div className="grid gap-0.5">
										<CardTitle className="group flex items-center gap-2 text-lg">
											Report
											<Button
												size="icon"
												variant="outline"
												className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
											>
												<Copy className="h-3 w-3" />
												<span className="sr-only">Copy Order ID</span>
											</Button>
										</CardTitle>
										<CardDescription>
											Date: {new Date().toLocaleDateString()}
										</CardDescription>
									</div>
								</CardHeader>
								<CardContent className="p-6 text-sm">
									<div className="grid gap-3">
										<div className="font-semibold">Report Details</div>
										<ul className="grid gap-3">
											<li className="flex items-center justify-between">
												<span className="text-muted-foreground">id</span>
												<span>{report.id}</span>
											</li>
										</ul>
									</div>
									<Separator className="my-4" />
									<div className="grid gap-3">
										<div className="font-semibold">Urls</div>
										<dl className="grid gap-3 ">
											{report.urls.map((url) => (
												<li
													key={url}
													className="flex items-center justify-between break-words overflow-hidden"
												>
													<Copier text={url} />
													<span className="text-muted-foreground text-wrap inline-flex">
														<p>{url}</p>
													</span>
												</li>
											))}
										</dl>
									</div>
									<Separator className="my-4" />
									<div className="grid gap-3">
										<div className="font-semibold">Filters</div>
										<dl className="grid gap-3">
											<li className="flex items-center justify-between">
												<span className="text-muted-foreground">EINs</span>
												<span>
													{report.eins.map((ein) => (
														<Badge key={ein}>{ein}</Badge>
													))}
												</span>
											</li>
											<li className="flex items-center justify-between">
												<span className="text-muted-foreground">NPIs</span>
												<span>
													{report.npis.map((npi) => (
														<Badge key={npi}>{npi}</Badge>
													))}
												</span>
											</li>
											<li className="flex items-center justify-between">
												<span className="text-muted-foreground">
													Billing Codes
												</span>
												<span>
													{report.billingCodes?.map((code) => (
														<Badge key={code}>{code}</Badge>
													))}
												</span>
											</li>
										</dl>
									</div>
									<Separator className="my-4" />
									<div className="grid gap-3">
										<div className="font-semibold">Reporting Entity</div>
										<dl className="grid gap-3">
											<li className="flex items-center justify-between">
												<span className="text-muted-foreground">Name</span>
												<span className={blurrableCell}>
													{blurrableCell ? "******" : firstRow[0]}
												</span>
											</li>
											<li className="flex items-center justify-between">
												<span className="text-muted-foreground">Type</span>
												<span className={blurrableCell}>
													{blurrableCell ? "******" : firstRow[1]}
												</span>
											</li>
										</dl>
									</div>
									<Separator className="my-4" />
									<div className="grid gap-3">
										<div className="font-semibold">Misc</div>
										<dl className="grid gap-3">
											<li className="flex items-center justify-between">
												<span className="text-muted-foreground">Version</span>
												<span className={blurrableCell}>
													{blurrableCell ? "******" : firstRow[7]}
												</span>
											</li>
											<li className="flex items-center justify-between">
												<span className="text-muted-foreground">
													Last Updated On
												</span>
												<span className={blurrableCell}>
													{blurrableCell ? "******" : firstRow[6]}
												</span>
											</li>
										</dl>
									</div>
								</CardContent>
								<CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
									<div className="text-xs text-muted-foreground">
										Last fetched at{" "}
										<time dateTime={report.lastFetchedAt}>
											{report.lastFetchedAt}
										</time>
									</div>
								</CardFooter>
							</Card>
						</div>
					</FilterProvider>
				</main>
			</div>
		</div>
	);
}
