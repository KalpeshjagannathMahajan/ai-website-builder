/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Grid from '../Grid';
import Modal from '../Modal';
import Icon from '../Icon/Icon';
import Button from '../Button/Button';
import { ButtonGroupProps as MuiButtonGroupProps, TextField } from '@mui/material';
import types from 'src/utils/types';
import { close_toast, show_toast } from 'src/actions/message';
import cart_management from 'src/utils/api_requests/cartManagement';
import _ from 'lodash';
import { handleSuggestedValue } from './helper';
import { ProductData, Product } from 'src/screens/ProductListing/mock/ProductInterface';
import { Buyer } from 'src/screens/BuyerDashboard/components/BuyerInterface';
import utils from 'src/utils/utils';
import { useTheme } from '@mui/material/styles';
import CustomizeText from 'src/common/CommonCustomizationComp/CustomizeText';

interface CartProduct {
	id: string | number;
	parent_id: string;
	quantity: number;
}
export interface CartWithoutRedux {
	id: string;
	products: {
		[key: string]: any;
	};
	products_details: ProductData;
}

export interface ButtonGroupProps extends MuiButtonGroupProps {
	min: number;
	max: number;
	step?: number;
	isTonalButton?: boolean;
	product_id?: any;
	parent_id?: string;
	product?: any;
	handle_count?: any;
	inputStyle?: any;
	containerStyle?: any;
	is_responsive?: any;
	from_max?: string;
	disabled: boolean;
	cart: any;
	buyer?: Buyer;
	set_cart: any;
	cart_item_key?: any;
	is_customization_required?: boolean;
	handle_customization?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	discount_applied?: any;
}

