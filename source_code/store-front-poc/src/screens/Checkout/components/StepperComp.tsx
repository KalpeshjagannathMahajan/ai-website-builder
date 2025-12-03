import { useContext } from 'react';
import { Grid, Icon, Stepper } from 'src/common/@the-source/atoms';
import OrderManagementContext from 'src/screens/OrderManagement/context';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import { STEPPER_CONSTANTS } from 'src/screens/OrderManagement/constants';
const StepperComp = () => {
	const { active_step, handle_update_stepper, wizshop_settings } = useContext(OrderManagementContext);
	const theme: any = useTheme();

	const get_icon_style = (key: string) => {
		if (active_step?.stepper_key === key) {
			return {
				fontSize: '26px',
				...theme?.order_management?.stepper?.active,
			};
		} else {
			return {
				fontSize: '26px',
				...theme?.order_management?.stepper?.in_active,
			};
		}
	};

	const handle_get_icon = (key: string) => {
		switch (key) {
			case STEPPER_CONSTANTS.SHIPPING_INFO.key:
				return 'IconTruckDelivery';
			case STEPPER_CONSTANTS.PAYMENT_DETAILS.key:
				return 'IconReceipt';
			case STEPPER_CONSTANTS.REVIEW.key:
				return 'IconShoppingCart';
			default:
				return 'IconTruckDelivery';
		}
	};

	const handle_get_steps = () => {
		const stepper_data = _.map(wizshop_settings?.pages, (item: any, index: number) => {
			const step_label = _.capitalize(_.get(item, 'short_name', ''));
			return {
				key: item?.key,
				label: step_label,
				step: index + 1,
				icon: <Icon sx={{ ...get_icon_style(item?.key) }} iconName={handle_get_icon(item?.key)} />,
			};
		});
		return stepper_data;
	};

	const handle_navigate = (step: number, key: string) => {
		const active_page = _.find(wizshop_settings?.pages, { key });
		handle_update_stepper(step - 1, active_page?.key);
	};

	return (
		<Grid container alignContent='center' justifyContent='center' bgcolor={theme?.order_management?.stepper?.container?.background} p={2}>
			<Stepper
				nonLinear
				connectorStyle={{
					'& .MuiStepConnector-line': {
						border: `1px dashed ${theme?.order_management?.stepper?.stepper_line?.color}`,
						width: '120px',
					},
				}}
				steps={handle_get_steps()}
				onClick={handle_navigate}
				style={{
					cursor: 'pointer',
				}}
				activeStep={active_step?.stepper_state}
			/>
		</Grid>
	);
};

export default StepperComp;
