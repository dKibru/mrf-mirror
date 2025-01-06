"use client";
import axios from "axios";
import { startTransition, useState } from "react";
import { LoaderCircle } from "lucide-react";
// import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { sampleNegotiatedRateUrls } from "@/configs";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z
	.object({
		url: z.string().min(2),
		billing_code: z.string().optional(),
		npi: z.string().optional(),
		ein: z.string().optional(),
		tos_accepted: z.boolean({
			message: "Please accept the terms of service",
		}),
	})
	.refine((data) => !(data.ein && data.npi), {
		message: "Either ein or npi should exist, but not both.",
		path: ["npi"],
	})
	.refine((data) => data.tos_accepted === true, {
		message: "Please accept the terms of service",
		path: ["tos_accepted"],
	});

export const TryMrfViewForm = () => {
	// const { executeRecaptcha } = useGoogleReCaptcha();
	const { toast } = useToast();

	const [showLoading, setShowLoading] = useState(false);
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const fillSample = (index: number) => {
		const sample = sampleNegotiatedRateUrls[index];
		form.setValue("url", sample.url || "");
		form.setValue("ein", sample.ein || "");
		form.setValue("npi", sample.npi || "");
		form.setValue("billing_code", sample.billing_code || "");
		toast({
			title: "You used a sample URL",
			description: `${sample.title} is a sample URL. You can use it to test the system.`,
		});
	};

	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		// if (!executeRecaptcha) {
		// 	alert("Execute recaptcha not available yet");
		// 	return;
		// }
		setShowLoading(true);
		// executeRecaptcha("enquiryFormSubmit").then((gReCaptchaToken) => {
		submitForm("gReCaptchaToken", values);
		// });
	};

	const submitForm = async (
		gReCaptchaToken: string,
		values: z.infer<typeof formSchema>,
	) => {
		const mrfUrl = values.url;
		const eins = values.ein;
		const npis = values.npi;
		const billingCodes = values.billing_code;
		try {
			const response = await axios.post(
				"/api/mrf/size",
				{
					mrfUrl,
					eins,
					npis,
					billingCodes,
					gRecaptchaToken: gReCaptchaToken,
				},
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				},
			);

			if (response.data.success) {
				startTransition(() => {
					toast({
						title: "Success",
						description: "Report has been created. Welcome!",
						action: (
							<ToastAction
								altText="Go To The Detail Page"
								onClick={() =>
									router.push(`/report/${response.data.reportName}`)
								}
							>
								Go To The Detail Page
							</ToastAction>
						),
					});
					setShowLoading(false);
					router.refresh();
					form.reset({
						url: "",
						ein: "",
						billing_code: "",
						npi: "",
						tos_accepted: false,
					});
				});
			} else {
				toast({
					variant: "destructive",
					title: "Report has failed",
					description: `Report has failure with error: ${response.data.error}`,
					action: <ToastAction altText="retry">Retry</ToastAction>,
				});
				setShowLoading(false);
			}
		} catch (error: any) {
			if (axios.isAxiosError(error)) {
				const errorData = error?.response?.data;
				setShowLoading(false);
				toast({
					variant: "destructive",
					title: "Error submitting form",
					description: errorData.error
						? errorData.error
						: "An error occurred. Please try again.",
				});
			} else {
				toast({
					variant: "destructive",
					title: "Error submitting form",
					description: "An error occurred. Please try again.",
				});
			}
		}
	};

	return (
		<>
			<div className="pointer-events-auto mx-auto max-w-2xl rounded-xl bg-white pt-1 border-none ">
				<p className="text-sm leading-6 text-gray-900 text-justify">
					Try our advanced MRF processing tools for free and see how quickly and
					efficiently we handle even the most complex files. Our trial is
					limited to 100,000 rows, giving you a taste of how we can streamline
					your data analysis.
				</p>
				<p className="text-sm leading-6 text-gray-900">
					Do not have any files on hand? Try one of these out:
				</p>
			</div>
			<div className="flex flex-wrap justify-center pb-5">
				{sampleNegotiatedRateUrls.map((sample, index) => (
					<Badge
						variant="outline"
						key={sample.url}
						className="text-yellow-100 bg-yellow-700 cursor-pointer"
						onClick={() => fillSample(index)}
					>
						{sample.title}
						{sample.url === form.getValues("url") && (
							<div>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="100%"
									height="100%"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
									className="feather feather-x cursor-pointer hover:text-yellow-400 rounded-full w-4 h-4 ml-2"
								>
									<title>x</title>
									<line x1={18} y1={6} x2={6} y2={18} />
									<line x1={6} y1={6} x2={18} y2={18} />
								</svg>
							</div>
						)}
					</Badge>
				))}
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
					<FormField
						control={form.control}
						name="url"
						render={({ field }) => (
							<FormItem>
								<FormLabel>MRF URL</FormLabel>
								<FormControl>
									<Textarea className="text-xs" placeholder="" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="ein"
						render={({ field }) => (
							<FormItem>
								<FormLabel>EINs</FormLabel>
								<FormControl>
									<Input placeholder="" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="npi"
						render={({ field }) => (
							<FormItem>
								<FormLabel>NPIs</FormLabel>
								<FormControl>
									<Input placeholder="" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="billing_code"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Billing Codes</FormLabel>
								<FormControl>
									<Input placeholder="" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="tos_accepted"
						render={({ field }) => (
							<FormItem className="mb-5 select-none">
								<FormControl>
									<div className="flex items-center space-x-2">
										<Checkbox
											id="tos_accepted"
											checked={field.value}
											onCheckedChange={() => {
												console.log(field.value);
												// field.value = !field.value;
												form.setValue("tos_accepted", !field.value);
												// field.onChange(!field.value);
											}}
										/>
										<label
											htmlFor="tos_accepted"
											className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
										>
											I agree to the{" "}
											<Link
												className="text-black"
												href="https://www.mrfview.com/data-use-agreement"
												target="_blank"
											>
												<button
													type="button"
													className="text-blue-500 hover:underline"
												>
													Data Use Agreement
												</button>
											</Link>{" "}
										</label>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={showLoading} className="">
						Process{" "}
						{showLoading && <LoaderCircle className="animate-spin ml-2" />}
					</Button>
				</form>
			</Form>
		</>
	);
};
