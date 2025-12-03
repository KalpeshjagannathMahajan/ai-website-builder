import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '../Grid';
import Modal from '../Modal';
import Icon from '../Icon/Icon';
import Button from '../Button/Button';
import { ButtonGroupProps as MuiButtonGroupProps, TextField } from '@mui/material';
import { addProductDetails, removeProductDetails, removeProductFromCart, updateCart } from 'src/actions/cart';
import types from 'src/utils/types';
import { close_toast, show_toast } from 'src/actions/message';
import cart_management from 'src/utils/api_requests/cartManagement';
import _ from 'lodash';
import { handleSuggestedValue } from './helper';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import { get_unit_price_of_product } from 'src/utils/common';
import CustomizeText from 'src/common/CommonCustomizationComp/CustomizeText';
import { Mixpanel } from 'src/mixpanel';
import utils, { get_cart_metadata, get_customer_metadata, get_product_metadata } from 'src/utils/utils';
import Events from 'src/utils/events_constants';

export interface ButtonGroupProps extends MuiButtonGroupProps {
	min: number;
	max: number;
	cart_item_key?: any;
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
	show_delete_icon?: boolean;
	default_order_quantity?: number;
	volume_tiers?: any;
	className?: any;
	set_price?: any;
	is_capitalize?: boolean;
	is_customization_required?: boolean;
	handle_customization?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	page_name?: any;
	section_name?: any;
	discount_applied?: any;
}

