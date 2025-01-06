"use client";

import { Button } from "@/components/ui/button";
import type { MrfRequestStatus } from "@/lib/types";
import { Download, Loader, RefreshCcw } from "lucide-react";
import { useState } from "react";

export default function DownloadReport({
	status,
	reportId,
}: { status: MrfRequestStatus; reportId: string }) {
	const [isLoading, setIsLoading] = useState(false);

	const onClick = () => {
		setIsLoading((prev) => true);
		window.open(`/api/mrf/report/${reportId}`, "_blank");
		setIsLoading((prev) => false);
	};
	return (
		<Button
			size="lg"
			disabled={status !== "completed"}
			variant="outline"
			onClick={onClick}
			className={`h-10 gap-1 text-sm  ${
				status !== "completed" ? "cursor-not-allowed" : ""
			}`}
		>
			{isLoading ? (
				<RefreshCcw className="h-3 w-3 animate-spin" />
			) : (
				<Download className="h-3.5 w-3.5" />
			)}

			<span className="sr-only sm:not-sr-only">Download</span>
		</Button>
	);
}
