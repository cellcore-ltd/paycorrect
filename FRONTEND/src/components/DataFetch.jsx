import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function isEmpty(result) {
	return (
		result == null ||
		(Array.isArray(result) && result.length === 0) ||
		(typeof result === "object" && !Array.isArray(result) && Object.keys(result).length === 0)
	);
}

export default function DataFetch({
	isFetching = false,
	result = null,
	error = null,
	message = null,
	onClose = null,
	onRetry = null,
}) {
	const [status, setStatus] = useState("idle"); // idle | loading | empty | success | error
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (isFetching) {
			setStatus("loading");
			setVisible(true);
			return;
		}

		// not fetching anymore -> derive final state
		if (error) {
			setStatus("error");
			setVisible(true);
			return;
		}

		if (isEmpty(result)) {
			setStatus("empty");
			setVisible(true);
			return;
		}

		if (result !== null) {
			setStatus("success");
			setVisible(true);
			return;
		}

		// nothing to show
		setStatus("idle");
		setVisible(false);
	}, [isFetching, result, error]);

	useEffect(() => {
		let t;
		if (status === "success") {
			t = setTimeout(() => {
				setVisible(false);
				setStatus("idle");
				onClose && onClose();
			}, 900);
		}
		return () => clearTimeout(t);
	}, [status, onClose]);

	if (!visible) return null;

	const statusTitle =
		status === "loading"
			? "Fetching data..."
			: status === "success"
			? "Data fetched"
			: status === "empty"
			? "No data found"
			: "Error fetching data";

	const statusMessage =
		message ||
		(status === "loading"
			? "Please wait while we load the requested data."
			: status === "success"
			? "Data loaded successfully."
			: status === "empty"
			? "The request completed but returned no results."
			: error?.message || String(error) || "An error occurred.");

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center">
			<div className="absolute inset-0 bg-black opacity-40" onClick={() => { setVisible(false); onClose && onClose(); }} />
			<motion.div
				initial={{ scale: 0.98, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6"
			>
				<div className="flex items-start gap-4">
					<div className="shrink-0">
						{status === "loading" && (
							<div className="w-10 h-10 rounded-full border-4 border-blue-300 border-t-blue-600 animate-spin" />
						)}
						{status === "success" && <div className="text-green-600 font-bold text-2xl">✓</div>}
						{status === "empty" && <div className="text-yellow-600">⚠️</div>}
						{status === "error" && <div className="text-red-600 font-bold">✕</div>}
					</div>
					<div className="flex-1">
						<h3 className="font-semibold text-lg">{statusTitle}</h3>
						<p className="text-sm text-gray-600 mt-1">{statusMessage}</p>
					</div>
				</div>

				<div className="mt-4 flex justify-end gap-2">
					{status === "loading" ? null : (
						<>
							{status === "error" && (
								<button onClick={() => { onRetry && onRetry(); }} className="px-4 py-2 bg-blue-500 text-white rounded">Retry</button>
							)}
							<button onClick={() => { setVisible(false); onClose && onClose(); }} className="px-4 py-2 bg-gray-100 text-gray-800 rounded">Close</button>
						</>
					)}
				</div>
			</motion.div>
		</div>
	);
}

