import React, { useContext } from 'react';
import OrderManagementContext from '../../context';
import { FormProvider, useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Box, Button, Grid } from 'src/common/@the-source/atoms';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';
import { t } from 'i18next';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import _ from 'lodash';
import { allValuesEmpty } from 'src/utils/utils';
import { EDIT_ORDER_BUYER_CONSTANT, TERMS_SECTION } from '../../constants';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import { check_dynamic_attributes } from '../../helper/helper';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

function TermsSection({ data, is_accordion, container_style }: any) {
	const {
		section_mode,
		handle_set_section_mode,
		handle_update_document,
		loader,
		attribute_data,
		document_data,
		handle_update_edit_order_data,
		handle_update_edit_order_modal,
	} = useContext(OrderManagementContext);
	const classes = useStyles();
	const theme: any = useTheme();

	const { update_document_loader } = loader;
	const methods = useForm({ mode: 'onChange' });
	const { formState, handleSubmit } = methods;
	const { isDirty } = formState;
	const field_id = TERMS_SECTION;

	const handle_back_change_fields = (payload_data: any) => {
		const document_attributes = document_data?.attributes;
		const filtered_data = _.pickBy(payload_data, (value, key) => {
			return !_.isEqual(document_attributes[key], value);
		});
		return filtered_data;
	};

	const handle_is_back_saving_permitted = (payload_data: any) => {
		const all_attributes = _.flatMap(data, (section) => _.filter(section?.attributes, (attr) => payload_data[attr?.id]));
		return _.some(all_attributes, 'back_saving_permitted');
	};

	const on_submit = (props_data: any) => {
		if (!props_data) {
			return;
		}

		let payload = handle_back_change_fields(props_data);
		let is_back_saving_permitted = handle_is_back_saving_permitted(payload);
		if (is_back_saving_permitted) {
			handle_update_edit_order_modal(true, field_id);
		}

		if (!is_back_saving_permitted) {
			handle_update_document({ ...payload });
		} else {
			handle_update_edit_order_data(EDIT_ORDER_BUYER_CONSTANT.payload, { ...payload });
		}
	};

	const add_key_to_attributes = (object: any) => {
		const updatedAttributes = _.map(object?.attributes, (attribute) =>
			_.assign({}, attribute, { key: attribute?.id, dType: attribute?.type, value: attribute_data[attribute?.id] }),
		);
		return _.assign({}, object, { attributes: updatedAttributes });
	};

	const handle_transform_data = (props_data: any) => {
		const updated_data = _.map(props_data, add_key_to_attributes);
		return updated_data;
	};

	const handle_check_mandatory = (props_data: any) => {
		const payload_keys: any = {};
		props_data?.attributes?.forEach((attr: any) => {
			if (attr?.required) {
				payload_keys[attr?.id] = attribute_data[attr?.id];
			}
		});
		return _.isEmpty(payload_keys) ? false : allValuesEmpty(payload_keys);
	};

	const handle_mandatory = (terms: any) => {
		return (
			<>
				{handle_check_mandatory(terms) && !is_accordion && (
					<CustomText type='Caption' style={{ fontSize: 13 }} color={theme?.order_management?.terms_section?.custom_color}>
						{t('OrderManagement.UserDetailSection.Mandatory')}
					</CustomText>
				)}
			</>
		);
	};

	const handle_render_view_terms = () => {
		return data?.map((terms: any) => {
			return (
				<Grid container flexDirection={'column'} key={terms?.name}>
					<CustomText
						type='Subtitle'
						color={
							handle_check_mandatory(terms) && !is_accordion
								? theme?.order_management?.terms_section?.custom_valid_color
								: theme?.order_management?.terms_section?.custom_invalid_color
						}>
						{terms?.name}
					</CustomText>
					{handle_mandatory(terms)}
					<Grid>
						{terms?.attributes?.map((item: any) => (
							<CustomText key={item?.name}>{attribute_data[item?.id] || ''}</CustomText>
						))}
					</Grid>
				</Grid>
			);
		});
	};

	const handle_render_edit_terms = () => {
		const transformed_data = handle_transform_data(data);
		const has_dynamic_attributes = check_dynamic_attributes(transformed_data);
		return transformed_data?.map((terms: any) => {
			return (
				<Grid container flexDirection={'column'} key={terms?.id}>
					<Box mb={2}>
						<CustomText
							type='Subtitle'
							color={
								handle_check_mandatory(terms) && !is_accordion
									? theme?.order_management?.terms_section?.custom_valid_color
									: theme?.order_management?.terms_section?.custom_invalid_color
							}>
							{terms?.name}
						</CustomText>
						{handle_mandatory(terms)}
					</Box>

					<FormProvider {...methods}>
						<form>
							{terms?.attributes?.map((attribute: any) => (
								<FormBuilder
									placeholder={attribute.name}
									label={attribute?.name}
									name={attribute?.id}
									multiline={true}
									validations={{
										required: Boolean(attribute.required),
										number: attribute.type === 'number',
										email: attribute.key === 'email' || attribute.id === 'email' || attribute.type === 'email',
										phone: attribute.id === 'phone' || attribute.type === 'phone',
										...attribute?.validations,
									}}
									disabled={attribute?.disabled}
									defaultValue={attribute?.value}
									type={attribute?.type}
									is_dynamic_attribute={attribute?.dynamic_attribute || false}
									has_dynamic_attrs={has_dynamic_attributes}
									attribute_id={attribute?.id}
								/>
							))}
						</form>
					</FormProvider>
				</Grid>
			);
		});
	};

	const handle_render_view_cta = () => {
		return (
			<Grid className={classes.textAlignmentContainer} py={1}>
				<Box className={classes.buttonContainer}>
					<Button variant='outlined' onClick={() => handle_set_section_mode('terms', 'view')} width='100px'>
						{t('OrderManagement.Buttons.Cancel')}
					</Button>
					<Button
						variant='contained'
						type='submit'
						disabled={!isDirty}
						loading={update_document_loader}
						loaderSize='20px'
						onClick={handleSubmit(on_submit)}
						sx={{
							minWidth: '100px',
						}}>
						{t('OrderManagement.Buttons.Save')}
					</Button>
				</Box>
			</Grid>
		);
	};

	const handle_render_terms_section = () => {
		if (is_accordion) {
			return handle_render_view_terms();
		} else {
			return (
				<Grid container bgcolor={theme?.order_management?.terms_section?.grid_container_bgcolor}>
					<Grid item md={8} sm={8} xs={12} lg={8} xl={8} gap={1.5}>
						{section_mode?.terms === 'view' ? handle_render_view_terms() : handle_render_edit_terms()}
					</Grid>

					<Can I={PERMISSIONS.edit_orders.slug} a={PERMISSIONS.edit_orders.permissionType}>
						<Grid item md={4} sm={4} xs={4} lg={4} xl={4} textAlign='right' className={classes.textAlignmentContainer}>
							{section_mode?.terms === 'view' && (
								<CustomText
									type='Subtitle'
									onClick={() => handle_set_section_mode('terms', 'edit')}
									style={{
										cursor: 'pointer',
										color: theme?.button?.color,
									}}>
									{t('OrderManagement.Buttons.Edit')}
								</CustomText>
							)}
						</Grid>
					</Can>
				</Grid>
			);
		}
	};

	return (
		<React.Fragment>
			{!_.isEmpty(data) && (
				<Box
					className={is_accordion ? classes.orderMoreSectionContainerV2 : classes.orderMoreSectionContainer}
					my={is_ultron ? 2 : ''}
					style={container_style}>
					{!_.isEmpty(data) && handle_render_terms_section()}
					{section_mode?.terms === 'edit' && handle_render_view_cta()}
				</Box>
			)}
		</React.Fragment>
	);
}

export default TermsSection;
