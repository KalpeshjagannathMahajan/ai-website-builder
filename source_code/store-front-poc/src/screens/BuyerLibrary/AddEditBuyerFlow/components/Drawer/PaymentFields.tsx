import React from 'react';
import { TextField } from '@mui/material';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid, Icon, Image, Input } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import LocationSearch from 'src/common/LocationSearch';
import { payment_attributes, payment_gateways, stepper_fields_gateways } from '../../constants';
import { payment_attributes_validation } from './AddPaymentHelpers';
import { secondary } from 'src/utils/light.theme';
import { colors } from 'src/utils/theme';
import { useTheme } from '@mui/material/styles';

const { FINIX, WORLDPAY, STAX, CYBERSOURCE, PCI_VAULT } = payment_gateways;

const text_style = {
	wordWrap: 'break-word',
	color: secondary[700],
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	maxWidth: '200px',
};

const cyber_form_style = {
	border: `1px solid ${colors.light_grey}`,
	width: '100%',
	height: '5.6rem',
	borderRadius: '0.8rem',
	padding: '0.8rem',
};

const error_text_style = {
	marginLeft: '0.8rem',
	marginTop: '0.4rem',
};

interface PaymentFieldProps {
	fields: any;
	is_edit_flow: boolean;
	stax_validations: any;
	is_from_app: boolean;
	width: number;
	all_address: any;
	get_states: any;
	control: any;
	set_copy_modal: any;
	copy_modal: boolean;
	handle_selected_place: any;
	getValues: any;
	country: string;
	watch: any;
	state_options: any;
	methods: any;
	setValue: any;
	payment_source: string;
	active_step?: number;
	added_card_details?: any;
	cyber_source_validations: any;
}

