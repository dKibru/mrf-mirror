"use client";

import Script from "next/script";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PricingPage() {
	const inIframe = typeof window !== "undefined" && window.self !== window.top;

	return (
		<>
			<Script src="https://js.stripe.com/v3/pricing-table.js" />
			<div className="flex min-h-screen w-full  flex-col bg-sparko-bg">
				<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
					{!inIframe && (
						<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
							<Breadcrumb className="flex">
								<BreadcrumbList>
									<BreadcrumbItem>
										<BreadcrumbLink asChild>
											<Link href="/">Home</Link>
										</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										<BreadcrumbPage>Pricing</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</header>
					)}
					<main
						className={cn(
							" leading-7 text-gray-900 bg-sparko-bg ",
							inIframe ? "" : "py-6 sm:py-12 md:py-16",
						)}
					>
						<div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-0 max-w-5xl">
							<div className="flex mb-6 flex-col items-center leading-7 text-center text-gray-900 border-0 border-gray-200">
								{!inIframe && (
									<h2
										id="pricing"
										className="box-border m-0 text-3xl font-semibold leading-tight tracking-tight text-sparko-active border-solid sm:text-4xl md:text-5xl"
									>
										Pricing
									</h2>
								)}
								<p className="box-border mt-2 text-xl text-gray-900 border-solid sm:text-2xl" />
							</div>
							<div>
								<h3 className="box-border m-0 text-3xl font-semibold leading-tight tracking-tight text-sparko border-solid sm:text-4xl md:text-5xl">
									Download In-Network Rate Files:
								</h3>
								<p className="text-sparko">
									Access detailed CSV files for all selected NPIs, optimized for
									Excel or other analytical tools. We can filter data by billing
									codes to streamline your analysis. Note: File sizes are capped
									at 300,000 rows due to Excel and PC limitations. Processing
									times may vary.{" "}
									<a href="https://www.rateleverage.com/contact">Contact us</a>{" "}
									for bundle pricing if you need to process multiple files with
									a single filter.
								</p>
								<div>
									<stripe-pricing-table
										pricing-table-id="prctbl_1Pv3uYDEUpGALL5ckr3n8iGB"
										publishable-key="pk_live_51OGmPEDEUpGALL5cWYuP31f1MRU9pubTj3T0EomuhLv0wwIJzzl5V9JnmYOqC7Bj1pLL5yXZLFteYhZ0VhPy4jlL00GT667Sfw"
									></stripe-pricing-table>
								</div>
								<h3 className="box-border m-0 py-2 text-3xl font-semibold leading-tight tracking-tight text-sparko border-solid sm:text-4xl md:text-5xl">
									Download Massive In-Network Rate Files:
								</h3>
								<div>
									<stripe-pricing-table
										pricing-table-id="prctbl_1Pv4UMDEUpGALL5cTEI7QTYV"
										publishable-key="pk_live_51OGmPEDEUpGALL5cWYuP31f1MRU9pubTj3T0EomuhLv0wwIJzzl5V9JnmYOqC7Bj1pLL5yXZLFteYhZ0VhPy4jlL00GT667Sfw"
									></stripe-pricing-table>
								</div>
								<h3 className="box-border m-0 py-2 text-3xl font-semibold leading-tight tracking-tight text-sparko border-solid sm:text-4xl md:text-5xl">
									NPIs in In-Network Rates Search:
								</h3>
								<p className="text-sparko py-1">
									Access detailed CSV files for all selected NPIs, optimized for
									Excel or other analytical tools. We can filter data by billing
									codes to streamline your analysis. Note: File sizes are capped
									at 300,000 rows due to Excel and PC limitations. Processing
									times may vary. Contact us for bundle pricing if you need to
									process multiple files with a single filter. Navigating
									through INR files can be challenging. Let us do the heavy
									lifting by searching and ranking INR files from top payers to
									identify which ones are most likely to contain the NPIs you
									need. We can provide filtered CSVs by billing codes for easier
									analysis.
								</p>
								<p className="text-sparko py-1">
									This includes a CSV for all NPIs selected. We can optionally
									filter down to certain billing codes so you do not have to
									later
								</p>
								<stripe-pricing-table
									pricing-table-id="prctbl_1PuEx0DEUpGALL5cNdAzj4cF"
									publishable-key="pk_live_51OGmPEDEUpGALL5cWYuP31f1MRU9pubTj3T0EomuhLv0wwIJzzl5V9JnmYOqC7Bj1pLL5yXZLFteYhZ0VhPy4jlL00GT667Sfw"
								/>
							</div>
						</div>
					</main>
				</div>
			</div>
		</>
	);
}

declare global {
	//  // eslint-disable-next-line @typescript-eslint/no-namespace
	namespace JSX {
		interface IntrinsicElements {
			"stripe-pricing-table": React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>;
		}
	}
}
