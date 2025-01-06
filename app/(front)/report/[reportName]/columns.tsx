"use client";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuCheckboxItem,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
	ListFilter,
	ArrowDownIcon,
	ArrowUpIcon,
	SortAscIcon,
	EyeIcon,
} from "lucide-react";
import { useContext, useEffect } from "react";
import { type BillingCode, FilterContext } from "./context";
import type { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table";
import { Textarea } from "@/components/ui/textarea";

export type BillingCodeMap = {
	[billingCode: string]: {
		name: string;
		description: string;
	};
};

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="-ml-3 h-8 data-[state=open]:bg-accent"
					>
						<span>{title}</span>
						{column.getIsSorted() === "desc" ? (
							<ArrowDownIcon className="ml-2 h-4 w-4" />
						) : column.getIsSorted() === "asc" ? (
							<ArrowUpIcon className="ml-2 h-4 w-4" />
						) : (
							<SortAscIcon className="ml-2 h-4 w-4" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
						<ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
						<ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Desc
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
						<EyeIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Hide
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export type ReportRow = {
	version: string;
	negotiation_arrangement: string;
	name: string;
	billing_code_type: string;
	billing_code_type_version: string;
	billing_code: string;
	description: string;
	billing_class: string;
	negotiated_type: string;
	negotiated_rate: string;
	service_code: string;
	// expiration_date,billing_code_modifier,provider_group_npi,provider_group_tin_type,provider_group_tin_value,hash
	expiration_date: string;
	billing_code_modifier: string;
	provider_group_npi: string;
	provider_group_tin_type: string;
	provider_group_tin_value: string;
	hash: string;
	allowed_amount?: number;
	billed_charge?: number;
};

export const columns: ColumnDef<ReportRow>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "billing_code_type",
		header: "Billing Code Type",
	},
	{
		accessorKey: "billing_code_type_version",
		header: "Billing Code Type Version",
	},
	{
		accessorKey: "billing_code",
		header: "Billing Code",
	},
	{
		accessorKey: "description",
		header: "Description",
	},
	{
		accessorKey: "billing_class",
		header: "Billing Class",
	},
	{
		accessorKey: "negotiated_type",
		header: "Negotiated Type",
	},
	{
		accessorKey: "negotiated_rate",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Negotiated Rate" />
		),
	},
	{
		accessorKey: "service_code",
		header: "Service Code",
		cell: ({ row }) =>
			row.original.service_code ? (
				<ServiceCodeCell value={row.original.service_code} />
			) : null,
	},
	{
		accessorKey: "expiration_date",
		header: "Expiration Date",
	},
	{
		accessorKey: "billing_code_modifier",
		header: "Billing Code Modifier",
	},
	{
		accessorKey: "provider_group_npi",
		header: "Provider Group NPI",
	},
	{
		accessorKey: "provider_group_tin_type",
		header: "Provider Group TIN Type",
	},
	{
		accessorKey: "provider_group_tin_value",
		header: "Provider Group TIN Value",
	},
	{
		accessorKey: "negotiation_arrangement",
		header: "Negotiation Arrangement",
	},
];

export const allowedAmountColumns: ColumnDef<ReportRow>[] = [
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => (
			<NameCell
				name={row.original.name}
				description={row.original.description}
			/>
		),
	},
	{
		accessorKey: "allowed_amount",
		header: "Allowed Amount",
	},
	{
		accessorKey: "billed_charge",
		header: "Billed Charge",
	},
	{
		accessorKey: "billing_code_type",
		header: "Billing Code Type",
	},
	{
		accessorKey: "billing_code_type_version",
		header: "Billing Code Type Version",
	},
	{
		accessorKey: "billing_code",
		header: "Billing Code",
	},
	{
		accessorKey: "billing_class",
		header: "Billing Class",
	},
	// {
	// 	accessorKey: "negotiated_type",
	// 	header: "Negotiated Type",
	// },
	// {
	// 	accessorKey: "negotiated_rate",
	// 	header: ({ column }) => (
	// 		<DataTableColumnHeader column={column} title="Negotiated Rate" />
	// 	),
	// },
	{
		accessorKey: "service_code",
		header: "Service Code",
		cell: ({ row }) =>
			row.original.service_code ? (
				<ServiceCodeCell value={row.original.service_code} />
			) : null,
	},

	// {
	// 	accessorKey: "expiration_date",
	// 	header: "Expiration Date",
	// },
	// {
	// 	accessorKey: "billing_code_modifier",
	// 	header: "Billing Code Modifier",
	// },
	// {
	// 	accessorKey: "provider_group_npi",
	// 	header: "Provider Group NPI",
	// },
	// {
	// 	accessorKey: "provider_group_tin_type",
	// 	header: "Provider Group TIN Type",
	// },
	// {
	// 	accessorKey: "provider_group_tin_value",
	// 	header: "Provider Group TIN Value",
	// },
	// {
	// 	accessorKey: "negotiation_arrangement",
	// 	header: "Negotiation Arrangement",
	// },
];

