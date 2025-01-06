"use client";

import { removeSingleReport } from "@/app/actions";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useRouterRefresh } from "@/lib/hooks";
import type { MrfRequest } from "@/lib/types";
import { CheckCircle, Eye, MinusCircle, UndoIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RequestsTableRow({ request }: { request: MrfRequest }) {
	const [deletingState, setDeletingState] = useState<
		"confirming" | "idle" | "deleting"
	>("idle");
	const router = useRouter();
	const refresh = useRouterRefresh();
	const { toast } = useToast();

	const onDeleteClick = async () => {
		setDeletingState("deleting");
		await removeSingleReport(request.id);

		refresh().then(() => {
			setDeletingState("idle");
			toast({
				title: "Success",
				description: `Report ${request.id} has been Removed`,
			});
		});
	};
	return (
		<TableRow
			className={
				deletingState === "confirming"
					? "line-through text-red-200"
					: deletingState === "deleting"
					  ? "blur-sm"
					  : ""
			}
			key={request.id}
		>
			<TableCell className="font-medium">
				<Link href={`/report/${request.id}`}>{request.id}</Link>
			</TableCell>
			<TableCell className="font-medium">
				{request.isAllowedAmount ? "Allowed Amount" : "Negotiated Rate"}
			</TableCell>
			<TableCell>{request.status}</TableCell>
			{request.isDefault ? (
				<TableCell className="text-right">
					<Eye
						onClick={() => router.push(`/report/${request.id}`)}
						className="inline size-4 text-blue-500 ml-2 cursor-pointer"
					/>
					<span className="size-4 ml-5">&nbsp;</span>
				</TableCell>
			) : (
				<TableCell className="text-right">
					{deletingState === "confirming" ? (
						<UndoIcon
							onClick={() => setDeletingState("idle")}
							className="inline size-4 text-green-500 ml-2 cursor-pointer"
						/>
					) : (
						<Eye
							onClick={() => router.push(`/report/${request.id}`)}
							className="inline size-4 text-blue-500 ml-2 cursor-pointer"
						/>
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
			)}
		</TableRow>
	);
}
