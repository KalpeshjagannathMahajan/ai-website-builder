import React from 'react';
import classes from './Inventory.module.css';
import { Box, Grid } from '../../atoms';
import InventoryMenu from './InventoryMenu';
import { INVENTORY_STATUS, handle_get_menu } from './constants';
import { useSelector } from 'react-redux';
import OutOfStock from '../RecommendCard/OutOfStock';
import CustomText from '../../CustomText';
import { useTheme } from '@mui/material/styles';
import { warning } from 'src/utils/common.theme';
import { formatNumberWithCommas } from 'src/utils/common';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

interface InventoryStatusProps {
	data: any;
	variantType?: string;
	style?: any;
	fontSize?: number;
	showBg?: boolean;
	disable?: boolean;
	show_icon?: boolean;
	color?: string;
}

const InventoryStatus = ({ data, variantType, style, fontSize = 14, showBg, disable, show_icon = true, color }: InventoryStatusProps) => {
	const cart = useSelector((state: any) => state.cart);
	const meta = useSelector((state: any) => state?.settings?.inventory_icon_config);
	const reserved = cart?.document_items?.[data.id]?.total_reserved ?? 0;
	const status = data?.inventory?.inventory_status;
	const total_available = data?.inventory?.total_available ?? 0;
	const out_of_stock_threshold = data?.inventory?.out_of_stock_threshold ?? 0;
	const is_not_in_stock = reserved + total_available <= out_of_stock_threshold;
	const inventory = data?.inventory;
	const is_tracked = inventory?.inventory_tracking_enabled;
	const theme: any = useTheme();

	const render_chip_status = () => {
		if (status === INVENTORY_STATUS.out_of_stock && is_not_in_stock && meta?.out_of_stock?.show) {
			return <OutOfStock style={style} text='Out of stock' color={color} />;
		} else if (status === INVENTORY_STATUS.back_order) {
			return (
				<OutOfStock
					text='Back order'
					color={theme?.product?.inventory_status?.back_order?.color}
					style={{ backgroundColor: `${warning[50]}` }}
				/>
			);
		} else {
			return null;
		}
	};

	const render_status = () => {
		let status_component;
		switch (status) {
			case INVENTORY_STATUS.out_of_stock:
				if (is_not_in_stock && meta?.out_of_stock?.show) {
					status_component = (
						<Grid className={classes.parent_container}>
							<Box
								bgcolor={theme?.product?.inventory_status?.out_of_stock?.background}
								className={is_ultron ? classes.status_container : classes.status_container_storefront}
								sx={{ style, ...theme?.product?.inventory_status?.status_container }}>
								<CustomText
									type='H6'
									color={theme?.product?.inventory_status?.out_of_stock?.color}
									className={classes.status_details2}
									style={{ fontSize }}>
									Out of stock
								</CustomText>
								{show_icon && <InventoryMenu menu_data={handle_get_menu(inventory, meta, reserved)} disable={disable} />}
							</Box>
						</Grid>
					);
				}
				break;

			case INVENTORY_STATUS.back_order:
				status_component = (
					<Grid className={classes.parent_container}>
						<Box
							bgcolor={theme?.product?.inventory_status?.back_order?.background}
							className={classes.status_container}
							sx={{ ...style, ...theme?.product?.inventory_status?.status_container, ...theme?.product?.inventory_status?.back_order }}>
							<CustomText
								type='H6'
								color={theme?.product?.inventory_status?.back_order?.color}
								className={classes.status_details2}
								style={{ fontSize }}>
								Back Order
							</CustomText>
							{is_tracked && show_icon && <InventoryMenu menu_data={handle_get_menu(inventory, meta, reserved)} disable={disable} />}
						</Box>
					</Grid>
				);
				break;

			default:
				status_component = (
					<React.Fragment>
						{is_tracked && (
							<Grid className={classes.parent_container}>
								{showBg ? (
									<Box
										bgcolor={theme?.product?.inventory_status?.default?.background}
										sx={{
											...theme?.product?.inventory_status?.status_container,
										}}
										className={classes.status_container}>
										<CustomText
											type='H6'
											color={theme?.product?.inventory_status?.available?.color}
											className={classes.status_details}
											style={{ fontSize, ...theme?.product?.inventory_status?.available }}>
											{`${meta?.available_quantity?.label} - ${formatNumberWithCommas(data?.inventory?.available_quantity + reserved)}`}
										</CustomText>
										{show_icon && <InventoryMenu menu_data={handle_get_menu(inventory, meta, reserved)} disable={disable} />}
									</Box>
								) : (
									<Box display='flex' alignItems='center' gap={0.5}>
										<CustomText type={showBg ? 'H6' : ''} className={classes.status_details} style={{ fontSize }}>
											{`${meta?.available_quantity?.label}: ${formatNumberWithCommas(data?.inventory?.available_quantity + reserved)}`}
										</CustomText>
										{show_icon && <InventoryMenu menu_data={handle_get_menu(inventory, meta, reserved)} disable={disable} />}
									</Box>
								)}
							</Grid>
						)}
					</React.Fragment>
				);
		}

		return status_component;
	};

	return <React.Fragment>{variantType === 'chip' ? render_chip_status() : render_status()}</React.Fragment>;
};

export default InventoryStatus;
