import _, { isEmpty } from 'lodash';
import { Grid } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { colors } from 'src/utils/theme';
import PaymentCard from '../../AddEditBuyerFlow/components/PaymentCard';
import { PaymentMethodsValues } from 'src/@types/payment';
import { PAYMENT_METHODS } from '../../constants';
import { useTheme } from '@mui/material/styles';
import useStyles from '../../styles';

interface Props {
	primary_card_id: any;
	list_container_class?: string;
	container_style?: any;
	payment_methods: any[];
	title: string;
	is_editable?: boolean;
	on_edit_press?: (flag: any) => any;
	add_payment_method?: any;
	type: PaymentMethodsValues;
	empty_state?: React.ReactNode;
	payment_gateway?: string;
	set_show_card_modal?: (val: boolean) => void;
	set_selected_payment_method?: (val: string) => void;
	drawer?: any;
}

const PaymentMethods = ({
	primary_card_id,
	list_container_class,
	container_style,
	payment_methods,
	title,
	is_editable,
	on_edit_press,
	add_payment_method,
	type,
	empty_state,
	payment_gateway,
	set_show_card_modal = () => {},
	set_selected_payment_method = () => {},
	drawer,
}: Props) => {
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const theme: any = useTheme();
	const classes = useStyles();

	return (
		<Grid container flexDirection={'column'} gap={2} sx={container_style}>
			{is_ultron && (
				<CustomText type='H3' color={colors.secondary_text}>
					{title}
				</CustomText>
			)}
			{!isEmpty(payment_methods) || is_editable ? (
				<Grid
					className={
						is_ultron
							? list_container_class
							: drawer
							? classes.view_details_card_container
							: classes.storefront_drawer_view_details_card_container
					}>
					{_.map(payment_methods, (card_item, card_index) => {
						return (
							<PaymentCard
								type={type}
								key={`payment_card_${card_index}`}
								item={card_item}
								style={{
									...theme?.view_buyer?.custom_card_style,
								}}
								is_editable={is_editable}
								on_edit_press={() => on_edit_press && on_edit_press(type === PAYMENT_METHODS.ACH ? card_item : card_index)}
								primary_card_id={primary_card_id}
								payment_gateway={payment_gateway}
								set_show_card_modal={set_show_card_modal}
								set_selected_payment_method={set_selected_payment_method}
							/>
						);
					})}
					{add_payment_method}
				</Grid>
			) : empty_state ? (
				empty_state
			) : (
				<></>
			)}
		</Grid>
	);
};

export default PaymentMethods;
