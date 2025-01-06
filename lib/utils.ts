import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AllowedAmountItem } from "./types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function getAllowedAmountResponse(mrfUrl: string) {
	const url = `http://3.130.73.91:8081/oon?download=csvx&url=${encodeURIComponent(
		mrfUrl,
	)}`;
	try {
		return (await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"x-api-token": "819315a2-e783-4886-8f06-8913c760a8e6",
			},
		}).then((d) => d.json())) as { records: AllowedAmountItem[] };
	} catch (e) {
		console.log(e);
		return null;
	}
}

// courtesy of chatgpt
export function jsonToCsv(jsonArray: any[]): string {
	if (jsonArray.length === 0) {
		return "";
	}
	const headers = Object.keys(jsonArray[0]);
	const csvRows: string[] = [headers.join(",")];

	for (const item of jsonArray) {
		const values = headers.map((header) => {
			const value = item[header];
			// Handle cases where the value contains a comma, new line, or quote
			const escapedValue =
				typeof value === "string" &&
				(value.includes(",") || value.includes('"') || value.includes("\n"))
					? `"${value.replace(/"/g, '""')}"`
					: value;
			return escapedValue;
		});
		csvRows.push(values.join(","));
	}

	return csvRows.join("\n");
}
