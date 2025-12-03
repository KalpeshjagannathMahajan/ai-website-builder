import { useState, useEffect } from 'react';
import { isEmpty, map, size, some } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Checkbox, Chip, Grid, Icon, Image } from 'src/common/@the-source/atoms';
import { RefundTransactionsProps } from 'src/@types/payment';
import CustomText from 'src/common/@the-source/CustomText';
import ImageLinks from 'src/assets/images/ImageLinks';
import { get_formatted_price_with_currency } from 'src/utils/common';
import { colors } from 'src/utils/theme';
import useStyles from '../styles';
import constants from '../constants';
import { useTheme } from '@mui/material';
import { info } from 'src/utils/common.theme';

const { MIN_TXNS_COUNT } = constants;

const RefundTransactions = ({ transactions, set_payment_ids, set_input_value, payment_method_ids, currency }: RefundTransactionsProps) => {
	const [checked_items, set_checked_items] = useState(transactions?.map(() => false));
	const [disabled_items, set_disabled_items] = useState<boolean[]>(transactions?.map(() => false));
	const [transactions_to_show, set_transactions_to_show] = useState<number>(MIN_TXNS_COUNT);
	const [show_all, set_show_all] = useState(false);
	const { t } = useTranslation();
	const { state } = useLocation();
	const { id } = useParams();
	const classes = useStyles();
	const show_limited_txns = !id && isEmpty(state?.transaction_id);
	const theme: any = useTheme();

	const calculate_total = (): number => {
		let total = 0;
		const selected_payment_ids: string[] = [];
		transactions?.forEach((item, index) => {
			if (checked_items[index]) {
				total += item.amount;
				selected_payment_ids.push(item.id);
			}
		});
		set_payment_ids(selected_payment_ids);
		return Number(total?.toFixed(2));
	};

	useEffect(() => {
		set_input_value(calculate_total());
	}, [checked_items]);

	useEffect(() => {
		const initialize_checked_items = () => {
			if (!some(transactions, (payment) => payment?.source === 'terminal')) {
				if (!isEmpty(state?.transaction_id)) {
					// Preselect the transaction matching the provided transaction_id
					set_checked_items(map(transactions, (transaction) => transaction.id === state.transaction_id));
				} else if (!show_limited_txns) {
					// Preselect all transactions if no transaction_id is provided
					set_checked_items(map(transactions, () => true));
				}
			}
		};

		initialize_checked_items();
	}, [transactions]);

	const handle_checkbox_change = (index: number): void => {
		const updated_checked_items = [...checked_items];
		updated_checked_items[index] = !updated_checked_items[index];
		set_checked_items(updated_checked_items);

		if (transactions[index].source === 'terminal') {
			set_disabled_items(transactions?.map((_, idx) => idx !== index && updated_checked_items[index]));
		} else if (updated_checked_items[index]) {
			set_disabled_items(transactions?.map((payment) => payment?.source === 'terminal'));
		} else if (!some(transactions, (_, idx) => updated_checked_items[idx] && transactions[idx]?.source !== 'terminal')) {
			set_disabled_items(transactions?.map(() => false));
		}
	};

	const toggle_show_more = () => {
		set_show_all((prev) => !prev);
		set_transactions_to_show((prev) => (prev === MIN_TXNS_COUNT ? transactions?.length : MIN_TXNS_COUNT));
	};

	// Render payment details
	const render_payment_detail = (payment_method_id: string, type: string = 'detail', style?: any) => {
		const payment_method = payment_method_ids[payment_method_id];
		const component_map: any = {
			detail: (
				<Grid display='flex' pt={'0.5rem'} alignItems='center' style={style}>
					<CustomText color={colors.secondary_text}>{payment_method?.title}</CustomText>
				</Grid>
			),
			logo: (
				<Image
					style={{ marginLeft: '1rem', ...style }}
					src={payment_method.logo}
					width={payment_method.payment_method_type === 'wallet' || payment_method.payment_method_id === 'manual' ? 24 : 40}
					height={24}
				/>
			),
			chip: (
				<Chip
					size='small'
					bgColor={info?.[50]}
					sx={{ border: '1px solid #FFF', ...style }}
					label={
						<CustomText color={info?.main} type='Caption'>
							ACH
						</CustomText>
					}
				/>
			),
		};
		return component_map[type];
	};

	const handle_render_content = (item: any) => {
		if (item.payment_method_type === 'ach' && item?.source === 'manual') {
			return (
				<Grid container flexDirection={'column'}>
					<Box style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
						<CustomText
							style={{
								minWidth: '110px',
							}}>
							{item.display_id}
						</CustomText>
						{render_payment_detail(item?.payment_method_id, 'logo')}
					</Box>
					{render_payment_detail(item?.payment_method_id, 'detail', { padding: 0 })}
				</Grid>
			);
		} else if (item.payment_method_type === 'ach' && item?.source !== 'manual') {
			const payment_method = payment_method_ids[item?.payment_method_id];
			const sub_title = payment_method?.subtitle;

			return (
				<Grid container flexDirection={'column'}>
					<Box style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
						<CustomText
							style={{
								minWidth: '110px',
							}}>
							{item.display_id}
						</CustomText>
						{render_payment_detail(item?.payment_method_id, 'chip')}
					</Box>
					<Grid display='flex' pt={'0.5rem'} alignItems='center' p={0}>
						<CustomText color={colors.secondary_text}>{sub_title}</CustomText>
					</Grid>
				</Grid>
			);
		} else {
			return (
				<>
					<Grid>
						<CustomText>
							{item.display_id}
							{item?.source === 'terminal' && (
								<Image style={{ marginLeft: '1rem' }} src={ImageLinks.terminal_icon} width={40} height={24} />
							)}
						</CustomText>
						{render_payment_detail(item?.payment_method_id)}
					</Grid>
					<Grid>{render_payment_detail(item?.payment_method_id, 'logo')}</Grid>
				</>
			);
		}
	};

	// Render transaction items
	const render_transactions = (): JSX.Element[] => {
		const transactions_to_render = show_all ? transactions : transactions?.slice(0, transactions_to_show);
		return map(transactions_to_render, (item, index) => {
			return (
				<Grid
					item
					key={`transaction_${item?.id}`}
					display='flex'
					gap={1}
					mt={1.5}
					width='100%'
					className={classes.transaction_item}
					sx={{
						opacity: disabled_items[index] ? 0.5 : 1,
					}}>
					<Checkbox
						name='transaction'
						checked={checked_items[index]}
						onChange={() => handle_checkbox_change(index)}
						disabled={disabled_items[index]}
						sx={{
							borderRadius: '0px',
						}}
					/>
					<Grid item className={classes.transaction_details}>
						<Grid display='flex' alignItems='center' justifyContent='space-between' flex={1}>
							<Grid xs={8} display={'flex'} gap={1}>
								{handle_render_content(item)}
							</Grid>
							<CustomText type='H6'>{get_formatted_price_with_currency(currency, item?.total_amount)}</CustomText>
						</Grid>
						{item?.total_refunded > 0 && (
							<Grid className={classes.total_refunded}>
								<CustomText type='Body' color={colors.secondary_text}>
									{t('Payment.Refund.AmountRefunded')}
								</CustomText>
								<CustomText type='Body' color={colors.secondary_text}>
									{get_formatted_price_with_currency(currency, item?.total_refunded)}
								</CustomText>
							</Grid>
						)}
					</Grid>
				</Grid>
			);
		});
	};

	return (
		<Grid container display='flex' flexDirection='column'>
			<CustomText type='H6'>{t('Payment.Refund.SelectTransactionsToRefund')}</CustomText>
			<Box display='flex' gap={1}>
				<CustomText type='Body' color={colors.secondary_text}>
					{t('Payment.Refund.ShowingNoOfTransactions', {
						count: show_all ? size(transactions) : Math.min(MIN_TXNS_COUNT, size(transactions)),
					})}
				</CustomText>
			</Box>

			{render_transactions()}

			{size(transactions) > MIN_TXNS_COUNT && (
				<Box
					display='flex'
					gap={0.5}
					my={1.5}
					alignItems='center'
					justifyContent='center'
					style={{ cursor: 'pointer' }}
					onClick={toggle_show_more}>
					<CustomText color={colors.primary_500} type='Subtitle'>
						{show_all ? t('Payment.Refund.ShowLess') : t('Payment.Refund.ShowMore')}
					</CustomText>
					<Icon iconName={show_all ? 'IconChevronUp' : 'IconChevronDown'} color={theme?.payments?.green} />
				</Box>
			)}
		</Grid>
	);
};

export default RefundTransactions;
