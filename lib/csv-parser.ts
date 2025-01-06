type CSVRow = string[];
type CSVData = CSVRow[];

export class CSVParser {
	private data: string;
	private delimiter: string;
	private rows: CSVData;

	constructor(data: string, delimiter = ",") {
		this.data = data;
		this.delimiter = delimiter;
		this.rows = [];
		this.parse();
	}

	private parse(): void {
		const lines = this.data.split(/\r?\n/);
		for (const line of lines) {
			if (line.trim() === "") continue; // Skip empty lines
			const row = this.parseLine(line);
			this.rows.push(row);
		}
	}

	private parseLine(line: string): CSVRow {
		const row: CSVRow = [];
		let currentField = "";
		let inQuotes = false;

		for (let i = 0; i < line.length; i++) {
			const char = line[i];
			const nextChar = line[i + 1];

			if (char === '"' && inQuotes && nextChar === '"') {
				// Escaped quote within quoted field
				currentField += '"';
				i++; // Skip the next quote
			} else if (char === '"') {
				// Toggle inQuotes state
				inQuotes = !inQuotes;
			} else if (char === this.delimiter && !inQuotes) {
				// End of a field
				row.push(currentField);
				currentField = "";
			} else {
				// Regular character within a field
				currentField += char;
			}
		}

		// Add the last field
		row.push(currentField);
		return row;
	}

	public getRows(): CSVData {
		return this.rows;
	}

	public getRow(index: number): CSVRow | undefined {
		return this.rows[index];
	}

	public getCell(rowIndex: number, colIndex: number): string | undefined {
		const row = this.rows[rowIndex];
		return row ? row[colIndex] : undefined;
	}
}
