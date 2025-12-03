export const positiveIntegerValidationRules = () => {
	return {
		min: { value: 0, message: 'The value should be greater than 0' },
		validate: (value: any) => {
			if (!Number.isInteger(parseFloat(value))) {
				return 'The value must be an integer';
			}
			return true;
		},
	};
};
