import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	HeadObjectCommand,
} from "@aws-sdk/client-s3";
const { fromUtf8 } = require("@aws-sdk/util-utf8-node");

export class S3Service {
	private s3: S3Client;
	private bucketName: string;

	constructor() {
		this.s3 = new S3Client({
			region: process.env.AWS_REGION,
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
			},
		});
		this.bucketName = process.env.AWS_S3_BUCKET as string;
	}

	async configExists(reportName: string): Promise<boolean> {
		const key = `reports/${reportName}.config.json`;
		const command = new HeadObjectCommand({
			Bucket: this.bucketName,
			Key: key,
		});

		try {
			await this.s3.send(command);
			return true;
		} catch (err) {
			return false;
		}
	}

	async reportExists(reportName: string): Promise<boolean> {
		const key = `reports/${reportName}/report.demo.csv`;
		const command = new HeadObjectCommand({
			Bucket: this.bucketName,
			Key: key,
		});

		try {
			await this.s3.send(command);
			return true;
		} catch (err) {
			return false;
		}
	}

	async uploadFile(reportName: string, content: string): Promise<string> {
		const key = `reports/${reportName}.config.json`;
		const uploadParams = {
			Bucket: this.bucketName,
			Key: key,
			Body: fromUtf8(content),
			ContentType: "application/json",
		};

		await this.s3.send(new PutObjectCommand(uploadParams));
		return key;
	}

	async downloadFile(reportName: string) {
		const reportKey = `reports/${reportName}/report.demo.csv.gz`;
		const fileType = "csv.gz";
		const downloadParams = {
			Bucket: this.bucketName,
			Key: reportKey,
		};
		const file = await this.s3.send(new GetObjectCommand(downloadParams));
		return { file, fileType };
	}
}
