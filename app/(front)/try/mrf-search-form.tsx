"use client";
import { startTransition, useState } from "react";
import { LoaderCircle } from "lucide-react";
// import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import axios from "axios";
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
		insurance_company: z.string().min(2),
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

export const MrfSearchForm = () => {
	// const { executeRecaptcha } = useGoogleReCaptcha();
	const { toast } = useToast();

	const [showLoading, setShowLoading] = useState(false);
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

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
		const { insurance_company, ein, npi } = values;
		try {
			const response = await axios.post(
				"/api/mrf/search",
				{
					insurance_company,
					ein,
					npi,
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
				form.reset({
					ein: "",
					insurance_company: "",
					npi: "",
					tos_accepted: false,
				});
				startTransition(() => {
					toast({
						title: "Success",
						description: "Report has been created. Welcome!",
					});
					setShowLoading(false);
					router.refresh();
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
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const errorData = error?.response?.data;
				setShowLoading(false);
				throw error;
			}
			toast({
				variant: "destructive",
				title: "Error submitting form",
				description: "An error occurred. Please try again.",
				action: <ToastAction altText="retry">Retry</ToastAction>,
			});
		}
	};

	return (
		<>
			<div className="pointer-events-auto mx-auto max-w-2xl rounded-xl bg-white pt-1 border-none pb-4">
				<p className="text-sm leading-6 text-gray-900 text-justify">
					The MRF Search is an online app to find the MRF URLs for a specified
					Insurance company.
				</p>
				<p className="text-sm leading-6 text-gray-900">
					In the form below, please select the Insurance company, and/or NPIs
					and/or EIN and/or Billing codes. The found MRF urls are provided in
					the form of a downloaded text file. Use MRF Explorer for further
					processing.
				</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
					<FormField
						control={form.control}
						name="insurance_company"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Insurance Company</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<SelectTrigger className="">
										<SelectValue placeholder="Select an insurance company" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Insurance Companies</SelectLabel>
											<SelectItem value="Cigna">Cigna</SelectItem>
											<SelectItem value="UHC">UHC</SelectItem>
											<SelectItem value="Aetna">Aetna</SelectItem>
											<SelectItem value="CareFirst">CareFirst</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
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
