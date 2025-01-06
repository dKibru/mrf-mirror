"use client";

import { useContext } from "react";
import ReportTimeline from "./report-timeline";
import { FilterContext } from "../context";

export default function ReportPage() {
	const filterContext = useContext(FilterContext);

	return <ReportTimeline statuses={filterContext.reportStatuses} />;
}
