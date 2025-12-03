/* eslint-disable */
import { makeStyles } from '@mui/styles';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from 'src/common/Menu';
import { Button, Grid, Icon } from 'src/common/@the-source/atoms';
import RouteNames from 'src/utils/RouteNames';
import DeleteCartModal from './DeleteCartModal';
import { Trans, useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import CartSummaryContext from '../context';
import { colors } from 'src/utils/theme';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import constants from 'src/utils/constants';
import { MenuItem, Select, useMediaQuery } from '@mui/material';
import { get_items } from '../helper';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
const is_store_front = VITE_APP_REPO === 'store_front';

const useStyles = makeStyles((theme: any) => ({
	products_count: {
		marginRight: '8px !important',
	},
	container: {
		display: 'flex',
		alignItems: 'flex-start',
		width: '100%',
		justifyContent: 'space-between',
		height: '100%',
		marginBottom: '8px',
		[!is_ultron && theme.breakpoints.down('sm')]: {
			alignItems: 'center',
			flexDirection: 'column',
		},
	},
	box: {
		display: 'flex',
		alignItems: 'center',
		gap: '1rem',
	},
	icon_styles: {
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer',
		marginRight: '2px',
		padding: '8px',
		...theme?.order_management?.cart_border_style,
		borderRadius: '8px',
	},
	add_products: {
		marginRight: '10px',
		borderBottom: is_ultron ? 'none' : `2px solid ${theme?.cart_summary?.header?.text_color}`,
	},
	header: {
		display: 'flex',
		width: '100%',
		justifyContent: 'space-between',
		height: '100%',
		marginBottom: '8px',
	},
	group_by_container: {
		width: '100%',
		border: theme?.cart_summary?.custom_cart_total?.border,
		padding: '8px',
	},
}));

const ProductListHeader = ({ cart_length, handle_edit_groups }: any) => {
	const theme: any = useTheme();
	const classes = useStyles();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const [show_modal, toggle_modal] = useState(false);
	const navigate = useNavigate();
	const { t } = useTranslation();
	const settings = useSelector((state: any) => state?.settings);
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const {
		set_open_custom_product,
		cart_group_by,
		selected_container,
		container_is_display,
		toggle_button_value,
		cart,
		calculate_data,
		set_cart_loading,
	} = useContext(CartSummaryContext);
	const is_custom_grouping = cart_group_by === constants.CART_GROUPING_KEYS.CUSTOM_GROUPING;

	const cart_grouping_config = settings?.cart_grouping_config || {};
	const { options = [] } = cart_grouping_config;
	const updated_options = _.filter(options, (option: any) => option?.is_active);
	const show_grouping_data = cart_grouping_config?.enabled;

	const handle_add_products = () => {
		navigate(RouteNames.product.all_products.path); // RouteNames.all_products.path
	};

	const default_option = _.find(updated_options, { is_default: true });
	const default_value = default_option?.value || '';
	const cart_group_by_value = cart_group_by || default_value;

	const menu_list = [
		{
			id: 'delete',
			data: {
				label: 'Delete cart',
			},
			onClick: () => toggle_modal(true),
		},
		settings?.enable_custom_line_item
			? {
					id: 'add-custom-line-item',
					onClick: () => set_open_custom_product(true),
					data: {
						label: 'Add custom item',
					},
			  }
			: {},
	].filter((item) => !_.isEmpty(item));

	const renderValue = (selected: string) => {
		const selectedOption = _.find(updated_options, { value: selected }) || _.find(updated_options, { is_default: true });
		return (
			<Grid container alignItems='center' display='flex'>
				<Icon iconName='IconStack2' />
				<CustomText
					type='Body'
					style={{
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						maxWidth: is_small_screen ? '35ch' : '200px',
						marginLeft: '8px',
					}}>
					Group by: <b>{selectedOption ? selectedOption?.label : ''}</b>
				</CustomText>
			</Grid>
		);
	};

	const render_group_by = () => {
		if (!show_grouping_data || _.isEmpty(updated_options)) return;
		if (updated_options?.length === 1)
			return (
				<Grid
					className={classes.group_by_container}
					sx={{
						maxWidth: is_small_screen ? '100%' : '280px',
					}}>
					<CustomText type='Body'>
						<span style={{ fontWeight: 700 }}> Grouped By: </span> {updated_options?.[0]?.label}{' '}
					</CustomText>
				</Grid>
			);
		return (
			<Select
				renderValue={renderValue}
				value={cart_group_by_value}
				sx={{ height: '35px', width: '100%', maxWidth: is_small_screen ? '100%' : '280px' }}
				MenuProps={{
					PaperProps: {
						sx: is_ultron
							? {}
							: {
									borderRadius: 0,
							  },
					},
				}}>
				{_.map(updated_options, (option: any) => (
					<MenuItem key={option?.value} value={option?.value} onClick={() => handle_click(option?.value)}>
						{option?.label}
					</MenuItem>
				))}
			</Select>
		);
	};

	const handle_click = (value: string) => {
		if (value === cart_group_by) return;
		set_cart_loading(true);
		calculate_data(selected_container, container_is_display, toggle_button_value, value, set_cart_loading, get_items(cart));
	};

	const handle_delete_btn = () => {
		return (
			<div className={classes.icon_styles} onClick={() => toggle_modal(true)}>
				<Icon iconName='IconTrash' color='#676D77' sx={{ cursor: 'pointer' }} />
			</div>
		);
	};

	return (
		<>
			<div className={classes.container}>
				<div className={classes.header}>
					<div className={classes.box}>
						<Grid sx={{ display: 'flex', alignItems: 'center' }}>
							<CustomText
								type='H6'
								color={theme?.cart_summary?.product_card?.text_color}
								style={{ marginRight: '8px', textWrap: 'nowrap' }}>
								<Trans i18nKey='CartSummary.ProductListHeader.ShowingProducts' count={cart_length <= 1 ? 1 : cart_length}>
									{{ cart_length }} Product
								</Trans>
							</CustomText>
							<CustomText type='Body' color={theme?.cart_summary?.product_card?.text_gray} style={{ textWrap: 'nowrap' }}>
								in cart
							</CustomText>
						</Grid>
						{!is_small_screen && render_group_by()}
					</div>
					<div className={classes.box} style={{ cursor: 'pointer' }}>
						{is_ultron && handle_delete_btn()}
						{show_grouping_data && is_custom_grouping && (
							<Button variant='text' onClick={handle_edit_groups} sx={{ marginRight: '10px' }}>
								<Icon color={colors.primary_500} iconName='IconEdit' sx={{ mr: 1 }} />
								{t('CartSummary.ProductListHeader.EditGroups')}
							</Button>
						)}
						{is_ultron ? (
							<React.Fragment>
								<Button variant='outlined' onClick={handle_add_products} sx={{ marginRight: '10px' }}>
									{t('CartSummary.ProductListHeader.AddProducts')}
								</Button>
								<Menu
									LabelComponent={
										<div className={classes.icon_styles}>
											<Icon iconName='IconDotsVertical' color={theme?.cart?.icon?.color} />
										</div>
									}
									hideGreenBorder={true}
									closeOnItemClick={true}
									commonMenuComponent={(_item: any) => {
										return (
											<div className={classes.container}>
												<CustomText type='Body' color={theme?.cart_summary?.product_card?.text_color}>
													{_item.data?.label}
												</CustomText>
											</div>
										);
									}}
									menu={menu_list}
								/>
							</React.Fragment>
						) : (
							<Button
								sx={{
									...theme?.order_management?.add_products_style,
									marginRight: '10px',
									padding: is_ultron ? '0' : '8px 12px',
									display: { xs: 'none', sm: 'inline-flex' },
								}}
								startIcon={<Icon iconName='IconPlus' />}
								variant='outlined'
								onClick={handle_add_products}>
								{t('CartSummary.ProductListHeader.AddProducts')}
							</Button>
						)}
						{is_store_front && handle_delete_btn()}
					</div>
				</div>
				{is_small_screen && <div style={{ width: '100%' }}>{render_group_by()}</div>}
			</div>
			{show_modal && <DeleteCartModal show_modal={show_modal} toggle_modal={toggle_modal} />}
		</>
	);
};

export default ProductListHeader;
