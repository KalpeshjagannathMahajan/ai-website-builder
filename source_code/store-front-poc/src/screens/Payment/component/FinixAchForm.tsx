/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { Grid } from 'src/common/@the-source/atoms';
import { colors } from 'src/utils/theme';
import AchFormSkeleton from './AchFormSkeleton';
import { useTheme } from '@mui/styles';

interface Props {
	height: string;
	set_disable_save: (state: boolean) => void;
	set_finix_form: any;
}

const FinixAchForm = ({ height, set_disable_save, set_finix_form }: Props) => {
	const [is_form_loading, set_is_form_loading] = useState<boolean>(true);
	const theme: any = useTheme();
	const options: any = {
		showAddress: true,
		showLabels: true,
		labels: {
			// Supported Fields: "name", "number", "expiration_date", "security_code", "account_number", "bank_code", "account_type", "address_line1", "address_line2", "address_city", "address_state","address_region", "address_country", "address_postal_code"
			name: 'Full Name',
			account_number: 'Bank account number',
		},
		showPlaceholders: true,
		placeholders: {
			// Supported Fields: "name", "number", "expiration_date", "security_code", "account_number", "bank_code", "account_type", "address_line1", "address_line2", "address_city", "address_state","address_region", "address_country", "address_postal_code"
			name: 'Name',
			account_number: 'Enter account number',
			bank_code: 'Enter bank number',
		},
		defaultValues: {
			// Supported Fields:  "name", "security_code", "bank_code", "account_type", "address_line1", "address_line2", "address_city", "address_state","address_region", "address_country", "address_postal_code"
			// name: "John Doe",
		},
		hideFields: [
			// Supported Fields: "name", "security_code", "address_line1", "address_line2", "address_city", "address_state","address_region", "address_country", "address_postal_code", "address_country"
			// "name",
			// "address_line1",
			// "address_line2",
			// "address_city",
			//"address_state",
			// "address_region",
			// "address_country",
		],
		requiredFields: [
			// Supported Fields: "name", "address_line1", "address_line2", "address_city", "address_state","address_region", "address_country", "address_postal_code"
			'name',
			'address_line1',
			'address_city',
			'address_country',
			'address_postal_code',
		],
		hideErrorMessages: false,
		errorMessages: {
			// Supported Fields: "name", "number", "expiration_date", "security_code", "account_number", "bank_code", "account_type", "address_line1", "address_line2", "address_city", "address_state","address_region", "address_country", "address_postal_code"
			name: 'Please enter a valid name',
			address_city: 'Please enter a valid city',
			account_type: 'Account Type is required',
			// bank_code:'bank code must be exactly 9 numeric characters'
		},
		styles: {
			default: {
				color: '#000',
				border: `1px solid ${colors.light_grey}`,
				padding: '8px 16px',
				fontSize: '12px',
				fontFamily: theme?.custom_font_styles?.fontFamily,
				boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 2px 4px rgba(0, 0, 0, 0.03)',
			},
			success: {
				// color: "#5cb85c",
			},
			error: {
				// color: "#d9534f",
				border: '1px solid rgba(255,0,0, 0.3)',
			},
		},
		onUpdate: (state: any, binInformation: any, formHasErrors: any) => {
			set_disable_save(formHasErrors);

			// const bankCode = state?.bank_code || '';
			// if (!/^\d{9}$/.test(bankCode)) {
			// 	console.log("Invalid bank code.");
			// 	set_disable_save(true);
			// } else {
			// 	set_disable_save(formHasErrors);
			// }
		},
		onLoad: () => {
			set_disable_save(false);
			set_is_form_loading(false);
		},
		// submitLabel: 'Create Token',
	};

	useEffect(() => {
		const initialise_finix_form = () => {
			if ((window as any).Finix) {
				const form = (window as any).Finix.BankTokenForm('form-element', options);
				set_finix_form(form);
			}
		};
		initialise_finix_form();
	}, []);

	return (
		<Grid height={height}>
			{is_form_loading && <AchFormSkeleton width='90%' height='100%' />}
			<div id='form-element' />
		</Grid>
	);
};

export default FinixAchForm;
