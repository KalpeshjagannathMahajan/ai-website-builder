/* eslint-disable eqeqeq */
import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Button, Input, Icon, Box, Grid } from 'src/common/@the-source/atoms';
import CustomDialog, { DialogContainer, DialogTitle, DialogFooter } from 'src/common/CustomDialog';
import { get_formatted_price_with_currency } from 'src/utils/common';
import CartSummaryContext from '../context';
import { get_discounted_value } from '../helper';
import { useTranslation } from 'react-i18next';
import { Alert, Divider } from '@mui/material';
import ModalProductCard from './ModalProductCard';
import CustomText from 'src/common/@the-source/CustomText';
import _ from 'lodash';
import { Mixpanel } from 'src/mixpanel';
import { get_product_metadata } from 'src/utils/utils';
import Events from 'src/utils/events_constants';

const useStyles = makeStyles((theme: any) => ({
	offered_price: {
		padding: '0.8rem 1.5rem',
		borderRadius: '8px',
		border: `2px solid ${theme?.cart_summary?.offer_discount?.border}`,
	},

	discount_box: {
		display: 'flex',
		alignItems: 'center',
		gap: '2rem',
		flex: 2,
	},

	body_section: {
		paddingTop: '12px',
		paddingBottom: '12px',
		paddingLeft: '24px',
		paddingRight: '24px',
		display: 'flex',
		flexDirection: 'column',
		gap: '24px',
		marginBottom: '10px',
	},
	toggle_container: {
		display: 'flex',
		width: '100%',
		border: `1.4px solid ${theme?.cart_summary?.offer_discount?.toggle_border}`,
		borderRadius: '8px',
	},
	toggle_box: {
		cursor: 'pointer',
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: '0px 5px',
	},
	icon: {
		transform: 'scale(1.1)',
	},
	info_box: {
		display: 'flex',
		gap: '10px',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: '100%',
	},
	line: {
		height: '1px',
		borderBottom: `1px solid ${theme?.cart_summary?.offer_discount?.toggle_border}`,
		width: '100%',
	},
	input_box: {
		display: 'flex',
		gap: '10px',
		width: '100%',
	},
}));

const extract_decimal_number = (value: any, maxDecimals = 2) => {
	const numArr = String(value)
		.replace(/[^0-9.]/g, '')
		.split('.');
	const wholePart = numArr[0] || '';
	const wholePartTemp = wholePart.length === 0 ? wholePart : +wholePart;
	const decimalPart = numArr[1] || '';
	const dot = String(value).includes('.') ? '.' : '';

	let val: any = wholePartTemp + dot + decimalPart.slice(0, maxDecimals + 1);
	return !isNaN(val) ? val : 0;
};

interface Props {
	show_modal: boolean;
	toggle_modal: any;
	product_data: any;
}

