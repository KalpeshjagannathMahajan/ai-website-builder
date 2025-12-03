import { useEffect, useState } from 'react';
import { Grid } from 'src/common/@the-source/atoms';
import { colors } from 'src/utils/theme';
import PaymentDrawerSkeleton from './PaymentDrawerSkeleton';
import { useTheme } from '@mui/material/styles';

interface Props {
	height: string;
	set_disable_save: (state: boolean) => void;
	set_finix_form: any;
	is_from_app?: boolean;
}

export const FinixForm = ({ height, set_disable_save, set_finix_form, is_from_app = false }: Props) => {
	const [is_form_loading, set_is_form_loading] = useState<boolean>(true);
	const is_store_front = import.meta.env.VITE_APP_REPO === 'store_front';
	const options = {
		showAddress: true,
		showLabels: true,
		labels: {
			// Supported Fields: 'name', 'number', 'expiration_date', 'security_code', 'account_number', 'bank_code', 'account_type', 'address_line1', 'address_line2', 'address_city', 'address_state','address_region', 'address_country', 'address_postal_code'
			name: 'Full Name',
		},
		showPlaceholders: true,
		placeholders: {
			// Supported Fields: 'name', 'number', 'expiration_date', 'security_code', 'account_number', 'bank_code', 'account_type', 'address_line1', 'address_line2', 'address_city', 'address_state','address_region', 'address_country', 'address_postal_code'
			name: 'Full Name',
			number: 'XXXX XXXX XXXX XXXX',
		},
		hideFields: [
			// Supported Fields: 'name', 'security_code', 'address_line1', 'address_line2', 'address_city', 'address_state','address_region', 'address_country', 'address_postal_code', 'address_country'
			// 'name',
			'address_line1',
			'address_line2',
			'address_city',
			'address_state',
			// 'address_region',
			'address_country',
			'address_postal_code',
		],
		requiredFields: [
			// Supported Fields: 'name', 'address_line1', 'address_line2', 'address_city', 'address_state','address_region', 'address_country', 'address_postal_code'
			'name',
			// 'address_line1',
			// 'address_city',
			// 'address_region',
			// 'address_state',
			// 'address_country',
			// 'address_postal_code',
		],
		hideErrorMessages: false,
		errorMessages: {
			// Supported Fields: 'name', 'number', 'expiration_date', 'security_code', 'account_number', 'bank_code', 'account_type', 'address_line1', 'address_line2', 'address_city', 'address_state','address_region', 'address_country', 'address_postal_code'
			name: 'Please enter a valid name',
			address_city: 'Please enter a valid city',
		},
		styles: {
			// default styling for all fields
			default: {
				color: '#000',
				border: `1px solid ${colors.light_grey}`,
				borderRadius: '8px',
				padding: '8px 16px',
				// fontFamily: 'Helvetica',
				fontSize: '12px',
				boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 2px 4px rgba(0, 0, 0, 0.03)',
			},
			// specific styling if the field is valid
			success: {
				// color: '#5cb85c',
			},
			// specific styling if the field has errors
			error: {
				color: colors.red,
				border: `1px solid ${colors.red}`,
			},
		},
		onUpdate: (state: any, binInformation: any, formHasErrors: any) => {
			set_disable_save(formHasErrors);
		},

		onLoad: () => {
			set_is_form_loading(false);
		},

		// optional callback function that will trigger after the form has loaded
		// onLoad: function () {
		// custom code to run when the form has loaded
		// },
		// optional callback function that will be called when the form is submitted
		// NOTE: adding this option will automatically create a submit button for you.
		// If you do not want to use the default button and create your own,
		// do not supply this function and instead create your own submit button
		// and attach the onSubmit function to it manually.
		/* onSubmit, */

		// optional param to set the label for the submit button that is auto generated
		/* submitLabel: 'Create Token', */
	};
	const theme: any = useTheme();

	useEffect(() => {
		const initialise_finix_form = () => {
			if ((window as any).Finix && (window as any).Finix.CardTokenForm) {
				const form = (window as any).Finix.CardTokenForm('finix_form', options);
				set_finix_form(form);
			} else {
				console.error('Finix form is not defined yet');
			}
		};

		initialise_finix_form();
	}, []);

	return (
		<Grid
			mt={1}
			sx={{
				height: '31vh',
				maxHeight: height,
				fontSize: '16px',
				overflowY: 'auto',
				paddingBottom: is_store_front ? '1rem' : '',
				'&::-webkit-scrollbar': {
					width: '0',
					paddingBottom: is_from_app ? '6rem' : '',
				},
				...theme?.order_management?.finix_form,
			}}>
			{is_form_loading && <PaymentDrawerSkeleton width={480} height='100%' />}
			<div id='finix_form' />
		</Grid>
	);
};
