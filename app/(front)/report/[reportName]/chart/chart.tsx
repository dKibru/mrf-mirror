"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { FilterContext } from "../context";
import { useContext, useEffect, useMemo, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { BillingCodeMap } from "../columns";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useFromTo } from "@/lib/hooks";
import { COLUMNS_PER_VIEW } from "@/lib/config";

export function ReportChart({
	negotiatedRatesPerBillingCode,
	totalRows,
	billingCodeMap,
}: {
	negotiatedRatesPerBillingCode: Record<
		string,
		{ billing_code: string; negotiated_rates: string[] }
	>;
	totalRows: number;
	billingCodeMap: BillingCodeMap;
}) {
	const filterContext = useContext(FilterContext);
	const [showBars, setShowBars] = useState({
		showMin: true,
		showMax: true,
		showAvg: true,
	});

	const allChartData = useMemo(() => {
		return Object.entries(negotiatedRatesPerBillingCode)
			.map(([billingCode, data]) => ({
				billingCode: billingCode,
				frequency: data.negotiated_rates.length,
				average:
					data.negotiated_rates.reduce((acc, rate) => acc + Number(rate), 0) /
					data.negotiated_rates.length,
				max: data.negotiated_rates.reduce(
					(acc, rate) => Math.max(acc, Number(rate)),
					0,
				),
				min: data.negotiated_rates.reduce(
					(acc, rate) => Math.min(acc, Number(rate)),
					999999999999999,
				),
			}))
			.filter((data) =>
				filterContext.billingCodes.some(
					(code) => code.code === data.billingCode && code.selected,
				),
			);
	}, [negotiatedRatesPerBillingCode, filterContext.billingCodes]);

	const { from, to, bindTo, bindFrom } = useFromTo({
		initialFrom: 0,
		initialTo: COLUMNS_PER_VIEW,
		lowerLimit: 0,
		upperLimit: allChartData.length,
	});

	const [chartData, setChartData] = useState(allChartData.slice(0, 100));

	useEffect(() => {
		setChartData(allChartData.slice(from, to));
	}, [from, to, allChartData]);

	return (
		<>
			<Card className="">
				<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
					<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
						<CardTitle>Negotiated Rates Per Billing Code</CardTitle>
						<CardDescription>
							Note: This data is based on the first <b>{totalRows} </b>rows of
							the report.
						</CardDescription>
					</div>
					<div className="flex">
						<span className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
							<span className="text-xs text-muted-foreground">
								billing codes selected
							</span>
							<span className="text-lg font-bold leading-none sm:text-3xl">
								{
									filterContext.billingCodes.filter((code) => code.selected)
										.length
								}
							</span>
						</span>
					</div>
				</CardHeader>
				<CardContent className="">
					<div className="flex items-center justify-center ">
						<div className="flex items-center justify-between w-full ">
							{allChartData.length > COLUMNS_PER_VIEW && (
								<button
									type="button"
									{...bindFrom}
									className="flex items-center justify-center w-9 h-9 border rounded-full"
								>
									<ArrowLeftIcon className="w-6 h-6" />
								</button>
							)}

							<ChartContainer
								config={{
									average: {
										label: (
											<button
												type="button"
												onClick={() =>
													setShowBars({
														...showBars,
														showAvg: !showBars.showAvg,
													})
												}
												className={showBars.showAvg ? "" : "line-through"}
											>
												Average Negotiated Rate
											</button>
										),
										color: "#60a5fa",
									},

									max: {
										label: (
											<button
												type="button"
												onClick={() =>
													setShowBars({
														...showBars,
														showMax: !showBars.showMax,
													})
												}
												className={showBars.showMax ? "" : "line-through"}
											>
												Maximum Negotiated Rate
											</button>
										),
										color: "#705757",
									},

									min: {
										label: (
											<button
												type="button"
												onClick={() =>
													setShowBars({
														...showBars,
														showMin: !showBars.showMin,
													})
												}
												className={showBars.showMin ? "" : "line-through"}
											>
												Minimum Negotiated Rate
											</button>
										),
										color: "#4c1d95",
									},
								}}
								className="lg:min-h-[400px]"
							>
								<BarChart
									stackOffset="none"
									accessibilityLayer
									data={chartData}
								>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="billingCode"
										tickLine={false}
										tickMargin={10}
										axisLine={false}
										tickFormatter={(value) => value}
									/>

									<ChartTooltip
										content={
											<ChartTooltipContent
												labelFormatter={(value) => {
													return `${value} - ${billingCodeMap[value].name}`;
												}}
											/>
										}
									/>
									<ChartLegend content={<ChartLegendContent />} />

									<Bar
										dataKey="min"
										fill="var(--color-min)"
										radius={2}
										stackId="a"
										hide={!showBars.showMin}
									/>
									<Bar
										dataKey="average"
										fill="var(--color-average)"
										radius={2}
										stackId="a"
										hide={!showBars.showAvg}
									/>
									<Bar
										dataKey="max"
										fill="var(--color-max)"
										radius={2}
										stackId="a"
										hide={!showBars.showMax}
									/>
								</BarChart>
							</ChartContainer>
							{allChartData.length > COLUMNS_PER_VIEW && (
								<button
									type="button"
									{...bindTo}
									className="flex items-center justify-center w-9 h-9 border rounded-full"
								>
									<ArrowRightIcon className="w-6 h-6" />
								</button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
}

export function AllowedAmountChart({
	allowedAmountPerBillingCode,
	billedChargePerBillingCode,
	totalRows,
	billingCodeMap,
}: {
	allowedAmountPerBillingCode: Record<
		string,
		{ billing_code: string; allowed_amounts: number[] }
	>;
	billedChargePerBillingCode: Record<
		string,
		{ billing_code: string; billed_charges: number[] }
	>;
	totalRows: number;
	billingCodeMap: BillingCodeMap;
}) {
	const [showAllowedAmount, setShowAllowedAmount] = useState(true);
	const dynamicSuffix = showAllowedAmount ? "Allowed Amount" : "Billed Charge";
	const filterContext = useContext(FilterContext);
	const [showBars, setShowBars] = useState({
		showMin: true,
		showMax: true,
		showAvg: true,
	});

	const allowedAmountChartData = useMemo(() => {
		return Object.entries(allowedAmountPerBillingCode)
			.map(([billingCode, data]) => ({
				billingCode: billingCode,
				frequency: data.allowed_amounts.length,
				average:
					data.allowed_amounts.reduce((acc, rate) => acc + Number(rate), 0) /
					data.allowed_amounts.length,
				max: data.allowed_amounts.reduce(
					(acc, rate) => Math.max(acc, Number(rate)),
					0,
				),
				min: data.allowed_amounts.reduce(
					(acc, rate) => Math.min(acc, Number(rate)),
					999999999999999,
				),
			}))
			.filter((data) =>
				filterContext.billingCodes.some(
					(code) => code.code === data.billingCode && code.selected,
				),
			);
	}, [allowedAmountPerBillingCode, filterContext.billingCodes]);
	const billedChargeChartData = useMemo(() => {
		return Object.entries(billedChargePerBillingCode)
			.map(([billingCode, data]) => ({
				billingCode: billingCode,
				frequency: data.billed_charges.length,
				average:
					data.billed_charges.reduce((acc, rate) => acc + Number(rate), 0) /
					data.billed_charges.length,
				max: data.billed_charges.reduce(
					(acc, rate) => Math.max(acc, Number(rate)),
					0,
				),
				min: data.billed_charges.reduce(
					(acc, rate) => Math.min(acc, Number(rate)),
					999999999999999,
				),
			}))
			.filter((data) =>
				filterContext.billingCodes.some(
					(code) => code.code === data.billingCode && code.selected,
				),
			);
	}, [billedChargePerBillingCode, filterContext.billingCodes]);
	const allChartData = showAllowedAmount
		? allowedAmountChartData
		: billedChargeChartData;

	const { from, to, bindTo, bindFrom } = useFromTo({
		initialFrom: 0,
		initialTo: COLUMNS_PER_VIEW,
		lowerLimit: 0,
		upperLimit: allChartData.length,
	});

	const [chartData, setChartData] = useState(allChartData.slice(0, 100));

	useEffect(() => {
		setChartData(allChartData.slice(from, to));
	}, [from, to, allChartData]);

	return (
		<>
			<Card className="">
				<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
					<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
						<CardTitle>
							<h1>{dynamicSuffix} Per Billing Code</h1>
							<button
								onClick={() => setShowAllowedAmount(!showAllowedAmount)}
								type="button"
								className="text-sm font-normal text-blue-600 cursor-pointer"
							>
								View {showAllowedAmount ? "Billed Charge" : "Allowed Amount"}{" "}
								instead
							</button>
						</CardTitle>
						<CardDescription>
							Note: This data is based on the first <b>{totalRows} </b>rows of
							the report.
						</CardDescription>
					</div>
					<div className="flex">
						<span className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
							<span className="text-xs text-muted-foreground">
								billing codes selected
							</span>
							<span className="text-lg font-bold leading-none sm:text-3xl">
								{
									filterContext.billingCodes.filter((code) => code.selected)
										.length
								}
							</span>
						</span>
					</div>
				</CardHeader>
				<CardContent className="">
					<div className="flex items-center justify-center ">
						<div className="flex items-center justify-between w-full ">
							{allChartData.length > COLUMNS_PER_VIEW && (
								<button
									type="button"
									{...bindFrom}
									className="flex items-center justify-center w-9 h-9 border rounded-full"
								>
									<ArrowLeftIcon className="w-6 h-6" />
								</button>
							)}

							<ChartContainer
								config={{
									average: {
										label: (
											<button
												type="button"
												onClick={() =>
													setShowBars({
														...showBars,
														showAvg: !showBars.showAvg,
													})
												}
												className={showBars.showAvg ? "" : "line-through"}
											>
												Average {dynamicSuffix}
											</button>
										),
										color: "#60a5fa",
									},

									max: {
										label: (
											<button
												type="button"
												onClick={() =>
													setShowBars({
														...showBars,
														showMax: !showBars.showMax,
													})
												}
												className={showBars.showMax ? "" : "line-through"}
											>
												Maximum {dynamicSuffix}
											</button>
										),
										color: "#705757",
									},

									min: {
										label: (
											<button
												type="button"
												onClick={() =>
													setShowBars({
														...showBars,
														showMin: !showBars.showMin,
													})
												}
												className={showBars.showMin ? "" : "line-through"}
											>
												Minimum {dynamicSuffix}
											</button>
										),
										color: "#4c1d95",
									},
								}}
								className="lg:min-h-[400px]"
							>
								<BarChart
									stackOffset="none"
									accessibilityLayer
									data={chartData}
								>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="billingCode"
										tickLine={false}
										tickMargin={10}
										axisLine={false}
										tickFormatter={(value) => value}
									/>

									<ChartTooltip
										content={
											<ChartTooltipContent
												labelFormatter={(value) => {
													return `${value} - ${billingCodeMap[value].name}`;
												}}
											/>
										}
									/>
									<ChartLegend content={<ChartLegendContent />} />

									<Bar
										dataKey="min"
										fill="var(--color-min)"
										radius={2}
										stackId="a"
										hide={!showBars.showMin}
									/>
									<Bar
										dataKey="average"
										fill="var(--color-average)"
										radius={2}
										stackId="a"
										hide={!showBars.showAvg}
									/>
									<Bar
										dataKey="max"
										fill="var(--color-max)"
										radius={2}
										stackId="a"
										hide={!showBars.showMax}
									/>
								</BarChart>
							</ChartContainer>
							{allChartData.length > COLUMNS_PER_VIEW && (
								<button
									type="button"
									{...bindTo}
									className="flex items-center justify-center w-9 h-9 border rounded-full"
								>
									<ArrowRightIcon className="w-6 h-6" />
								</button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
