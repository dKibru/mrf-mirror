import type React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ClipboardIcon, Copy, Mail } from "lucide-react";
import type { MrfRequest } from "@/lib/types";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import ReportTabs from "./tabs";
import { Copier } from "@/components/copier";
import { FilterProvider } from "./context";
import type { BillingCodeMap } from "./columns";

export default function AllowedAmountLayout({
	report,
	children,
}: { report: MrfRequest; children: React.ReactNode }) {
	const isDemoContent = true;
	const version = report.allowedAmounts?.[0].version;
	const lastUpdatedOn = report.allowedAmounts?.[0].last_updated_on;
	const billingCodeMap: BillingCodeMap =
		report?.allowedAmounts?.reduce((acc, row) => {
			const billingCode = row.billing_code;
			const name = row.name;
			const description = row.description;

			// Check if the billing code already exists in the map
			if (!acc[billingCode]) {
				// If not, add it to the map with the name and description
				acc[billingCode] = {
					name: name,
					description: description,
				};
			}

			return acc;
		}, {} as BillingCodeMap) ?? {};
	const uniqueBillingCodes = Array.from(
		new Set(report?.allowedAmounts?.map((row) => row.billing_code)),
	);
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
								<BreadcrumbPage>Report {report.id}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>
				<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
					<FilterProvider
						report={report}
						isAllowedAmount={true}
						reportStatuses={report.reportStatuses}
						billingCodeMap={billingCodeMap}
						tableData={
							report.allowedAmounts?.map((d) => {
								return {
									billing_class: d.billing_class,
									billing_code: d.billing_code,
									allowed_amount: d.allowed_amount,
									billed_charge: d.billed_charge,
									billing_code_type: d.billing_code_type,
									billing_code_type_version: d.billing_code_type_version,
									description: d.description,
									expiration_date: "",
									last_updated_on: d.last_updated_on,
									billing_code_modifier: "",
									negotiated_rate: "",
									negotiated_type: "",
									hash: "",
									name: d.name,
									npi: d.npi,
									provider_group_npi: "",
									provider_group_tin_type: "",
									provider_group_tin_value: "",
									reporting_entity_name: d.reporting_entity_name,
									reporting_entity_type: d.reporting_entity_type,
									service_code: d.service_code.join("|"),
									tin_type: d.tin_type,
									tin_value: d.tin_value,
									version: d.version,
									negotiation_arrangement: "",
								};
							}) ?? []
						}
						billingCodes={uniqueBillingCodes.map((code) => ({
							code,
							label: code === undefined ? "None" : code,
							selected: true,
						}))}
					>
						<div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
							<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
								<Card className="md:col-span-4" x-chunk="dashboard-05-chunk-0">
									<CardHeader className="pb-3">
										<CardTitle>Report</CardTitle>
										<CardDescription className="max-w-lg text-balance leading-relaxed">
											This is the report for the request {report.id}
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
										<div className="font-semibold">Misc</div>
										<dl className="grid gap-3">
											<li className="flex items-center justify-between">
												<span className="text-muted-foreground">Version</span>
												<span>{version}</span>
											</li>
											<li className="flex items-center justify-between">
												<span className="text-muted-foreground">
													Last Updated On
												</span>
												<span>{lastUpdatedOn}</span>
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
