/* eslint-disable array-callback-return */
import { Button, Drawer, Grid, Icon, Typography } from '../../atoms';
import { useTranslation } from 'react-i18next';
import { Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from '../VariantDrawer/variant.module.css';
// import SkeletonVariants from '../VariantDrawer/SkeletonVariant';
import CartItemCard from './Card';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { get_discounted_value } from 'src/screens/CartSummary/helper';
import { useTheme } from '@mui/material/styles';
import { get_formatted_price_with_currency } from 'src/utils/common';

interface CartDrawerProps {
	show: boolean;
	set_show: any;
	data: any;
	cart_product_id: any;
	attribute_template?: any;
	discount_campaigns?: any[];
}

const CartDrawer = ({ show, set_show, data, cart_product_id, attribute_template, discount_campaigns }: CartDrawerProps) => {
	const { t } = useTranslation();
	const cart = useSelector((state: any) => state.cart);
	const [total_price, set_total_price] = useState(0);
	const [cart_item_id, set_cart_item_id] = useState<any>(null);
	const theme: any = useTheme();
	const currency = useSelector((state: any) => state?.settings?.currency);

	const cart_product = cart?.products[cart_product_id];

	const filtered_cart_product = _.mapValues(
		_.pickBy(cart_product, (value) => {
			return value?.discount_type && value?.discount_value;
		}),
	);

	const discounted_product = { ...filtered_cart_product };

	const handle_get_cart_item_id = () => {
		const filtered_keys = _.keys(
			_.pickBy(cart_product, (value, key) => {
				return key !== 'parent_id' && key !== 'id' && value.discount_type === null && value.discount_value === null;
			}),
		);

		if (_.isEmpty(filtered_keys)) {
			return crypto.randomUUID();
		} else {
			return filtered_keys[0];
		}
	};

	useEffect(() => {
		let id = handle_get_cart_item_id();
		set_cart_item_id(id);
	}, [cart]);

	useEffect(() => {
		let total = 0;
		const price = data?.pricing?.price;

		cart?.products[data?.id] &&
			Object.keys(cart?.products[data?.id])?.map((key: string) => {
				const product = cart?.products[data?.id][key];
				const _temp = product?.quantity ?? 0;
				const discount_price = price - get_discounted_value(product?.discount_type, product?.discount_value, price);
				total += discount_price * _temp;
			});
		set_total_price(total);
	}, [cart, data]);

	return (
		<>
			<Drawer
				anchor='right'
				width={640}
				open={show}
				onClose={() => {
					set_show(false);
				}}
				content={
					<React.Fragment>
						<Grid
							className={styles.container}
							sx={{
								...theme?.product?.variant_drawer?.container,
							}}>
							<Grid container justifyContent='space-between' direction='row' height='3rem' sx={{ marginTop: '.7rem' }}>
								<Typography variant='h6'>{`Edit quantity for ${data?.sku_id}`}</Typography>
								<Icon
									iconName='IconX'
									onClick={() => {
										set_show(false);
									}}
									className={styles.icon_style}
									sx={{ cursor: 'pointer' }}
								/>
							</Grid>
							<Divider />
							<Grid className={styles.body}>
								<Grid container direction='column'>
									<CartItemCard
										product={data}
										cart_product={{}}
										cart_item_key={cart_item_id}
										attribute_template={attribute_template}
										discount_campaigns={discount_campaigns}
									/>
									{!_.isEmpty(discounted_product) &&
										Object.keys(discounted_product).map((key: string) => {
											const Item = cart_product?.[key];

											if (key !== 'id' && key !== 'parent_id')
												return (
													<Grid key={key}>
														<CartItemCard product={data} cart_product={Item} cart_item_key={key} attribute_template={attribute_template} />
													</Grid>
												);
											else {
												return null;
											}
										})}
								</Grid>
							</Grid>
							<Grid className={styles.footer}>
								<Grid
									container
									direction='row'
									justifyContent='space-between'
									alignItems={'center'}
									sx={{
										padding: '5px 20px',
										background: theme?.product?.variant_drawer?.footer?.background,
										marginBottom: '0px',
										marginTop: '10px',
									}}>
									<Typography
										sx={{
											marginRight: '10px',
											fontWeight: 700,
											fontSize: '16px',
											borderRadius: '9px',
											padding: '9px',
											...theme?.product?.cart_drawer,
										}}>
										{t('Common.VariantDrawer.CartValue', { price: get_formatted_price_with_currency(currency, total_price) })}
									</Typography>
									<Button
										onClick={() => {
											set_show(false);
										}}>
										{t('Common.VariantDrawer.Done')}
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</React.Fragment>
				}
			/>
		</>
	);
};

export default CartDrawer;
