import { S3Service } from "@/lib/s3-service";
import type { ReportConfig } from "@/lib/types";
import { getAllowedAmountResponse, jsonToCsv } from "@/lib/utils";
import { cookies } from "next/headers";
export async function GET(
	request: Request,
	{ params }: { params: { reportId: string } },
) {
	// get path parameter from the request
	const uploader = new S3Service();
	const cookie = cookies().get(`report-${params.reportId}`);
	if (!cookie) return new Response("Report not found", { status: 404 });
	const reportValue = cookie?.value
		? (JSON.parse(cookie.value) as ReportConfig)
		: null;
	if (reportValue?.isAllowedAmount) {
		const report = await getAllowedAmountResponse(
			reportValue.in_network_file_urls[0],
		);
		if (!report) return new Response("Report not found", { status: 404 });
		const headers = new Headers();
		headers.append(
			"Content-Disposition",
			`attachment; filename="report-${params.reportId}.csv"`,
		);
		return new Response(jsonToCsv(report.records), {
			headers,
		});
	}

	const report = await uploader.downloadFile(params.reportId);

	const headers = new Headers();
	headers.append(
		"Content-Disposition",
		`attachment; filename="report-${params.reportId}.${report.fileType}"`,
	);

	return new Response(report.file.Body?.transformToWebStream(), {
		headers,
	});
}
