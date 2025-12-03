import { Typography, Icon, Box, Grid } from 'src/common/@the-source/atoms';
import classes from './Inventory.module.css';
import Menu from 'src/common/Menu';
import _ from 'lodash';
import React from 'react';
import { info, success, warning } from 'src/utils/common.theme';
import { useTheme } from '@mui/material/styles';
import { custom_stepper_text_color } from 'src/utils/light.theme';
import CustomText from '../../CustomText';
import DOMPurify from 'dompurify';

interface Props {
	menu_data: any;
	disable?: boolean;
}
const dividerStyle: React.CSSProperties = {
	height: '1px',
	width: '250px',
	margin: '0 0 0 -1rem',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InventoryMenu: React.FC<Props> = ({ menu_data, disable }) => {
	// Filter menu_data to include only items where item.data.number is true
	//const filteredMenuData = menu_data.filter((item: any) => item?.data?.number);
	const theme: any = useTheme();

	const get_bg_color = (menu_id: any) => {
		switch (menu_id) {
			case 'in_transit_details':
				return info[50];
			case 'on_order_details':
				return success[50];
			case 'backorder_allowed':
				return warning[50];
			default:
				return 'white';
		}
	};
	const get_border_color = (menu_id: any) => {
		switch (menu_id) {
			case 'in_transit_details':
				return info[100];
			case 'on_order_details':
				return success[100];
			default:
				return 'none';
		}
	};

	return (
		<Menu
			LabelComponent={
				<Grid pt={0.4}>
					<Icon iconName='IconInfoCircle' sx={{ color: theme?.palette?.secondary?.[800], cursor: 'pointer' }} />
				</Grid>
			}
			disable={disable}
			hideGreenBorder={true}
			commonMenuComponent={(item: any) => {
				const custom_info_item = item?.entries || item?.is_notes;
				return (
					<React.Fragment>
						{!item?.is_custom ? (
							<Box className={classes.inventory_menu}>
								<Typography sx={{ fontWeight: 400 }} color={theme?.product?.inventory_menu?.label_color}>
									{_.startCase(item?.data?.label)}
								</Typography>
								<Typography variant='subtitle2' sx={{ fontWeight: 700 }} color={theme?.product?.inventory_menu?.label_color}>
									{_.get(item, 'data.value', '-')}
								</Typography>
							</Box>
						) : (
							<Box className={classes.inventory_menu}>
								<Box
									className={!custom_info_item ? classes.custom_inventory_menu : classes.custom_inventory_menu_entries}
									bgcolor={get_bg_color(item?.id)}>
									{custom_info_item ? (
										<React.Fragment>
											<CustomText
												type='CaptionBold'
												color={custom_stepper_text_color?.grey}
												style={{ marginLeft: item?.is_notes ? '-8px' : '0' }}>
												{_.get(item, 'data.label', '')}
											</CustomText>
											<div style={{ ...dividerStyle, background: get_border_color(item?.id) }}></div>
											<Grid px={!item?.is_notes ? 2 : 0}>
												{item?.is_notes ? (
													<div
														dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(_.get(item, 'data.value', '-')) }}
														className='html-div-inventory'
													/>
												) : (
													<ul style={{ listStyleType: 'disc' }}>
														{_.map(_.get(item, 'data.value', []), (vals: any, index: number) => {
															return (
																<li key={index}>
																	<CustomText type='Caption' color={custom_stepper_text_color?.grey}>
																		{vals}
																	</CustomText>
																</li>
															);
														})}
													</ul>
												)}
											</Grid>
										</React.Fragment>
									) : (
										<CustomText type='Caption' color={custom_stepper_text_color?.grey}>
											{`${_.get(item, 'data.label', '')} ${_.get(item, 'data.value', '')}`}
										</CustomText>
									)}
								</Box>
							</Box>
						)}
					</React.Fragment>
				);
			}}
			menu={menu_data}
			hover={false}
		/>
	);
};

export default InventoryMenu;
