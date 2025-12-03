import { t } from 'i18next';
import _ from 'lodash';
import { Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import CartCustomize from './CartCustomize';
import { Divider } from '@mui/material';
import { background_colors, custom_stepper_text_color } from 'src/utils/light.theme';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
	container: {
		display: 'flex',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		width: '100%',
		gap: '1rem',
	},
	textWrap: {
		width: 'calc(100% - 50px)',
		textWrap: 'wrap',
		overflow: 'hidden',
	},
	iconContainer: {
		width: '50px',
		cursor: 'pointer',
		display: 'flex',
		justifyContent: 'space-between',
	},
}));

const container_style = {
	background: background_colors.secondary,
	padding: '1rem',
	marginTop: '1rem',
	gap: '1rem',
};

function NoteAndCustomize({
	notesValue,
	product_data,
	set_is_edit_modifiers,
	set_edit_product,
	cart_error,
	show_edit_btn,
	style,
	cart_item_id,
	entity_id,
	set_show_note_modal,
	set_selected_product,
	handle_remove_note,
}: any) {
	const classes = useStyles();

	const check_render = {
		notes: !_.isEmpty(notesValue),
		customize: product_data?.is_custom_product,
	};

	const count = _.filter(check_render, (val) => Boolean(val)).length;

	if (!count) return;

	return (
		<Grid
			container
			sx={{
				...container_style,
				...style,
			}}>
			{check_render.notes && (
				<Grid className={classes.container}>
					<Grid className={classes.textWrap}>
						<CustomText type='Body' color={custom_stepper_text_color?.grey} style={{ lineBreak: 'anywhere' }}>
							<b>{t('CartSummary.ProductCard.Note')}</b> {notesValue}
						</CustomText>
					</Grid>
					{_.isEmpty(cart_error) && show_edit_btn && (
						<Grid className={classes.iconContainer}>
							<Icon
								iconName='IconEdit'
								onClick={() => {
									set_show_note_modal(true);
									set_selected_product(product_data);
								}}
							/>
							<Icon
								iconName='IconTrash'
								onClick={() => {
									handle_remove_note(entity_id, cart_item_id);
								}}
							/>
						</Grid>
					)}
				</Grid>
			)}
			{count === 2 && <Divider />}

			<CartCustomize
				product_data={product_data}
				set_is_edit_modifiers={set_is_edit_modifiers}
				set_edit_product={set_edit_product}
				is_error={!_.isEmpty(cart_error)}
				show_edit_btn={show_edit_btn}
			/>
		</Grid>
	);
}

export default NoteAndCustomize;
