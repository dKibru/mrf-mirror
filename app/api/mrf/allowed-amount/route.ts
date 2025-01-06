import axios from "axios";
import { NextResponse } from "next/server";
import { S3Service } from "../../../../lib/s3-service";
import crypto from "node:crypto";
import { sampleNegotiatedRateUrls } from "@/configs";
import { cookies } from "next/headers";
import type { AllowedAmountItem, ReportConfig } from "@/lib/types";

interface RecaptchaResponseData {
  success: boolean;
  score?: number;
  error?: string;
}

export async function POST(request: Request, response: Response) {
  const secretKey = process?.env?.RECAPTCHA_SECRET_KEY;

  const postData = await request.json();
  const { gRecaptchaToken, mrfUrl } = postData;

  let reactpchaResponseData: RecaptchaResponseData | null = null;
  const formData = `secret=${secretKey}&response=${gRecaptchaToken}`;
  try {
    const res = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    reactpchaResponseData = res.data;
  } catch (e) {
    console.log("recaptcha error:", e);
    return NextResponse.json({ success: false, error: "recaptcha error" });
  }

  if (
    reactpchaResponseData?.success &&
    reactpchaResponseData?.score &&
    reactpchaResponseData?.score > 0.5
  ) {
    try {
      if (!mrfUrl) return;

      const smallEnough = await fileSmallEnough(mrfUrl);
      if (!smallEnough)
        return NextResponse.json(
          { success: false, error: "File is too big" },
          { status: 401 }
        );
      const ipAddress = request.headers.get("x-forwarded-for");
      const userAgent = request.headers.get("user-agent");

      const reportNameData = `report-${new Date().toISOString()}-${ipAddress}`;
      const reportName = `demo_oon_${crypto
        .createHash("md5")
        .update(reportNameData)
        .digest("hex")
        .substring(0, 8)}`;
      const data: ReportConfig = {
        operations: [],
        in_network_file_urls: [mrfUrl],
        isAllowedAmount: true,
        filter: {},
        report_name: reportName,
        bucket: process.env.AWS_S3_BUCKET?.toString(),
        meta_data: {
          ip_address: ipAddress,
          user_agent: userAgent,
        },
      };
      const url = `http://3.130.73.91:8081/oon?url=${encodeURIComponent(
        mrfUrl
      )}`;
      const response = (await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-token": "819315a2-e783-4886-8f06-8913c760a8e6",
        },
      }).then((d) => d.json())) as { records: AllowedAmountItem[] };

      const uploader = new S3Service();
      await uploader.uploadFile(reportName, JSON.stringify(data));

      // add data to the cookie
      cookies().set(`report-${reportName}`, JSON.stringify(data), {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });

      return NextResponse.json(
        { success: true, reportName: reportName },
        { status: 202 }
      );
    } catch (error) {
      console.error("Error during report placement:", error);
      // Handle any errors that occur during the API request.
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  } else {
    console.error("Error during ReCaptcha verification:");
    return NextResponse.json({
      success: false,
      score: reactpchaResponseData?.score,
    });
  }
}

const fileSmallEnough = async (mrfUrl: string) => {
  const urlIsSample = sampleNegotiatedRateUrls.find(
    (sample) => sample.url === mrfUrl
  );
  if (urlIsSample) return true;

  const maxFileSize = 10 * 1024 * 1024;
  try {
    const response = await axios.head(mrfUrl, {
      maxContentLength: maxFileSize,
      maxBodyLength: maxFileSize,
    });
    const contentLength = response.headers["content-length"];
    const contentRange = response.headers["content-range"];
    if (contentLength && contentLength <= maxFileSize) return true;
    if (contentRange && contentRange <= maxFileSize) return true;
    try {
      const response = await axios.get(mrfUrl, {
        maxContentLength: maxFileSize,
        maxBodyLength: maxFileSize,
      });
      return true;
    } catch (e) {
      console.error({ e, msg: "Error getting mrf file" });
      return false;
    }
  } catch (e) {
    console.error({ e, msg: "Error calculating mrf file" });
    return false;
  }
};

// date, ip, hash
