"use client";
// stolen from https://github.com/vercel/next.js/discussions/58520#discussioncomment-9605299
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

/**
 * Wrapper around `router.refresh()` from `next/navigation` `useRouter()` to return Promise, and resolve after refresh completed
 * @returns Refresh function
 */
export function useRouterRefresh() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const [resolve, setResolve] = useState<((value: unknown) => void) | null>(
		null,
	);
	const [isTriggered, setIsTriggered] = useState(false);

	const refresh = () => {
		return new Promise((resolve, reject) => {
			setResolve(() => resolve);
			startTransition(() => {
				router.refresh();
			});
		});
	};

	useEffect(() => {
		if (isTriggered && !isPending) {
			if (resolve) {
				resolve(null);

				setIsTriggered(false);
				setResolve(null);
			}
		}
		if (isPending) {
			setIsTriggered(true);
		}
	}, [isTriggered, isPending, resolve]);

	return refresh;
}

interface UseClickAndHoldProps {
	initialValue?: number;
	increment?: number;
	interval?: number;
}

interface BindProps {
	onMouseDown: () => void;
	onMouseUp: () => void;
	onMouseLeave: () => void;
}

export const useClickAndHold = ({
	initialValue = 100,
	increment = 1,
	interval = 10,
}: UseClickAndHoldProps): [
	number,
	BindProps,
	React.Dispatch<React.SetStateAction<number>>,
] => {
	const [value, setValue] = useState<number>(initialValue);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		return () => stopCounter(); // Cleanup on unmount
	}, []);

	const startCounter = () => {
		if (intervalRef.current) return;
		intervalRef.current = setInterval(() => {
			setValue((prevValue) => prevValue + increment);
		}, interval);
	};

	const stopCounter = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	const bind: BindProps = {
		onMouseDown: startCounter,
		onMouseUp: stopCounter,
		onMouseLeave: stopCounter,
	};

	return [value, bind, setValue];
};

interface UseFromToProps {
	initialFrom: number;
	initialTo: number;
	lowerLimit: number;
	upperLimit: number;
}

interface UseFromToReturn {
	from: number;
	to: number;
	bindTo: BindProps;
	bindFrom: BindProps;
}

export const useFromTo = ({
	initialFrom,
	initialTo,
	lowerLimit,
	upperLimit,
}: UseFromToProps): UseFromToReturn => {
	const viewGap = initialTo - initialFrom;
	const [from, bindFrom, setFrom] = useClickAndHold({
		initialValue: initialFrom,
		increment: -10,
	});
	const [to, bindTo, setTo] = useClickAndHold({
		initialValue: initialTo,
		increment: 10,
	});

	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		let toTempValue = to;
		if (to >= upperLimit) {
			toTempValue = upperLimit;
		}
		if (to <= viewGap) {
			toTempValue = viewGap;
		}
		if (toTempValue - from > viewGap) {
			setFrom(() => toTempValue - viewGap);
		}
		setTo(() => toTempValue);
	}, [to, setTo]);

	useEffect(() => {
		let fromTempValue = from;
		if (from <= lowerLimit) {
			fromTempValue = lowerLimit;
		}
		if (to - fromTempValue > viewGap) {
			setTo(() => fromTempValue + viewGap);
		}
		setFrom(() => fromTempValue);
	}, [from, setFrom]);

	return {
		from,
		to,
		bindTo,
		bindFrom,
	};
};
