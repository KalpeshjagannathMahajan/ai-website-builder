import { Avatar, Box, Chip, Grid, Icon, Tooltip } from 'src/common/@the-source/atoms';
import _ from 'lodash';
import React from 'react';
import utils from 'src/utils/utils';
import Card from 'src/common/@the-source/atoms/Card';
import CustomText from 'src/common/@the-source/CustomText';
import { t } from 'i18next';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import { isoToDateDay } from 'src/utils/common';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import { colors } from 'src/utils/theme';
import { close_toast, show_toast } from 'src/actions/message';
import { useDispatch } from 'react-redux';
import types from 'src/utils/types';
import { makeStyles } from '@mui/styles';
import useTenantSettings from 'src/hooks/useTenantSettings';
import constants from 'src/utils/constants';

const useMaterialStyles = makeStyles(() => ({
	link: {
		display: 'inline-block',
		color: 'rgba(0, 0, 0, 0.6)',
		textDecoration: 'none',
		'&:hover': {
			textDecoration: 'underline',
		},
	},
}));

const { TENANT_SETTINGS_KEYS } = constants;

const BasicDetails = ({
	data,
	primary_contact,
	primary_card,
	credits,
	tax_info,
	display_contact,
	contact_field,
	show_tax_info,
	buyer_details,
	reference_id,
	customer_id,
}: any) => {
	const classes = useStyles();
	const material_class = useMaterialStyles();
	const theme: any = useTheme();

	const { show_customer_system_uuid } = useTenantSettings({ [TENANT_SETTINGS_KEYS.SHOW_CUSTOMER_UUID]: false });
	const basic_keys = data?.attributes?.filter(
		(attr: any) => attr.id === 'company_name' || attr.id === 'display_name' || attr.id === 'customer_group',
	);
	const main_basic_details_attributes = { company_name: 1, display_name: 1, sales_reps: 1, catalog_group: 1, type_of_customer: '' };

	const other_basic_details_attributes = _.filter(
		_.get(
			buyer_details?.find((section: any) => section?.key === 'basic_details'),
			'attributes',
			[],
		),
		(attr) => !(attr?.id in main_basic_details_attributes),
	);
	let customer_type = data?.attributes?.filter((attr: any) => attr.id === 'type_of_customer')?.[0];
	let salesrep_and_catalog = data?.attributes?.filter((attr: any) => attr.id === 'sales_reps' || attr.id === 'catalog_group');
	let basic_details = _.map(salesrep_and_catalog, (item) => {
		let value_length = _.get(item, 'value', '')?.split(',')?.length;
		return {
			...item,
			max_length: value_length,
			styles: {
				flexDirection: value_length > 1 ? 'column' : 'row',
			},
		};
	});

	const buyer_name = _.get(data, 'attributes[0].value') || '';
	const initials = _.upperCase(
		buyer_name
			?.split(' ')
			?.map((word: string) => word.charAt(0))
			?.join(''),
	);
	const first_two_letters: any = _.take(initials, 2);
	const salutation = _.find(primary_contact?.attributes, { id: 'salutation' })?.value || '';
	const first_name = _.find(primary_contact?.attributes, { id: 'first_name' })?.value || '';
	const last_name = _.find(primary_contact?.attributes, { id: 'last_name' })?.value || '';
	const full_name = `${salutation} ${first_name} ${last_name}`;
	const number = _.find(primary_contact?.attributes, { id: 'phone' })?.value || '';
	const country_code = _.find(primary_contact?.attributes, { id: 'country_code' })?.value || '';
	const phone_number = utils.format_phone_number(number, country_code);
	const dispatch = useDispatch();

	const dynamic_line_element = (label: any, value: any, icon: any = null) => (
		<React.Fragment>
			<Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
				{/* Label part with auto overflow handling, aligned to the left */}
				<CustomText
					style={{ minWidth: '50px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
					type='Body'
					color='#00000099'>
					{label}
				</CustomText>

				{/* Value part with flexible box to contain icon and text, right aligned */}
				<Box display='flex' alignItems='center' justifyContent='flex-end' sx={{ flexGrow: 1, overflow: 'hidden' }}>
					{icon}
					<CustomText type='Body' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
						{value}
					</CustomText>
				</Box>
			</Box>
		</React.Fragment>
	);

	const handle_render_attr = (id: any, value: any, name: any, type: any) => {
		if (id === 'last_name' || id === 'country_code' || id === 'salutation') return null;
		if (id === 'first_name') {
			return dynamic_line_element('Name', full_name);
		}
		if (id === 'phone') {
			return dynamic_line_element('Phone', value ? phone_number : '--', <Icon iconName='IconPhone' sx={{ marginRight: '8px' }} />);
		}
		const handle_render_value = () => {
			switch (type) {
				case 'date':
					return isoToDateDay(value, 'DD/MM/YY');
				case 'select':
				case 'single_select':
					const single_select_field = _.find(contact_field, { id })?.options;
					const single_select_label = _.find(single_select_field, { value })?.label;
					return single_select_label;
				case 'multi_select':
					const multi_select_field = _.find(contact_field, { id })?.options;
					const multi_select_label = _.split(value, ',')
						.map((i) => _.find(multi_select_field, { value: i })?.label)
						.join(', ');
					return multi_select_label;
				default:
					return _.capitalize(value || '--');
			}
		};
		switch (type) {
			case 'phone':
				return dynamic_line_element(name, value ? phone_number : '--', value && <Icon iconName='IconPhone' sx={{ mr: 0.5 }} />);
			case 'phone_e164':
				return dynamic_line_element(
					name,
					value ? (utils.format_phone_number_e164(value) !== 'Invalid Number' ? utils.format_phone_number_e164(value) : '--') : '--',
					value && <Icon iconName='IconPhone' sx={{ mr: 0.5 }} />,
				);
			case 'email':
				return dynamic_line_element(
					name,
					<a href={`mailto:${value}`} className={material_class.link}>
						<CustomText type='Body'>{value ?? '--'}</CustomText>
					</a>,
					<Icon iconName='IconMail' sx={{ marginRight: '8px', marginLeft: '8px' }} />,
				);

			default:
				return dynamic_line_element(name, handle_render_value());
		}
	};

	const handle_empty_contact = () => {
		return (
			<Box display='flex' alignItems='center'>
				<Icon iconName='user' color={theme?.view_buyer?.basic_details?.secondary} />
				<CustomText style={{ opacity: 0.6, marginLeft: '10px' }}>No contact added</CustomText>
			</Box>
		);
	};

	const handle_empty_card = () => {
		return (
			<Box display='flex' alignItems='center'>
				<Icon iconName='IconCreditCard' color={theme?.view_buyer?.basic_details?.secondary} />
				<CustomText style={{ opacity: 0.6, marginLeft: '10px' }}>{t('OrderManagement.CartCheckoutCard.PaymentNotAssigned')}</CustomText>
			</Box>
		);
	};

	const copy_to_clipboard = async (link: string) => {
		await navigator.clipboard.writeText(link);
		dispatch<any>(
			show_toast({
				open: true,
				showCross: false,
				anchorOrigin: {
					vertical: types.VERTICAL_TOP,
					horizontal: types.HORIZONTAL_CENTER,
				},
				autoHideDuration: 5000,
				onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
					console.log(event);
					if (reason === types.REASON_CLICK) {
						return;
					}
					dispatch(close_toast(''));
				},
				state: types.SUCCESS_STATE,
				title: t('Common.Common.CopiedToClipboard'),
				subtitle: '',
				showActions: false,
			}),
		);
	};

	return (
		<React.Fragment>
			{/* Buyer name */}
			<Box mb={2.2} display='flex' alignItems='center'>
				<Avatar
					variant='rounded'
					backgroundColor={theme?.view_buyer?.avatar?.background}
					size='large'
					style={{
						padding: 3.5,
					}}
					isImageAvatar={false}
					content={
						<CustomText type='H1' color={theme?.view_buyer?.avatar?.color}>
							{first_two_letters}
						</CustomText>
					}
				/>
				<Box ml={2} display='flex' flexDirection='column' gap={0.4}>
					{basic_keys?.map((attr: any) => (
						<CustomText type='H2' style={{ fontWeight: 'normal' }}>
							{attr?.value}
						</CustomText>
					))}
				</Box>
			</Box>

			<hr></hr>

			<Box my={1} pb={1.5}>
				{customer_type?.value && (
					<Grid
						my={1}
						display={'flex'}
						direction={'row'}
						justifyContent={'space-between'}
						key={customer_type?.attribute_id}
						sx={{ flexWrap: 'wrap' }}>
						<CustomText color={theme?.view_buyer?.basic_details?.primary} type='Body2' style={{ marginTop: '5px' }}>
							{customer_type?.name}
						</CustomText>
						<CustomText type='Body2' style={{ marginTop: '5px', textTransform: 'capitalize' }}>
							{customer_type?.value}
						</CustomText>
					</Grid>
				)}
				{basic_details?.map(({ attribute_id, name, value, options, style = {}, max_length = 0 }: any) => {
					const filtered_data = _.filter(options, (option) => value.includes(option.value));
					const labels = _.map(filtered_data, 'label');
					const first_three_elements = labels.slice(0, 3);

					return (
						<Grid my={1} display={'flex'} style={style} key={attribute_id} sx={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
							<CustomText color={theme?.view_buyer?.basic_details?.primary} type='Body' style={{ marginTop: '5px' }}>
								{name}
							</CustomText>
							{labels.length > 1 ? (
								<Grid display='flex' flexWrap={'nowrap'} direction={'row'} gap={'.4rem'} width={'100%'}>
									{first_three_elements.map((item: any) => (
										<Chip
											textColor={theme?.view_buyer?.basic_details?.chip?.text}
											bgColor={theme?.view_buyer?.basic_details?.chip?.background}
											label={item}
											className={classes.value_chips}
										/>
									))}
									{labels.length > 3 && (
										<Tooltip placement='top' arrow title={labels.join(', ')}>
											<div style={{ marginLeft: 'auto' }}>
												<Chip
													textColor={theme?.view_buyer?.basic_details?.chip?.text}
													bgColor={theme?.view_buyer?.basic_details?.chip?.background}
													label={`+${labels.length - 3}`}
													className={classes.count_chip}
												/>
											</div>
										</Tooltip>
									)}
								</Grid>
							) : (
								// <Tooltip placement='top' arrow title={labels[0]}>
								<div style={{ marginLeft: max_length === 1 ? 'auto' : '' }}>
									<Chip
										textColor={theme?.view_buyer?.basic_details?.chip?.text}
										bgColor={theme?.view_buyer?.basic_details?.chip?.background}
										label={labels[0]}
										className={classes.chips_style}
									/>
								</div>
								// </Tooltip>
							)}
						</Grid>
					);
				})}
				{other_basic_details_attributes?.map((val) => (
					<Grid my={1} justifyContent={'space-between'}>
						{handle_render_attr(val?.id === 'phone' ? 'phone2' : val?.id, val?.value, val?.name, val?.type)}
					</Grid>
				))}

				{show_tax_info && tax_info && (
					<Grid
						my={1}
						display={'flex'}
						direction={'row'}
						justifyContent={'space-between'}
						key={tax_info?.attribute_id}
						sx={{ flexWrap: 'wrap' }}>
						<CustomText color={theme?.view_buyer?.basic_details?.primary} type='Body2' style={{ marginTop: '5px' }}>
							{`Is taxable ${tax_info?.is_taxable ? `(${tax_info?.tax_rate}%)` : ''}`}
						</CustomText>
						<CustomText type='Body2' style={{ marginTop: '5px', textTransform: 'capitalize' }}>
							{tax_info?.is_taxable ? 'Yes' : 'No'}
						</CustomText>
					</Grid>
				)}
			</Box>

			{/* Contact Details */}
			{display_contact && (
				<Box my={1}>
					{_.isEmpty(primary_contact?.attributes) && handle_empty_contact()}
					{!_.isEmpty(primary_contact?.attributes) && <hr></hr>}
					{primary_contact?.attributes?.map(({ attribute_id, name, value, id, type, is_display }: any) => {
						if (id === 'last_name' || id === 'country_code' || id === 'salutation') return null;
						if (is_display !== false)
							return (
								<>
									<Grid my={1.5} display={'flex'} justifyContent={'space-between'} key={attribute_id}>
										{handle_render_attr(id, value, name, type)}
									</Grid>
								</>
							);
						return null;
					})}
				</Box>
			)}

			<hr></hr>

			{/* Payment Details */}
			<Can I={PERMISSIONS.view_payment.slug} a={PERMISSIONS.view_payment.permissionType}>
				<Box my={2}>
					{_.isEmpty(primary_card) ? (
						handle_empty_card()
					) : (
						<Grid display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'}>
							<CustomText color={theme?.view_buyer?.basic_details?.primary} type='Body' style={{ marginTop: '5px' }}>
								{t('OrderManagement.CartCheckoutCard.PaymentMethod')}
							</CustomText>
							<Card data={primary_card} />
						</Grid>
					)}
				</Box>
			</Can>
			{/* Payment Card Details */}
			<Box mt={2}>
				<Can I={PERMISSIONS.wallet_view.slug} a={PERMISSIONS.wallet_view.permissionType}>
					<Grid display='flex' justifyContent='space-between' alignItems='center'>
						<CustomText color={theme?.view_buyer?.basic_details?.primary} type='Body'>
							{t('OrderManagement.CartCheckoutCard.AvailableCredits')}
						</CustomText>
						<Box display='flex' alignItems='center'>
							<CustomText type='Body' style={{ margin: '0 10px' }}>
								${credits}
							</CustomText>
							<Icon iconName='IconWallet' />
						</Box>
					</Grid>
				</Can>
			</Box>
			<hr />
			{!_.isNull(reference_id) && (
				<Grid display={'flex'} justifyContent={'space-between'}>
					<CustomText type='Body' color={colors.secondary_text}>
						Reference id
					</CustomText>
					<CustomText
						type='Body'
						color={colors.secondary_text}
						style={{ cursor: 'pointer' }}
						onClick={() => copy_to_clipboard(reference_id)}>
						{reference_id}
						<Icon iconName='IconCopy' color={colors.secondary_text} sx={{ position: 'relative', top: '5px', paddingLeft: '5px' }} />
					</CustomText>
				</Grid>
			)}
			{!_.isNull(customer_id) && show_customer_system_uuid === true && (
				<Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
					<CustomText type='Body' color={colors.secondary_text}>
						Customer id
					</CustomText>
					<CustomText
						type='Body'
						color={colors.secondary_text}
						style={{ cursor: 'pointer' }}
						onClick={() => copy_to_clipboard(customer_id)}>
						{String(customer_id).substring(0, 15)}
						<span style={{ color: colors.secondary_text }}>{String(customer_id).substring(15, 17)}..</span>
						<Icon iconName='IconCopy' color={colors.secondary_text} sx={{ position: 'relative', top: '5px', paddingLeft: '5px' }} />
					</CustomText>
				</Grid>
			)}
		</React.Fragment>
	);
};

export default BasicDetails;