const CounterWithoutRedux = ({
	min,
	max,
	step = 1,
	isTonalButton = true,
	product_id,
	handle_count,
	parent_id,
	product,
	containerStyle,
	inputStyle,
	is_responsive,
	from_max,
	disabled,
	cart,
	cart_item_key,
	// buyer,
	set_cart,
	handle_customization = () => {},
	is_customization_required = false,
	discount_applied,
}: ButtonGroupProps) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [count, set_count] = useState<number>(cart?.products[product_id ?? product?.id]?.[cart_item_key]?.quantity || 0);
	const [error, setError] = useState<boolean>(false);
	const [tempCount, setTempCount] = useState<number>(count);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [suggestedQuantity, setSuggestedQuantity] = useState<number>(0);
	const [inputValue, setInputValue] = useState<any>(count);
	const product_total_quantity: number = (utils.get_cart_items(product_id, cart) as number) - count;
	const theme: any = useTheme();

	const validateProductCount = (productCount: number): boolean => {
		const temp_count = productCount + product_total_quantity;
		let suggest = handleSuggestedValue(temp_count, min, max, step).suggestCount - product_total_quantity;
		if (temp_count !== 0 && temp_count < min) {
			setError(true);
			setErrorMessage(t('Counter.Error.MinimumQuantity', { min }));
			setSuggestedQuantity(min);
			return true;
		} else if (max < min) {
			setError(true);
			setErrorMessage(t('Counter.Error.MinimumQuantity', { min }));
			setSuggestedQuantity(min);
			return true;
		} else if (temp_count !== 0 && temp_count > max) {
			setError(true);
			setErrorMessage(t('Counter.Error.MaximumQuantity', { from_max, max }));
			setSuggestedQuantity(suggest);
			return true;
		} else if (temp_count !== 0 && (temp_count - min) % step !== 0) {
			setError(true);
			const suggestedFormat = `${suggest - step} ${suggest} ${suggest + step <= max ? suggest + step : ''}`;
			setErrorMessage(t('Counter.Error.NotValidQuantity', { suggestedFormat }));
			setSuggestedQuantity(suggest > max ? suggest - step : suggest);
			return true;
		} else {
			setError(false);
			setErrorMessage('');
			return false;
		}
	};
	const update_cart_store = async (_count: number, is_remove: boolean = false) => {
		if (handle_count) {
			handle_count(_count);
		}
		let updated_cart: { [productId: string]: CartProduct } = { ...cart?.products };
		let cart_item_details: { [productId: string]: Product } = { ...cart?.products_details };
		const { id: cart_id } = cart;

		if (is_remove) {
			try {
				await cart_management.remove_items({ cart_id, product_ids: [], cart_item_ids: [cart_item_key] || [] });
				delete updated_cart[product_id];

				// TODO: update the local cart

				// dispatch(removeProductFromCart(updated_cart));
				if (updated_cart.hasOwnProperty(product_id)) {
					delete updated_cart[product_id];
					delete cart_item_details[product_id];
					// dispatch(removeProductDetails(cart.products_details));
				}
				set_cart({ id: cart_id, products: updated_cart, products_details: cart_item_details });
			} catch {
				console.error('unable to remove item');
			}
		} else {
			try {
				let response: any;
				if (cart_item_key) {
					response = await cart_management.update_item({
						cart_id,
						product_id,
						quantity: _count,
						cart_item_id: cart_item_key,
						discount_campaign_id: discount_applied?.id,
					});
				} else {
					response = await cart_management.update_item({
						cart_id,
						product_id,
						quantity: _count,
						discount_campaign_id: discount_applied?.id,
					});
				}
				if (!updated_cart.hasOwnProperty(product_id)) {
					// TODO: add product in the cart (Product Details) Redundant for us
					// dispatch(addProductDetails({ [product_id]: product }));
					cart_item_details = { ...cart_item_details, [product_id]: product };
				}
				updated_cart = {
					...updated_cart,
					[response.product_id]: {
						[response.id]: {
							quantity: _count,
							meta: response?.meta,
							discount_type: response?.discount_type,
							discount_value: response?.discount_value,
							discount_campaign_id: discount_applied?.id,
						},
					},
				};
				set_count(_count);
				// TODO: update the local cart
				// updated_cart[product_id] = { id: product_id, quantity: updated_cart[product_id].quantity, parent_id };
				// dispatch(updateCart({ id: product_id, quantity: updated_cart[product_id].quantity, parent_id }));
				set_cart({ id: cart_id, products: updated_cart, products_details: cart_item_details });
			} catch {
				console.error('unable update quantity');
			}
		}
	};
	const handleToastMessage = () => {
		dispatch<any>(
			show_toast({
				open: true,
				showCross: false,
				anchorOrigin: {
					vertical: types.VERTICAL_TOP,
					horizontal: types.HORIZONTAL_CENTER,
				},
				autoHideDuration: 3000,
				// eslint-disable-next-line @typescript-eslint/no-shadow
				onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
					console.log(event);
					if (reason === types.REASON_CLICK) {
						return;
					}
					dispatch(close_toast(types.ERROR_STATE));
				},
				state: t('Counter.ErrorToast.Status'),
				title: t('Counter.ErrorToast.Title'),
				subtitle: t('Counter.ErrorToast.Subtitle'),
				showActions: false,
			}),
		);
	};
	const incrementCounter = (event: any) => {
		event.stopPropagation();
		if (disabled) return;
		let updated_count = count;

		if (count === max) {
			setError(true);
			validateProductCount(count);
			handleToastMessage();
			return;
		}
		if (count >= min) {
			updated_count += step;
		} else {
			updated_count += min;
		}
		const errors = validateProductCount(updated_count);

		if (!errors) {
			update_cart_store(updated_count);
		}
	};
	const decrementCounter = (event: any) => {
		event.stopPropagation();
		let newCount = count === min ? 0 : count - step;
		validateProductCount(newCount);

		if (newCount === 0) {
			if (cart?.products[product_id ?? product?.id]?.[cart_item_key]?.discount_type) {
				update_cart_store(min, true);
			} else {
				update_cart_store(0, true);
			}
		} else {
			update_cart_store(newCount);
		}
	};
	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === '-' || event.key === 'Minus' || event.key === '.' || event.key === 'Decimal') {
			event.preventDefault();
		}
	};
	const handle_input = (event: any) => {
		const value = event.target.value;
		// Check for e, E, or negative sign
		if (value.includes('e') || value.includes('E') || value.includes('-')) {
			event.preventDefault(); // This prevents the input from changing its value
		}
	};
	const onValueChange = (event: any) => {
		event.stopPropagation();
		// eslint-disable-next-line @typescript-eslint/no-shadow
		const inputValue = event.target.value;

		// Check if the input value is an integer and positive
		const newTempCount = _.parseInt(inputValue);
		if (Number.isInteger(newTempCount) && newTempCount >= 0) {
			if (cart?.products[product_id ?? product?.id]?.[cart_item_key]?.discount_type && newTempCount === 0) {
				setInputValue(min);
				setError(false);
				validateProductCount(min);
				setTempCount(min);
			} else {
				setInputValue(newTempCount);
				setError(false);
				validateProductCount(newTempCount);
				setTempCount(newTempCount);
			}
		} else {
			setInputValue(undefined);
			if (cart?.products[product_id ?? product?.id]?.[cart_item_key]?.discount_type) {
				setTempCount(min);
			} else {
				setTempCount(0);
			}
			setError(false);
			// setErrorMessage(t('Counter.Error.InvalidQuantity'));
		}
	};

	const handle_close_modal = () => {
		setModalOpen(false);
		validateProductCount(count);
	};
	const handleDoneClick = () => {
		if (!error) {
			if (tempCount === 0) {
				update_cart_store(0, true);
			} else {
				update_cart_store(tempCount);
			}
			set_count(tempCount); // Update the count value
			setModalOpen(false);
		}
	};
	const handle_select_suggested = () => {
		setTempCount(suggestedQuantity);
		setInputValue(suggestedQuantity); // Update inputValue when suggested value is selected
		setError(false);
	};
	const helper_error_message = () => {
		return <Grid sx={{ fontSize: '14px' }}>{errorMessage}</Grid>;
	};
	useEffect(() => {
		validateProductCount(tempCount);
	}, [suggestedQuantity, tempCount]);
	useEffect(() => {
		set_count(cart?.products[product_id ?? product?.id]?.[cart_item_key]?.quantity || 0);
	}, [cart?.products[product_id ?? product?.id]?.[cart_item_key]?.quantity]);

	const handle_add_to_cart = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (is_customization_required && handle_customization) {
			handle_customization(event);
			return;
		}
		incrementCounter(event);
	};

	return (
		<>
			{count === 0 ? (
				<Button
					id={`add_to_cart_${product?.id}`}
					sx={{
						height: '40px',
						boxShadow: 'none',
						color: disabled ? theme?.product?.counter?.disabled_color : '',
						background: disabled ? theme?.product?.counter?.disabled_background : theme?.product?.counter?.background,
						'&:hover': {
							background: disabled
								? theme?.product?.counter?.disabled_background
								: theme?.product?.counter?.hover_background || theme?.product?.counter?.background,
							color: disabled ? theme?.product?.counter?.disabled_color : theme?.product?.counter?.hover_color || '',
						},
						...theme?.product_details?.product_info_container?.add_to_cart_button,
					}}
					onClick={!disabled ? handle_add_to_cart : () => {}}
					fullWidth
					disabled={disabled}
					disableRipple={disabled}
					disableTouchRipple={disabled}
					tonal={isTonalButton}>
					<Grid>
						Add to cart
						{is_customization_required && <CustomizeText />}
					</Grid>{' '}
				</Button>
			) : (
				<Grid
					id={`counter_${product?.id}`}
					container
					style={{
						...containerStyle,
						whiteSpace: 'nowrap',
						display: 'flex', // Use flex display
					}}
					alignItems='center'
					wrap='nowrap'>
					<Icon
						color='primary'
						iconName='IconMinus'
						fontSize='small'
						onClick={decrementCounter}
						sx={{
							border: 'none',
							width: '20px',
							height: '20px',
							padding: '7px',
							borderRadius: '50px',
							marginRight: '6px',
							cursor: 'pointer',
							...theme?.product?.counter?.decrement_icon,
						}}
					/>
					<Grid
						item
						alignItems='center'
						xl={is_responsive ? 8 : undefined}
						lg={is_responsive ? 6 : undefined}
						md={is_responsive ? 4 : undefined}
						sm={is_responsive ? 4 : undefined}
						xs={is_responsive ? 4 : undefined}
						style={{
							flex: '1', // Let this item grow as needed
						}}>
						<input
							id={'counter-input'}
							readOnly={true}
							style={{
								outline: 'none',
								fontSize: '16px',
								fontWeight: 700,
								height: '34px',
								borderRadius: '10px',
								width: '100%', // Use 100% width
								flexBasis: '50%',
								cursor: 'pointer',
								textAlign: 'center',
								...inputStyle,
								...theme?.product?.counter?.input,
							}}
							type='number'
							value={count}
							onClick={() => {
								if (disabled) {
								} else {
									setInputValue(count);
									setTempCount(count);
									setModalOpen(true);
								}
							}}
						/>
					</Grid>
					<Icon
						color={error ? theme?.product?.counter?.increment_icon?.error_style?.color : 'primary'}
						iconName='IconPlus'
						fontSize='small'
						sx={{
							border: 'none',
							background:
								error || disabled
									? theme?.product?.counter?.increment_icon?.error_style?.background
									: theme?.product?.counter?.increment_icon?.style?.background,
							color: theme?.product?.counter?.increment_icon?.style?.color,
							width: '20px',
							height: '20px',
							padding: '7px',
							borderRadius: '50px',
							marginLeft: '6px',
							cursor: 'pointer',
						}}
						onClick={incrementCounter}
					/>
				</Grid>
			)}

			<Modal
				open={modalOpen}
				onClose={handle_close_modal}
				title={t('Counter.ModalTitle')}
				footer={
					<Grid container justifyContent='end'>
						<Button variant='outlined' onClick={handle_close_modal} sx={{ marginRight: '1rem' }}>
							{t('Counter.ModalCancelButton')}
						</Button>
						<Button onClick={handleDoneClick} disabled={error}>
							{t('Counter.ModalDoneButton')}
						</Button>
					</Grid>
				}
				children={
					<>
						<TextField
							onChange={onValueChange}
							value={inputValue}
							onInput={(event) => handle_input(event)}
							onKeyDown={handleKeyDown}
							onWheel={(event) => event.target.blur()} // Prevent scroll behavior
							error={Boolean(error)}
							helperText={helper_error_message()}
							type='number'
							label={''}
							variant='outlined'
							fullWidth
						/>
						{error && (
							<Grid
								container
								direction='row'
								alignItems='center'
								width='21rem'
								height='4rem'
								sx={{
									borderRadius: '1.2rem',
									gap: '8px',
									padding: '7px 18px 7px 12px',
									cursor: 'pointer',
									...theme?.product?.counter?.error_style,
								}}
								onClick={handle_select_suggested}>
								<Grid item>
									<Icon iconName='IconBulb' sx={{ width: '18px', height: '18px' }} />
								</Grid>
								<Grid item>
									<p style={{ fontSize: '12px', fontWeight: 500, color: theme?.product?.counter?.suggested_value?.color }}>
										{t('Counter.Suggested', { suggestedQuantity })}
									</p>
								</Grid>
							</Grid>
						)}
					</>
				}
			/>
		</>
	);
};

CounterWithoutRedux.defaultProps = {
	value: '',
	initialCount: 0,
	step: 1,
	isTonalButton: true,
	isBtnDisableOnMin: false,
	hasVariant: false,
	handleVariant: () => {},
	error: false,
	disableIncrement: false,
	is_responsive: false,
};

export default CounterWithoutRedux;