const OfferDiscountModal = ({ show_modal, toggle_modal, product_data }: Props) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const { cart_summary_card, cart, handle_apply_item_discount, discount_loader, cart_metadata, customer_metadata } =
		useContext(CartSummaryContext);
	const currency_symbol = cart_summary_card?.currency_symbol;
	const { data } = cart;

	const products = data?.products ? Object?.values(data?.products) : [];
	const discount_data = data?.items?.[product_data?.id]?.[product_data?.cart_item_id] || {};

	const discount_logic_types = [
		{
			value: 'percentage',
			component: (selected: boolean) => (
				<Icon className={classes.icon} iconName='IconPercentage' color={selected ? '#16885F' : '#9AA0AA'} />
			),
		},
		{
			value: 'value',
			component: (selected: boolean) => (
				<Icon className={classes.icon} iconName='IconCurrencyDollar' color={selected ? '#16885F' : '#9AA0AA'} />
			),
		},
	];

	const handle_get_entity_error = (value: any, selling_price: any, id: any) => {
		if (id === 1 && value == 0) {
			return {
				message: 'Discount can not be 0',
				is_error: true,
				name: 'discount_input',
			};
		}

		if (id === 2 && selling_price == value) {
			return {
				message: 'You added an offered price that was higher than the catalog selling price. Adding a charge is currently not supported.',
				is_error: true,
				name: 'offered_input',
			};
		}

		return {
			message: '',
			is_error: false,
			name: '',
		};
	};

	const [discount, set_discount] = useState<any>(0);
	const [discount_logic_type, set_discount_logic_type] = useState(_.head(discount_logic_types)?.value);
	const [offered_price, set_offered_price] = useState<any>(0);
	const [error, set_error] = useState<any>({ is_error: false, name: '', message: '' });
	const [discount_item_quantity, set_discount_item_quantity] = useState(product_data?.quantity);
	const selling_price = product_data?.initial_price ?? product_data?.pricing?.price;
	const discount_value = get_discounted_value(discount_logic_type, discount, selling_price);
	const discounted_value_label = `-${get_formatted_price_with_currency(currency_symbol, discount_value)}`;

	const handle_change_discount = (event: any) => {
		const value = event?.target?.value;
		let rectified_value = value;

		let _error = handle_get_entity_error(value, null, 1);
		set_error(_error);

		if (discount_logic_type === 'percentage') {
			if (value < 0 || value > 100) return false;
			rectified_value = extract_decimal_number(value, 2);
			let discounted_value = get_discounted_value(discount_logic_type, rectified_value, selling_price);
			let offered_value = selling_price - discounted_value;
			set_offered_price(offered_value?.toFixed(2));
		}

		if (discount_logic_type === 'value') {
			if (value > selling_price) return;
			rectified_value = extract_decimal_number(value, 2);
			let offered_value = selling_price - rectified_value;
			set_offered_price(offered_value?.toFixed(2));
		}

		set_discount(rectified_value);
	};

	const handle_change_discount_logic_type = (_item: any) => {
		set_discount(0);
		set_discount_logic_type(_item?.value);
		set_offered_price(selling_price?.toFixed(2));
	};

	const handle_change_offered_price = (event: any) => {
		set_discount_logic_type('value');
		const value = event?.target?.value;
		let rectified_value = value;

		let _error = handle_get_entity_error(value, selling_price, 2);
		set_error(_error);

		if (value > selling_price) return;
		rectified_value = extract_decimal_number(value, 2);

		set_offered_price(rectified_value);
		let update_discount_value = selling_price - rectified_value;

		set_discount(update_discount_value?.toFixed(2));
	};

	const custom_product_or_discount_applied = () => {
		return (
			(discount_data?.discount_type && (discount_data?.discount_value || discount_data?.discount_value === 0)) ||
			product_data?.is_custom_product
		);
	};

	const handle_submit = () => {
		let payload: any = {
			cart_id: data?.id,
			product_id: product_data?.id,
			quantity: discount_item_quantity,
			discount_type: discount_logic_type,
			discount_value: discount,
			final_price: offered_price * discount_item_quantity,
			non_discounted_cart_item_id: product_data?.cart_item_id,
			is_edit_discount: discount_data?.discount_type && discount_data?.discount_value ? true : false,
		};

		if (custom_product_or_discount_applied()) {
			payload = {
				...payload,
				cart_item_id: product_data?.cart_item_id,
			};
		} else {
			payload = {
				...payload,
				cart_item_id: crypto.randomUUID(),
			};
		}

		handle_apply_item_discount(payload, payload?.product_id, payload?.cart_item_id);
	};

	const handle_error_state = (state: any) => {
		set_error(state);
	};

	useEffect(() => {
		if (show_modal) {
			set_discount(discount_data?.discount_value || 0);
			set_discount_logic_type(discount_data?.discount_type || discount_logic_types[0]?.value);
			if (discount_data) {
				let _discount_value = get_discounted_value(discount_data?.discount_type, discount_data?.discount_value, selling_price);
				let total = selling_price - _discount_value;
				set_offered_price(total);
			}
		}
	}, [show_modal]);

	const handle_close = () => {
		toggle_modal(false);
	};

	const handle_confirm_discount_clicked = () => {
		handle_submit();
		const product_metadata = get_product_metadata(product_data);
		Mixpanel.track(Events.CONFIRM_DISCOUNT_CLICKED, {
			tab_name: 'Home',
			page_name: 'cart_page',
			section_name: 'discount_form_popup',
			subtab_name: '',
			cart_metadata,
			customer_metadata,
			product_metadata,
		});
	};

	return (
		<React.Fragment>
			<CustomDialog show_modal={show_modal} handle_close={handle_close} style={{ width: '470px' }}>
				<DialogContainer>
					<DialogTitle value={t('CartSummary.OfferDiscountModal.ModalTitle')} show_close={!discount_loader} handle_close={handle_close} />
					<Divider />

					<Grid className={classes.body_section}>
						<CustomText type='Subtitle' style={{ marginTop: '10px' }}>
							{t('CartSummary.OfferDiscountModal.DiscountProductTitle')}
						</CustomText>

						{products?.map((product: any) => {
							if (product?.id === product_data?.id) {
								return (
									<ModalProductCard
										set_discount_item_quantity={set_discount_item_quantity}
										discount_item_quantity={discount_item_quantity}
										discount_data={discount_data}
										key={product?.id}
										handle_get_error_state={handle_error_state}
										item={product_data}
										product={product}
										show_modal={show_modal}
									/>
								);
							}
						})}

						<hr style={{ margin: 0 }}></hr>

						<CustomText type='Subtitle'>{t('CartSummary.OfferDiscountModal.DiscountTitle')}</CustomText>

						<Box className={classes.info_box}>
							<CustomText type='Subtitle' color='#676D77'>
								{t('CartSummary.OfferDiscountModal.SellingPrice')}
							</CustomText>
							<CustomText type='Subtitle' style={{ opacity: '0.6' }}>
								{get_formatted_price_with_currency(currency_symbol, selling_price)}
							</CustomText>
						</Box>

						<Box className={classes.info_box}>
							<Box className={classes.discount_box}>
								<CustomText type='Subtitle' color='#676D77'>
									{t('CartSummary.OfferDiscountModal.Discount')}
								</CustomText>
								<Box className={classes.input_box}>
									<Input
										onChange={handle_change_discount}
										sx={{
											width: '100%',
										}}
										error={error?.is_error && error?.name === 'discount_input'}
										value={discount}
										id={'discount-input'}
										variant='outlined'
										type='number'
										children={undefined}
										label={''}
									/>

									<Box className={classes.toggle_container}>
										{discount_logic_types?.map((item, index) => {
											const is_selected = item?.value === discount_logic_type;
											const styles = {
												borderTopLeftRadius: index === 0 ? '6.5px' : 'none',
												borderBottomLeftRadius: index === 0 ? '6.5px' : 'none',
												borderTopRightRadius: index === discount_logic_types?.length - 1 ? '6.5px' : 'none',
												borderBottomRightRadius: index === discount_logic_types?.length - 1 ? '6.5px' : 'none',
												background: is_selected ? '#E8F3EF' : 'white',
											};
											return (
												<Box onClick={() => handle_change_discount_logic_type(item)} className={classes.toggle_box} style={styles}>
													{item?.component(is_selected)}
												</Box>
											);
										})}
									</Box>
								</Box>
							</Box>
							<CustomText
								type='Subtitle'
								style={{
									flex: 1,
									display: 'flex',
									justifyContent: 'end',
								}}
								color='#AE3500'>
								{discounted_value_label}
							</CustomText>
						</Box>

						<Box className={classes.line} />

						<Box className={classes.info_box}>
							<CustomText type='Subtitle'>{t('CartSummary.OfferDiscountModal.OfferedPrice')}</CustomText>

							<Input
								onChange={handle_change_offered_price}
								sx={{
									width: '35%',
								}}
								value={offered_price || 0}
								error={error?.is_error && error?.name === 'offered_input'}
								InputProps={{
									startAdornment: (
										<CustomText type='Subtitle' color='#676D77' style={{ marginRight: '10px' }}>
											{currency_symbol}
										</CustomText>
									),
								}}
								id={'discount-input'}
								variant='outlined'
								children={undefined}
								label={''}
							/>
						</Box>
					</Grid>

					{error?.is_error && (
						<Box px={2.5} mb={1}>
							<Alert sx={{ my: 1 }} severity='warning'>
								{error?.message}
							</Alert>
						</Box>
					)}

					<Divider />

					<DialogFooter>
						<Button onClick={handle_close} disabled={discount_loader} variant='outlined' color='secondary'>
							{t('CartSummary.OfferDiscountModal.Cancel')}
						</Button>
						<Button
							loading={discount_loader}
							disabled={(discount == 0 && true) || discount_loader || !discount_item_quantity}
							onClick={handle_confirm_discount_clicked}>
							{t('CartSummary.OfferDiscountModal.Confirm')}
						</Button>
					</DialogFooter>
				</DialogContainer>
			</CustomDialog>
		</React.Fragment>
	);
};

export default OfferDiscountModal;
