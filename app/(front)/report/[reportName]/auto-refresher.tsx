"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { REFRESH_REPORT_IN_MINUTES } from "@/lib/config";
import { useRouterRefresh } from "@/lib/hooks";
import type { MrfRequestStatus } from "@/lib/types";
import { RefreshCcw } from "lucide-react";
import * as React from "react";

export default function AutoRefresher({
	status,
}: { status: MrfRequestStatus }) {
	const router = useRouterRefresh();
	const [refresh, setRefresh] = React.useState(false);

	const refetchData = () => {
		setRefresh(true);
		router().then(() => setRefresh(false));
	};

	// refresh every minute
	React.useEffect(() => {
		if (status === "completed") return;
		const interval = setInterval(
			() => {
				refetchData();
			},
			REFRESH_REPORT_IN_MINUTES * 1000 * 60,
		);
		return () => clearInterval(interval);
	}, [router]);

	const progress = status === "completed" ? 100 : 25;

	return (
		<Card>
			<CardHeader className="pb-2">
				<CardDescription className="flex justify-between">
					<span>Status</span>
					{status !== "completed" && (
						<Button
							size="sm"
							variant="outline"
							className="h-6 gap-1"
							disabled={refresh}
							onClick={refetchData}
						>
							<RefreshCcw
								className={`h-3 w-3 ${refresh ? "animate-spin" : ""}`}
							/>
							<span className="sr-only">Refresh</span>
						</Button>
					)}
				</CardDescription>
				<CardTitle className="text-4xl">{status}</CardTitle>
			</CardHeader>
			<CardContent>
				{status === "pending" && (
					<div className="text-xs text-muted-foreground">
						Status will be updated in {REFRESH_REPORT_IN_MINUTES} minutes
					</div>
				)}
			</CardContent>
			<CardFooter>
				<Progress value={progress} aria-label="25% increase" />
			</CardFooter>
		</Card>
	);
}
