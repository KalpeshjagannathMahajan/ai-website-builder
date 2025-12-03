import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { CHARGE_NAMES, CHARGE_TYPE, CHARGE_VALUE_TYPES, LOADING_CONSTANT } from '../../constants';
import { get_cart_summary } from '../../helper/helper';
import api_requests from 'src/utils/api_requests';
import { Button, Icon, Input } from 'src/common/@the-source/atoms';
import { get_formatted_price_with_currency } from 'src/utils/common';
import ShowCharges from '../ChargeModal/components/ShowCharges';
import CustomDialog, { DialogContainer, DialogFooter, DialogTitle } from 'src/common/CustomDialog';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import OrderManagementContext from '../../context';
import { get_document_details_api } from '../Api/getDocumentDetails';
import utils from 'src/utils/utils';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
import { get_currency_icon } from 'src/utils/common';

interface Props {
	cart_total: number;
	charges: any;
	on_close: any;
	document_id: string;
	charge_type: string;
	charge_name: string;
	is_open: boolean;
	charge_id?: string;
	handle_edit_modal_action?: any;
	modal_details?: any;
}

const useStyles = makeStyles((theme: any) => ({
	body_section: {
		paddingTop: '12px',
		paddingBottom: '12px',
		paddingLeft: '24px',
		paddingRight: '24px',
		display: 'flex',
		flexDirection: 'column',
		gap: '24px',
	},
	toggle_container: {
		display: 'flex',
		width: '112px',
		border: theme?.order_management?.charge_modal?.border,
		borderRadius: '12px',
	},
	toggle_box: {
		cursor: 'pointer',
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	icon: {
		transform: 'scale(1.7)',
	},
	info_box: {
		display: 'flex',
		gap: '10px',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: '100%',
	},
	line: {
		height: '1px',
		borderBottom: theme?.order_management?.charge_modal?.borderBottom,
		width: '100%',
	},
	ola: {
		display: 'flex',
		justifyContent: 'space-between',
		gap: '10px',
	},
}));

const ChargeModal = ({
	cart_total,
	charges,
	charge_type,
	on_close,
	document_id,
	charge_name,
	is_open,
	charge_id,
	handle_edit_modal_action,
	modal_details,
}: Props) => {
	const [final_name, set_final_name] = useState(charge_name);
	const classes = useStyles();
	const { t } = useTranslation();
	const { document_data, loader, set_refetch, set_toast_data, handle_loading_state } = useContext(OrderManagementContext);
	const { cart_details } = document_data;
	const { apply_discount_loader } = loader;
	const currency_symbol = cart_details?.meta?.pricing_info?.currency_symbol;
	const theme: any = useTheme();

	const discount_shipping_logic_types = [
		{
			value: 'percentage',
			component: (selected: boolean) => (
				<Icon
					className={classes.icon}
					iconName='IconPercentage'
					color={selected ? theme?.order_management?.charge_modal?.valid_color : theme?.order_management?.charge_modal?.invalid_color}
				/>
			),
		},
		{
			value: 'value',
			component: (selected: boolean) => (
				<Icon className={classes.icon} iconName={get_currency_icon(currency_symbol)} color={selected ? '#16885F' : '#9AA0AA'} />
			),
		},
	];

	const is_additional_charge = !_.includes(
		_.filter(_.map(CHARGE_NAMES, 'name'), (value) => {
			return value !== CHARGE_NAMES?.additional_charge?.name && value !== CHARGE_NAMES?.adjustment?.name;
		}),
		final_name,
	);

	const charge = _.find(charges, { id: charge_id }) || {};
	const [value, set_value] = useState(charge?.value || '');
	const [value_type, set_value_type] = useState(
		charge?.value_type ||
			(charge_name === CHARGE_NAMES?.Shipping?.name || is_additional_charge ? CHARGE_VALUE_TYPES?.value : CHARGE_VALUE_TYPES?.percentage),
	);
	const is_edit = !!charge_id;
	const charge_except_this_charge = _.filter(charges, (_value: any) => _value?.id !== charge_id);
	const charge_with_this_charge = [
		...charge_except_this_charge,
		{
			name: final_name,
			value_type,
			value: Number(value),
			charge_type,
		},
	];
	const { total_amount_without_charges, total_amount_with_charges, total_amount_with_discount } = get_cart_summary(
		cart_total,
		charge_with_this_charge,
	);

	const handle_toggle = (text: string) => {
		if (modal_details?.is_disable) {
			return;
		}
		set_value('');
		set_value_type(text);
	};

	const handle_close = () => {
		on_close();
	};

	const handle_on_change = (text: string) => {
		const number = Number(text);

		if (text === '') {
			set_value('');
			return;
		}

		if (isNaN(number) || number === 0) {
			return;
		}

		if (value_type === CHARGE_VALUE_TYPES?.percentage && number <= 100) {
			if (number < 0 || number > 100) {
				return false;
			}
			let val = utils.extract_decimal_number(number);
			set_value(val);
		}

		if (
			value_type === CHARGE_VALUE_TYPES?.value &&
			(charge_type === CHARGE_TYPE?.tax || (charge_type === CHARGE_TYPE?.discount && number <= total_amount_without_charges))
		) {
			let val = utils.extract_decimal_number(text);
			set_value(val);
		}
	};

	const add_update_charge = async (charge_value: number) => {
		if (isNaN(charge_value)) {
			return;
		}
		handle_loading_state(LOADING_CONSTANT.apply_discount_loader, true);
		try {
			if (charge_value === 0) {
				const { document_status, document_end_status_flag }: any = await get_document_details_api(document_id, true);

				if (document_end_status_flag) {
					set_toast_data({
						toast_state: true,
						toast_message: t('OrderManagement.useOrderManagement.NotEditable', { status: document_status }),
					});
					return;
				}

				await api_requests.order_management.remove_document_charge({
					document_id,
					charge_id: charge?.id,
				});
				handle_loading_state(LOADING_CONSTANT.apply_discount_loader, false);
			} else {
				await api_requests.order_management.update_document_charge({
					document_id,
					...(charge?.id && { id: charge?.id }),
					name: final_name,
					value: charge_value,
					value_type,
					charge_type,
					meta: {},
				});
			}
			set_refetch((prev: any) => !prev);
		} finally {
			handle_loading_state(LOADING_CONSTANT.apply_discount_loader, false);
		}
	};

	const handle_update = async () => {
		await add_update_charge(value);
		on_close();
	};

	const remove_charges = async () => {
		await add_update_charge(0);
		on_close();
	};

	const handle_render_title = () => {
		if (final_name === CHARGE_NAMES.adjustment.name) {
			return (
				<React.Fragment>
					{is_edit ? 'Edit' : 'Add'} {CHARGE_NAMES.adjustment.name}
				</React.Fragment>
			);
		}

		return (
			<React.Fragment>
				{is_edit ? 'Edit' : 'Add'} {is_additional_charge ? CHARGE_NAMES?.additional_charge.name : final_name}
			</React.Fragment>
		);
	};

	const handle_render_button = () => {
		return (
			<React.Fragment>
				{!is_edit ? (
					<Button
						onClick={handle_update}
						loading={apply_discount_loader}
						disabled={!value || !final_name || apply_discount_loader || modal_details?.is_disable}>
						Apply
					</Button>
				) : (
					<React.Fragment>
						<Button variant='outlined' disabled={apply_discount_loader} color='secondary' onClick={remove_charges}>
							Remove
						</Button>
						<Button
							loading={apply_discount_loader}
							disabled={!value || !final_name || apply_discount_loader || modal_details?.is_disable}
							onClick={handle_update}>
							Update
						</Button>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	};

	const handle_set_name = (event: any) => {
		let val = event?.target?.value;
		set_final_name(val);
		let exists = _.some(CHARGE_NAMES, (item) => _.get(item, 'name') === val);

		if (exists && val !== CHARGE_NAMES?.additional_charge?.name) {
			handle_edit_modal_action(val);
		}
	};

	useEffect(() => {
		if (modal_details?.fetch_charge && is_open) {
			const _charge = _.find(charges, { id: charge_id }) || {};
			set_value(_charge?.value || '');
			set_value_type(_charge?.value_type || CHARGE_VALUE_TYPES?.percentage);
		}
	}, [modal_details]);

	return (
		<CustomDialog show_modal={is_open} handle_close={handle_close} style={{ width: '420px' }}>
			<DialogContainer>
				<DialogTitle value={handle_render_title()} show_close={true} handle_close={on_close} />

				<div className={classes.body_section}>
					{is_additional_charge && (
						<Input
							sx={{ width: '100%', flex: 1, marginBottom: '8px' }}
							variant='outlined'
							label='Enter'
							disabled={final_name === CHARGE_NAMES.adjustment.name || modal_details?.is_disable}
							value={final_name}
							onChange={handle_set_name}
							children={undefined}
						/>
					)}

					<div className={classes.ola}>
						<Input
							sx={{ width: '100%', flex: 1 }}
							variant='outlined'
							value={value}
							type='number'
							disabled={modal_details?.is_disable}
							label='Enter value'
							onChange={(e) => handle_on_change(e.target.value)}
							children={undefined}
						/>

						{!is_additional_charge && (
							<div className={classes.toggle_container}>
								{discount_shipping_logic_types?.map((item, index) => {
									const is_selected = item?.value === value_type;
									const styles = {
										borderTopLeftRadius: index === 0 ? '11.5px' : 'none',
										borderBottomLeftRadius: index === 0 ? '11.5px' : 'none',
										borderTopRightRadius: index === discount_shipping_logic_types?.length - 1 ? '11.5px' : 'none',
										borderBottomRightRadius: index === discount_shipping_logic_types?.length - 1 ? '11.5px' : 'none',
										background: is_selected
											? theme?.order_management?.charge_modal?.selected_background
											: theme?.order_management?.charge_modal?.unselected_background,
									};
									let toggle_value =
										item?.value === CHARGE_VALUE_TYPES.percentage ? CHARGE_VALUE_TYPES?.percentage : CHARGE_VALUE_TYPES?.value;
									return (
										<div onClick={() => handle_toggle(toggle_value)} className={classes.toggle_box} style={styles}>
											{item.component(is_selected)}
										</div>
									);
								})}
							</div>
						)}
					</div>

					<div className={classes.info_box}>
						<CustomText color={theme?.order_management?.charge_modal?.label_color} type='H3'>
							{t('OrderManagement.DiscountModal.CartTotal')}
						</CustomText>
						<CustomText type='H6' color={theme?.order_management?.charge_modal?.label_color}>
							{get_formatted_price_with_currency(currency_symbol, cart_details?.cart_total)}
						</CustomText>
					</div>

					<ShowCharges
						currency_symbol={currency_symbol}
						charges={charge_with_this_charge}
						total_amount_with_discount={total_amount_with_discount}
						total_amount_without_charges={total_amount_without_charges}
					/>

					<div className={classes.info_box}>
						<div className={classes.line} />
					</div>
					<div className={classes.info_box}>
						<CustomText color={theme?.order_management?.charge_modal?.label_color} type='Title'>
							{t('OrderManagement.DiscountModal.Total')}
						</CustomText>
						<CustomText type='H6' color={theme?.order_management?.charge_modal?.label_color}>
							{get_formatted_price_with_currency(currency_symbol, total_amount_with_charges)}
						</CustomText>
					</div>
				</div>

				<DialogFooter>{handle_render_button()}</DialogFooter>
			</DialogContainer>
		</CustomDialog>
	);
};

export default ChargeModal;
