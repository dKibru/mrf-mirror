"use client";
import { Check, Copy } from "lucide-react";
import * as React from "react";

export function Copier({
	text,
	className,
}: { className?: string; text: string }) {
	const [copied, setCopied] = React.useState(false);
	const copy = () => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 1000);
	};
	return (
		<button
			type="button"
			className={`${className} flex items-center gap-1 text-sm`}
			onClick={copy}
		>
			{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
			<span className="sr-only">Copy</span>
		</button>
	);
}
