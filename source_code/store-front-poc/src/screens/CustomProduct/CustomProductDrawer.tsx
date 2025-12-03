/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from './customproduct.module.css';
import { Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { show_toast } from 'src/actions/message';
import cart_management from 'src/utils/api_requests/cartManagement';
import CustomError from './CustomError';
import { calculatePriceForSelections, generate_sku_id, transformData, should_show_modifier } from './helper';
import SkeletonCustomProduct from './SkeletonCustomProduct';
import CustomProductHeader from './Components/CustomProductHeader';
import CustomProductBody from './Components/CustomProductBody';
import CustomProductFooter from './Components/CustomProductFooter';
import { error_message, success_message, update_message } from './message_constants';
import useProductModifiers from './hooks/useProductModifiers';
import { useTheme } from '@mui/material/styles';
import { RootState } from 'src/store';
import usePricelist from 'src/hooks/usePricelist';
import Alert from '@mui/material/Alert';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';
import { get_cart_metadata, get_customer_metadata } from 'src/utils/utils';

interface custom_product_props {
	show_customise: boolean;
	set_show_customise: React.Dispatch<React.SetStateAction<boolean>>;
	set_show_modal: React.Dispatch<React.SetStateAction<boolean>>;
	product_id: string;
	default_sku_id: string;
	handle_get_cart_details?: any;
	open?: boolean;
	// set_open: React.Dispatch<React.SetStateAction<boolean>>;
	is_edit?: boolean;
	product_data?: any;
	base_price?: number;
	currency: string;
	page_name?: string;
	section_name?: string;
}

const CustomProductDrawer = ({
	show_customise,
	set_show_customise,
	set_show_modal,
	product_id,
	default_sku_id,
	handle_get_cart_details,
	// set_open,
	is_edit = false,
	product_data = {},
	base_price = 0,
	currency,
	page_name = '',
	section_name = '',
}: custom_product_props) => {
	const cart = useSelector((state: any) => state?.cart);
	const buyer_cart = useSelector((state: any) => state?.buyer?.buyer_cart);
	const [custom_val, set_custom_val] = useState<any>({});
	const [sku_id, set_sku_id] = useState('');
	const [is_disable, set_is_disable] = useState(false);
	const [done_click, set_done_click] = useState(false);
	const [total_value, set_total_value] = useState(0);
	const [total, set_total] = useState(0);
	const [quantity, set_quantity] = useState(1);
	const [errors, set_errors] = useState<any>({});
	const [show_more, set_show_more] = useState(true);
	const [is_btn_loading, set_is_btn_loading] = useState<boolean>(false);
	const [prev_custom_values, set_previous_custom_values] = useState({});
	const [show_alert_bar, set_show_alert_bar] = useState(false);
	const dispatch = useDispatch();
	const buyer_tenant_id = useSelector((state: any) => state?.buyer?.buyer_id || state?.buyer?.buyer_info?.id);
	const catalog_id: any = usePricelist();
	const { data, is_loading } = useProductModifiers({ product_id, buyer_tenant_id, catalog_id: catalog_id?.value });
	const theme: any = useTheme();
	const cart_id = useSelector((state: RootState) => _.head(state?.buyer?.buyer_cart?.data)?.id) || buyer_cart?.id;
	const customer_metadata = get_customer_metadata({ is_loggedin: true });
	const cart_metadata = get_cart_metadata();
	const local_id = localStorage.getItem('CartData') ? JSON.parse(localStorage.getItem('CartData') || '').id : null;

	const handle_custom_product = async (updated_custom_values: any) => {
		set_is_btn_loading(true);
		const modifiers: any = transformData(updated_custom_values, data);

		const sorted_modifiers: any = {};

		_.map(data, (modifier: any) => {
			const applied_value: any = modifiers[modifier.id];
			if (applied_value) {
				sorted_modifiers[modifier.id] = applied_value;
			}
		});

		let payload = {
			cart_id: (cart?.id || cart_id) ?? local_id,
			product_id: crypto.randomUUID(),
			quantity,
			cart_item_id: crypto.randomUUID(),
			meta: {},
			sku_id,
			is_custom_product: true,
			created_from_parent_id: product_id,
			applied_modifiers: sorted_modifiers,
		};

		let edit_payload = {
			cart_id: (cart?.id || cart_id) ?? local_id,
			product_id: product_data?.id,
			quantity,
			cart_item_id: product_data?.cart_item_id,
			sku_id,
			is_custom_product: true,
			created_from_parent_id: product_id,
			applied_modifiers: sorted_modifiers,
		};

		try {
			const response: any = await cart_management.update_item(is_edit ? edit_payload : payload);
			if (response?.status === 200) {
				if (cart_id) handle_get_cart_details();
				set_show_customise(false);
				if (is_edit) {
					dispatch<any>(show_toast(update_message));
				} else {
					dispatch<any>(show_toast(success_message));
				}
				Mixpanel.track(Events.ADD_TO_CART_CLICKED, {
					tab_name: 'Products',
					page_name,
					section_name,
					subtab_name: '',
					cart_metadata,
					customer_metadata,
					product_metadata: {
						sku_id,
						default_sku_id,
						cart_id: cart?.id,
						product_id,
						applied_modifiers: sorted_modifiers,
						total_price: total,
						final_count: quantity,
					},
				});
			}
		} catch (err) {
			console.error(err);
			set_show_customise(false);
		} finally {
			set_is_btn_loading(false);
		}
	};

	const handle_values = (custom_data: any) => {
		set_custom_val((prev_custom_val: any) => {
			let temp_data: any = {};

			Object.keys(custom_data).forEach((key) => {
				let value_data = custom_data[key];
				if (_.isArray(value_data)) {
					value_data = value_data.join(',');
				}
				temp_data[key] = value_data;
			});

			// return temp_data;
			return {
				...prev_custom_val,
				...temp_data,
			};
		});
	};

	const handle_error = (custom_error: any) => {
		set_errors((prevErrors: any) => {
			return { ...prevErrors, ...custom_error };
		});
	};

	const handle_quantity_change = (val: number) => {
		set_quantity(val);
	};
	const button_should_disable = () => {
		let isValid = true;

		data?.forEach((item: any) => {
			if (should_show_modifier(item, data, custom_val)) {
				if (item?.mandatory === true && !custom_val[item?.id]) {
					isValid = false;
				}
			}
		});

		return isValid;
	};
	const handle_done = () => {
		set_done_click(true);
		let isValid = true;

		let updated_custom_values = { ...custom_val };
		Object.keys(updated_custom_values).forEach((key) => {
			if (!updated_custom_values[key]) {
				delete updated_custom_values[key];
			}
		});

		data?.forEach((item: any) => {
			if (should_show_modifier(item, data, updated_custom_values)) {
				if (item?.mandatory === true && !updated_custom_values[item?.id]) {
					isValid = false;
				}
			}
		});

		const validate_error = _.find(_.values(errors), (error_val: any) => !error_val?.valid);
		if (!_.isEmpty(validate_error)) {
			isValid = false;
		}

		if (_.isEmpty(custom_val)) {
			isValid = false;
		}

		if (isValid && !is_disable) {
			handle_custom_product(updated_custom_values);
		} else {
			dispatch<any>(show_toast(error_message));
		}
	};

	const handle_disable = () => {
		let disable: boolean = false;

		if (errors) {
			for (let key in errors) {
				if (!errors[key].valid) {
					disable = true;
					break;
				}
			}
		}

		set_is_disable(disable);
	};

	useEffect(() => {
		if (!show_customise) {
			set_total_value(0);
			set_custom_val({});
		}
	}, [show_customise]);

	useEffect(() => {
		handle_disable();
	}, [errors, custom_val]);

	useEffect(() => {
		set_total_value(total * quantity);
	}, [total, quantity]);

	useEffect(() => {
		generate_sku_id(custom_val, data, custom_val, set_sku_id, default_sku_id);
		calculatePriceForSelections(custom_val, data, set_total, base_price);
		// Object.keys(custom_val).forEach((key) => {
		// 	if (!custom_val[key]) {
		// 		delete custom_val[key];
		// 	}
		// });
		if (sku_id.length > 70) {
			set_show_more(false);
		} else {
			set_show_more(true);
		}
	}, [custom_val]);

	useEffect(() => {
		if (_.isEqual(custom_val, prev_custom_values)) {
			if (is_edit && total !== product_data?.final_price) {
				set_show_alert_bar(true);
			} else {
				set_show_alert_bar(false);
			}
		}
	}, [custom_val, prev_custom_values, total]);

	useEffect(() => {
		const convert_data = (applied_mod_data: any) => {
			const result: any = {};
			for (const key in applied_mod_data) {
				if (applied_mod_data.hasOwnProperty(key)) {
					result[key] = applied_mod_data[key].value;
				}
			}
			return result;
		};

		const modifiers_data = convert_data(product_data?.applied_modifiers);

		set_previous_custom_values(modifiers_data);
		set_custom_val(modifiers_data);
	}, [is_edit]);

	return (
		<>
			{show_customise && (
				<Drawer
					anchor='right'
					width={640}
					open={show_customise}
					onClose={() => {
						if (is_edit) set_show_customise(false);
						else if (data?.length > 0 && !is_loading && !_.isEmpty(custom_val)) set_show_modal(true);
						else if (_.isEmpty(custom_val)) {
							set_show_modal(false);
							set_show_customise(false);
						} else {
							set_show_customise(false);
						}
					}}
					content={
						<React.Fragment>
							<Grid
								sx={{
									...theme?.product?.custom_product_drawer?.container,
								}}
								className={styles.custom_product_drawer_container}>
								<CustomProductHeader
									data={data}
									set_show_customise={set_show_customise}
									is_loading={is_loading}
									sku_id={sku_id}
									show_more={show_more}
									custom_val={custom_val}
									set_show_modal={set_show_modal}
									is_edit={is_edit}
								/>

								{is_loading ? (
									<SkeletonCustomProduct />
								) : data?.length > 0 ? (
									<>
										<Grid sx={{ mt: 1, px: 2 }}>
											{is_ultron && show_alert_bar && (
												<Alert sx={{ background: '#FCEFD6' }} icon={<Icon iconName='IconInfoCircle' />}>
													Prices have changed. Please review before saving.
												</Alert>
											)}
										</Grid>

										<CustomProductBody
											data={data}
											custom_val={custom_val}
											errors={errors}
											done_click={done_click}
											handle_values={handle_values}
											handle_error={handle_error}
											is_loading={is_loading}
											sku_id={sku_id}
											show_more={show_more}
											is_edit={is_edit}
											currency={currency}
											set_errors={set_errors}
											set_custom_val={set_custom_val}
										/>

										<CustomProductFooter
											total_value={total_value}
											handle_quantity_change={handle_quantity_change}
											handle_done={handle_done}
											is_btn_loading={is_btn_loading}
											quantity={product_data?.quantity}
											custom_val={custom_val}
											currency={currency}
										/>
									</>
								) : (
									<CustomError set_show_customise={set_show_customise} />
								)}
							</Grid>
						</React.Fragment>
					}
				/>
			)}
		</>
	);
};

export default CustomProductDrawer;
