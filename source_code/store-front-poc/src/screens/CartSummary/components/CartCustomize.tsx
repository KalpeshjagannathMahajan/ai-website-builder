import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid, Icon } from 'src/common/@the-source/atoms';
import { custom_stepper_text_color } from 'src/utils/light.theme';

interface CartCustomizeProps {
	product_data: any;
	set_is_edit_modifiers?: any;
	set_edit_product?: any;
	is_error?: boolean;
	show_edit_btn?: boolean;
}

const useStyles = makeStyles((theme: any) => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		borderRadius: '8px',
		background: theme?.cart_summary?.customize_cart?.container_bg,
		width: '100%',
		color: '#4F555E',
		justifyContent: 'space-between',
	},
	custom_container: {
		display: 'flex',
		flexDirection: 'row',
		width: 'calc(100% - 45px)',
		alignItems: 'baseline',
		'@media (max-width: 600px)': {
			flexDirection: 'column',
		},
	},
	custom_header: {
		whiteSpace: 'nowrap',
		marginRight: '3px',
	},
	custom_label: {
		fontWeight: '500',
		color: theme?.cart_summary?.customize_cart?.label_color,
		marginRight: '4px',
	},
	icon: {
		color: theme?.cart_summary?.customize_cart?.icon_color,
		margin: '0px 2px',
		marginBottom: '-5px',
	},
	value: {
		color: theme?.cart_summary?.customize_cart?.label_color,
		width: '15px',
	},
	custom_grid: {
		display: 'flex',
		wordBreak: 'break-word',
		flexWrap: 'wrap',
	},
	icon_edit: {
		width: '45px',
		cursor: 'pointer',
		display: 'flex',
		justifyContent: 'flex-end',
	},
}));

const CartCustomize = ({ product_data, set_is_edit_modifiers, set_edit_product, is_error, show_edit_btn }: CartCustomizeProps) => {
	const styles = useStyles();
	const { t } = useTranslation();
	const values = Object.values(product_data?.applied_modifiers || {}) || [];
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';

	if (!product_data?.is_custom_product) return;

	const handle_edit_click = () => {
		set_is_edit_modifiers && set_is_edit_modifiers(true);
		set_edit_product && set_edit_product(product_data);
	};

	return (
		<Grid container className={styles.container} sx={{ marginTop: is_ultron ? '1rem' : '0' }}>
			<Grid className={styles.custom_container}>
				<CustomText type='Subtitle' color={custom_stepper_text_color.grey} className={styles.custom_header}>
					{t('CartCustom.Header')}
				</CustomText>
				<Grid container className={styles.custom_grid}>
					{values.map((custom_attribute: any, ind: number) => {
						if (custom_attribute?.value !== '') {
							const isString = typeof custom_attribute?.value === 'string';
							const valueToShow = isString ? custom_attribute?.value.split(',').join(', ') : custom_attribute?.value;
							const label = custom_attribute?.label ? `${custom_attribute.label} :` : '';
							return (
								<>
									<CustomText type='Body' color={custom_stepper_text_color.grey}>
										{label} {valueToShow}
									</CustomText>

									{ind !== Object.values(product_data?.applied_modifiers)?.length - 1 && (
										<Icon iconName='IconPointFilled' className={styles.icon} />
									)}
								</>
							);
						}
						return null;
					})}
				</Grid>
			</Grid>
			{!is_error && show_edit_btn && (
				<Grid className={styles.icon_edit}>
					<Icon iconName='IconEdit' onClick={handle_edit_click} />
				</Grid>
			)}
		</Grid>
	);
};

export default CartCustomize;
