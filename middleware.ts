import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEMO_REPORTS } from "./lib/config";

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const res = NextResponse.next();

	if (pathname.startsWith("/report")) {
		const pathSegments = pathname.split("/");
		if (pathSegments.length < 3) {
			return res;
		}
		const reportName = pathSegments[2];
		const reportExists = cookies().get(`report-${reportName}`);

		if (!reportExists && !DEMO_REPORTS.includes(reportName)) {
			res.cookies.set(`report-${reportName}`, JSON.stringify({}));
		}
		return res;
	}

	return res;
}

export const config = {
	matcher: "/report/:path*",
};
