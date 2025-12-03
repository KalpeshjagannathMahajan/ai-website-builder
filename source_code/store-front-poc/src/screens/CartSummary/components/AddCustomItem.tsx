import React, { useContext, useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Drawer, Grid, Icon, Button, Box } from 'src/common/@the-source/atoms';
import { FormProvider, useForm } from 'react-hook-form';
import { Divider } from '@mui/material';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import _ from 'lodash';
import { ADDTEMPLATE } from './mock';
import CustomCounter from 'src/common/@the-source/molecules/CustomCounter';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import cart_management from 'src/utils/api_requests/cartManagement';
import CartSummaryContext from '../context';
import { t } from 'i18next';
import { useTheme } from '@mui/material/styles';
import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';
import { useDispatch } from 'react-redux';
import { addProductDetails, updateCart } from 'src/actions/cart';
import { get_items } from '../helper';
import constants from 'src/utils/constants';
import { get_currency, get_formatted_price_with_currency } from 'src/utils/common';

interface Props {
	open: boolean;
	on_close: () => any;
	on_reopen: () => any;
}

const useStyles = makeStyles(() => ({
	toggle_container: {
		display: 'flex',
		width: '30%',
		border: '1.4px solid rgba(0, 0, 0, 0.12)',
		borderRadius: '8px',
		height: '55px',
	},
	toggle_box: {
		cursor: 'pointer',
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: '0px 5px',
	},
	icon: {
		transform: 'scale(1.1)',
	},
}));
const { CUSTOM_GROUPING } = constants.CART_GROUPING_KEYS;
const AddCustomItemDrawer = ({ open, on_close, on_reopen }: Props) => {
	const {
		container_config_data,
		// set_refetch_data,
		toggle_toast,
		adhoc_data,
		set_adhoc_data,
		adhoc_count,
		cart,
		set_cart,
		set_adhoc_count,
		cart_metadata,
		customer_metadata,
		cart_group_data,
		set_cart_group_data,
		calculate_data,
		selected_container,
		container_is_display,
		toggle_button_value,
		set_cart_loading,
		cart_group_by,
	} = useContext(CartSummaryContext);
	const dispatch = useDispatch();
	const [loading, set_loading] = useState<boolean>(false);
	const [disabled, set_disabled] = useState<boolean>(false);
	const display_number = adhoc_count.toString().padStart(5, '0');
	const theme: any = useTheme();

	const _cart = useSelector((state: any) => state?.cart);
	let updated_cart: { [productId: string]: any } = { ..._cart?.products };
	const redux_currency = useSelector((state: any) => state?.settings?.currency);
	const currency = adhoc_data?.pricing?.currency || redux_currency;

	const methods = useForm({
		defaultValues:
			{
				...adhoc_data,
				sku_id: adhoc_data?.sku_id || `CUSTOM-${display_number}`,
				note: adhoc_data?.meta?.notes?.[0]?.value,
				price: adhoc_data?.pricing?.price || '0',
				quantity: adhoc_data?.quantity || 1,
				container: adhoc_data?.meta?.item_volume || '0',
			} || {},
	});
	const classes = useStyles();
	const { control, getValues, setValue, handleSubmit } = methods;
	const [quantity, set_quantity] = useState<number>(1);
	const { refetch } = cart;

	const [container_type, set_container_type] = useState<string>(
		adhoc_data?.meta?.item_volume_unit || container_config_data?.tenant_container_default_unit,
	);
	useEffect(() => {
		if (_.size(_cart?.product)) {
			set_adhoc_count(1);
		}
	}, []);
	const handle_disable = () => {
		if (disabled || loading) {
			return true;
		}
		return _.some(ADDTEMPLATE, (item: any) => item.required && !getValues()?.[item?.id]);
	};
	const handle_quantity_change = (val: number) => {
		if (val > 10000) {
			set_disabled(true);
		} else {
			set_disabled(false);
		}
		set_quantity(val);
	};

	const container_logic_types = [
		{
			value: 'CFT',
			component: (selected: boolean) => (
				<CustomText
					type='Subtitle'
					className={classes.icon}
					color={selected ? theme?.product?.custom_item_CBM?.color : theme?.product?.custom_item_CBM?.notSelected}>
					CFT
				</CustomText>
			),
		},
		{
			value: 'CBM',
			component: (selected: boolean) => (
				<CustomText
					type='Subtitle'
					className={classes.icon}
					color={selected ? theme?.product?.custom_item_CBM?.color : theme?.product?.custom_item_CBM?.notSelected}>
					CBM
				</CustomText>
			),
		},
	];

	const handle_change_container_logic_type = (_item: any) => {
		set_container_type(_item?.value);
	};

	const handle_update_cart = async (item: any, add_new: boolean = false) => {
		set_loading(true);
		try {
			const response: any = await cart_management.update_item(item);
			const new_items_with_unit_prices = { ...cart?.data?.items_with_unit_prices };
			new_items_with_unit_prices[response?.id] = response?.product?.pricing?.price;
			const new_cart = {
				...cart?.data,
				items: {
					...cart?.data?.items,
					[response?.product_id]: {
						[response?.id]: {
							quantity: response?.quantity,
							final_total: response?.quantity * response?.product?.pricing?.price,
							product_volume_data: response?.product?.volume_data,
							is_price_modified: false,
							is_custom_product: false,
							initial_price: response?.product?.pricing?.price,
							meta: { ...response?.meta, product_details: { product_state: 'ADHOC' } },
						},
					},
				},
				products: { ...cart?.data?.products, [response?.product_id]: response?.product },
				items_with_unit_prices: new_items_with_unit_prices,
			};
			set_cart(new_cart);
			const is_exsist = _.some(
				cart_group_data,
				(group: any) => _.includes(group?.products, response?.product_id) || _.includes(group?.cart_items, response?.id),
			);
			if (!is_exsist && cart_group_by === CUSTOM_GROUPING) {
				const new_groups = _.map(cart_group_data, (group: any) => {
					if (group?.base_name === 'Ungrouped') {
						const _products = [...(group?.products || []), response?.product_id];
						const _cart_items = [...(group?.cart_items || []), response?.id];
						return { ...group, products: _products, cart_items: _cart_items };
					} else {
						return group;
					}
				});
				set_cart_group_data(new_groups);
				calculate_data(
					selected_container,
					container_is_display,
					toggle_button_value,
					CUSTOM_GROUPING,
					set_cart_loading,
					get_items({ data: new_cart }),
					new_groups,
				);
			} else {
				calculate_data(
					selected_container,
					container_is_display,
					toggle_button_value,
					cart_group_by,
					set_cart_loading,
					get_items({ data: new_cart }),
					cart_group_data,
				);
			}

			if (!updated_cart.hasOwnProperty(response?.product_id)) {
				dispatch(addProductDetails({ [response?.product_id]: response?.product }));
			}
			dispatch(
				updateCart({
					id: response?.product_id,
					quantity: response?.quantity,
					parent_id: response?.product_id,
					cart_item_id: response?.id || null,
					cart_item: updated_cart?.[response?.product_id],
				}),
			);
			toggle_toast({
				show: true,
				message: '',
				title: !_.isEmpty(adhoc_data) ? 'Custom Line Item Updated' : 'Custom Line Item Added',
				status: 'success',
			});
			if (add_new) {
				on_reopen();
			} else {
				on_close();
			}
			if (_.isEmpty(adhoc_data)) set_adhoc_count(adhoc_count + 1);
			set_loading(false);
			set_adhoc_data(null);
			refetch();
			// set_adhoc_count(adhoc_count + 1);
			Mixpanel.track(Events.ADD_MORE_CUSTOM_LINE_CLICKED, {
				tab_name: 'Home',
				page_name: 'cart_page',
				section_name: 'custom_line_item_side_&_bottom_sheet',
				subtab_name: '',
				cart_metadata,
				customer_metadata,
			});
		} catch (err) {
			console.error(err);
			set_loading(false);
		}
	};
	const handle_on_submit = (add_new: boolean = false) => {
		const new_product = getValues();
		const product_id = !_.isEmpty(adhoc_data) ? adhoc_data?.id : crypto?.randomUUID();
		const product_details = {
			id: product_id,
			type: 'variant',
			moq: 0,
			sku_id: new_product?.sku_id,
			name: new_product?.name,
			inventory_tracked: false,
			price: _.toNumber(new_product?.price),
			product_state: 'ADHOC',
		};

		let cart_item: any = {
			cart_id: _cart?.id,
			product_id,
			quantity,
			product_details,
			meta: {
				notes: [
					{
						value: new_product?.note,
					},
				],
				item_volume: parseFloat(new_product?.container) || 0,
				item_volume_unit: container_type,
			},
		};
		if (!_.isEmpty(adhoc_data)) {
			cart_item = { ...cart_item, cart_item_id: adhoc_data?.cart_item_id };
		}

		handle_update_cart(cart_item, add_new);
	};
	const handle_submit_add_another = () => {
		handle_on_submit(true);
	};

	const handle_save = () => {
		handle_on_submit(false);
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'> {!_.isEmpty(adhoc_data) ? 'Update' : 'Add'} Custom Line item</CustomText>
				<Icon iconName='IconX' onClick={on_close} />
			</Grid>
		);
	};
	const handle_render_lower_body = () => {
		return (
			<Grid display={'flex'} bgcolor={'#F0F6FF'} p={1} alignItems={'center'} borderRadius={1}>
				<CustomText type='H6'>
					Total Value : {get_formatted_price_with_currency(currency, quantity * parseFloat(getValues()?.price ?? 0))}
				</CustomText>
			</Grid>
		);
	};
	const handle_price_field = (attribute: any) => {
		return (
			<Grid
				display={'flex'}
				gap={1}
				bgcolor={'#F2F6E7'}
				p={2}
				alignItems={'center'}
				justifyContent={'space-between'}
				borderRadius={1}
				style={theme?.product?.custom_item}>
				<CustomText type='Subtitle'>Price per unit (in {get_currency(currency)})</CustomText>
				<FormBuilder
					style={{ background: '#FFF', width: '218px', borderRadius: '10px' }}
					placeholder={attribute?.name}
					name={`${attribute?.id}`}
					start_icon={<Icon iconName='IconCurrencyDollar' sx={{ height: '24px', woidth: '28px' }} />}
					defaultValue={attribute?.value}
					type={attribute?.type}
					control={control}
					register={methods.register}
					getValues={getValues}
					setValue={setValue}
				/>
			</Grid>
		);
	};

	const handle_quantity_field = () => {
		return (
			<Grid display={'flex'} gap={1} bgcolor={'#F7F8FA'} p={2} alignItems={'center'} justifyContent={'space-between'} borderRadius={1}>
				<CustomText type='Subtitle'>Quantity</CustomText>
				<Grid display={'flex'} alignItems={'center'} direction={'column'} gap={1}>
					<CustomCounter
						min={1}
						max={10000}
						is_mandatory={true}
						onChange={handle_quantity_change}
						defaultValue={adhoc_data ? adhoc_data?.quantity : 1}
					/>
					{quantity > 10000 && (
						<CustomText type='Micro' color='#D74C10'>
							{t('Adhoc.Quantity_error')}
						</CustomText>
					)}
				</Grid>
			</Grid>
		);
	};

	const handle_container_field = (attribute: any) => {
		if (container_config_data?.tenant_container_enabled) {
			return (
				<Grid display={'flex'} gap={1} alignItems={'center'} justifyContent={'space-between'} borderRadius={1}>
					<FormBuilder
						placeholder={attribute?.name}
						label={attribute?.name}
						name={`${attribute?.id}`}
						validations={{
							required: Boolean(attribute?.required),
						}}
						defaultValue={attribute?.value}
						type={attribute?.type}
						control={control}
						register={methods.register}
						getValues={getValues}
						setValue={setValue}
					/>
					<Box className={classes.toggle_container}>
						{container_logic_types?.map((item, index) => {
							const is_selected = item?.value === container_type;
							const styles = {
								borderTopLeftRadius: index === 0 ? '6.5px' : 'none',
								borderBottomLeftRadius: index === 0 ? '6.5px' : 'none',
								borderTopRightRadius: index === container_logic_types?.length - 1 ? '6.5px' : 'none',
								borderBottomRightRadius: index === container_logic_types?.length - 1 ? '6.5px' : 'none',
								background: is_selected ? theme?.product?.custom_item_CBM?.color2 : 'white',
							};
							return (
								<Box onClick={() => handle_change_container_logic_type(item)} className={classes.toggle_box} style={styles}>
									{item?.component(is_selected)}
								</Box>
							);
						})}
					</Box>
				</Grid>
			);
		}
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body' pt={1} gap={'13px'}>
				<FormProvider {...methods}>
					{_.map(ADDTEMPLATE, (attribute) => {
						switch (attribute?.id) {
							case 'price':
								return handle_price_field(attribute);
							case 'quantity':
								return handle_quantity_field();
							case 'container':
								return handle_container_field(attribute);
							default:
								return (
									<FormBuilder
										placeholder={attribute?.name}
										label={attribute?.name}
										name={`${attribute?.id}`}
										validations={{
											required: Boolean(attribute?.required),
											maxLength: attribute?.id === 'sku_id' ? 20 : Infinity,
										}}
										defaultValue={attribute?.value}
										type={attribute?.type}
										control={control}
										register={methods.register}
										getValues={getValues}
										setValue={setValue}
									/>
								);
						}
					})}
				</FormProvider>
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Button disabled={handle_disable()} fullWidth variant='outlined' onClick={handleSubmit(handle_submit_add_another)}>
					{t('Adhoc.SubmitAndAddOther')}
				</Button>
				<Button disabled={handle_disable()} fullWidth onClick={handleSubmit(handle_save)}>
					{!_.isEmpty(adhoc_data) ? 'Save' : 'Add'}
				</Button>
			</Grid>
		);
	};

	const handle_render_content = () => {
		return (
			<>
				<Grid className='drawer-container'>
					{handle_render_header()}
					<Divider className='drawer-divider' />
					{handle_render_drawer_content()}
					{handle_render_lower_body()}
					<Divider className='drawer-divider' />
					{handle_render_footer()}
				</Grid>
			</>
		);
	};

	return (
		<>
			<Drawer
				anchor='right'
				width={480}
				open={open}
				onClose={on_close}
				content={<React.Fragment>{handle_render_content()}</React.Fragment>}
			/>
		</>
	);
};
export default AddCustomItemDrawer;
