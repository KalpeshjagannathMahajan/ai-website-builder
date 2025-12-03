import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid, Icon, Modal } from 'src/common/@the-source/atoms';
import { TextField } from '@mui/material';
import { get_entity_error } from '../helper';
import utils from 'src/utils/utils';
import { get_max_quantity } from 'src/screens/ProductListing/utils';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

interface InputModalProps {
	error: any;
	modalOpen: any;
	handle_close_modal: any;
	onDone: any;
	quantity: number;
	product: any;
	current_product_reserved: any;
	product_total_quantity: any;
	is_discount_applied: boolean;
}
const InputModal = ({
	// error,
	modalOpen,
	handle_close_modal,
	onDone,
	quantity,
	product,
	current_product_reserved,
	product_total_quantity,
	is_discount_applied,
}: InputModalProps) => {
	const { t } = useTranslation();
	const [count, set_count] = useState<Number>(quantity || 0);
	const [err, set_err] = useState<any>({});
	const [suggested, set_suggested] = useState(0);
	const pricing = _.get(product, 'pricing', {});
	const volume_tiers = _.get(pricing, 'volume_tiers', []);
	const min = _.get(pricing, 'min_order_quantity', 0);
	const default_order_quantity = _.get(pricing, 'default_order_quantity', 0);
	const theme: any = useTheme();
	const moq_break_enabled = _.get(
		useSelector((state: any) => state?.settings),
		'moq_break_enabled',
		false,
	);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === '-' || event.key === 'Minus' || event.key === '.' || event.key === 'Decimal') {
			event.preventDefault();
		}
	};
	const handle_input = (event: any) => {
		const value = event.target.value;
		if (value?.includes('e') || value?.includes('E') || value?.includes('-')) {
			event.preventDefault();
		}
	};

	const onValueChange = (event: any) => {
		event.stopPropagation();
		const inputValue = event.target.value;
		const newTempCount = _.isEmpty(inputValue) ? 0 : _.parseInt(inputValue);
		let _error;

		if (newTempCount === 0) {
			set_count(0);
			set_err({ message: '', is_error: false });
		}

		if (Number.isInteger(newTempCount) && newTempCount >= 0) {
			if (product?.discount_type && newTempCount === 0) {
				_error = get_entity_error(
					product,
					min,
					product_total_quantity,
					current_product_reserved,
					0,
					product?.is_custom_product,
					moq_break_enabled,
					_.isEmpty(volume_tiers),
					is_discount_applied,
				);
				set_count(min);
			} else {
				_error = get_entity_error(
					product,
					newTempCount,
					product_total_quantity,
					current_product_reserved,
					0,
					product?.is_custom_product,
					moq_break_enabled,
					_.isEmpty(volume_tiers),
					is_discount_applied,
				);
				set_count(newTempCount);
			}
		}

		if (_error?.id === 4) {
			const max = get_max_quantity(product, current_product_reserved, product?.is_custom_product);
			const valid_value = utils.get_inc_acc_volume_tiers(min, default_order_quantity, max || 0, volume_tiers, false);
			set_err({ ..._error, suggest: valid_value });
		} else set_err(_error);

		if (!_.isEmpty(volume_tiers) && !_error?.is_error && !moq_break_enabled) {
			const current_tier = utils.find_tier(volume_tiers, newTempCount);

			if (!_.isEmpty(current_tier)) {
				const { start_quantity = 0, ioq = 1 } = current_tier;
				const start = start_quantity === 0 ? min : start_quantity;
				const diff = (newTempCount - start) / ioq;

				if (!_.isInteger(diff) || (min > newTempCount && newTempCount !== 0)) {
					// If not an integer, suggest the floor value of is_integer * ioq + start quantity
					const valid_suggested_quantity = Math.floor(diff) * ioq + start;
					const final_valid = Math.max(valid_suggested_quantity, min);

					if (newTempCount !== final_valid) set_err({ message: t('Counter.Error.InvalidQuantity'), is_error: true, suggest: final_valid });
				} else {
					set_err({ message: '', is_error: false });
				}
			}
			set_count(newTempCount);
		}
	};

	const helper_error_message = () => {
		return <Grid sx={{ fontSize: '14px', color: 'red' }}>{err?.message}</Grid>;
	};

	const handle_select_suggested = () => {
		set_count(suggested);
		set_err(
			get_entity_error(
				product,
				suggested,
				product_total_quantity,
				current_product_reserved,
				0,
				product?.is_custom_product,
				moq_break_enabled,
				_.isEmpty(volume_tiers),
				is_discount_applied,
			),
		);
		set_suggested(0);
	};

	useEffect(() => {
		set_suggested(err?.suggest);
	}, [err]);

	useEffect(() => {
		set_count(quantity);
	}, [quantity]);

	return (
		<>
			<Modal
				open={modalOpen}
				onClose={handle_close_modal}
				title={t('Counter.ModalTitle')}
				footer={
					<Grid container justifyContent='end'>
						<Button variant='outlined' onClick={handle_close_modal} sx={{ marginRight: '1rem' }}>
							{t('Counter.ModalCancelButton')}
						</Button>
						<Button onClick={(e: any) => onDone({ ...e, target: { value: count } })} disabled={err?.is_error}>
							{t('Counter.ModalDoneButton')}
						</Button>
					</Grid>
				}
				children={
					<>
						<TextField
							onChange={onValueChange}
							value={count}
							onInput={(event) => handle_input(event)}
							onKeyDown={handleKeyDown}
							onWheel={(event: any) => (event?.target as HTMLInputElement).blur()} // Prevent scroll behavior
							// error={Boolean(error)}
							helperText={helper_error_message()}
							type='number'
							label={''}
							variant='outlined'
							fullWidth
							sx={{
								'& .MuiOutlinedInput-root': {
									borderRadius: theme?.form_elements_?.borderRadius,
								},
							}}
							autoFocus
							onFocus={(event) => event?.target?.select()}
						/>
						{err?.is_error && (
							<Grid
								container
								direction='row'
								alignItems='center'
								width='21rem'
								height='4rem'
								sx={{
									borderRadius: '1.2rem',
									gap: '8px',
									color: '#4578C4',
									background: 'rgba(240, 246, 255, 1)',
									padding: '7px 18px 7px 12px',
									cursor: 'pointer',
								}}
								onClick={handle_select_suggested}>
								<Grid item>
									<Icon iconName='IconBulb' sx={{ width: '18px', height: '18px' }} />
								</Grid>
								<Grid item>
									<p style={{ fontSize: '12px', fontWeight: 500, color: '#4578C4' }}>
										{t('Counter.Suggested', { suggestedQuantity: suggested })}
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

export default InputModal;