const NameCell = ({
	name,
	description,
}: { name: string; description: string }) => {
	return (
		<>
			<Popover>
				<PopoverTrigger asChild>
					<p className="line-clamp-2 w-96">
						{name} <br /> <span className="text-blue-600"> Read More ...</span>
					</p>
				</PopoverTrigger>
				<PopoverContent className="w-96">
					<div className="grid gap-4">
						<div className="space-y-2">
							<h4 className="font-medium leading-none">Name</h4>
							<p className="text-sm text-muted-foreground">{name}</p>
						</div>
						<div className="space-y-2">
							<h4 className="font-medium leading-none">Description</h4>
							<p className="text-sm text-muted-foreground">{description}</p>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</>
	);
};

const ServiceCodeCell = ({ value }: { value: string }) => {
	const codes = value.split("|");
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">View Service Codes ({codes.length})</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Service Codes</DialogTitle>
					<DialogDescription>
						There are {codes.length} codes associated with this row.
					</DialogDescription>
				</DialogHeader>

				<div className=" gap-2 overflow-auto">
					{codes.map((code) => (
						<Badge key={code}>{code}</Badge>
					))}
				</div>

				<DialogFooter className="sm:justify-start">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

interface VirtualizedCommandProps {
	height: string;
	placeholder: string;
	onSelectOption?: (option: string) => void;
	onClearOption: () => void;
	onSelectAllClick: () => void;
}

const VirtualizedCommand = ({
	height,
	placeholder,
	onSelectOption,
	onClearOption,
	onSelectAllClick,
}: VirtualizedCommandProps) => {
	const options = useContext(FilterContext).billingCodes;
	const [filteredOptions, setFilteredOptions] =
		React.useState<BillingCode[]>(options);
	const parentRef = React.useRef(null);
	const [query, setQuery] = React.useState("");

	const handleSearch = (search: string) => {
		setQuery(search);
		setFilteredOptions(
			options.filter((option) =>
				option.code.toLowerCase().includes(search.toLowerCase() ?? []),
			),
		);
	};

	useEffect(() => {
		setFilteredOptions(
			options.filter((option) =>
				option.code.toLowerCase().includes(query.toLowerCase() ?? []),
			),
		);
	}, [options]);

	const virtualizer = useVirtualizer({
		count: filteredOptions.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 35,
		overscan: 5,
	});

	const virtualOptions = virtualizer.getVirtualItems();

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
		}
	};

	return (
		<Command shouldFilter={false} onKeyDown={handleKeyDown}>
			<CommandInput
				onValueChange={handleSearch}
				placeholder={placeholder}
				onClearClick={onClearOption}
				onSelectAllClick={onSelectAllClick}
			/>

			<CommandList>
				<CommandEmpty>No item found.</CommandEmpty>
				<CommandGroup
					ref={parentRef}
					style={{
						height: height,
						width: "100%",
						overflow: "auto",
					}}
				>
					<div
						style={{
							height: `${virtualizer.getTotalSize()}px`,
							width: "100%",
							position: "relative",
						}}
					>
						{virtualOptions?.map((virtualOption) => (
							<CommandItem
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: `${virtualOption.size}px`,
									transform: `translateY(${virtualOption.start}px)`,
								}}
								key={filteredOptions[virtualOption.index].code}
								value={filteredOptions[virtualOption.index].code}
								onSelect={onSelectOption}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										filteredOptions[virtualOption.index].selected
											? "opacity-100"
											: "opacity-0",
									)}
								/>
								{filteredOptions[virtualOption.index].label}
							</CommandItem>
						))}
					</div>
				</CommandGroup>
			</CommandList>
		</Command>
	);
};

export const FilterByBillingCode = ({
	billingCodes,
}: { billingCodes: BillingCode[] }) => {
	const width = "400px";
	const height = "400px";
	const filterContext = useContext(FilterContext);
	const searchPlaceholder = "Filter By Billing Codes";

	useEffect(() => {
		filterContext.setBillingCodes(billingCodes);
	}, [billingCodes]);

	const [open, setOpen] = React.useState<boolean>(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="justify-between"
				>
					<ListFilter className="h-3.5 w-3.5 mr-1" /> {searchPlaceholder}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0" style={{ width: width }}>
				<VirtualizedCommand
					height={height}
					onClearOption={() => {
						filterContext.markAllAsInActive();
					}}
					placeholder={searchPlaceholder}
					onSelectOption={(currentValue) => {
						filterContext.toggleBillingCode(currentValue);
					}}
					onSelectAllClick={() => {
						filterContext.markAllAsActive();
					}}
				/>
			</PopoverContent>
		</Popover>
	);
};
