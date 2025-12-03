import { ButtonGroup, useTheme } from '@mui/material';
import { Icon, Button } from 'src/common/@the-source/atoms';
import InputModal from './InputModal';
import { useState } from 'react';
import { makeStyles } from '@mui/styles';

const useStyle = makeStyles((theme: any) => ({
	counter_input: {
		outline: 'none',
		fontSize: '16px',
		fontWeight: 700,
		cursor: 'pointer',
		width: '80%',
		border: 'none',
		textAlign: 'center',
	},
	button_group: {
		width: '166px',
		height: '40px',
		background: theme?.cart_summary?.background,
		[theme.breakpoints.down('sm')]: {
			width: '100%',
			minWidth: '145px',
		},
	},
	inc_button: {
		border: 'none',
		width: '10%',
		':hover': { background: theme?.cart_summary?.background, borderRight: 'none' },
	},
}));
const Counter = ({
	disabledDecrement,
	disableIncrement,
	handleIncrement,
	handleDecrement,
	handleBlurQuantity,
	handleSetQuantity,
	quantity,
	error,
	handle_delete_entity,
	moq,
	disabled,
	show_delete_icon = true,
	show_input_modal = true,
	icon_style,
	product,
	current_product_reserved,
	product_total_quantity,
	is_discount_applied,
}: any) => {
	// TODO: change the inline style
	const theme: any = useTheme();
	const classes = useStyle();
	const [open, set_open] = useState<boolean>(false);
	const handle_close_modal = () => {
		set_open(false);
	};

	return (
		<>
			<ButtonGroup
				sx={{ border: error ? '1px solid #D74C10' : '1px solid #B5BBC3', ...theme?.card_ }}
				className={classes.button_group}
				aria-label='small outlined button group'>
				<Button
					// sx={style.inc_button}
					sx={{ ...theme?.order_management?.cart_summary_counter_style }}
					className={classes.inc_button}
					onClick={moq >= quantity && show_delete_icon ? handle_delete_entity : handleDecrement}
					variant='text'
					disabled={disabledDecrement}>
					<Icon
						color={disabledDecrement ? '#B5BBC3' : 'primary'}
						iconName={moq >= quantity && show_delete_icon ? 'IconTrash' : 'IconMinus'}
						fontSize='small'
						sx={icon_style}
					/>
				</Button>

				<input
					className={classes.counter_input}
					style={{
						color: disabled ? 'grey' : theme?.order_management?.cart_counter_style?.color,
					}}
					disabled={disabled}
					value={quantity}
					onBlur={!show_input_modal ? handleBlurQuantity : undefined}
					onChange={!show_input_modal ? handleSetQuantity : undefined}
					onClick={() => show_input_modal && set_open(true)}
				/>

				<Button
					disabled={disableIncrement}
					className={classes.inc_button}
					onClick={handleIncrement}
					sx={{ ...theme?.order_management?.cart_summary_counter_style }}
					variant='text'>
					<Icon sx={icon_style} color={disableIncrement ? '#B5BBC3' : 'primary'} iconName='IconPlus' fontSize='small' />
				</Button>
			</ButtonGroup>
			{show_input_modal && (
				<InputModal
					modalOpen={open}
					handle_close_modal={handle_close_modal}
					quantity={quantity}
					onDone={(e: any) => {
						set_open(false);
						if (e.target.value === 0) handle_delete_entity();
						else handleSetQuantity(e);
					}}
					product={product}
					current_product_reserved={current_product_reserved}
					product_total_quantity={product_total_quantity}
					error={error}
					is_discount_applied={is_discount_applied}
				/>
			)}
		</>
	);
};

export default Counter;
