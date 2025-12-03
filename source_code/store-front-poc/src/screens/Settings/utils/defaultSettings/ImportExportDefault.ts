export const IMPORT_EXPORT_CONFIG = {
	products: {
		disabled: false,
		export: {
			products: true,
		},
		import: {
			products: true,
		},
	},
	categories: {
		disabled: false,
		export: {
			categories: true,
		},
		import: {
			categories: true,
		},
	},
	collections: {
		disabled: false,
		export: {
			collections: true,
		},
		import: {
			collections: true,
		},
	},
	inventory: {
		disabled: false,
		export: {
			inventory: true,
		},
		import: {
			inventory: true,
		},
	},
	buyers: {
		disabled: false,
		export: {
			buyers: true,
			basic_information: true,
			contacts: true,
			addresses: true,
		},
		import: {
			buyers: true,
			basic_information: true,
			contacts: true,
			addresses: true,
		},
	},
	documents: {
		disabled: false,
		export: {
			documents: true,
			order_quote: true,
			order_quote_items: true,
		},
		import: {
			documents: true,
			order_quote: true,
			order_quote_items: true,
		},
	},
	modifiers: {
		disabled: false,
		export: {
			modifiers: true,
			product_modifiers: true,
		},
		import: {
			modifiers: true,
			product_modifiers: true,
		},
	},
	pricing: {
		disabled: false,
		export: {
			pricing: true,
		},
		import: {
			pricing: true,
		},
	},
	related_products: {
		disabled: false,
		export: {
			related_products: false,
		},
		import: {
			related_products: false,
		},
	},
};
