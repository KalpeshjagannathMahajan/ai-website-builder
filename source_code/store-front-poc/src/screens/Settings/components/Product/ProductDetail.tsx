import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import { PDP } from './PDPmock';
import _ from 'lodash';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import utils from 'src/utils/utils';
import { useContext, useEffect, useState } from 'react';
import EditRailDrawer from '../Common/Drawer/EditRailDrawer';
import SettingsContext from '../../context';
import EditAttributesDrawer from '../Common/Drawer/EditAttributesDrawer';
import AddSection from '../Common/Drawer/AddSectionDrawer';
import settings from 'src/utils/api_requests/setting';
import { text_colors } from 'src/utils/light.theme';
import { transform_rails_for_app } from '../../utils/utils';

const ProductDetailsSetting = () => {
	const [drawer, set_drawer] = useState<any>({ state: false, data: null, type: null });
	const [attribute_drawer, set_attribute_drawer] = useState<boolean>(false);
	const [drawer_info, set_drawer_info] = useState({ data: null, type: '', section: '' });

	const [is_modal_open, set_is_modal_open] = useState<any>({ state: false, type: '', data: null });
	const { get_keys_configuration, configure, update_configuration, attribute_list, get_products } = useContext(SettingsContext);

	const handle_update_config = (data: any) => {
		update_configuration('pdp_page_config_web', data);
		let pdp_page_config = transform_rails_for_app(data);
		update_configuration('pdp_page_config', pdp_page_config);
	};
	const handle_close_modal = () => {
		set_is_modal_open({ state: false, type: '', data: null });
	};

	useEffect(() => {
		get_products();
		get_keys_configuration('pdp_page_config_web');
		get_keys_configuration('pdp_page_config');
	}, []);

	const handleRowDrag = ({ api }: { api: any }, key: any) => {
		const updated_data: any = [];
		api.forEachNode((node: any, index: number) => updated_data.push({ ...node?.data, priority: key === 'sections' ? index + 1 : index }));
		if (key === 'sections') {
			const [basic_element] = _.remove(updated_data, { key: 'basic_details' });
			if (basic_element) {
				updated_data.unshift({ ...basic_element, priority: 0 });
			}
		}
		handle_update_config({ ...configure?.pdp_page_config_web, [key]: updated_data });
	};

	const handle_save = (data: any) => {
		const updated_rails = _.map(configure?.pdp_page_config_web?.rails, (rail: any) => (rail?.type === data?.type ? data : rail));
		handle_update_config({ ...configure?.pdp_page_config_web, rails: updated_rails });
	};

	const should_disable_button = (data: any, key: string) => data?.key === 'basic_details' && key === 'delete';

	const handle_add_attribute = async (val: any, is_edit: boolean) => {
		let prod_options = _.head(val?.options)?.label
			? _.map(val?.options, (option) => option?.value)
			: _.map(val?.meta?.options, (option) => option?.value);
		let template: any = {
			entity: 'product',
			id: '',
			name: val?.name,
			data_type: val?.type,
			options: prod_options ?? [],
			meta: { options: (_.head(val?.options)?.label ? val?.options : val?.meta?.options) ?? [], default_value: val?.value ?? '' },
		};

		if (is_edit) {
			template = { ...template, id: val?.id };
		}
		try {
			await settings.update_attribute(template);
			get_products();
		} catch (err) {
			console.error(err);
		} finally {
			set_attribute_drawer(false);
		}
	};
	const handle_delete_attribute = async (data: any) => {
		try {
			await settings.delete_attribute({ entity: 'product', attribute_id: data?.id });
			get_products(true);
		} catch (err) {
			console.error(err);
		}
	};
	const setup_row_data = (key: any) => {
		const row_data: any = _.sortBy(configure?.pdp_page_config_web?.[key], ['priority']).map((item: any) => {
			if (key === 'sections') {
				return {
					...item,
					attributes: _.map(item?.attributes, (att) => ({
						...att,
						name: _.find(attribute_list, (attribute) => attribute?.id === att?.attribute_id)?.name,
						label: _.find(attribute_list, (attribute) => attribute?.id === att?.attribute_id)?.name,
						value: att?.attribute_id,
					})),
				};
			} else {
				return {
					...item,
					is_active: item?.is_active ?? true,
				};
			}
		});
		return row_data;
	};

	const get_att_list = (attributes: any) => {
		const current_attr_ids = _.map(attributes, (attr: any) => attr?.attribute_id);
		const attributes_array = _.flatMap(configure?.pdp_page_config_web?.sections, (item: any) => item?.attributes)?.map(
			(attribute: any) => attribute?.attribute_id,
		);
		const filtered_attr_list = _.filter(
			attribute_list,
			(item) => _.includes(current_attr_ids, item?.value) || !_.includes(attributes_array, item?.value),
		);
		return filtered_attr_list;
	};

	const handle_delete = () => {
		if (is_modal_open?.type === 'attribute') {
			handle_delete_attribute(is_modal_open?.data);
		} else {
			const updated_sections = _.filter(configure?.pdp_page_config_web?.sections, (sec: any) => sec?.key !== is_modal_open?.data?.key);
			handle_update_config({ ...configure?.pdp_page_config_web, sections: updated_sections });
		}
		set_is_modal_open({ state: false, type: '', data: null });
	};

	const handle_render_modal_footer = () => {
		return (
			<Grid display='flex' justifyContent='flex-end' gap={1.2}>
				<Button onClick={handle_close_modal} variant='outlined'>
					Back
				</Button>
				<Button onClick={handle_delete}>Confirm</Button>
			</Grid>
		);
	};

	const handle_render_modal_content = () => {
		return (
			<Grid>
				<CustomText type='Body'>{`Are you sure you want to delete this ${is_modal_open?.type}?`}</CustomText>
			</Grid>
		);
	};

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>Product Form and Rails</CustomText>
			</Grid>
			<Grid display='flex' direction='column' gap={2} mt={1}>
				{_.map(PDP, (section: any) => {
					const rowData = section?.key === 'custom_attributes' ? attribute_list : setup_row_data(section?.key);
					const height = rowData?.length * 50;

					const handle_edit = (params: any, key: string) => {
						if (key === 'delete') {
							set_is_modal_open({
								state: true,
								type: section?.key === 'custom_attributes' ? 'attribute' : 'section',
								data: params?.node?.data,
							});
						} else if (section?.key === 'custom_attributes') {
							set_drawer_info({ data: params?.node?.data, type: 'edit_field', section: '' });
							set_attribute_drawer(true);
						} else {
							set_drawer({ state: true, data: params?.node?.data, type: section?.key });
						}
					};

					const columnDef = [
						...section?.config,
						{ ...utils.create_action_config(section?.actions, handle_edit, 'Actions'), cellRendererParams: { should_disable_button } },
					];
					const handle_action_button = (key: string) => {
						if (key === 'attribute') {
							set_drawer_info({ data: null, type: 'add_field', section: '' });
							set_attribute_drawer(true);
						} else {
							set_drawer({ state: true, data: null, type: section?.key });
						}
					};

					return (
						<Grid display='flex' direction='column' gap={2} key={section?.key} alignItems='flex-start'>
							<Grid display='flex' direction='column'>
								<CustomText type='H6'>{section.title}</CustomText>
								<CustomText color={text_colors?.primary}>{section.subtitle}</CustomText>
							</Grid>
							<Grid width='100%'>
								<AgGridTableContainer
									onRowDragEnd={(event: any) => handleRowDrag(event, section?.key)}
									columnDefs={columnDef}
									hideManageColumn
									rowData={rowData}
									containerStyle={{ height: `${height + 100}px`, maxHeight: '500px' }}
									showStatusBar={false}
								/>
								{section?.action_button && (
									<Grid py={1} my={1}>
										<Button
											variant='text'
											disabled={section?.action_button?.key === 'section' ? get_att_list([])?.length === 0 : false}
											onClick={() => handle_action_button(section?.action_button?.key)}>
											{section?.action_button?.title}
										</Button>
									</Grid>
								)}
							</Grid>
						</Grid>
					);
				})}
			</Grid>
			{attribute_drawer && (
				<AddSection
					drawer={attribute_drawer}
					set_drawer={set_attribute_drawer}
					type={drawer_info?.type}
					data={drawer_info?.data}
					on_add={handle_add_attribute}
					section={drawer_info?.section}
					source='product'
				/>
			)}

			{drawer?.state && drawer?.type === 'rails' && (
				<EditRailDrawer
					is_visible={drawer?.state}
					data={drawer?.data}
					close={() => set_drawer({ state: false, data: null, type: null })}
					handle_save={handle_save}
				/>
			)}
			{drawer?.state && drawer?.type === 'sections' && (
				<EditAttributesDrawer
					is_visible={drawer?.state}
					data={drawer?.data}
					close={() => set_drawer({ state: false, data: null, type: null })}
					all_attributes={get_att_list(drawer?.data?.attributes)}
					type={drawer?.type}
					prefilled_attributes={_.map(drawer?.data?.attributes, (attribute: any) => attribute?.attribute_id)}
				/>
			)}
			<Modal
				width={420}
				open={is_modal_open?.state}
				onClose={handle_close_modal}
				title='Confirm delete'
				footer={handle_render_modal_footer()}
				children={handle_render_modal_content()}
			/>
		</Grid>
	);
};

export default ProductDetailsSetting;
