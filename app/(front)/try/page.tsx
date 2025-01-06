import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getMyRequests } from "../../actions";
import type { MrfRequest } from "@/lib/types";
import RequestsTableRow from "./requests-table-row";
import Refresher from "./refresher";

export default async function RegisterPage() {
	const data = await getMyRequests();
	if (data.length === 0) {
		return <EmptyState />;
	}
	return (
		<Table className="bg-gray-100">
			<TableCaption>A list of your recent requests.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="">Request ID</TableHead>
					<TableHead>Type</TableHead>
					<TableHead>Status</TableHead>
					<TableHead className="text-right">
						<Refresher />
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((request) => (
					<RequestsTableRow request={request} key={request.id} />
				))}
			</TableBody>
		</Table>
	);
}

const EmptyState = () => (
	<div className="flex flex-1 items-center justify-center rounded-lg">
		<div className="flex flex-col items-center gap-1 text-center">
			<h3 className="text-2xl font-bold tracking-tight">
				You have no requests yet.
			</h3>
			<p className="text-sm text-muted-foreground">
				Requests will appear here as you process them.
			</p>
		</div>
	</div>
);
