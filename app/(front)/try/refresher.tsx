"use client";

import { useRouterRefresh } from "@/lib/hooks";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";

export default function Refresher() {
	const router = useRouterRefresh();
	const [isRefreshing, setIsRefreshing] = useState(false);

	const refresh = () => {
		setIsRefreshing(true);
		router().then(() => setIsRefreshing(false));
	};

	return (
		<RefreshCcw
			onClick={refresh}
			className={`${isRefreshing && "animate-spin"} h-4 w-4`}
		/>
	);
}