const PaymentFields: React.FC<PaymentFieldProps> = ({
	fields,
	is_edit_flow,
	stax_validations,
	is_from_app,
	width,
	all_address,
	get_states,
	control,
	set_copy_modal,
	copy_modal,
	handle_selected_place,
	getValues,
	country,
	watch,
	state_options,
	methods,
	setValue,
	payment_source,
	active_step,
	added_card_details = {},
	cyber_source_validations,
}) => {
	const { t } = useTranslation();
	const theme: any = useTheme();

	const should_render_copy_address_at_top = () => {
		const valid_gateways = [...stepper_fields_gateways, payment_gateways.FINIX, payment_gateways.ACH, payment_gateways.PCI_VAULT];
		return valid_gateways.includes(payment_source);
	};

	const prevent_validation_on_card_fields = (attribute: any) => {
		if (!is_edit_flow) return true;
		return attribute?.id === payment_attributes.card_number || attribute?.id === payment_attributes?.cvv;
	};

	const stax_card_number = (
		<Grid display={'flex'} direction={'column'} width={'100%'} gap={0}>
			{!is_edit_flow ? (
				<Grid id='staxjs-number' maxHeight={56}></Grid>
			) : (
				<TextField label={'Card Number'} name={'Card Number'} value={'**** **** **** ****'} disabled={true} style={{ marginTop: '5px' }} />
			)}
			{!is_edit_flow && !stax_validations?.number && (
				<CustomText type='Body' color='#D74C10' style={{ marginLeft: '13px', marginTop: '05px' }}>
					{t('Common.AddPaymentModal.InvalidCardNumber')}
				</CustomText>
			)}
		</Grid>
	);

	const render_stax_cvv = (
		<Grid display={'flex'} direction={'column'} width={is_from_app && width <= 400 ? '46%' : '48%'} marginRight={'auto'} gap={0}>
			{!is_edit_flow ? (
				<Grid id='staxjs-cvv' maxHeight={56}></Grid>
			) : (
				<TextField label={'CVV'} name={'cvv'} value={'***'} disabled={true} />
			)}
			{!is_edit_flow && !stax_validations?.cvv && (
				<CustomText type='Body' color='#D74C10' style={{ marginLeft: '13px', marginTop: '05px' }}>
					{t('Common.AddPaymentModal.InvalidCardCvv')}
				</CustomText>
			)}
		</Grid>
	);

	const render_address_from = (
		<Grid display='flex' gap={1.2} mb={1.6}>
			{!should_render_copy_address_at_top() && <CustomText type='H3'>{t('Payment.Address')}</CustomText>}
			{all_address?.length > 0 && (
				<>
					{should_render_copy_address_at_top() && <CustomText type='H3'>{t('Payment.Address')}</CustomText>}
					<Grid display='flex' alignItems='center' sx={{ cursor: 'pointer' }} onClick={() => set_copy_modal(true)}>
						<Icon iconName='IconCopy' color={theme?.payments.copy_form_text?.color} />
						<CustomText type='Subtitle' color={theme?.payments.copy_form_text?.color}>
							{t('Payment.CopyFrom')}
						</CustomText>
					</Grid>
				</>
			)}
		</Grid>
	);

	const should_show_copy_address = (id: string) => {
		return id === 'country' && (!should_render_copy_address_at_top() || (is_edit_flow && payment_source === FINIX));
	};

	const render_default = (attribute: any, i: number) => (
		<Grid
			mb={attribute?.id === 'address_1' ? -2.4 : 0}
			key={`${attribute?.name}-${i}`}
			width={attribute?.id === 'expiry' || attribute?.id === 'cvv' ? '48%' : '100%'}>
			{should_show_copy_address(attribute?.id) && render_address_from}
			{attribute?.id === 'address_1' ? (
				<LocationSearch
					placeholder={attribute?.name}
					label={attribute?.name}
					name={attribute?.id}
					validations={{
						...((stepper_fields_gateways?.includes(payment_source) && payment_attributes_validation?.[attribute?.id]) || {}),
						required: Boolean(attribute?.required),
					}}
					show_copy_drawer={copy_modal}
					edit_buyer_id={false}
					handle_selected_place={handle_selected_place}
					getValues={getValues}
					country={country}
					from='payment'
					field_data={fields}
				/>
			) : (
				<FormBuilder
					placeholder={attribute?.name}
					label={attribute?.label}
					name={attribute?.id}
					validations={{
						...((stepper_fields_gateways?.includes(payment_source) && payment_attributes_validation?.[attribute?.id]) || {}),
						required: !attribute?.disabled && Boolean(attribute?.required),
						expiry: attribute?.id === 'expiry',
						number: !prevent_validation_on_card_fields(attribute) && attribute?.type === 'number',
						email: attribute?.type === 'email',
					}}
					defaultValue={watch(attribute?.id) || attribute?.value}
					type={attribute?.type}
					options={attribute?.id === 'state' ? state_options : attribute?.options}
					control={control}
					register={methods.register}
					getValues={getValues}
					setValue={setValue}
					disabled={is_edit_flow && attribute?.disabled}
					is_payment={true}
					onChangeCapture={(e: any) => {
						if (attribute?.id === 'country') get_states(e, true);
					}}
				/>
			)}
		</Grid>
	);

	const cyber_source_card_field = (
		<Grid display={'flex'} direction={'column'} width={'100%'} gap={0} mt={2}>
			{is_edit_flow ? (
				<TextField label={'Card Number'} name={'Card Number'} value={'**** **** **** ****'} disabled={true} style={{ marginTop: '5px' }} />
			) : (
				<div id='number-container' className='form-control' style={{ ...cyber_form_style }}></div>
			)}
			{!is_edit_flow && _.has(cyber_source_validations, 'card_number') && !cyber_source_validations?.card_number && (
				<CustomText type='Body' color={colors.red} style={error_text_style}>
					{t('Common.AddPaymentModal.InvalidCardNumber')}
				</CustomText>
			)}
		</Grid>
	);

	const cyber_source_cvv_field = (
		<Grid display={'flex'} direction={'column'} width={is_from_app && width <= 400 ? '46%' : '48%'} marginRight={'auto'} gap={0}>
			{is_edit_flow ? (
				<TextField label={'CVV'} name={'cvv'} value={'***'} disabled={true} />
			) : (
				<div id='securityCode-container' className='form-control' style={{ ...cyber_form_style }}></div>
			)}
			{!is_edit_flow && _.has(cyber_source_validations, 'cvv') && !cyber_source_validations?.cvv && (
				<CustomText type='Body' color={colors.red} style={error_text_style}>
					{t('Common.AddPaymentModal.InvalidCardCvv')}
				</CustomText>
			)}
		</Grid>
	);

	const render_fields_by_type = (attribute: any, i: number) => {
		switch (attribute?.id) {
			case 'card_number':
				return stax_card_number;
			case 'cvv':
				return render_stax_cvv;
			default:
				return render_default(attribute, i);
		}
	};

	const render_cyber_source_fields = (attribute: any, i: number) => {
		switch (attribute?.id) {
			case 'card_number':
				return cyber_source_card_field;
			case 'cvv':
				return cyber_source_cvv_field;
			default:
				return render_default(attribute, i);
		}
	};

	const render_field_by_gateway = (attribute: any, i: number) => {
		switch (payment_source) {
			case WORLDPAY:
				if (active_step === 1) return null;
				return render_default(attribute, i);
			case STAX:
				return render_fields_by_type(attribute, i);
			case FINIX:
				return render_fields_by_type(attribute, i);
			case CYBERSOURCE:
				return render_cyber_source_fields(attribute, i);
			default:
				return render_default(attribute, i);
		}
	};

	const render_card_holder_name = (card_holder_name: string | null) => (
		<Grid container mt={1}>
			<Input disabled variant='outlined' sx={{ width: '100%' }} label='Name on card' children={undefined} value={card_holder_name || ''} />
		</Grid>
	);

	const render_card_details = (details: any) => (
		<Grid display='flex' container flexDirection='column' p={2} bgcolor={colors.grey_600} borderRadius={1.2}>
			<CustomText type='Body2' style={text_style}>
				{details?.card_holder_name || ''}
			</CustomText>
			<Grid display='flex' gap={2} alignItems='center'>
				<CustomText type='Body' style={text_style}>
					XXXX XXXX XXXX {details?.card_number_label || ''}
				</CustomText>
				<Image src={details?.logo} width={40} height={24} />
			</Grid>
			<CustomText type='Body' style={text_style}>
				{details?.expiry || '--'}
			</CustomText>
		</Grid>
	);

	const render_special_fields = () => {
		const card_holder_name = `${getValues('first_name')} ${getValues('last_name')}`;
		switch (payment_source) {
			case WORLDPAY:
				if (active_step === 0) return render_address_from;
				else if (active_step === 1) return null;
				return render_card_holder_name(card_holder_name);
			case FINIX:
			case PCI_VAULT:
				if (active_step === 1)
					return (
						<>
							{render_card_details(added_card_details)}
							{render_address_from}
						</>
					);
				return null;
			case CYBERSOURCE:
				if (active_step === 0 && !is_edit_flow) return render_address_from;
				return null;
			default:
				return null;
		}
	};

	return (
		<React.Fragment>
			{render_special_fields()}
			{_.map(fields, (attribute: any, i: number) => render_field_by_gateway(attribute, i))}
		</React.Fragment>
	);
};

export default PaymentFields;