const Counter = ({
	min,
	max,
	step = 1,
	isTonalButton = true,
	product_id,
	handle_count,
	parent_id,
	product,
	cart_item_key,
	containerStyle,
	inputStyle,
	is_responsive,
	from_max,
	disabled,
	show_delete_icon = true,
	default_order_quantity = 0,
	volume_tiers = [],
	className,
	is_capitalize = false,
	set_price,
	handle_customization = () => {},
	is_customization_required = false,
	page_name,
	section_name,
	discount_applied,
}: ButtonGroupProps) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const cart = useSelector((state: any) => state.cart);
	const buyer = useSelector((state: any) => state.buyer);
	const login = useSelector((state: any) => state.login);
	const is_logged_in = login?.status?.loggedIn;
	const [dec_disable, set_dec_disable] = useState(disabled);
	const [count, set_count] = useState<number>(cart?.products[product_id ?? product?.id]?.[cart_item_key]?.quantity || 0);
	const [error, setError] = useState<boolean>(false);
	const [tempCount, setTempCount] = useState<number>(count);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [suggestedQuantity, setSuggestedQuantity] = useState<number>(0);
	const [inputValue, setInputValue] = useState<any>(count);
	const product_total_quantity: number = (utils.get_cart_items(product_id, cart) as number) - count;
	const theme: any = useTheme();
	const navigate = useNavigate();
	const moq_break_enabled = _.get(
		useSelector((state: any) => state?.settings),
		'moq_break_enabled',
		false,
	);

	const customer_metadata = get_customer_metadata({ is_loggedin: true });

	const validateProductCount = (productCount: number): boolean => {
		const temp_count = productCount + product_total_quantity;
		let suggest = _.get(handleSuggestedValue(temp_count, min, max, step), 'suggestCount', 0) - product_total_quantity;
		const volume_suggest = utils.get_inc_acc_volume_tiers(min, default_order_quantity, max, volume_tiers, false);
		if (temp_count !== 0 && temp_count < min && !moq_break_enabled) {
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
			if (_.isEmpty(volume_tiers)) setSuggestedQuantity(suggest);
			else setSuggestedQuantity(volume_suggest);
			return true;
		} else if (_.isEmpty(volume_tiers) && temp_count !== 0 && (temp_count - min) % step !== 0 && !moq_break_enabled) {
			setError(true);
			// const suggestedFormat = `${suggest - step} ${suggest} ${suggest + step <= max ? suggest + step : ''}`;
			setErrorMessage(t('Counter.Error.InvalidQuantity'));
			setSuggestedQuantity(suggest > max ? suggest - step : suggest);
			return true;
		} else if (_.isEmpty(volume_tiers)) {
			setError(false);
			setErrorMessage('');
			return false;
		}
	};

	const update_cart_store = async (_count: number, is_remove: boolean = false) => {
		if (handle_count) {
			handle_count(_count);
		}
		let updated_cart: { [productId: string]: any } = { ...cart?.products };
		const cart_id = _.get(buyer?.buyer_cart, 'id', '') || buyer?.buyer_cart?.data?.[0]?.id;
		if (is_remove) {
			try {
				await cart_management.remove_items({ cart_id, product_ids: [], cart_item_ids: [cart_item_key] || [] });
				dispatch(removeProductFromCart({ product_id, cart_item_key }));
				if (updated_cart.hasOwnProperty(product_id)) {
					delete updated_cart[product_id];
					dispatch(removeProductDetails(cart?.products_details));
				}
				set_dec_disable(true);
			} catch {
				console.error('unable to remove item');
			}
		} else {
			try {
				let response: any;
				if (cart_item_key) {
					response = await cart_management.update_item({
						cart_id,
						product_id: product_id ?? product?.id,
						quantity: _count,
						cart_item_id: cart_item_key,
						is_custom_product: false,
						discount_campaign_id: discount_applied?.id,
					});
				} else {
					response = await cart_management.update_item({
						cart_id,
						product_id: product_id ?? product?.id,
						quantity: _count,
						is_custom_product: false,
						discount_campaign_id: discount_applied?.id,
					});
				}

				if (!updated_cart.hasOwnProperty(product_id)) {
					dispatch(addProductDetails({ [product_id]: product }));
				}
				updated_cart = {
					...updated_cart,
					[response.product_id]: {
						[response.id]: {
							quantity: _count,
							meta: response?.meta,
							discount_campaign_id: discount_applied?.id,
							discount_type: response?.discount_type,
							discount_value: response?.discount_value,
							is_custom_product: response?.is_custom_item ?? false,
						},
					},
				};
				set_count(_count);
				dispatch(
					updateCart({
						id: product_id || product?.id,
						quantity: _count,
						parent_id,
						discount_campaign_id: discount_applied?.id,
						cart_item_id: cart_item_key || null,
						cart_item: updated_cart?.[product_id || product?.id],
					}),
				);

				return updated_cart;
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
	const handleWarningToastMessage = () => {
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
				state: t('Counter.WarningToast.Status'),
				title: t('Counter.WarningToast.Title'),
				subtitle: t('Counter.WarningToast.Subtitle'),
				showActions: false,
			}),
		);
	};

	const handleToastMessageForInvalid = () => {
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
				state: t('Counter.ErrorToastInvalid.Status'),
				title: t('Counter.ErrorToastInvalid.Title'),
				subtitle: t('Counter.ErrorToastInvalid.Subtitle'),
				showActions: false,
			}),
		);
	};

	const increment_counter = async (event: any) => {
		event.stopPropagation();
		if (disabled) return;
		let updated_count = count;

		if (max < min) {
			setError(true);
			setErrorMessage(t('Counter.Error.MinimumQuantity', { min }));
			handleToastMessageForInvalid();
			return;
		}
		if (count + product_total_quantity === max) {
			setError(true);
			validateProductCount(count);
			handleToastMessage();
			return;
		}

		if (!_.isEmpty(volume_tiers)) {
			updated_count = utils.get_inc_acc_volume_tiers(min, default_order_quantity, count, volume_tiers, count !== 0);
		} else {
			updated_count = utils.get_closest_increment(min, step, count, default_order_quantity);
		}

		const errors = validateProductCount(updated_count);
		let cart_metadata = get_cart_metadata();
		if (errors && updated_count + product_total_quantity > max) {
			handleWarningToastMessage();
		}
		if (!errors) {
			const updated_cart = await update_cart_store(updated_count);
			cart_metadata = get_cart_metadata(_.size(updated_cart));
		}

		const product_metadata = get_product_metadata(product, updated_count);

		Mixpanel.track(Events.ADD_TO_CART_CLICKED, {
			tab_name: 'Products',
			page_name,
			section_name,
			subtab_name: '',
			customer_metadata,
			cart_metadata,
			product_metadata,
		});
	};

	const get_closest_decrement = (start_value: number, increment_value: number, value: number) => {
		if ((value - start_value) % increment_value === 0) return value - increment_value;

		let current_value = start_value;
		while (current_value + increment_value < value) {
			current_value += increment_value;
		}
		return current_value;
	};

	const decrement_counter = (event: any) => {
		event.stopPropagation();
		let newCount = count === min ? 0 : count - step;
		validateProductCount(newCount);

		if (newCount === 0) {
			if (cart?.products[product_id ?? product?.id]?.[cart_item_key]?.discount_type) {
				update_cart_store(min, true);
			} else {
				update_cart_store(0, true);
			}
		} else if (!_.isEmpty(volume_tiers)) {
			const quantity = utils.get_dec_acc_volume_tiers(min, count, volume_tiers);
			update_cart_store(quantity);
		} else {
			newCount = get_closest_decrement(min, step, count);
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

	const on_value_change = (event: any) => {
		event.stopPropagation();
		// eslint-disable-next-line @typescript-eslint/no-shadow
		const inputValue = event.target.value;

		// Check if the input value is an integer and positive
		const newTempCount = _.isEmpty(inputValue) ? 0 : _.parseInt(inputValue);

		if (newTempCount === 0) {
			setInputValue(newTempCount);
			setTempCount(newTempCount);
			setErrorMessage('');
			setError(false);
		}

		if (!_.isEmpty(volume_tiers) && !moq_break_enabled) {
			const current_tier = utils.find_tier(volume_tiers, newTempCount);

			if (!_.isEmpty(current_tier)) {
				const { start_quantity = 0, ioq = 1 } = current_tier;
				const start = start_quantity === 0 ? min : start_quantity;
				const diff = (newTempCount - start) / ioq;

				if (!_.isInteger(diff) || (min > newTempCount && newTempCount !== 0)) {
					// If not an integer, suggest the floor value of is_integer * ioq + start quantity
					const valid_suggested_quantity = Math.floor(diff) * ioq + start;
					const final_valid = Math.max(valid_suggested_quantity, min);

					if (newTempCount !== final_valid) {
						setErrorMessage(t('Counter.Error.InvalidQuantity'));
						setError(true);
						setSuggestedQuantity(final_valid);
					}
				} else {
					setErrorMessage('');
					setError(false);
				}
			}
			setInputValue(newTempCount);
			setTempCount(newTempCount);

			return;
		}

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
	const handleDoneClick = async () => {
		if (!error) {
			let cart_metadata = get_cart_metadata();
			if (tempCount === 0) {
				const updated_cart = await update_cart_store(0, true);
				cart_metadata = get_cart_metadata(_.size(updated_cart));
			} else {
				const updated_cart = await update_cart_store(tempCount);
				cart_metadata = get_cart_metadata(_.size(updated_cart));
			}
			set_count(tempCount); // Update the count value
			const product_metadata = get_product_metadata(product, tempCount);
			Mixpanel.track(Events.ADD_TO_CART_CLICKED, {
				tab_name: 'Products',
				page_name,
				section_name,
				subtab_name: '',
				customer_metadata,
				cart_metadata,
				product_metadata,
			});
			setModalOpen(false);
		}
	};
	const handle_select_suggested = () => {
		setTempCount(suggestedQuantity);
		setInputValue(suggestedQuantity); // Update inputValue when suggested value is selected
		setError(false);
		setErrorMessage('');
	};
	const helper_error_message = () => {
		return <Grid sx={{ fontSize: '14px' }}>{errorMessage}</Grid>;
	};
	useEffect(() => {
		validateProductCount(tempCount);
		set_dec_disable(disabled);
	}, [suggestedQuantity, tempCount]);

	useEffect(() => {
		const result = get_unit_price_of_product({ ...product, quantity: count });
		set_price && set_price(result?.unit_price ?? 0);
	}, [count]);

	useEffect(() => {
		set_count(cart?.products?.[product_id ?? product?.id]?.[cart_item_key]?.quantity || 0);
		set_dec_disable(disabled);
	}, [cart?.products[product_id ?? product?.id]?.[cart_item_key]?.quantity]);

	const handle_add_to_cart = (event: React.MouseEvent<HTMLButtonElement>) => {
		const wizshop_settings: any = localStorage.getItem('wizshop_settings');
		const pre_login_settings = JSON.parse(wizshop_settings);

		if (!is_logged_in && pre_login_settings?.prelogin_price) {
			navigate(RouteNames.user_login.path);
			return;
		}

		if (is_customization_required && handle_customization) {
			handle_customization(event);
			return;
		}
		increment_counter(event);
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
						textTransform: is_capitalize ? theme?.product_details?.product_info_container?.add_to_cart_button?.textTransform : '',
					}}
					onClick={!disabled ? handle_add_to_cart : () => {}}
					fullWidth
					disabled={disabled}
					disableRipple={disabled}
					disableTouchRipple={disabled}
					tonal={isTonalButton}
					className={className}>
					<Grid>
						Add to cart
						{is_customization_required && <CustomizeText />}
					</Grid>
				</Button>
			) : (
				<Grid
					container
					id={`counter_${product?.id}`}
					style={{
						...containerStyle,
						whiteSpace: 'nowrap',
						display: 'flex', // Use flex display
					}}
					alignItems='center'
					wrap='nowrap'>
					<Icon
						color='primary'
						iconName={min >= count && show_delete_icon ? 'IconTrash' : 'IconMinus'}
						fontSize='small'
						onClick={dec_disable ? () => {} : decrement_counter}
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
						onClick={increment_counter}
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
							onChange={on_value_change}
							value={inputValue}
							onInput={(event) => handle_input(event)}
							onKeyDown={handleKeyDown}
							onWheel={(event: any) => event?.target?.blur()} // Prevent scroll behavior
							error={Boolean(error)}
							helperText={helper_error_message()}
							type='number'
							label={''}
							variant='outlined'
							fullWidth
							sx={{
								'& .MuiOutlinedInput-root': {
									...theme?.form_elements_,
								},
							}}
							autoFocus
							onFocus={(event) => event?.target?.select()}
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

Counter.defaultProps = {
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

export default Counter;
