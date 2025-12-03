import { Card, CardActions, CardContent, CardProps as MuiCardProps, Grid } from '@mui/material';
// @ts-ignore
import LazyLoad from 'react-lazyload';
import Button from '../../atoms/Button';
import Chip from '../../atoms/Chips/Chip';
import Counter from '../../atoms/Counter/Counter';
import Icon from '../../atoms/Icon/Icon';
import Image from '../../atoms/Image/Image';
import Typography from '../../atoms/Typography/Typography';
import styles from './ProductCard.module.css';
import { t } from 'i18next';
import types from 'src/utils/types';
import { from_max_quantity, get_max_quantity } from 'src/screens/ProductListing/utils';
import { INVENTORY_STATUS } from '../Inventory/constants';
import FallbackImage from 'src/assets/images/fallback.png';
import { useTheme } from '@mui/material/styles';

export interface CardProps extends MuiCardProps {
	data: any;
	imageEnv: any;
	fallbackEnv?: any;
	handleCounterIncrement?: () => any;
	handleCounterDecrement?: () => any;
	handleLimit?: () => any;
	handleRemoveFromCart?: () => any;
	noBoxShadow?: boolean;
	handleVariant: (id: any) => any;

	onProductCardClick: (id: any) => any;
}

/**
 *
 * This component is not used anywhere! Will make it deprecated soon.
 */
const ProductCard = ({
	data,
	imageEnv,
	fallbackEnv,
	noBoxShadow,
	handleCounterIncrement,
	handleCounterDecrement,
	handleLimit,
	handleRemoveFromCart,
	handleVariant,
	onProductCardClick,
	...rest
}: CardProps) => {
	const {
		badges = null,
		lines = [],
		product_images = [],
		variant = null,
		cart = [],
		parent_id,
		inventory = null,
		pricing = null,
		imageFit = 'cover',
		id,
	} = data;
	const orderedAttributes = lines?.sort((a: any, b: any) => a.priority - b.priority);

	const topLeft = badges?.find((item: any) => item?.position === 'top-left');
	const topRight = badges?.find((item: any) => item?.position === 'top-right');
	const bottomLeft = badges?.find((item: any) => item?.position === 'bottom-left');
	const bottomRight = badges?.find((item: any) => item?.position === 'bottom-right');

	const hasVariantBool = typeof variant?.has_variant === 'boolean' ? variant?.has_variant : variant?.has_variant === 'true';
	const hasVariantSelected = cart?.length > 0;

	const productsInCart = !hasVariantBool && cart?.length > 0 ? cart?.[0]?.quantity : 0;
	const max_quantity = get_max_quantity({ inventory, pricing }, inventory?.total_reserved);
	const theme: any = useTheme();

	return (
		<LazyLoad height={350} offset={100}>
			<Card
				{...rest}
				sx={{
					boxShadow: noBoxShadow ? null : 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
				}}
				className={styles['product-card']}>
				<CardContent
					onClick={() => {
						onProductCardClick(id);
					}}
					sx={{ p: 0 }}
					className={styles['product-card-content']}>
					{[topRight, topLeft]?.filter(Boolean).map((item: any) => {
						const { position, values } = item;
						const sorted = values?.sort((a: any, b: any) => a.priority - b.priority);
						return (
							<Grid className={styles[position]} p='1em'>
								{sorted?.map(
									(badge: any) =>
										badge?.text && (
											<Chip sx={{ marginLeft: 0.1 }} bgColor={badge?.background_color} textColor={badge?.text_color} label={badge?.text} />
										),
								)}
							</Grid>
						);
					})}
					<Image
						src={product_images?.[0] ? `${imageEnv}/${product_images[0]}` : FallbackImage}
						fallbackSrc={product_images?.[0] ? `${fallbackEnv ?? imageEnv}/${product_images[0]}` : FallbackImage}
						alt='image'
						style={{
							objectFit: imageFit || 'cover',
							borderRadius: '8px 8px 0 0',
						}}
						imgClass={styles['product-image']}
					/>
					{[bottomLeft, bottomRight]?.filter(Boolean).map((item: any) => {
						const { position, values } = item;
						const sorted = values?.sort((a: any, b: any) => a.priority - b.priority);
						return (
							<Grid p='1em' className={styles[`${position}`]}>
								{sorted?.map((badge: any) => (
									<Chip sx={{ marginLeft: 0.1 }} bgColor={badge?.background_color} textColor={badge?.text_color} label={badge?.text} />
								))}
							</Grid>
						);
					})}
				</CardContent>
				<Grid container className={styles['product-card-content-body']} overflow='auto'>
					<Grid container direction='column' wrap='nowrap' rowSpacing={1} justifyContent='space-around'>
						{orderedAttributes?.map((item: any) => {
							const leftAttribute = item?.line?.find((ele: any) => ele?.position === 'left');
							const rightAttribute = item?.line?.find((ele: any) => ele?.position === 'right');
							return (
								<Grid alignItems='center' item container columnSpacing={2} justifyContent='space-between'>
									<Grid item xs>
										<Typography
											variant={leftAttribute?.text_type}
											truncateIn={leftAttribute?.truncate || 1}
											noWrap
											color={leftAttribute?.text_color}>
											{leftAttribute?.text || '---'}
										</Typography>
									</Grid>
									{rightAttribute && (
										<Grid item>
											<Typography
												variant={rightAttribute?.text_type}
												color={rightAttribute?.key === 'variant_count' ? theme?.palette?.secondary?.[700] : rightAttribute?.text_color}>
												{rightAttribute?.key === 'variant_count'
													? cart?.length
														? `${cart?.length || 1}/${variant?.count} SELECTED`
														: rightAttribute?.text?.toUpperCase()
													: rightAttribute?.text ?? '---'}
											</Typography>
										</Grid>
									)}
								</Grid>
							);
						})}
					</Grid>
				</Grid>
				<CardActions disableSpacing sx={{ p: '0 1em 1em' }} className={styles['product-card-action']}>
					{hasVariantBool ? (
						hasVariantSelected ? (
							<Button
								startIcon={<Icon color='primary' iconName='IconEdit' />}
								variant='outlined'
								sx={{
									height: '40px',
								}}
								onClick={() => {
									handleVariant(id);
								}}
								fullWidth>
								{t('Common.ProductCard.CustomizeSelection')}
							</Button>
						) : (
							<Button
								tonal
								sx={{
									height: '40px',
								}}
								onClick={() => {
									handleVariant(id);
								}}
								fullWidth>
								{t('Common.ProductCard.AddToCart')}
							</Button>
						)
					) : (
						<Counter
							disabled={inventory?.inventory_status === INVENTORY_STATUS.out_of_stock}
							initialCount={productsInCart}
							min={inventory?.min_order_quantity}
							max={max_quantity}
							step={inventory?.incremental_value}
							hasVariant={hasVariantBool}
							product={data}
							product_id={id}
							parent_id={parent_id}
							from_max={from_max_quantity(max_quantity, inventory?.max_order_quantity ?? types.DEFAULT_ORDER_QUANTITY)}
						/>
					)}
				</CardActions>
			</Card>
		</LazyLoad>
	);
};
ProductCard.defaultProps = {
	handleCounterIncrement: () => {},
	handleCounterDecrement: () => {},
	handleRemoveFromCart: () => {},
	handleLimit: () => {},
	fallbackEnv: undefined,
	noBoxShadow: false,
};

export default ProductCard;
