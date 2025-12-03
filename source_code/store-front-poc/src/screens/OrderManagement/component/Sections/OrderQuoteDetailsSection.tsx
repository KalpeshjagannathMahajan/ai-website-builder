import { Box, Button, Grid } from 'src/common/@the-source/atoms';
import React, { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import OrderManagementContext from '../../context';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import CustomText from 'src/common/@the-source/CustomText';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { useParams } from 'react-router-dom';
import { ALLOWED_EMPTY_VALUES_TYPES, EDIT_ORDER_BUYER_CONSTANT, ORDER_SECTION } from '../../constants';
import { allValuesEmpty } from 'src/utils/utils';
import { formattedValue } from 'src/utils/common';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import { check_dynamic_attributes, get_default_values } from '../../helper/helper';
import { error } from 'src/utils/light.theme';

interface Props {
	data: any;
}

const text_style = {
	fontSize: is_ultron ? 14 : 16,
	maxWidth: '100%',
	wordWrap: 'break-word',
};

const text_style_required = {
	...text_style,
	fontWeight: 600,
	color: error.main,
};

const OrderQuoteDetailsSection: React.FC<Props> = ({ data }) => {
	const {
		show_edit_cta,
		section_mode,
		handle_set_section_mode,
		handle_update_document,
		attribute_data,
		document_data,
		loader,
		handle_update_edit_order_modal,
		handle_update_edit_order_data,
	} = useContext(OrderManagementContext);
	const is_editable_quote = useSelector((state: any) => state?.document?.is_editable_quote);
	const is_editable_order = useSelector((state: any) => state?.document?.is_editable_order);
	const methods = useForm({
		defaultValues: get_default_values(data?.attributes, attribute_data),
		shouldUnregister: false,
	});

	const { handleSubmit, setValue } = methods;
	const { t } = useTranslation();
	const params = useParams();
	const { doc_status } = params;
	const { quote_details } = section_mode;
	const { update_document_loader } = loader;
	const field_id = ORDER_SECTION;
	const classes = useStyles();
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const is_editable = !_.some(data?.attributes, 'disabled');

	const handle_transform_data = (props_data: any) => {
		// formattedValue(attribute_data[item?.id] ?? item?.value, item);
		const updated_attributes = _.sortBy(props_data?.attributes, ['priority'])?.map((attribute) =>
			_.assign({}, attribute, {
				key: attribute.name,
				dType: attribute?.type,
				value: attribute_data[attribute?.id] ?? attribute?.value,
			}),
		);
		const updated_data = _.assign({}, props_data, { attributes: updated_attributes });

		return updated_data;
	};

	const handle_click = () => {
		if (quote_details === 'view') {
			handle_set_section_mode('quote_details', 'edit');
		} else {
			handle_set_section_mode('quote_details', 'view');
		}
	};

	const handle_back_change_fields = (payload_data: any) => {
		const field_attrs = data?.attributes;
		const document_attributes = document_data?.attributes;
		const filtered_data = _.pickBy(payload_data, (value, key) => {
			const attribute_type = _.find(field_attrs, (item: any) => item?.id === key)?.type;
			if (ALLOWED_EMPTY_VALUES_TYPES.includes(attribute_type)) {
				return document_attributes[key] !== value || value === ''; // Include empty values explicitly
			}
			return document_attributes[key] !== value || value === '';
		});
		return filtered_data;
	};

	const handle_is_back_saving_permitted = (payload_data: any) => {
		const all_attributes = _.filter(data?.attributes, (attr) => payload_data[attr.id]);
		return _.some(all_attributes, 'back_saving_permitted');
	};

	const onSubmit = (props_data: any) => {
		if (!props_data) {
			return;
		}
		const order_attributes = _.keyBy(data.attributes, 'name');
		const result: any = {};

		for (const attribute_name in props_data) {
			if (order_attributes.hasOwnProperty(attribute_name)) {
				let attribute_id = order_attributes[attribute_name]?.id;
				// Handle empty or cleared values
				if (order_attributes?.[attribute_name]?.type === 'date') {
					result[attribute_id] = props_data[attribute_name] || ''; // Ensure empty values are sent as an empty string
				} else {
					result[attribute_id] = props_data[attribute_name] === undefined ? '' : props_data[attribute_name];
				}
			}
		}

		let payload = handle_back_change_fields(result);
		let is_back_saving_permitted = handle_is_back_saving_permitted(payload);

		if (is_back_saving_permitted) {
			handle_update_edit_order_modal(true, field_id);
		}

		if (props_data && !is_back_saving_permitted) {
			handle_update_document({ ...payload });
		} else {
			handle_update_edit_order_data(EDIT_ORDER_BUYER_CONSTANT.payload, { ...payload });
		}
	};

	const handle_edit_attribute = (edit_attributes: any) => {
		const has_dynamic_attributes = check_dynamic_attributes(edit_attributes);
		return (
			<Box gap={has_dynamic_attributes ? 1 : 2} display='flex' flexDirection='column'>
				{edit_attributes?.map((attribute: any) => {
					let options = attribute?.options;

					if (attribute?.view_only && !doc_status) {
						return null;
					}
					if (attribute?.is_display !== false)
						return (
							<FormBuilder
								placeholder={attribute.name}
								label={attribute?.name}
								name={attribute?.key}
								validations={{
									required: Boolean(attribute.required),
									number: attribute.type === 'number',
									email: attribute.key === 'email' || attribute.id === 'email' || attribute.type === 'email',
									phone: attribute.id === 'phone' || attribute.type === 'phone',
									...attribute?.validations,
								}}
								setValue={setValue}
								disabled={attribute?.disabled}
								defaultValue={attribute?.value}
								// value={attribute?.value}
								type={attribute?.type}
								options={options}
								is_dynamic_attribute={attribute?.dynamic_attribute || false}
								has_dynamic_attrs={has_dynamic_attributes}
								attribute_id={attribute?.id}
							/>
						);
				})}
			</Box>
		);
	};

	const handle_render_edit_field = () => {
		let transformed_attributes_data = handle_transform_data(data);
		return (
			<FormProvider {...methods}>
				<form>{handle_edit_attribute(transformed_attributes_data?.attributes)}</form>
			</FormProvider>
		);
	};

	const handle_get_value_by_type = (item: any) => {
		return formattedValue(attribute_data[item?.id] ?? item?.value, item);
	};
	const handle_render_view_field = () => {
		return (
			<Box display='flex' gap={1.5} flexDirection='column'>
				{_.sortBy(data?.attributes, ['priority'])?.map((ele: any) => {
					if (ele?.view_only && !doc_status) {
						return null;
					}
					const is_required_and_empty = ele?.required && _.isEmpty(attribute_data?.[ele?.id]);

					if (ele?.is_display !== false)
						return (
							<Box key={ele.key} mb={1.5}>
								<CustomText type='Body' style={is_required_and_empty ? text_style_required : text_style}>
									{ele?.name}
									{is_required_and_empty ? ' *' : ''}
								</CustomText>

								<CustomText type='H6' style={text_style}>
									{handle_get_value_by_type(ele)}
								</CustomText>
							</Box>
						);
				})}
			</Box>
		);
	};
	const render_fields = () => {
		return <Box gap={1.5}>{quote_details === 'view' ? handle_render_view_field() : handle_render_edit_field()}</Box>;
	};
	const handle_render_content_section = () => {
		if (quote_details === 'view') {
			return (
				<Grid item md={5} sm={5} xs={12}>
					{render_fields()}
				</Grid>
			);
		} else {
			return (
				<Grid item md={4} sm={4} xs={12}>
					{render_fields()}
				</Grid>
			);
		}
	};
	const handle_render_action_section = () => {
		if (quote_details === 'view') {
			return (
				<Grid
					item
					md={4}
					sm={3}
					xs={2}
					className={quote_details === 'view' ? classes.textAlignmentContainer : classes.buttonAlignmentContainer}>
					<CustomText
						onClick={handle_click}
						type='H6'
						color={theme?.button?.color}
						style={{
							cursor: 'pointer',
							textDecorationLine: theme?.order_management?.style?.text_decoration_line,
							...text_style,
						}}>
						{t('OrderManagement.Buttons.Edit')}
					</CustomText>
				</Grid>
			);
		} else {
			return (
				<Grid
					item
					md={5}
					sm={4}
					xs={12}
					className={quote_details === 'view' ? classes.textAlignmentContainer : classes.buttonAlignmentContainer}>
					<Box className={classes.buttonContainer} sx={is_small_screen ? { marginTop: '10px' } : {}}>
						<Button variant='outlined' onClick={() => handle_set_section_mode('quote_details', 'view')} width='100px'>
							{t('OrderManagement.Buttons.Cancel')}
						</Button>
						<Button variant='contained' onClick={handleSubmit(onSubmit)} loading={update_document_loader} loaderSize='20px' width='100%'>
							{t('OrderManagement.Buttons.Save')}
						</Button>
					</Box>
				</Grid>
			);
		}
	};

	const handle_check_mandatory = (props_data: any) => {
		const payload_keys: any = {};
		props_data?.attributes?.forEach((attr: any) => {
			if (attr?.required) {
				payload_keys[attr?.id] = attribute_data[attr.id];
			}
		});

		return _.isEmpty(payload_keys) ? false : allValuesEmpty(payload_keys);
	};

	const handle_render_edit_cta = () => {
		return (
			<Can I={PERMISSIONS.edit_orders.slug} a={PERMISSIONS.edit_orders.permissionType}>
				{is_editable && (show_edit_cta || is_editable_quote || is_editable_order) && handle_render_action_section()}
			</Can>
		);
	};

	const handle_render_order_section = () => {
		if (!_.isEmpty(data)) {
			return (
				<React.Fragment>
					<Grid item md={3} sm={4} xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
						<Grid>
							<CustomText
								type='H6'
								color={
									handle_check_mandatory(data)
										? theme?.order_management?.order_quote_section?.custom_valid_color
										: theme?.order_management?.order_quote_section?.custom_invalid_color
								}
								style={{ marginBottom: 1, ...text_style }}>
								{_.get(document_data, 'type') === 'quote' ? 'Quote Details' : 'Order Details'}
							</CustomText>
							{handle_check_mandatory(data) && (
								<CustomText
									type='Caption'
									style={{ fontSize: 13 }}
									color={theme?.order_management?.order_quote_section?.custom_valid_color}>
									{t('OrderManagement.UserDetailSection.Mandatory')}
								</CustomText>
							)}
						</Grid>
						{is_small_screen && quote_details === 'view' && handle_render_edit_cta()}
					</Grid>
					{handle_render_content_section()}
					{is_small_screen && quote_details === 'edit' && handle_render_edit_cta()}
					{!is_small_screen && handle_render_edit_cta()}
					{!is_ultron && (
						<hr
							style={{
								borderBottom: theme?.order_management?.order_manage_container?.hr_border_top,
								borderTop: '0',
								borderRadius: '0',
								marginInline: '0',
								marginBottom: '32px',
							}}></hr>
					)}
				</React.Fragment>
			);
		}
	};

	return (
		<Grid container className={is_ultron ? classes.gridContainerStyle : classes.storeFront_gridContainerStyle} my={is_ultron ? 2 : 0}>
			{handle_render_order_section()}
		</Grid>
	);
};

export default OrderQuoteDetailsSection;
