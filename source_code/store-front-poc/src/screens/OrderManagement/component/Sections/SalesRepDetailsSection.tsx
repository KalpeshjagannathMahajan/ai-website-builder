import React, { useContext } from 'react';
import _ from 'lodash';
import { Box, Button, Grid } from 'src/common/@the-source/atoms';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import OrderManagementContext from '../../context';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { formattedValue } from 'src/utils/common';
import { DOCUMENT_SECTION } from '../../constants';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import {
	check_dynamic_attributes,
	generate_document_msg,
	get_default_values,
	get_transformed_form_attrs,
	handle_check_mandatory,
} from '../../helper/helper';
import { colors } from 'src/utils/theme';
import useStyles from '../../styles';

interface SalesRepDetailsSectionProps {
	data: any;
}

const MODES = {
	VIEW: 'view',
	EDIT: 'edit',
};
const DATE_KEY_MAP = {
	UPDATED: 'updated',
	CREATED: 'created',
};

const text_style = {
	fontSize: 14,
	maxWidth: '100%',
	wordWrap: 'break-word',
};

const msg_style = {
	fontSize: 13,
	fontStyle: 'normal',
	fontWeight: 400,
	whiteSpace: 'normal',
	overflow: 'hidden',
};

const SalesRepDetailsSection: React.FC<SalesRepDetailsSectionProps> = ({ data }) => {
	const { section_mode, handle_set_section_mode, handle_update_document, loader, document_data, get_order_info, attribute_data } =
		useContext(OrderManagementContext);
	const { document_type, doc_status } = useParams();
	const { t } = useTranslation();
	const methods = useForm({
		defaultValues: get_default_values(data?.attributes, document_data, true),
	});
	const { handleSubmit, setValue } = methods;
	const { sales_rep_details: mode } = section_mode;
	const { update_document_loader } = loader;
	const order_info = get_order_info(document_data, true);
	const is_view_mode = mode === MODES.VIEW;
	const classes = useStyles();

	const created_on_message = generate_document_msg(
		order_info?.created_by,
		DATE_KEY_MAP.CREATED,
		document_type as string,
		order_info?.created_on,
	);
	const updated_on_message = generate_document_msg(
		order_info?.updated_by,
		DATE_KEY_MAP.UPDATED,
		document_type as string,
		order_info?.update_on,
	);

	const on_submit = (props_data: any) => {
		if (!props_data) return;
		handle_update_document(props_data);
	};

	const toggle_mode = () => {
		const mode_to_set = mode === MODES.VIEW ? MODES.EDIT : MODES.VIEW;
		handle_set_section_mode(DOCUMENT_SECTION.sales_rep_details, mode_to_set);
	};

	const get_value_by_type = (item: any) => {
		return formattedValue(attribute_data?.[item?.id] ?? item?.value, item);
	};

	const render_edit_attribute = (edit_attributes: any) => {
		const has_dynamic_attributes = check_dynamic_attributes(edit_attributes);
		return (
			<Box gap={has_dynamic_attributes ? 1 : 2} display='flex' flexDirection='column'>
				{edit_attributes?.map((attribute: any) => {
					if (attribute?.view_only && !doc_status) return null;
					if (attribute?.is_display === false) return null;
					return (
						<FormBuilder
							key={attribute?.id}
							placeholder={attribute?.name}
							label={attribute?.name}
							name={attribute?.id}
							validations={{
								required: Boolean(attribute?.required),
								number: attribute?.type === 'number',
								email: ['email', 'phone'].includes(attribute?.type) || ['email', 'phone'].includes(attribute?.id),
								...attribute?.validations,
							}}
							setValue={setValue}
							disabled={attribute?.disabled}
							defaultValue={attribute?.value}
							type={attribute?.type}
							options={attribute?.options}
							is_dynamic_attribute={attribute?.dynamic_attribute || false}
							has_dynamic_attrs={has_dynamic_attributes}
							attribute_id={attribute?.id}
						/>
					);
				})}
			</Box>
		);
	};

	const render_edit_field = () => {
		const transformed_attributes_data = get_transformed_form_attrs(data, attribute_data);
		return (
			<FormProvider {...methods}>
				<form style={{ marginBottom: '6px' }}>{render_edit_attribute(transformed_attributes_data?.attributes)}</form>
			</FormProvider>
		);
	};

	const content_map = {
		[MODES.VIEW]: (
			<Box display='flex' gap={1.5} flexDirection='column'>
				{_.sortBy(data?.attributes, ['priority'])?.map((ele: any) => {
					if (ele?.view_only && !doc_status) return null;
					if (ele?.is_display === false) return null;
					return (
						<Box key={ele.key} mb={1.5}>
							<CustomText type='Body' style={text_style}>
								{ele?.name}
							</CustomText>
							<CustomText type='H6' style={text_style}>
								{get_value_by_type(ele)}
							</CustomText>
						</Box>
					);
				})}
			</Box>
		),
		[MODES.EDIT]: render_edit_field(),
	};

	const action_section_map = {
		[MODES.VIEW]: (
			<Grid item md={4} sm={3} xs={2} className={classes.textAlignmentContainer}>
				<CustomText
					onClick={toggle_mode}
					type='H6'
					color='#16885F'
					style={{
						cursor: 'pointer',
						...text_style,
					}}>
					{t('OrderManagement.Buttons.Edit')}
				</CustomText>
			</Grid>
		),
		[MODES.EDIT]: (
			<Grid item md={4} sm={4} xs={3} className={classes.buttonAlignmentContainer}>
				<Box className={classes.buttonContainer}>
					<Button variant='outlined' onClick={() => handle_set_section_mode(DOCUMENT_SECTION.sales_rep_details, MODES.VIEW)} width='100%'>
						{t('OrderManagement.Buttons.Cancel')}
					</Button>
					<Button variant='contained' onClick={handleSubmit(on_submit)} loading={update_document_loader} loaderSize='20px' width='100%'>
						{t('OrderManagement.Buttons.Save')}
					</Button>
				</Box>
			</Grid>
		),
	};

	const render_date_msg = (
		<Box mt={2} mb={1} display='flex' flexDirection='column' gap={1}>
			{updated_on_message && <CustomText style={msg_style}>{updated_on_message}</CustomText>}
			{created_on_message && <CustomText style={msg_style}>{created_on_message}</CustomText>}
		</Box>
	);

	return (
		<Grid container className={classes.gridContainerStyle} my={2}>
			<Grid item md={3} sm={4} xs={4.5}>
				<CustomText
					type='H6'
					color={handle_check_mandatory(data, document_data) ? colors.red : colors.black}
					style={{ marginBottom: 1, ...text_style }}>
					{t('OrderManagement.SalesRepDetailsSection.SalesRepDetails')}
				</CustomText>
				{handle_check_mandatory(data, document_data) && (
					<CustomText type='Caption' style={{ fontSize: 13 }} color={colors.red}>
						{t('OrderManagement.UserDetailSection.Mandatory')}
					</CustomText>
				)}
			</Grid>
			<Grid item md={is_view_mode ? 5 : 4} sm={is_view_mode ? 5 : 4} xs={is_view_mode ? 5.5 : 4}>
				{content_map[mode]}
				{render_date_msg}
			</Grid>
			{action_section_map[mode]}
		</Grid>
	);
};

export default SalesRepDetailsSection;
