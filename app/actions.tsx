"use server";

import { DEMO_REPORTS } from "@/lib/config";
import { CSVParser } from "@/lib/csv-parser";
import { S3Service } from "@/lib/s3-service";
import type { MrfRequest, MrfSearchRequest, ReportConfig } from "@/lib/types";
import { getAllowedAmountResponse } from "@/lib/utils";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { cookies } from "next/headers";

export async function removeSingleReport(reportName: string) {
	cookies().delete(`report-${reportName}`);
	return true;
}
export async function removeSingleMrfSearch(reportName: string) {
	cookies().delete(`mrf-search-${reportName}`);
	return true;
}

export async function getMyMrfSearches(): Promise<MrfSearchRequest[]> {
	const all = cookies().getAll();
	const reports = all.filter((cookie) => cookie.name.startsWith("mrf-search-"));
	const requests: MrfSearchRequest[] = [];
	//
	for (const cookie of reports) {
		const id = cookie.name.replace("mrf-search-", "");
		const report = cookies().get(`mrf-search-${id}`);
		if (!report) {
			continue;
		}
		const data = JSON.parse(report.value) as MrfSearchRequest;
		requests.push(data);
	}

	return requests;
}

export async function getMyRequests(): Promise<MrfRequest[]> {
	const all = cookies().getAll();
	const reports = all.filter((cookie) => cookie.name.startsWith("report-"));
	const lastFetchedAt = new Date().toISOString();

	const s3Service = new S3Service();
	const requests: MrfRequest[] = [];

	for (const reportName of DEMO_REPORTS) {
		requests.push({
			id: reportName,
			isDefault: true,
			urls: [],
			eins: [],
			npis: [],
			status: "completed",
			isAllowedAmount: false,
			billingCodes: [],
			gRecaptchaToken: "",
			report: {
				header: [],
				data: [],
			},
			lastFetchedAt,
			reportStatuses: [],
		});
	}

	for (const cookie of reports) {
		const id = cookie.name.replace("report-", "");
		const reportExists = await s3Service.reportExists(id);
		const configExists = reportExists ? true : await s3Service.configExists(id);
		try {
			const value = JSON.parse(cookie.value) as MrfRequest;
			requests.push({
				id,
				urls: [],
				eins: [],
				npis: [],
				status: value.isAllowedAmount
					? "completed"
					: reportExists
					  ? "completed"
					  : configExists
						  ? "pending"
						  : "error",
				billingCodes: [],
				isAllowedAmount: value.isAllowedAmount,
				gRecaptchaToken: "",
				report: {
					header: [],
					data: [],
				},
				lastFetchedAt,
				reportStatuses: [],
			});
		} catch (e) {
			console.error(e);
		}
	}

	return requests;
}

export async function getReport(
	reportName: string,
): Promise<MrfRequest | null> {
	const lastFetchedAt = new Date().toISOString();
	const all = cookies().getAll();
	const reports = all.filter((cookie) => cookie.name.startsWith("report-"));
	const report = reports.find(
		(cookie) => cookie.name.replace("report-", "") === reportName,
	);
	const reportValue = report?.value
		? (JSON.parse(report.value) as ReportConfig)
		: null;
	if (reportValue?.isAllowedAmount) {
		const response = await getAllowedAmountResponse(
			reportValue.in_network_file_urls[0],
		);
		if (!response) {
			return null;
		}
		return {
			isAllowedAmount: true,
			allowedAmounts: response.records,
			isDefault: false,
			billingCodes: [],
			gRecaptchaToken: "",
			report: {
				header: ["d"],
				data: [],
			},
			lastFetchedAt,
			reportStatuses: [
				{
					status: "completed",
					message: "Report is enqueued",
				},
				{
					status: "completed",
					message: "Report generation has started",
				},
				{
					status: "completed",
					message: "Report generation is completed",
				},
			],
			urls: [reportValue.in_network_file_urls[0]],
			eins: [],
			npis: [],
			id: reportName,
			status: "completed",
		};
	}
	if (!report) {
		// the report doesn't belongs to the current user
		// return null;
	}
	const client = new S3Client({
		region: process.env.AWS_REGION,
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
		},
	});
	const reportConfigCommand = new GetObjectCommand({
		Bucket: process.env.AWS_S3_BUCKET ?? "",
		Key: `reports/${reportName}.config.json`,
	});
	let configDataContent = "";
	try {
		const response = await client.send(reportConfigCommand);
		configDataContent = (await response?.Body?.transformToString()) ?? "";
		// csv = await fs.readFile("./assets/sample-report.csv", "utf8");
	} catch (err) {
		// report config is not found
		return null;
	}
	let configData: ReportConfig;
	try {
		configData = JSON.parse(configDataContent);
	} catch (err) {
		// invalid report config data
		return null;
	}

	// checking if the report is ready
	console.log(`reading : reports/${reportName}/report.demo.csv`);
	const reportCommand = new GetObjectCommand({
		Bucket: process.env.AWS_S3_BUCKET,
		// Key: "reports/2024_07_12_anthem_1_oncology_md/report.demo.csv",
		Key: `reports/${reportName}/report.demo.csv`,
	});
	let csv = "";
	try {
		const response = await client.send(reportCommand);
		csv = (await response?.Body?.transformToString()) ?? "";
		// csv = await fs.readFile("./assets/sample-report.csv", "utf8");
	} catch (err) {
		// report is not ready
		return {
			id: reportName,
			urls: configData.in_network_file_urls,
			eins: (configData.filter.provider_group_tin_value as string[]) ?? [],
			npis: (configData.filter.provider_group_npi as string[]) ?? [],
			status: "pending",
			billingCodes: configData.filter.billing_code as string[],
			gRecaptchaToken: "",
			report: {
				header: [],
				data: [],
			},
			lastFetchedAt,
			reportStatuses: [
				{
					status: "completed",
					message: "Report is enqueued",
				},
				{
					status: "pending",
					message: "Report generation has started",
				},
			],
		};
	}

	if (!csv) {
		return null;
	}

	const parser = new CSVParser(csv);
	const [header, ...csvData] = parser.getRows();

	return {
		id: reportName,
		urls: configData.in_network_file_urls,
		eins: (configData.filter.provider_group_tin_value as string[]) ?? [],
		npis: (configData.filter.provider_group_npi as string[]) ?? [],
		status: "completed",
		billingCodes: (configData.filter.billing_code as string[]) ?? [],
		gRecaptchaToken: "",
		report: {
			header,
			data: csvData,
		},
		lastFetchedAt,
		reportStatuses: [
			{
				status: "completed",
				message: "Report is enqueued",
			},
			{
				status: "completed",
				message: "Report generation has started",
			},
			{
				status: "completed",
				message: "Report generation is completed",
			},
		],
	};
}
