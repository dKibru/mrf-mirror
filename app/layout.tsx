import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
const inter = Inter({ subsets: ["latin"] });

import type { Viewport } from "next";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export const metadata = {
	title: "Price Transparency Viewer",
	description:
		"Uncover the complexities. Delve into the intricacies that define our industry. From the labyrinth of data to the rules of transparency, we pave the path for clarity.",
	charset: "utf-8",
	keywords:
		"Price Transparency MRF view viewer downloader Healthcare health care data",
	author: "Sparko Systems",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet={metadata.charset} />
				<meta name="description" content={metadata.description} />
				<meta name="keywords" content={metadata.keywords} />
				<meta name="author" content={metadata.author} />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="https://app.sparko.io/images/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/svg+xml"
					media="(prefers-color-scheme: light)"
					href="https://app.sparko.io/images/favicon.svg"
				/>
				<link
					rel="icon"
					type="image/png"
					media="(prefers-color-scheme: light)"
					href="https://app.sparko.io/images/favicon.png"
				/>
				<link
					rel="icon"
					type="image/svg+xml"
					media="(prefers-color-scheme: dark)"
					href="https://app.sparko.io/images/favicon-white.svg"
				/>
				<link
					rel="icon"
					type="image/png"
					media="(prefers-color-scheme: dark)"
					href="https://app.sparko.io/images/favicon-white.png"
				/>
				<meta
					prefix="og: http://ogp.me/ns#"
					property="og:title"
					content="Sparko MRF Viewing Demo"
				/>
				<meta
					prefix="og: http://ogp.me/ns#"
					property="og:type"
					content="website"
				/>
				<meta
					prefix="og: http://ogp.me/ns#"
					property="og:image"
					content="https://app.mrfview.com/demo_8d221a18.png"
				/>

				<meta
					prefix="og: http://ogp.me/ns#"
					property="og:image:width"
					content="1570"
				/>
				<meta
					prefix="og: http://ogp.me/ns#"
					property="og:image:height"
					content="985"
				/>
				<meta
					prefix="og: http://ogp.me/ns#"
					property="og:url"
					content="https://app.mrfview.com/report/demo_8d221a18"
				/>
				<title>{metadata.title}</title>
			</head>
			<body className={inter.className}>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
