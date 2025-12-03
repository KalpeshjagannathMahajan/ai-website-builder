import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { filter, find, get, has, includes, indexOf, isEmpty, keys, map, remove, size, split } from 'lodash';
import { Accordion, Box, Button, Grid, Icon } from 'src/common/@the-source/atoms';
import RenderOrderDetails from './RenderOrderDetails';
import CustomText from 'src/common/@the-source/CustomText';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { get_currency, get_formatted_price_with_currency } from 'src/utils/common';
import { AuthorizeFormProps } from 'src/@types/payment';
import Can from 'src/casl/Can';
import PAYMENT_CONSTANTS from '../constants';
import SavedCardListing from 'src/common/@the-source/molecules/SavedCardListing';
import { colors } from 'src/utils/theme';
import { PERMISSIONS } from 'src/casl/permissions';
import AddPaymentModal from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/Drawer/AddPaymentModal';
import AuthorizedTxnRenderer from 'src/common/Authorization/AuthorizedTransaction';
import VoidAuthModal from 'src/common/Authorization/VoidAuthModal';
import useStyles from '../styles';
import constants from '../constants';
import utils from 'src/utils/utils';

const { MIN_AUTH_TXNS_COUNT } = constants;

const AuthorizeForm = ({
	form_data,
	buyer_data,
	set_toast,
	all_addresses,
	payment_config,
	input_value,
	set_input_value,
	payment_method_data,
	set_payment_method_data,
	set_payment_method_attrs,
	edit_form_details,
	has_void_authorization_permission,
}: AuthorizeFormProps) => {
	const [selected_payment_method_id, set_selected_payment_method_id] = useState<string>('');
	const [is_add_card_modal, set_is_add_card_modal_visible] = useState<boolean>(false);
	const [expanded, set_expanded] = useState<string[]>([]);
	const [open_void_auth_modal, set_open_void_auth_modal] = useState<boolean>(false);
	const [selected_transaction, set_selected_transaction] = useState<any>(null);
	const [transactions_to_show, set_transactions_to_show] = useState<number>(MIN_AUTH_TXNS_COUNT);
	const [show_all, set_show_all] = useState<boolean>(false);
	const authorized_transactions = get(form_data, 'authorized_transactions', []);
	const show_order_details = has(form_data, 'display_id');
	const currency = useSelector((state: any) => state?.settings?.currency);
	const { t } = useTranslation();
	const { id } = useParams();
	const { state } = useLocation();
	const classes = useStyles();
	const theme: any = useTheme();
	const buyer_id = id ?? get(buyer_data, 'id');
	const transactions_to_render = show_all ? authorized_transactions : authorized_transactions?.slice(0, transactions_to_show);

	const saved_payment_methods = useMemo(() => {
		if (isEmpty(payment_method_data)) return [];
		const payment_method_key_data = payment_method_data?.[PAYMENT_CONSTANTS.payment_method_data_keys.card] || {};
		return filter(payment_method_key_data, (method: any) => method?.payment_method_type === PAYMENT_CONSTANTS.method_types.card);
	}, [payment_method_data]);

	const mapped_cards = {
		...(payment_method_data || {}),
		payment_method_ids: keys(payment_method_data),
	};

	const primary_card_id = get(
		find(saved_payment_methods, (card) => card?.is_default),
		'payment_method_id',
		'',
	);

	const handle_callback = () => {
		const payload = {
			buyer_id,
			...(state?.document_id ? { document_id: state?.document_id } : {}),
		};
		edit_form_details(payload, 'authorize');
	};

	const handle_close_add_card_modal = () => {
		set_is_add_card_modal_visible(false);
		handle_callback();
	};

	const handle_update_added_cards = (key: string, value: any, data_key: string) => {
		const key_parts = split(key, '.');
		const saved_index = indexOf(key_parts, 'saved_payment_methods');
		if (saved_index !== -1 && saved_index + 1 < key_parts.length) {
			const method_id = key_parts?.[saved_index + 1];

			if (method_id) {
				set_payment_method_data((prevData: any) => ({
					...prevData,
					[data_key]: {
						...prevData?.[data_key],
						[method_id]: {
							...(prevData?.[method_id] || {}),
							...value,
						},
					},
				}));
			}
		}
	};

	const handle_add_click = () => {
		set_is_add_card_modal_visible(true);
	};

	const handle_amount_change = (event: any) => {
		let entered_value = event.target.value.replace(/^0+/, '');
		if (entered_value === '' || entered_value?.[0] === '.') entered_value = 0 + entered_value;
		const is_valid_number = utils.check_valid_number(entered_value);
		if (is_valid_number) {
			if (!entered_value.endsWith('.')) {
				set_input_value(entered_value);
			} else {
				set_input_value(entered_value);
			}
		}
	};

	const handle_toggle_accordion_state = (panel: string) => (_event: React.SyntheticEvent, flag: boolean) => {
		set_expanded(flag ? [...expanded, panel] : remove(expanded, (_panel) => _panel !== panel));
	};

	const handle_void_click = (item: any) => {
		set_selected_transaction(item);
		set_open_void_auth_modal(true);
	};

	const toggle_show_more = () => {
		set_show_all((prev) => !prev);
		set_transactions_to_show((prev) => (prev === MIN_AUTH_TXNS_COUNT ? authorized_transactions?.length : MIN_AUTH_TXNS_COUNT));
	};

	useEffect(() => {
		const selected = filter(saved_payment_methods, (value: any) => value.payment_method_type === PAYMENT_CONSTANTS.method_types.card);
		const assigned_payment_method = find(selected, (method: any) => method.is_selected);
		const default_payment_method = find(selected, (method: any) => method.is_default);
		const random_payment_method = find(selected, () => true);
		set_selected_payment_method_id(
			assigned_payment_method?.payment_method_id ||
				default_payment_method?.payment_method_id ||
				random_payment_method?.payment_method_id ||
				'',
		);
	}, [saved_payment_methods]);

	useEffect(() => {
		set_payment_method_attrs({ payment_method_id: selected_payment_method_id });
	}, [selected_payment_method_id]);

	const render_accordion_title = (
		<Box display='flex' flexDirection='column' gap={0.6}>
			<CustomText type='H3'>{t('Payment.PreAuth.PastAuthorizedTransactions')}</CustomText>
			{includes(expanded, 'txn-accordion') && (
				<CustomText type='Title' color={colors.secondary_text}>
					{t('Payment.PreAuth.ShowingNoOfTransactions', {
						count: show_all ? size(authorized_transactions) : Math.min(MIN_AUTH_TXNS_COUNT, size(authorized_transactions)),
					})}
				</CustomText>
			)}
		</Box>
	);

	const render_auth_txns_item = (item: any, index: number) => (
		<Grid container display='flex' alignItems='center' justifyContent='space-between' key={item?.id}>
			<AuthorizedTxnRenderer transaction={item} index={index} />
			<Grid item>
				<Button variant='text' onClick={() => handle_void_click(item)}>
					{t('Payment.PreAuth.Void')}
				</Button>
			</Grid>
		</Grid>
	);

	const render_auth_txns = (
		<Accordion
			expanded={expanded}
			on_change={handle_toggle_accordion_state}
			id='txn-accordion'
			content={[
				{
					title: render_accordion_title,
					expandedContent: (
						<Box>
							{map(transactions_to_render, (item: any, index: number) => render_auth_txns_item(item, index))}
							{size(authorized_transactions) > MIN_AUTH_TXNS_COUNT && (
								<Box
									display='flex'
									gap={0.5}
									my={1.5}
									alignItems='center'
									justifyContent='center'
									style={{ cursor: 'pointer' }}
									onClick={toggle_show_more}>
									<CustomText color={colors.primary_500} type='Subtitle'>
										{show_all ? t('Payment.PreAuth.ViewLess') : t('Payment.PreAuth.ViewMore')}
									</CustomText>
									<Icon iconName={show_all ? 'IconChevronUp' : 'IconChevronDown'} color={theme?.payments?.green} />
								</Box>
							)}
						</Box>
					),
				},
			]}
			titleColor={colors.white}
			contentBackground={colors.white}
			contentColor={colors.black}
			expandIconColor={colors.secondary_text}
			containerStyle={{
				padding: 0,
			}}
			titleStyle={{ padding: 0 }}
		/>
	);

	return (
		<>
			<Grid container className={classes.container}>
				<Box mb={1}>
					<CustomText type='H3'>{t('Payment.PreAuth.PaymentSummary')}</CustomText>
				</Box>

				{show_order_details && <RenderOrderDetails data={form_data} currency={currency} />}

				<Grid item pl={1} width='100%' display='flex' justifyContent='space-between' alignItems='center'>
					<CustomText type='Title'>{t('Payment.PreAuth.AmountToBeAuthorized')}</CustomText>
					<FormBuilder
						placeholder={t('Payment.PreAuth.AmountToBeAuthorized')}
						name='amount'
						value={input_value}
						onChange={handle_amount_change}
						validations={{
							amount: true,
						}}
						type='number'
						style={{
							width: '45%',
						}}
						inputProps={{
							autoComplete: 'off',
						}}
						size='small'
						start_icon={get_currency(currency)}
					/>
				</Grid>
				<Grid className={classes.total_card} mb={1} width='100%'>
					<CustomText type='Subtitle'>Total amount</CustomText>
					<CustomText type='Subtitle'>{get_formatted_price_with_currency(currency, input_value)}</CustomText>
				</Grid>
			</Grid>

			<Grid container className={classes.container} mb={1}>
				<Box display='flex' justifyContent={'space-between'} width='100%' alignItems='center' mb={2}>
					<Grid item>
						<CustomText type='H3'>{t('Payment.SelectCard')}</CustomText>
					</Grid>
					<Can I={PERMISSIONS.add_payment.slug} a={PERMISSIONS.add_payment.permissionType}>
						<Grid item display='flex' gap={1} alignItems='center' className={classes.add_new_card} onClick={handle_add_click}>
							<Icon color={colors.primary_500} iconName='IconPlus' />
							<CustomText type='H6' color={colors.primary_500}>
								{t('Payment.AddNewCard')}
							</CustomText>
						</Grid>
					</Can>
				</Box>
				<SavedCardListing
					section_heading=''
					default_payment_id={selected_payment_method_id}
					saved_payment_methods={saved_payment_methods}
					update_selected_payment_method={set_selected_payment_method_id}
					component_type='select'
					useDefaultValue={true}
					render_type={PAYMENT_CONSTANTS.method_types.card}
				/>
			</Grid>

			{has_void_authorization_permission && !isEmpty(authorized_transactions) && (
				<Grid container className={classes.container} mb={1} p={0}>
					{render_auth_txns}
				</Grid>
			)}
			{is_add_card_modal && (
				<AddPaymentModal
					all_cards={mapped_cards}
					all_address={all_addresses}
					customer_id=''
					web_token={payment_config?.web_token}
					is_visible={is_add_card_modal}
					close={handle_close_add_card_modal}
					source='buyer'
					buyer_id={buyer_id}
					primary_card_id={primary_card_id}
					payment_source={payment_config?.payment_gateway}
					handle_update_form={handle_update_added_cards}
				/>
			)}
			{open_void_auth_modal && selected_transaction && (
				<VoidAuthModal
					open_void_auth_modal={open_void_auth_modal}
					transaction={selected_transaction}
					set_toast={set_toast}
					set_open_void_auth_modal={set_open_void_auth_modal}
					callback={handle_callback}
				/>
			)}
		</>
	);
};

export default AuthorizeForm;
