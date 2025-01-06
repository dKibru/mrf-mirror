"use client";

import { removeSingleMrfSearch } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useRouterRefresh } from "@/lib/hooks";
import type { MrfRequest, MrfSearchRequest } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
	CheckCircle,
	Download,
	Eye,
	MinusCircle,
	UndoIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function MrfSearchRow({
	request,
}: {
	request: MrfSearchRequest;
}) {
	const [deletingState, setDeletingState] = useState<
		"confirming" | "idle" | "deleting"
	>("idle");
	const router = useRouter();
	const refresh = useRouterRefresh();
	const { toast } = useToast();

	const onDeleteClick = async () => {
		setDeletingState("deleting");
		await removeSingleMrfSearch(request.report_name);

		refresh().then(() => {
			setDeletingState("idle");
			toast({
				title: "Success",
				description: `Report ${request.report_name} has been Removed`,
			});
		});
	};

	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<TableRow
					className={cn(
						"w-full",
						deletingState === "confirming" ? "line-through text-red-200" : "",
						deletingState === "deleting" ? "blur-sm" : "",
					)}
					key={request.report_name}
				>
					<TableCell className="font-medium">
						{request.filter.insurance_company}
					</TableCell>
					<TableCell>
						{request.filter.eins?.map((ein) => (
							<Badge key={ein}>{ein}</Badge>
						))}
					</TableCell>

					<TableCell>
						{request.filter.npis?.map((npi) => (
							<Badge key={npi}>{npi}</Badge>
						))}
					</TableCell>
					<TableCell>{request.data?.count}</TableCell>
					<TableCell className="text-right">
						{deletingState === "confirming" ? (
							<UndoIcon
								onClick={() => setDeletingState("idle")}
								className="inline size-4 text-green-500 ml-2 cursor-pointer"
							/>
						) : (
							<Eye className="inline size-6 text-blue-500 ml-2 cursor-pointer" />
						)}

						{deletingState === "confirming" ? (
							<CheckCircle
								onClick={onDeleteClick}
								className="inline size-4 text-red-500 ml-2 cursor-pointer"
							/>
						) : (
							<MinusCircle
								onClick={() => setDeletingState("confirming")}
								className="inline size-4 text-red-500 ml-2  cursor-pointer"
							/>
						)}
					</TableCell>
				</TableRow>
			</HoverCardTrigger>
			<HoverCardContent className="w-80">
				<div className="flex justify-between space-x-4">
					<div className="space-y-1">
						<h4 className="text-sm font-semibold">Mrf URLS</h4>
						<p className="text-sm">
							<ul>
								{Array.from({ length: request.data?.count ?? 0 }).map(
									(_, index) => (
										<li className="py-1" key={index}>
											{index + 1}.{" "}
											<span className="blur-md">
												https://www.example.com/report.csv
											</span>
										</li>
									),
								)}
							</ul>
						</p>
						<div className="flex items-center pt-2">
							<span className="text-xs text-muted-foreground">
								This report is based on {request.data?.percentage} % of the
								data. Contact Us To Access The Actual Results.
							</span>
						</div>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
