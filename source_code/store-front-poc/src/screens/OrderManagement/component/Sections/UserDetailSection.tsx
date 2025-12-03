import { Box, Grid, Icon } from 'src/common/@the-source/atoms';
import React, { useContext } from 'react';
import OrderManagementContext from '../../context';
import { SPECIAL_DOCUMENT_ATTRIBUTE } from '../../constants';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';
import { allValuesEmpty } from 'src/utils/utils';
import CustomText from 'src/common/@the-source/CustomText';

import { formattedValue } from 'src/utils/common';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import useMediaQuery from '@mui/material/useMediaQuery';
import DisplayPriorityCard from 'src/common/DisplayPriorityCard';

interface Props {
	data: any;
}

const text_style = {
	fontSize: is_ultron ? 14 : 16,
	padding: 0,
};

const empty_card_style = {
	display: 'flex',
	flexDirection: 'column',
	gap: 2,
	justifyContent: 'center',
	alignItems: 'center',
	minHeight: '15rem',
	height: 'auto',
};

const UserDetailSection: React.FC<Props> = ({ data }) => {
	const {
		attribute_data,
		handle_drawer_state,
		handle_drawer_type,
		buyer_details_form,
		//get_country_label
	} = useContext(OrderManagementContext);
	const { t } = useTranslation();
	const classes = useStyles();
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));

	const handle_click = (drawer_type: any) => {
		handle_drawer_state(true);
		handle_drawer_type(drawer_type);
	};

	const handle_empty_state = (icon: any, label: string) => {
		return (
			<Grid className={classes.viewDetailsCard} sx={empty_card_style}>
				<Icon iconName={icon} className={classes.user_details_section_icon_style} />
				<CustomText style={{ fontWeight: 400 }} color={theme?.order_management?.user_detail_section?.empty_state_color}>
					{label}
				</CustomText>
			</Grid>
		);
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const hangle_render_additional_fields = (additional_field_values: any, updated_attribute_detail: any, section_key: string) => {
		return _.map(additional_field_values, (key: any, _index: number) => {
			let value = updated_attribute_detail[key];
			if (!value) {
				return null;
			}
			const attributes = _.find(buyer_details_form?.sections, { key: section_key })?.[section_key]?.[0]?.attributes;
			const field = _.find(attributes, (fld: any) => fld.id === key);
			const formatted_value = formattedValue(value, field);
			return (
				<CustomText key={`additional_${_index}`} style={text_style} type='Body'>
					{formatted_value}
				</CustomText>
			);
		});
	};

	const render_action_button = (id: any) => {
		return (
			<Can I={PERMISSIONS.edit_orders.slug} a={PERMISSIONS.edit_orders.permissionType}>
				<Grid className={classes.textAlignmentContainer} item md={4} sm={3} xs={12}>
					<CustomText
						onClick={() => handle_click(id)}
						type='H6'
						style={{
							textDecorationLine: theme?.order_management?.style?.text_decoration_line,
							cursor: 'pointer',
							color: theme?.button?.color,
							...text_style,
						}}>
						{is_ultron ? t('OrderManagement.UserDetailSection.Change') : t('OrderManagement.UserDetailSection.Manage')}
					</CustomText>
				</Grid>
			</Can>
		);
	};

	return (
		<Grid
			className={is_ultron ? classes.gridContainerStyle : classes.storeFront_gridContainerStyle}
			marginTop={is_ultron ? 2 : '32px'}
			marginBottom={is_ultron ? 2 : '12px'}>
			{data?.map((ele: any, index: number) => {
				let id = ele?.attributes[0]?.id;
				const updated_attribute_detail = attribute_data[id] || [];
				const is_address = _.includes([SPECIAL_DOCUMENT_ATTRIBUTE.shipping_address, SPECIAL_DOCUMENT_ATTRIBUTE.billing_address], id);
				const is_contact = _.includes([SPECIAL_DOCUMENT_ATTRIBUTE.primary_contact], id);

				const is_shipping_address = _.includes([SPECIAL_DOCUMENT_ATTRIBUTE.shipping_address], id);
				const is_billing_address = _.includes([SPECIAL_DOCUMENT_ATTRIBUTE.billing_address], id);
				// const is_editable = !ele?.attributes?.[0]?.disabled;
				const is_required = ele?.attributes?.[0]?.required;

				const additional_field_values: any = [];
				const attr_keys = Object?.keys(updated_attribute_detail) || [];
				if (is_address || is_contact) {
					_.map(attr_keys, (key) => {
						if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(key)) {
							additional_field_values.push(key);
						}
					});
				}

				if (ele?.is_display !== false) {
					return (
						<Box key={ele.key}>
							<Grid container>
								<Grid item md={3} sm={4} xs={8}>
									<CustomText
										type='H6'
										className={is_ultron ? classes.ultron_user_details_section_label : classes.user_details_section_label}
										color={
											allValuesEmpty(updated_attribute_detail) && is_required
												? theme?.order_management?.user_detail_section?.custom_valid_color
												: theme?.order_management?.user_detail_section?.custom_invalid_color
										}>
										{ele?.name}
									</CustomText>
									{allValuesEmpty(updated_attribute_detail) && is_required && (
										<CustomText
											type='Caption'
											style={{ fontSize: 13 }}
											color={theme?.order_management?.user_detail_section?.all_value_empty_color}>
											{t('OrderManagement.UserDetailSection.Mandatory')}
										</CustomText>
									)}
								</Grid>

								{is_small_screen && (
									<Grid item md={3} sm={4} xs={4}>
										{render_action_button(id)}
									</Grid>
								)}

								<Grid item md={5} sm={5} xs={12} gap={0.3} display={'flex'} flexDirection={'column'}>
									{is_billing_address &&
										is_address &&
										allValuesEmpty(updated_attribute_detail) &&
										handle_empty_state('IconReceipt', 'Billing address not added')}
									{is_shipping_address &&
										is_address &&
										allValuesEmpty(updated_attribute_detail) &&
										handle_empty_state('IconTruckDelivery', 'Shipping address not added')}
									{is_address && !allValuesEmpty(updated_attribute_detail) && (
										<Box>
											<DisplayPriorityCard
												entity='addresses'
												buyer_fields={buyer_details_form}
												item={updated_attribute_detail}
												is_editable={false}
												text_type='Body'
												from_order={true}
												is_bold={false}
											/>
										</Box>
									)}

									{is_contact &&
										allValuesEmpty(updated_attribute_detail) &&
										handle_empty_state('user', t('OrderManagement.UserDetailSection.Contact'))}
									{is_contact && !allValuesEmpty(updated_attribute_detail) && (
										<Box>
											<DisplayPriorityCard
												entity='contacts'
												buyer_fields={buyer_details_form}
												item={updated_attribute_detail}
												is_editable={false}
												text_type='Body'
												from_order={true}
												is_bold={false}
											/>
										</Box>
									)}
								</Grid>

								{!is_small_screen && render_action_button(id)}
							</Grid>

							{data?.length !== index + 1 && <hr></hr>}
						</Box>
					);
				}
			})}
			{!is_ultron && (
				<hr
					style={{
						borderBottom: theme?.order_management?.order_manage_container?.hr_border_top,
						borderTop: '0',
						borderRadius: '0',
						marginInline: '0',
						marginTop: '32px',
						marginBottom: '32px',
					}}></hr>
			)}
		</Grid>
	);
};

export default UserDetailSection;
