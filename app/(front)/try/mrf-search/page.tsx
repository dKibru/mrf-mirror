import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getMyMrfSearches } from "../../../actions";
import Refresher from "../refresher";
import MrfSearchRow from "./row";

export default async function MrfSearchPage() {
	const data = await getMyMrfSearches();
	if (data.length === 0) {
		return <EmptyState />;
	}
	return (
		<Table>
			<TableCaption>A list of your recent requests.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Insurance Company</TableHead>
					<TableHead>EINs</TableHead>
					<TableHead>NPIs</TableHead>
					<TableHead>Count</TableHead>
					<TableHead className="text-right">
						<Refresher />
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((request) => (
					<MrfSearchRow request={request} key={request.report_name} />
				))}
			</TableBody>
		</Table>
	);
}

const EmptyState = () => (
	<div className="flex flex-1 items-center justify-center rounded-lg">
		<div className="flex flex-col items-center gap-1 text-center">
			<h3 className="text-2xl font-bold tracking-tight">
				You have no searches yet.
			</h3>
			<p className="text-sm text-muted-foreground">
				Requests will appear here as you process them.
			</p>
		</div>
	</div>
);
