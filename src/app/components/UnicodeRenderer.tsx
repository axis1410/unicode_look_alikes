"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { UNICODES } from "../constants";

export const UnicodeRenderer = () => {
	// return (
	// 	<div className="p-4">
	// 		{Object.entries(UNICODES).map(([original, lookAlikes]) => (
	// 			<div key={original} className="mb-4">
	// 				<h3 className="text-lg font-semibold">Original: {original}</h3>
	// 				<div className="flex gap-4">
	// 					{lookAlikes.map((char, index) => (
	// 						<div key={index} className="border p-2 rounded">
	// 							<span className="text-xl">{char}</span>
	// 							<div className="text-sm text-gray-600">
	// 								U+{char.charCodeAt(0).toString(16).toUpperCase()}
	// 							</div>
	// 						</div>
	// 					))}
	// 				</div>
	// 			</div>
	// 		))}
	// 	</div>
	// );
	const [text, setText] = useState<string>("");
	const [wordVariations, setWordVariations] = useState<
		{ original: string; variations: string[] }[]
	>([]);

	const generateVariations = (word: string): string[] => {
		const variations = new Set<string>();
		variations.add(word); // Add original word

		// Generate all possible combinations
		for (let i = 0; i < word.length; i++) {
			const char = word[i].toLowerCase();
			if (UNICODES[char as keyof typeof UNICODES]) {
				const lookAlikes = UNICODES[char as keyof typeof UNICODES];
				// For each existing variation, create new variations with the current character replaced
				const currentVariations = Array.from(variations);
				currentVariations.forEach((variant) => {
					lookAlikes.forEach((lookAlike) => {
						variations.add(variant.substring(0, i) + lookAlike + variant.substring(i + 1));
					});
				});
			}
		}

		return Array.from(variations).filter((v) => v !== word);
	};

	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value);
	};

	const handleUnicodeConversion = () => {
		const filteredWords = text
			.split(/[,\n]/)
			.map((word) => word.trim())
			.filter((word) => word.length > 0 && word.length <= 15);

		const variations = filteredWords.map((word) => ({
			original: word,
			variations: generateVariations(word),
		}));

		setWordVariations(variations);
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Textarea
					value={text}
					onChange={handleTextChange}
					className="w-[540px] h-[270px]"
					placeholder="Enter words separated by commas or new lines (max 15 characters per word)"
				/>
				<p className="text-sm text-gray-500">Maximum 15 characters per word</p>
			</div>

			<Button onClick={handleUnicodeConversion} disabled={text.length === 0}>
				Generate Unicode Variations
			</Button>

			{wordVariations.length > 0 && (
				<div className="mt-4 space-y-4">
					{wordVariations.map(({ original, variations }, index) => (
						<div key={index} className="border p-4 rounded">
							<h3 className="text-lg font-semibold">Original: {original}</h3>
							{variations.length > 0 ? (
								<div className="mt-2">
									<h4 className="text-md font-medium">Variations:</h4>
									<div className="flex flex-wrap gap-2 mt-1">
										{variations.map((variant, idx) => (
											<div key={idx} className="border px-2 py-1 rounded bg-gray-50">
												{variant}
											</div>
										))}
									</div>
								</div>
							) : (
								<p className="text-gray-500 mt-2">No variations available</p>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
