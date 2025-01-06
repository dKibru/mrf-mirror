import axios from "axios";
import { NextResponse } from "next/server";
import { S3Service } from "../../../../lib/s3-service";
import crypto from "node:crypto";
import { sampleNegotiatedRateUrls } from "@/configs";
import { cookies } from "next/headers";
import type { MrfSearchRequest } from "@/lib/types";

interface RecaptchaResponseData {
  success: boolean;
  score?: number;
  error?: string;
}

export async function POST(request: Request, response: Response) {
  const secretKey = process?.env?.RECAPTCHA_SECRET_KEY;

  const postData = await request.json();
  const { gRecaptchaToken, ein, npi, insurance_company } = postData;

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
      const npiValues = npi ? `${npi}`.trim().split(",") : [];
      const einValues = ein ? `${ein}`.trim().split(",") : [];
      const ipAddress = request.headers.get("x-forwarded-for");
      const userAgent = request.headers.get("user-agent");

      const reportNameData = `report-${new Date().toISOString()}-${ipAddress}`;
      const reportName = `demo_search_${crypto
        .createHash("md5")
        .update(reportNameData)
        .digest("hex")
        .substring(0, 8)}`;

      // send a fetch request
      let url = "http://3.130.73.91:8081/search?level=1";
      for (let i = 0; i < einValues.length; i++) {
        const ein = einValues[i];
        url += `&npi=${ein.replace("-", "")}`;
      }
      for (let i = 0; i < npiValues.length; i++) {
        const npi = npiValues[i];
        url += `&npi=${npi}`;
      }
      const response = (await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-token": "819315a2-e783-4886-8f06-8913c760a8e6",
        },
      }).then((d) => d.json())) as { count: number; npis: string[] };

      const data: MrfSearchRequest = {
        filter: {
          insurance_company,
          ...(einValues.length && {
            eins: einValues,
          }),
          ...(npiValues.length && {
            npis: npiValues,
          }),
        },
        data: {
          count: response.count,
          percentage: 0.1,
        },
        report_name: reportName,
        meta_data: {
          ip_address: ipAddress,
          user_agent: userAgent,
        },
      };
      const uploader = new S3Service();
      await uploader.uploadFile(reportName, JSON.stringify(data));

      cookies().set(`mrf-search-${reportName}`, JSON.stringify(data), {
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
