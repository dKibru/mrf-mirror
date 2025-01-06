"use client";
import { useEffect, useState, type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TryMrfViewForm } from "./mrf-view-form";
import { MrfSearchForm } from "./mrf-search-form";
import GoogleCaptchaWrapper from "@/app/google-captcha-wrapper";
import analytics from "@/lib/segment";
import { usePathname, useRouter } from "next/navigation";
import { AllowedAmountForm } from "./allowed-amount-form";
import { cn } from "@/lib/utils";
import { Check, List, Search, Table } from "lucide-react";

// type TabViews = "try/mrf-search" | "try";
export default function Layout({ children }: { children: ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const [mrfViewTab, setMrfViewTab] = useState<
		"negotiated_rates" | "allowed_amount"
	>("negotiated_rates");
	const primaryTab = pathname.startsWith("/try/mrf-search")
		? "try/mrf-search"
		: "try";

	useEffect(() => {
		analytics.page();
	}, []);

	return (
		<div className="w-full lg:grid lg:grid-cols-2 bg-sparko-bg min-h-screen h-full">
			<GoogleCaptchaWrapper>
				<Tabs defaultValue="" className="w-full max-w-3xl mx-auto p-6  ">
					<div className="grid grid-cols-2 justify-evenly w-full mb-0 mt-10">
						<TabButton
							icon={<Table />}
							label="MRF View"
							isActive={primaryTab === "try"}
							onClick={() => router.push("/try")}
						/>
						<TabButton
							icon={<Search />}
							label={"MRF Search"}
							isActive={primaryTab === "try/mrf-search"}
							onClick={() => router.push("/try/mrf-search")}
						/>
					</div>
					<div className="bg-gray-100 p-4 rounded-b-lg">
						{primaryTab === "try" && (
							<div className="flex justify-evenly items-center border-b border-gray-300">
								<SubTabButton
									label="Negotiated Rates"
									isActive={mrfViewTab === "negotiated_rates"}
									onClick={() => setMrfViewTab("negotiated_rates")}
								/>
								<SubTabButton
									label="Allowed Amount"
									isActive={mrfViewTab === "allowed_amount"}
									onClick={() => setMrfViewTab("allowed_amount")}
								/>
							</div>
						)}

						<div className=" bg-white relative overflow-hidden ">
							<TabsContent value="">
								{primaryTab === "try" && (
									<div className="w-full bg-white  pb-8 px-8">
										{mrfViewTab === "negotiated_rates" && (
											<>
												<h2 className="text-2xl pt-8 font-semibold text-center text-gray-800 mb-4">
													Experience the Power of Rapid MRF Processing
												</h2>
												<TryMrfViewForm />
											</>
										)}
										{mrfViewTab === "allowed_amount" && (
											<>
												<h2 className="text-2xl pt-8 font-semibold text-center text-gray-800 mb-4">
													Experience the Power of Out of Network
												</h2>
												<AllowedAmountForm />
											</>
										)}
									</div>
								)}
								{primaryTab === "try/mrf-search" && (
									<div className="w-full bg-white  p-8">
										<h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
											Find MRF URLs with Ease
										</h2>
										<MrfSearchForm />
									</div>
								)}
							</TabsContent>
						</div>
					</div>
				</Tabs>
			</GoogleCaptchaWrapper>

			<div className="flex items-center justify-center py-12">
				<div className="mx-auto grid gap-6">{children}</div>
			</div>
		</div>
	);
}

function TabButton({
	icon,
	label,
	isActive,
	onClick,
}: {
	icon: ReactNode;
	label: string;
	isActive: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			className={cn(
				"flex items-center px-4 py-2 text-sm font-medium rounded-t-lg focus:outline-none",
				isActive
					? "bg-gray-100 text-sparko-active font-bold"
					: "bg-gray-200 text-sparko hover:bg-gray-300",
			)}
			onClick={onClick}
		>
			{icon}
			<span className="ml-2">{label}</span>
		</button>
	);
}

function SubTabButton({
	label,
	isActive,
	onClick,
}: {
	label: string;
	isActive: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			className={cn(
				"text-sm py-2 px-4 focus:outline-none",
				isActive
					? "text-sparko-active font-bold border-b-2 border-[#7B7B7B]"
					: "text-sparko hover:text-blue-500",
			)}
			onClick={onClick}
		>
			{label}
		</button>
	);
}
