import { parsePhoneNumber } from 'awesome-phonenumber';
import _ from 'lodash';
const onlyDigitsRegex = /^\d+$/;
const onlyCharactersRegex = /^[A-Za-z]+$/;

export interface ValidationProps {
	name?: string;
	label?: string;
	required?: boolean;
	email?: boolean;
	maxLength?: number;
	minLength?: number;
	number?: boolean;
	amount?: boolean;
	character?: boolean;
	phone?: string;
	val?: any;
	expiry?: string;
	pincode?: any;
}

const apply_validations = ({
	character,
	required,
	email,
	label,
	maxLength,
	minLength,
	number,
	name,
	phone,
	val,
	expiry,
	amount,
	pincode,
}: ValidationProps) => {
	let rules: any = {
		validate: {},
		pattern: {},
	};

	if (required) {
		rules = {
			...rules,
			required: `${label || name} is required`,
		};
	} else {
		rules = {
			...rules,
			required: false,
		};
	}

	if (expiry) {
		rules = {
			...rules,
			pattern: {
				value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
				message: 'Expiry date must be in MM/YY format',
			},
			validate: {
				...rules.validate,
				notExpired: (value) => {
					if (/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)) {
						const currentDate = new Date();
						const currentYear = currentDate.getFullYear();
						const currentMonth = currentDate.getMonth();
						const expiryYear = parseInt(value?.substring(3), 10) + 2000;
						const expiryMonth = parseInt(value?.substring(0, 2), 10) - 1;
						return expiryYear > currentYear || (expiryYear === currentYear && expiryMonth >= currentMonth) || 'Expiry date is in the past';
					}
					return true;
				},
			},
		};
	}

	if (character) {
		rules = {
			...rules,
			pattern: {
				...rules.pattern,
				value: onlyCharactersRegex,
				message: 'This field should have only characters are allowed',
			},
		};
	}

	if (number) {
		rules = {
			...rules,
			pattern: {
				...rules.pattern,
				value: onlyDigitsRegex,
				message: 'Only digits are allowed',
			},
		};
	}

	if (amount) {
		rules = {
			...rules,
			pattern: {
				...rules.pattern,
				value: /^\d+(\.\d{1,2})?$/,
				message: 'Amount must be a number with up to 2 decimal places',
			},
		};
	}

	if (email && val) {
		rules = {
			...rules,
			validate: {
				...rules.validate,
				matchPattern: (v: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v) || 'Email must be a valid address',
			},
		};
	}
	if (pincode && val) {
		rules = {
			...rules,
			validate: {
				...rules.validate,
				matchPattern: (v: string) => /^[A-Z0-9]{4,10}$/.test(v) || 'Invalid Zip Code',
			},
		};
	}
	if (maxLength) {
		rules = {
			...rules,
			validate: {
				...rules.validate,
				maxLength: (v: string) => _.size(v) <= maxLength || `Maximum ${maxLength} ${number ? 'digits' : 'characters'} allowed`,
			},
		};
	}

	if (minLength) {
		rules = {
			...rules,
			validate: {
				...rules.validate,
				minLength: (v: string) => !v || _.size(v) >= minLength || `Minimum ${minLength} ${number ? 'digits' : 'characters'} required `,
			},
		};
	}

	if (phone && val) {
		const num = `+${val}`;
		const phone_number = parsePhoneNumber(num);

		rules = {
			...rules,
			validate: () => {
				if (!phone_number?.valid) {
					return 'Invalid number';
				}
			},
		};
	}
	return rules;
};

export default apply_validations;
