export type ReportConfig = {
	operations: string[];
	in_network_file_urls: string[];
	isAllowedAmount?: boolean;
	filter: {
		provider_group_tin_value?: string[];
		provider_group_npi?: string[];
		billing_code?: string[];
	};
	report_name: string;
	bucket?: string;
	meta_data: {
		ip_address: string | null;
		user_agent: string | null;
	};
};

export type MrfRequestStatus = "completed" | "pending" | "error";
export interface MrfRequest {
	id: string;
	isDefault?: boolean;
	urls: string[];
	eins: string[];
	npis: string[];
	status: MrfRequestStatus;
	isAllowedAmount?: boolean;
	billingCodes: string[];
	gRecaptchaToken: string;
	report: {
		header: string[];
		data: string[][];
	};
	lastFetchedAt: string;
	reportStatuses: ReportStatus[];
	allowedAmounts?: AllowedAmountItem[];
}

export interface ReportStatus {
	status: MrfRequestStatus;
	message: string;
}

export type MrfSearchRequest = {
	filter: {
		insurance_company: string;
		eins?: string[];
		npis?: string[];
	};
	data?: {
		count: number;
		percentage: number;
	};
	report_name: string;
	meta_data: {
		ip_address: string | null;
		user_agent: string | null;
	};
};

export type AllowedAmountItem = {
	allowed_amount: number;
	billed_charge: number;
	billing_class: string;
	billing_code: string;
	billing_code_type: string;
	billing_code_type_version: string;
	description: string;
	last_updated_on: string;
	name: string;
	npi: number;
	reporting_entity_name: string;
	reporting_entity_type: string;
	service_code: string[];
	sourceSystem_plan: string;
	tin_type: string;
	tin_value: string;
	version: string;
};
