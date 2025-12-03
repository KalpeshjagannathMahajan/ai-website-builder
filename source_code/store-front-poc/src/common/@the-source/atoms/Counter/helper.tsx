export const handleSuggestedValue: any = (prodCount: number, min: number, max: number, step: number) => {
	const valid_max = max - ((max - min) % step);
	if (min > valid_max) return { suggestCount: -1 };
	if (prodCount < min) return { suggestCount: min };
	if (prodCount > valid_max) return { suggestCount: valid_max };
	const approx_valid_qty = prodCount - ((prodCount - min) % step);
	if (approx_valid_qty < min) return { suggestCount: min };
	if (approx_valid_qty > valid_max) return { suggestCount: valid_max };
	if (approx_valid_qty + step <= valid_max) return { suggestCount: approx_valid_qty + step };
	return { suggestCount: approx_valid_qty };
};
