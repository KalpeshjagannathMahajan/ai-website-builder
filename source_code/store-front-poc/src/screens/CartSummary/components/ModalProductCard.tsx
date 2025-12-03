/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Image } from 'src/common/@the-source/atoms';
import { get_entity_error, get_initial_entity_error } from '../helper';
import { useTranslation } from 'react-i18next';
import get_product_image from 'src/utils/ImageConstants';
import Counter from './Counter';
import { makeStyles } from '@mui/styles';
import { get_max_quantity } from 'src/screens/ProductListing/utils';
import CustomText from 'src/common/@the-source/CustomText';

interface Props {
	item: any;
	product: any;
	discount_data: any;
	set_discount_item_quantity: any;
	discount_item_quantity: any;
	handle_get_error_state: any;
	show_modal: boolean;
}

const useStyles = makeStyles((theme: any) => ({
	image_box: {
		border: `1px solid ${theme?.cart_summary?.modal_product?.border}`,
		display: 'flex',
		justifyContent: 'center',
		borderRadius: '4px',
		width: '50px',
	},
}));

const ModalProductCard = ({
	item,
	product,
	discount_data,
	set_discount_item_quantity,
	discount_item_quantity,
	handle_get_error_state,
	show_modal,
}: Props) => {
	const product_data = { ...item, ...product };
	const from_offers = product_data?.quantity;
	const document_state = useSelector((state: any) => state?.cart?.document_items);
	const current_product_reserved = document_state?.[product_data?.id]?.total_reserved || 0;
	const [error, set_error] = useState<any>(get_initial_entity_error(product_data, current_product_reserved, from_offers));

	const step = product_data?.pricing?.step_increment;
	const { t } = useTranslation();
	const classes = useStyles();

	const handle_increment = () => {
		let new_quantity;
		if (+discount_item_quantity < product_data?.pricing?.min_order_quantity) new_quantity = product_data?.pricing?.min_order_quantity;
		else new_quantity = +discount_item_quantity + step;

		const _error = get_entity_error(product_data, +new_quantity, product_data?.quantity, current_product_reserved, product_data?.quantity);
		let error_obj = { ..._error, message: 'You can not increase the counter to more than what is added in cart' };
		set_error(error_obj);
		if (!error_obj?.is_error) {
			if (discount_item_quantity !== new_quantity) set_discount_item_quantity(new_quantity);
		}
	};

	const handle_decrement = () => {
		let new_quantity;
		const reserved_quantity = product_data?.inventory?.total_reserved;
		const max_quantity_allowed = get_max_quantity(product, reserved_quantity);

		if (+discount_item_quantity > max_quantity_allowed) new_quantity = max_quantity_allowed;
		else if (discount_item_quantity >= step) new_quantity = +discount_item_quantity - step;
		else new_quantity = +discount_item_quantity;

		const _error = get_entity_error(product_data, +new_quantity, product_data?.quantity, current_product_reserved, product_data?.quantity);

		let error_obj = {
			..._error,
		};
		if (_error?.id === 7 && _error?.is_error) {
			error_obj = {
				...error_obj,
				message: 'You can not increase the counter to more than what is added in cart',
			};
		}

		// if ((_error?.id === 9 || _error?.id === 3) && _error?.is_error) {
		// 	error_obj = { id: 0, is_error: false, message: '' };
		// }

		set_error(error_obj);
		if (!error_obj?.is_error) {
			if (discount_item_quantity !== new_quantity) set_discount_item_quantity(new_quantity);
		}
	};

	const handle_disable = () => {
		if (product_data?.is_custom_product) return true;
		if (discount_data?.discount_type && (discount_data?.discount_value || discount_data?.discount_value === 0)) {
			return true;
		} else {
			return false;
		}
	};

	const handle_set_quantity = (event: any) => {
		const _value = event.target.value;
		const regex = /^[1-9]\d*$/;
		const isPositiveInteger = regex.test(_value);
		if (!isPositiveInteger && _value) return;

		const _error = get_entity_error(product_data, +_value, product_data?.quantity, current_product_reserved, product_data?.quantity);

		let error_obj = {
			..._error,
		};
		if (_error?.id === 7 && _error?.is_error) {
			error_obj = {
				...error_obj,
				message: 'You can not increase the counter to more than what is added in cart',
			};
		}

		// if ((_error?.id === 9 || _error?.id === 3) && _error?.is_error) {
		// 	error_obj = { id: 0, is_error: false, message: '' };
		// }

		set_error(error_obj);
		set_discount_item_quantity(_value);
	};

	const handle_blur_quantity = (event: any) => {
		let _value = event.target.value;

		if (!_value) {
			set_discount_item_quantity(product_data?.quantity);
			return;
		}

		if (_value > product_data?.quantity) {
			_value = product_data?.quantity;
		}

		const _error = get_entity_error(product_data, +_value, product_data?.quantity, current_product_reserved, product_data?.quantity);

		set_error(_error);
		if (!_error?.is_error) {
			set_discount_item_quantity(_value);
		}
	};

	useEffect(() => {
		if (show_modal) {
			handle_get_error_state(error);
		}
	}, [error]);

	return (
		<Grid container alignItems='center' flexWrap={'nowrap'}>
			<Grid item width={'5rem'} mr='.8rem'>
				<Box className={classes.image_box}>
					<Image
						width={40}
						height={40}
						style={{ borderRadius: '6px' }}
						src={get_product_image(product_data, 'CART_SUMMARY_PAGE')}
						alt='test'
					/>
				</Box>
			</Grid>

			<Grid item width={'20rem'} mr='.6rem'>
				<CustomText
					type='Subtitle'
					style={{
						width: '100%',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
					color='rgba(0, 0, 0, 0.6)'>
					{product_data?.name}
				</CustomText>
				<CustomText type='Caption' color='rgba(0, 0, 0, 0.60)'>
					{t('CartSummary.ProductCard.Id', { id: product_data?.sku_id })}
				</CustomText>
			</Grid>

			<Grid item md={4}>
				<Counter
					show_delete_icon={false}
					disabled={handle_disable()}
					disabledDecrement={handle_disable() || error?.id === 5 || error?.id === 3 || error?.id === 9}
					disableIncrement={handle_disable() || error?.id === 2 || error?.id === 4 || error?.id === 5 || error?.id === 6 || error?.id === 7}
					handleIncrement={handle_increment}
					handleDecrement={handle_decrement}
					handleBlurQuantity={handle_blur_quantity}
					handleSetQuantity={handle_set_quantity}
					show_input_modal={false}
					quantity={discount_item_quantity}
					icon_style={{
						opacity: handle_disable() ? 0 : 1,
					}}
					moq={product_data?.pricing?.min_order_quantity}
				/>
			</Grid>
		</Grid>
	);
};

export default ModalProductCard;
