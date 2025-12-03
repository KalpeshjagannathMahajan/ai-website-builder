import { Alert } from '@mui/material';
import { useContext, useState } from 'react';
import { t } from 'i18next';
import { Box, Button, Grid, Icon, Modal } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import CartSummaryContext from '../context';
import { get_formatted_price_with_currency } from 'src/utils/common';
import get from 'lodash/get';
import isInteger from 'lodash/isInteger';
import cart_management from 'src/utils/api_requests/cartManagement';
import { get_discounted_value } from '../helper';

interface Props {
	handle_get_cart_details: any;
}

const UpdatePriceModal = ({ handle_get_cart_details }: Props) => {
	const [loading, set_loading] = useState(false);
	const { cart, update_price_modal_data, set_update_price_modal_data, set_edit_product_price_change } = useContext(CartSummaryContext);
	const {
		data: { item, product, currency, cart_total, modified_cart_total },
		action,
	} = update_price_modal_data;

	const currency_symbol: string = action === 'SINGLE' ? get(product?.pricing, 'currency', '$') : currency;

	const reset_modal = {
		open: false,
		action: '',
		data: {},
	};

	const subtitle =
		update_price_modal_data?.action === 'BULK'
			? t('PriceEdit.BulkPrice', { ProductCount: update_price_modal_data?.data?.products })
			: t('PriceEdit.SinglePrice');

	const old_price = action === 'SINGLE' ? item?.initial_price : cart_total;
	const new_price = action === 'SINGLE' ? product?.pricing?.price : modified_cart_total;
	const base_price = product?.pricing?.base_price;

	//Calculate percentage of change from old to new price
	const percentage_change = ((Number(new_price) - Number(old_price)) / Number(old_price)) * 100;

	// The price increase or decrease in percentage_change value to get in is_price_increased to be boolean
	const is_price_increased = percentage_change > 0 ? true : false;
	const percentage_change_abs = Math.abs(percentage_change);
	const format_percentage = isInteger(percentage_change_abs) ? percentage_change_abs : Number(percentage_change_abs).toFixed(2);

	// Offered Price
	let old_discount_value = get_discounted_value(item?.discount_type, item?.discount_value, old_price);
	let new_discount_value = get_discounted_value(item?.discount_type, item?.discount_value, new_price);
	let old_total = old_price - old_discount_value;
	let new_total = new_price - new_discount_value;

	let offered_price = item?.is_price_modified ? item?.final_price : old_total;
	let new_offered_price = item?.is_price_modified ? item?.final_price : new_total;

	const handle_apply = async () => {
		set_loading(true);
		const payload = {
			cart_id: cart?.data?.id || '',
			product_ids: action === 'BULK' ? [] : [product?.id],
		};

		try {
			const response: any = await cart_management.bulk_update_cart_initial_price(payload);
			if (response.status_code === 200) {
				set_update_price_modal_data(reset_modal);
				handle_get_cart_details();
				if (action === 'SINGLE') {
					set_edit_product_price_change((prev: any) => prev?.filter((product_id: any) => product_id !== product?.id));
				} else {
					set_edit_product_price_change([]);
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			set_loading(false);
		}
	};

	return (
		<Modal
			open={true}
			width={450}
			sx={{ padding: '1.5rem 0 0 2rem' }}
			onClose={() => set_update_price_modal_data(reset_modal)}
			title={`Apply New price${update_price_modal_data?.action === 'BULK' ? 's' : ''}?`}
			footer={
				<Grid container gap={2} justifyContent={'flex-end'}>
					<Button variant='outlined' onClick={() => set_update_price_modal_data(reset_modal)}>
						Cancel
					</Button>
					<Button loading={loading} onClick={handle_apply}>
						Apply new price
					</Button>
				</Grid>
			}
			children={
				<Grid>
					<Grid>
						<CustomText>{subtitle}</CustomText>
					</Grid>

					{/* Old to New Price Card */}
					<Grid container spacing={2} mt={1} alignItems='stretch'>
						{/* Old Price */}
						<Grid item xs={5.5}>
							<Box py={1} px={2} borderRadius={1} bgcolor='#F2F4F7' display='flex' flexDirection='column' height='100%'>
								<Box bgcolor='#676D77' borderRadius={1} my={1} width='fit-content'>
									<CustomText type='Body2' color='#fff' style={{ padding: '4px 8px' }}>
										Old
									</CustomText>
								</Box>

								{action === 'BULK' ? (
									<Box>
										<CustomText type='Body'>Cart total</CustomText>
										<CustomText style={{ marginBottom: '8px' }} type='Subtitle'>
											{get_formatted_price_with_currency(currency_symbol, old_price)}
										</CustomText>
									</Box>
								) : (
									<Grid container direction='column' spacing={1}>
										{base_price && (
											<Grid item container justifyContent='space-between' alignItems='center'>
												<Grid item>
													<CustomText type='Body'>Base price:</CustomText>
												</Grid>
												<Grid item>
													<CustomText type='Body'>
														<strong>{get_formatted_price_with_currency(currency, base_price)}</strong>
													</CustomText>
												</Grid>
											</Grid>
										)}
										<Grid item container justifyContent='space-between' alignItems='center'>
											<Grid item>
												<CustomText type='Body'>Sale price:</CustomText>
											</Grid>
											<Grid item>
												<CustomText type='Body'>
													<strong>{get_formatted_price_with_currency(currency, old_price)}</strong>
												</CustomText>
											</Grid>
										</Grid>
										{old_price !== offered_price && (
											<Grid item container justifyContent='space-between' alignItems='center'>
												<Grid item>
													<CustomText type='Body'>Offered price:</CustomText>
												</Grid>
												<Grid item>
													<CustomText type='Body'>
														<strong>{get_formatted_price_with_currency(currency, offered_price)}</strong>
													</CustomText>
												</Grid>
											</Grid>
										)}
									</Grid>
								)}
							</Box>
						</Grid>

						<Grid xs={1} item display='flex' alignItems='center'>
							<Icon iconName='IconArrowRight' />
						</Grid>

						{/* New Price */}
						<Grid item xs={5.5}>
							<Box
								py={1}
								px={2}
								borderRadius={1}
								bgcolor={is_price_increased ? '#F2F6E7' : '#FBEDE7'}
								display='flex'
								flexDirection='column'>
								<Box bgcolor={is_price_increased ? '#7DA50E' : '#D74C10'} borderRadius={1} my={1} width='fit-content'>
									<CustomText type='Body2' color='#fff' style={{ padding: '4px 8px' }}>
										New
									</CustomText>
								</Box>
								{action === 'BULK' ? (
									<Box>
										<CustomText type='Body'>Cart total</CustomText>
										<Grid container mb={1}>
											<Grid item>
												<CustomText type='Subtitle'>{get_formatted_price_with_currency(currency_symbol, new_price)}</CustomText>
											</Grid>
											<Grid item display='flex' alignItems='center' justifyContent='flex-end' fontSize='12px' ml={1}>
												<Icon
													sx={{ mr: 0.5 }}
													color={is_price_increased ? '#16885F' : '#D74C10'}
													iconName={is_price_increased ? 'IconTrendingUp' : 'IconTrendingDown'}
												/>
												<CustomText type='Body' color={is_price_increased ? '#16885F' : '#D74C10'}>
													{format_percentage}%
												</CustomText>
											</Grid>
										</Grid>
									</Box>
								) : (
									<Grid container direction='column' spacing={1}>
										{base_price && (
											<Grid item container justifyContent='space-between' alignItems='center'>
												<Grid item>
													<CustomText type='Body'>Base price:</CustomText>
												</Grid>
												<Grid item>
													<CustomText type='Body'>
														<strong>{get_formatted_price_with_currency(currency, base_price)}</strong>
													</CustomText>
												</Grid>
											</Grid>
										)}

										<Grid item container justifyContent='space-between' alignItems='center'>
											<Grid item>
												<CustomText type='Body'>Sale price:</CustomText>
											</Grid>
											<Grid item>
												<CustomText type='Body'>
													<strong>{get_formatted_price_with_currency(currency, new_price)}</strong>
												</CustomText>
											</Grid>
										</Grid>
										<Grid
											item
											display='flex'
											alignItems='center'
											justifyContent='flex-end'
											fontSize='12px'
											mt={-0.5}
											color={is_price_increased ? '#16885F' : '#D74C10'}>
											(
											<Icon
												sx={{ mr: 0.5 }}
												color={is_price_increased ? '#16885F' : '#D74C10'}
												iconName={is_price_increased ? 'IconTrendingUp' : 'IconTrendingDown'}
											/>
											{format_percentage}%)
										</Grid>
										{new_price !== new_offered_price && (
											<Grid item container justifyContent='space-between' alignItems='center'>
												<Grid item>
													<CustomText type='Body'>Offered price:</CustomText>
												</Grid>
												<Grid item>
													<CustomText type='Body'>
														<strong>{get_formatted_price_with_currency(currency, new_offered_price)}</strong>
													</CustomText>
												</Grid>
											</Grid>
										)}
									</Grid>
								)}
							</Box>
						</Grid>
					</Grid>

					<Grid mt={2}>
						<Alert icon={<Icon iconName='IconInfoCircle' />} sx={{ background: '#FCEFD6' }}>
							Manually edited price will remain same
						</Alert>
					</Grid>
				</Grid>
			}
		/>
	);
};

export default UpdatePriceModal;
