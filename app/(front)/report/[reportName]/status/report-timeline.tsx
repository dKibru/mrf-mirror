import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ReportStatus } from "@/lib/types";

export default function ReportTimeline({
	statuses,
}: { statuses: ReportStatus[] }) {
	return (
		<Card className="w-full">
			<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
					<CardTitle>Status Report</CardTitle>
					<CardDescription>
						Your report is currently being processed. This page will update once
						the report is complete.
					</CardDescription>
				</div>
				<div className="flex">
					<span className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
						<span className="text-xl font-bold leading-none sm:text-3xl animate-pulse">
							......
						</span>
					</span>
				</div>
			</CardHeader>
			<CardContent>
				<div className="p-6 sm:p-10">
					<div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-muted-foreground/20 after:left-0 grid gap-10">
						{statuses.map((item, index) => (
							<div key={item.message} className="grid gap-1 text-sm relative">
								<div
									className={`aspect-square  w-3  rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-1 ${
										item.status === "pending"
											? "animate-ping bg-green-500"
											: "bg-primary"
									}`}
								/>
								<div className="font-medium">{item.message}</div>
								{/* <div className="text-muted-foreground">{item.message}</div> */}
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
