import React, { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Grid } from 'src/common/@the-source/atoms';
import OrderManagementContext from '../../context';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { EDIT_ORDER_BUYER_CONSTANT, PAYMENT_SECTION, STEPPER_CONSTANTS } from '../../constants';
import dayjs from 'dayjs';
import CustomText from 'src/common/@the-source/CustomText';
import utils, { allValuesEmpty } from 'src/utils/utils';
import useStyles from '../../styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { check_dynamic_attributes } from '../../helper/helper';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

interface Props {
	data: any;
	is_accordion?: boolean;
	container_style?: any;
	additional_styles?: any;
	show_attributes?: boolean;
}

const text_style = {
	fontSize: 14,
	maxWidth: '100%',
	wordWrap: 'break-word',
};

const PaymentDetailsSection: React.FC<Props> = ({
	data,
	is_accordion,
	container_style,
	additional_styles = {},
	show_attributes = false,
}) => {
	const {
		attribute_data,
		show_edit_cta,
		section_mode,
		handle_set_section_mode,
		handle_update_document,
		loader,
		// document_data,
		handle_update_edit_order_data,
		handle_update_edit_order_modal,
	} = useContext(OrderManagementContext);
	const theme: any = useTheme();

	const defaultValues = React.useMemo(() => {
		const defaults: Record<string, any> = {};
		data?.forEach((section: any) => {
			section?.attributes?.forEach((attr: any) => {
				const value = attribute_data[attr.id];
				defaults[attr.id] =
					value !== null && value !== undefined ? value : attr.value !== null && attr.value !== undefined ? attr.value : '';
			});
		});
		return defaults;
	}, [data, attribute_data]);

	const methods = useForm({
		defaultValues,
		shouldUnregister: false,
	});

	const is_editable_quote = useSelector((state: any) => state?.document?.is_editable_quote);
	const is_editable_order = useSelector((state: any) => state?.document?.is_editable_order);
	const { handleSubmit, reset, setValue } = methods;
	const { t } = useTranslation();
	const classes = useStyles();
	const is_small_screen = useMediaQuery('(max-width:600px)');
	const { payment } = section_mode;
	const { update_document_loader } = loader;
	let count = 0;
	const field_id = PAYMENT_SECTION;

	const queryParams: any = new URLSearchParams(location.search);
	const key = queryParams.get('step');
	const current_step = _.find(STEPPER_CONSTANTS, { key });

	const handle_back_change_fields = (payload_data: any) => {
		const document_attributes = attribute_data;
		const filtered_data = _.pickBy(payload_data, (value, _key) => {
			return !_.isEqual(document_attributes[_key], value);
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

		if (props_data && !is_back_saving_permitted) {
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

	const handle_is_editable = (_updated_data: any) => {
		const updated_data = _.map(_updated_data, (item) => {
			const all_attributes_enabled = _.every(item?.attributes, ['disabled', true]);

			return {
				...item,
				is_editable: !all_attributes_enabled,
			};
		});
		return updated_data;
	};

	const handle_transform_data = (props_data: any) => {
		const updated_data = _.map(props_data, add_key_to_attributes)?.filter((ele) => {
			if (ele?.is_display) return true;
			return ele?.attributes?.some((attr: any) => attr?.view_only && show_attributes);
		});
		const tranformed_data = handle_is_editable(updated_data);
		return tranformed_data;
	};

	const handle_check_mandatory = (props_data: any, is_attribute?: boolean) => {
		const payload_keys: any = {};
		if (!is_attribute) {
			props_data?.forEach((obj: any) => {
				obj?.attributes?.forEach((attr: any) => {
					if (attr?.required) {
						payload_keys[attr?.id] = attribute_data[attr?.id];
					}
				});
			});
		} else {
			props_data?.attributes?.forEach((attr: any) => {
				if (attr?.required) {
					payload_keys[attr?.id] = attribute_data[attr?.id];
				}
			});
		}
		return _.isEmpty(payload_keys) ? false : allValuesEmpty(payload_keys);
	};

	const handle_edit = () => {
		handle_set_section_mode('payment', 'edit');
		reset();
	};

	const handle_render_edit_cta = () => {
		return (
			<Grid item md={4} sm={3} textAlign={'right'} className={classes.textAlignmentContainer}>
				<CustomText
					onClick={handle_edit}
					type='H6'
					style={{
						cursor: 'pointer',
						color: theme?.button?.color,
						textDecorationLine: theme?.order_management?.style?.text_decoration_line,
						...text_style,
					}}>
					{is_ultron ? t('OrderManagement.Buttons.Edit') : t('OrderManagement.UserDetailSection.Manage')}
				</CustomText>
			</Grid>
		);
	};

	const handle_render_view_cta = () => {
		return (
			<Grid className={classes.textAlignmentContainer}>
				<Box className={classes.buttonContainer}>
					<Button variant='outlined' onClick={() => handle_set_section_mode('payment', 'view')} width='100px'>
						{t('OrderManagement.Buttons.Cancel')}
					</Button>
					<Button
						variant='contained'
						type='submit'
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
	const handle_view_payment_attribute = (view_attributes: any) => {
		return (
			<Grid container gap={1} flexDirection='column' my={is_ultron ? 1 : 0}>
				{view_attributes?.map((item: any) => {
					let options = item?.options;
					let label;

					switch (item?.dType) {
						case 'select':
							let filtered_data = _.filter(options, (option: any) => attribute_data[item?.id] === option?.value);
							label = !allValuesEmpty(filtered_data) ? _.map(filtered_data, 'label') : attribute_data[item?.id];
							break;
						case 'date':
							let date = attribute_data[item?.id] ? dayjs(attribute_data[item?.id])?.format('MM-DD-YYYY') : '';
							label = date;
							break;
						case 'phone_e164':
							label = utils.format_phone_number_e164(attribute_data[item?.id]);
							break;
						default:
							label = !_.isObject(attribute_data[item?.id]) ? attribute_data[item?.id] : '';
					}

					if (item?.is_display !== false) {
						return (
							<CustomText type='Body' color={allValuesEmpty(attribute_data[item?.id]) ? 'grey' : 'black'} style={{ ...text_style }}>
								{label || 'Not Added'}
							</CustomText>
						);
					}
				})}
			</Grid>
		);
	};

	const handle_edit_payment_attribute = (edit_attributes: any) => {
		const has_dynamic_attributes = check_dynamic_attributes(edit_attributes);
		return (
			<React.Fragment>
				{edit_attributes?.map((attribute: any) => {
					let options = attribute?.options;
					if (attribute?.is_display !== false)
						return (
							<Grid my={2}>
								<FormBuilder
									placeholder={attribute?.name}
									label={attribute?.name}
									name={attribute?.id || ''}
									validations={{
										required: Boolean(attribute?.required),
										number: attribute?.type === 'number',
										email: attribute?.key === 'email' || attribute?.id === 'email' || attribute?.type === 'email',
										phone: attribute?.id === 'phone' || attribute?.type === 'phone',
										...attribute?.validations,
									}}
									setValue={setValue}
									disabled={attribute?.disabled}
									defaultValue={attribute?.value || ''}
									type={attribute?.type}
									options={options}
									is_dynamic_attribute={attribute?.dynamic_attribute || false}
									has_dynamic_attrs={has_dynamic_attributes}
									attribute_id={attribute?.id}
								/>
							</Grid>
						);
					else return null;
				})}
			</React.Fragment>
		);
	};

	const handle_attributes = (item: any) => {
		const sorted_attributes = _.sortBy(item?.attributes, 'priority');

		return (
			<Grid item pl={0} md={5} sm={payment === 'view' ? 5 : 4} xs={payment === 'view' ? 5.5 : 12} gap={1.5}>
				{payment === 'view' ? (
					<React.Fragment>{handle_view_payment_attribute(sorted_attributes)}</React.Fragment>
				) : (
					<FormProvider {...methods}>
						<form>{handle_edit_payment_attribute(sorted_attributes)}</form>
					</FormProvider>
				)}
			</Grid>
		);
	};

	const render_action_button = (ele: any) => {
		return (
			<Can I={PERMISSIONS.edit_orders.slug} a={PERMISSIONS.edit_orders.permissionType}>
				{payment === 'view' &&
					count === 1 &&
					(show_edit_cta || is_editable_quote || is_editable_order) &&
					ele?.is_editable &&
					handle_render_edit_cta()}
			</Can>
		);
	};

	return (
		<Box
			className={is_ultron ? classes.gridContainerStyle : classes.storeFront_gridContainerStyle}
			p={is_accordion ? 0 : 'auto'}
			gap={1}
			style={container_style}>
			<Grid container gap={is_ultron ? 1.5 : 0}>
				{handle_transform_data(data)?.map((ele: any, index) => {
					count++;
					return (
						<Grid container display={'flex'} alignItems={'center'} key={ele?.title}>
							<Grid item md={3} sm={4} xs={8}>
								<CustomText
									type={'H6'}
									style={{ ...text_style, ...additional_styles }}
									color={handle_check_mandatory(ele, true) && !is_accordion ? '#D74C10' : 'black'}>
									{ele?.name}
								</CustomText>
								{handle_check_mandatory(ele, true) && !is_accordion && (
									<CustomText type='Caption' style={{ fontSize: 13 }} color='#D74C10'>
										{t('OrderManagement.UserDetailSection.Mandatory')}
									</CustomText>
								)}
							</Grid>
							{handle_attributes(ele)}
							{is_small_screen && (
								<Grid item md={3} sm={4} xs={6.5} mt={-3}>
									{render_action_button(ele)}
								</Grid>
							)}
							{!is_small_screen && render_action_button(ele)}
							{!is_ultron && handle_transform_data(data)?.length - 1 !== index && <hr></hr>}
						</Grid>
					);
				})}
				{payment === 'edit' && handle_render_view_cta()}
				{!is_ultron && handle_transform_data(data)?.length > 0 && current_step?.key === STEPPER_CONSTANTS.REVIEW.key && (
					<hr
						style={{
							borderBottom: theme?.order_management?.order_manage_container?.hr_border_top,
							borderTop: '0',
							borderRadius: '0',
							margin: '32px 0',
						}}></hr>
				)}
			</Grid>
		</Box>
	);
};

export default PaymentDetailsSection;
