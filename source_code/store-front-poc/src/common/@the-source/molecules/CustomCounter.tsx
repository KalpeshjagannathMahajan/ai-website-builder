import { useEffect, useState } from 'react';
import { Grid, Icon } from '../atoms';
import { handle_field_validations } from 'src/screens/CustomProduct/helper';
import { makeStyles } from '@mui/styles';
import _ from 'lodash';
import { useTheme } from '@mui/material/styles';

export interface custom_counter {
	min: number;
	label?: string;
	onChange: any;
	id?: string;
	max: number;
	is_mandatory: boolean;
	handleError?: any;
	defaultValue?: number;
}

const useStyles = makeStyles((theme: any) => ({
	container_with_label: {
		...theme?.product?.custom_product_drawer?.custom_counter?.container_with_label_input,
	},
	label_input: {
		outline: 'none',
		fontSize: '16px',
		fontWeight: 700,
		height: '34px',
		borderRadius: '10px',
		width: '100%',
		cursor: 'pointer',
		border: 'none',
		textAlign: 'center',
		padding: '0 !important',
	},
	container: {
		whiteSpace: 'nowrap',
		display: 'flex',
		width: 'fit-content',
	},
	increment_icon: {
		border: 'none',
		width: '20px',
		height: '20px',
		padding: '7px',
		borderRadius: '50px',
		marginRight: '6px',
	},
	input: {
		outline: 'none',
		fontSize: '16px',
		fontWeight: 700,
		height: '34px',
		borderRadius: '10px',
		width: '100%',
		cursor: 'pointer',
		textAlign: 'center',
	},
	decrement_icon: {
		border: 'none',
		width: '20px',
		height: '20px',
		padding: '7px',
		borderRadius: '50px',
		marginLeft: '6px',
		cursor: 'pointer',
	},
	increment: {
		border: 'none',
		color: 'white',
		width: '20px',
		height: '20px',
		padding: '7px',
		borderRadius: '50px',
		marginLeft: '6px',
		cursor: 'pointer',
	},
}));

const CustomCounter = ({ min, label, onChange, id, max, is_mandatory, handleError, defaultValue }: custom_counter) => {
	const styles = useStyles();
	const [count, set_count] = useState<number>(id ? 0 : defaultValue ?? 1);
	const [error, setError] = useState<string>('');
	const theme: any = useTheme();
	const error_style_color = theme?.product?.custom_product_drawer?.custom_counter?.error_style_color;

	useEffect(() => {
		if (defaultValue) set_count(defaultValue);
	}, [defaultValue]);

	const incrementCounter = (event: any) => {
		event.stopPropagation();
		if (count === 0 && min) {
			if (is_mandatory) {
				set_count(1);
			} else {
				set_count(min);
			}
		} else if (max && count + 1 > max) {
			setError('inc');
		} else if (max && count + 1 === max) {
			set_count(count + 1);
			setError('inc');
		} else {
			setError('');
			set_count(count + 1);
		}
	};

	const decrementCounter = (event: any) => {
		event.stopPropagation();
		if (count === min) {
			set_count(id ? 0 : 1);
			setError('dec');
		} else if (count - 1 < min) {
			setError('dec');
		} else if (count - 1 === min) {
			set_count(count - 1);
			setError('dec');
		} else {
			setError('');
			set_count(count - 1);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === '-' || event.key === 'Minus' || event.key === '.' || event.key === 'Decimal') {
			event.preventDefault();
		}
	};
	const handleChange = (event: any) => {
		const value = event.target.value;
		// Check for e, E, or negative sign
		if (value?.includes('e') || value?.includes('E') || value?.includes('-')) {
			event.preventDefault(); // This prevents the input from changing its value
		}
		const updated_val = Number(value);
		if (!id && value && value > 0) {
			set_count(_.isNumber(updated_val) ? updated_val : 1);
		}
	};

	const handleInput = (event: any) => {
		const value = event.target.value;
		const updated_val = Number(value);
		if (value.length === 0) {
			set_count(0);
		} else if (value.length > 0 && value > 0) {
			set_count(_.isNumber(updated_val) ? updated_val : 1);
		}
	};

	useEffect(() => {
		if (id) {
			onChange({ [id]: count });
		} else {
			onChange(count);
		}

		const error_json = handle_field_validations(count, is_mandatory, min, max);
		if (typeof handleError === 'function') {
			if (id) {
				handleError({ [id]: error_json });
			}
		}
		setError(error_json?.valid ? '' : 'err');
	}, [count]);

	return (
		<>
			{label ? (
				<Grid
					container
					className={styles.container_with_label}
					sx={{
						...theme?.product?.custom_product_drawer?.custom_counter?.container_with_label,
					}}>
					<Icon
						iconName='IconMinus'
						color={error === 'dec' || error === 'err' ? error_style_color?.primary : error_style_color?.secondary}
						fontSize='small'
						onClick={decrementCounter}
						sx={{ cursor: error === 'dec' ? 'default' : 'pointer' }}
					/>
					<Grid item alignItems='center' sx={{ width: '100px' }}>
						<input
							type='number'
							value={count}
							className={styles.label_input}
							onChange={(e: any) => handleInput(e)}
							style={{
								...theme?.product?.custom_product_drawer?.custom_counter?.label_input,
							}}
						/>
					</Grid>
					<Icon
						color={error === 'inc' ? error_style_color?.primary : error_style_color?.secondary}
						iconName='IconPlus'
						fontSize='small'
						onClick={incrementCounter}
						sx={{ cursor: error === 'inc' ? 'default' : 'pointer' }}
					/>
				</Grid>
			) : (
				<Grid container className={styles.container} alignItems='center' wrap='nowrap'>
					<Icon
						iconName='IconMinus'
						fontSize='small'
						onClick={decrementCounter}
						className={styles.increment_icon}
						sx={{
							background: count === min ? error_style_color?.grey : error === 'dec' ? error_style_color?.grey : error_style_color?.tertiary,
							color: count === min ? error_style_color?.light : error === 'dec' ? error_style_color?.light : error_style_color?.dark_blue,
							cursor: count === min || error === 'dec' ? 'default' : 'pointer',
						}}
					/>
					<Grid item alignItems='center' sx={{ width: '100px' }}>
						<input
							id={'counter-input'}
							style={{
								...theme?.product?.counter?.input,
							}}
							type='number'
							value={count}
							onChange={(e: any) => handleChange(e)}
							onKeyDown={handleKeyDown}
							className={styles.input}
						/>
					</Grid>
					<Icon
						iconName='IconPlus'
						fontSize='small'
						onClick={incrementCounter}
						className={styles.increment}
						sx={{
							background:
								error === 'inc'
									? theme?.product?.custom_product_drawer?.custom_counter?.error_style_color?.light_grey
									: theme?.product?.custom_product_drawer?.custom_counter?.error_style_color?.default,
							cursor: error === 'inc' ? 'default' : 'pointer',
						}}
					/>
				</Grid>
			)}
		</>
	);
};

export default CustomCounter;
