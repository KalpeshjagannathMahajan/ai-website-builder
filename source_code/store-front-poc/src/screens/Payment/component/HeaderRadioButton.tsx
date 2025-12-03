import { useEffect, useMemo } from 'react';
import _ from 'lodash';
import { Grid, Radio } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../styles';
import constants from '../constants';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material';

const HeaderRadioButton = ({
	selected_radio_btn,
	set_selected_radio_btn,
	buyer_data,
	is_buyer_payment,
	has_any_refund_permission,
	has_any_collect_payment_permission,
	has_card_authorization_permission,
	has_recurring_payment_permission,
	set_show_discard_modal,
	set_temp_selected_radio_btn,
}: any) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const { source, id } = useParams();
	const theme: any = useTheme();

	const radio_button = useMemo(() => {
		const { radio_buttons } = constants;
		if (source && id) {
			// in case of coming from order/buyer/transaction table single action
			const source_map: any = {
				collect: 'direct',
				direct: 'direct',
			};
			return _.filter(radio_buttons, (action) => action?.value === (source_map?.[source] || source));
		}
		// Build a list of values to exclude based on permissions
		const excluded_values: string[] = [];
		if (!has_any_collect_payment_permission) excluded_values.push('direct');
		if (!has_any_refund_permission) excluded_values.push('refund');
		if (!has_card_authorization_permission) excluded_values.push('authorize');
		if (!has_recurring_payment_permission) excluded_values.push('subscription');
		// Filter buttons based on exclusions
		return _.filter(radio_buttons, (action: any) => !excluded_values.includes(action.value));
	}, [has_any_collect_payment_permission, has_any_refund_permission, has_card_authorization_permission, source, id]);

	const handle_disable = () => {
		return id ? true : !_.isEmpty(buyer_data) ? true : false;
	};

	const handle_change = (item: any) => {
		if (handle_disable()) {
			set_show_discard_modal(true);
			set_temp_selected_radio_btn(item);
			return;
		}
		set_selected_radio_btn(item);
		navigate(item?.route, { replace: true });
	};

	const get_value_from_current_url = () => {
		const parts = _.split(window.location.pathname, '/');
		return id ? source : _.last(parts);
	};
	useEffect(() => {
		const active_btn = get_value_from_current_url();
		const active_radio_btn: any = _.find(radio_button, { value: active_btn });
		set_selected_radio_btn(is_buyer_payment || (source === 'collect' && id) ? _.head(radio_button) : active_radio_btn);
	}, [location.pathname, radio_button]);

	return (
		<Grid className={classes.radio_button_container}>
			{_.map(radio_button, (item: any) => {
				const active_btn = selected_radio_btn?.value === item?.value;

				return (
					<Grid
						key={item?.value}
						onClick={() => handle_change(item)}
						className={active_btn ? classes.active_radio_button : classes.radio_button}>
						<Radio sx={{ px: '6px' }} size='small' checked={active_btn} value={active_btn} />
						<CustomText color={active_btn ? theme?.payments?.green : theme?.payments?.grey} type={active_btn ? 'H6' : 'Title'}>
							{item?.label}
						</CustomText>
					</Grid>
				);
			})}
		</Grid>
	);
};

export default HeaderRadioButton;
