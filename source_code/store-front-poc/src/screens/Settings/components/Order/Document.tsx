import { useContext, useEffect, useState } from 'react';
import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Accordion, Button, Grid, Icon, Switch } from 'src/common/@the-source/atoms';
import SettingsContext from '../../context';
import _ from 'lodash';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import {
	BUYER_INFO,
	EXCLUDE_ADD_MORE_FIELDS,
	ORDER_CONSTANTS_PAYMENT,
	buyer_info_columns,
	order_details_config,
	payment_method_config,
} from '../../utils/constants';
import AddSection from '../Common/Drawer/AddSectionDrawer';
import utils from 'src/utils/utils';
import ViewSettingDrawer from '../Common/Drawer/ViewSettingDrawer';
import { order_info_setting } from '../Common/Drawer/template';
import settings from 'src/utils/api_requests/setting';
import { isUUID } from '../../utils/helper';
import DraggableList from '../Common/Dnd/DraggableList';
import Loading from 'src/screens/Loading/Loading';
import RenameSectionModal from '../Common/Modals/RenameSectionModal';

const IDS_TO_STOP_ATTRIBUTE: string[] = ['4dd00c29-7815-4c99-b1b4-b1e45e1e6949', 'a7d79b6e-9480-4451-89ae-48155d91f018'];

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

const Document = () => {
	const {
		configure,
		get_keys_configuration,
		transform_document,
		handle_delete_section,
		update_configuration,
		is_loading,
		set_is_loading,
		setting_to_customer,
	} = useContext(SettingsContext);
	const is_internal_app = import.meta.env.VITE_APP_INTERNAL_TOOL === 'true';
	const [drawer, set_drawer] = useState<boolean>(false);
	const [type, set_type] = useState<string>('');
	const [data, set_data] = useState<any>(null);
	const [selected_section, set_selected_section] = useState<any>({});
	const [section_key, set_section_key] = useState<string>('');
	const [open_setting, set_open_setting] = useState<boolean>(false);
	const [attr, set_attr] = useState<any>({});
	const [rename_modal, set_rename_modal] = useState<boolean>(false);

	const document_settings = _.map(configure?.order_settings?.sections, (section: any) => {
		const quote_att = _.find(configure?.quote_settings?.sections, (at_item: any) => at_item?.key === section.key);
		if (section.key === 'send_emails_to') {
			return {
				...section,
				attributes: _.map(section?.attributes, (att) => {
					return {
						...att,
						is_quote_mandatory: _.find(quote_att?.attributes, (attribute) => attribute?.id === att.id)?.required ?? false,
						is_quote_display: _.find(quote_att?.attributes, (attribute) => attribute?.id === att.id)?.is_display ?? false,
					};
				}),
				is_mandatory: false,
				is_quote_mandatory: false,
				is_quote_display:
					_.find(configure?.quote_settings?.sections, (att) => att?.key === section.key)?.is_display ??
					section?.is_quote_display ??
					section?.is_display ??
					false,
			};
		} else {
			return {
				...section,
				attributes: _.map(section?.attributes, (att) => {
					return {
						...att,
						is_display: att?.is_display ?? true,
						is_quote_mandatory: _.find(quote_att?.attributes, (attribute) => attribute?.id === att.id)?.required ?? false,
						is_quote_display: _.find(quote_att?.attributes, (attribute) => attribute?.id === att.id)?.is_display ?? false,
					};
				}),
				is_display: section?.is_display ?? true,
				is_quote_mandatory: _.find(configure?.quote_settings?.sections, (att) => att?.key === section.key)?.is_mandatory ?? true,
				is_quote_display:
					_.find(configure?.quote_settings?.sections, (att) => att?.key === section.key)?.is_display ?? section?.is_quote_display ?? true,
			};
		}
	});

	const handle_order_permission = (field_key: string) => {
		let updated_data: any = {};

		updated_data = {
			...configure?.order_form_permissions,
			[field_key]: {
				...configure?.order_form_permissions?.[field_key],
				users_with_edit_permissions: 'all',
				roles_with_edit_permissions: [],
				roles_with_back_saving_permissions: [],
				users_with_back_saving_permissions: [],
			},
		};
		update_configuration('order_form_permissions', updated_data);
	};

	const handle_quote_permission = (field_key: string) => {
		let updated_data: any = {};

		updated_data = {
			...configure?.quote_form_permissions,
			[field_key]: {
				...configure?.quote_form_permissions?.[field_key],
				users_with_edit_permissions: 'all',
				roles_with_edit_permissions: [],
				roles_with_back_saving_permissions: [],
				users_with_back_saving_permissions: [],
			},
		};
		update_configuration('quote_form_permissions', updated_data);
	};

	useEffect(() => {
		get_keys_configuration('order_settings');
		get_keys_configuration('quote_settings');
		get_keys_configuration('order_form_permissions');
		get_keys_configuration('quote_form_permissions');
	}, []);

	const handle_attribute = async (att_data: any, action: string) => {
		let template: any = {
			entity: 'document',
			id: '', // if id empty it will create new else it will update existing attribute by id
			alias: att_data?.name?.toLowerCase()?.replace(' ', '_'),
			name: att_data?.name,
			data_type: att_data?.type,
			is_mandatory: att_data?.is_mandatory,
			is_filterable: true,
			is_searchable: true,
			is_internal: true,
			is_showroom_enabled: att_data?.enabled_for_showroom,
			configuration: { default_value: att_data?.value }, // Optional field - Dict or list
		};
		if (att_data?.dynamic_attr_config && att_data?.dynamic_attribute) {
			const { attribute_class } = att_data?.dynamic_attr_config;
			template = {
				...template,
				configuration: {
					...template.configuration,
					attribute_class,
				},
			};
		}

		if (action === 'edit') {
			template = att_data?.options
				? { ...template, id: att_data?.id, configuration: { ...template.configuration, options: att_data?.options } }
				: { ...template, id: att_data?.id };
		} else {
			template = att_data?.options ? { ...template, configuration: { options: att_data?.options } } : template;
		}

		try {
			const res: any = await settings.update_attribute(template);
			set_is_loading(false);
			return res?.data?.id;
		} catch (err) {
			set_is_loading(false);
			console.log(err);
		}
	};

	const buyer_info: any = _.filter(document_settings, (item) => BUYER_INFO.includes(item?.key));
	const order_details: any = _.filter(document_settings, (item) => !BUYER_INFO.includes(item?.key));
	const handleRowDrag = ({ api }: { api: any }) => {
		const new_sorted_data: any = [];
		api.forEachNode((node: any, index: any) => {
			new_sorted_data?.push({ ...node.data, priority: index });
		});

		let help: any;
		if (section_key) {
			help = _.map(document_settings, (item) => {
				if (item?.key === section_key) {
					return {
						...item,
						attributes: new_sorted_data,
					};
				}
				return item;
			});
			transform_document(help);
		}
	};
	const add = async (val: any, is_edit: boolean, section_name?: string) => {
		set_is_loading(true);
		const new_section_key = crypto.randomUUID();
		const is_present = _.some(document_settings, (section) => section?.key === new_section_key);
		if (type === 'add_section' && !is_present) {
			const section_data = document_settings;
			const new_section: any = {
				key: val?.section_name?.toLowerCase()?.replace(' ', '_'),
				name: val?.section_name,
				priority: section_data?.length,
				is_display: true,
				required: val?.required,
				is_quote_display: true,
				is_quote_mandatory: val?.is_quote_mandatory,
			};
			delete val?.section_name;
			let new_id = await handle_attribute(val, 'create');

			if (new_id) {
				new_section.attributes = [{ ...val, id: new_id, value: val?.value || '', priority: 0 }];
				handle_order_permission(new_id);
				handle_quote_permission(new_id);
				transform_document([...section_data, new_section]);
			}
		} else {
			let section_data: any = {};
			if (_.isEmpty(section_key)) {
				section_data = _.find(document_settings, new_section_key ? { key: new_section_key } : { name: section_name });
			} else {
				section_data = _.find(document_settings, { key: section_key || new_section_key });
			}

			let section_attributes = section_data?.attributes;
			if (is_edit) {
				if (isUUID(val?.id) && !IDS_TO_STOP_ATTRIBUTE?.includes(val?.id)) await handle_attribute(val, 'edit');

				section_attributes = _.map(section_attributes, (attribute: any) => (attribute?.id === val.id ? { ...val } : attribute));
			} else {
				let new_id = await handle_attribute(val, 'create');
				section_attributes?.push({
					...val,
					id: new_id,
					priority: section_attributes?.length,
					value: val?.value || '',
				});
				handle_order_permission(new_id);
				handle_quote_permission(new_id);
			}

			const updated_order_sections = document_settings.map((section) => {
				if ((section_key && section_key === section?.key) || (!section_key && section_name === section?.name)) {
					return { ...section, attributes: section_attributes };
				}
				return section;
			});

			transform_document(updated_order_sections);
		}
		set_drawer(false);
	};
	const handle_edit_section = (params: any) => {
		set_open_setting(true);
		set_attr(params?.node?.data);
	};

	const buyer_config = [...buyer_info_columns, utils.create_action_config(actions, handle_edit_section, 'Actions')];
	const show_details = setting_to_customer ? _.filter(order_details, { key: 'order_details' }) : order_details;

	const handleDrop = (list?: any) => {
		set_is_loading(true);
		const updated_list = _.map(list, ({ label, key }) => ({ label, value: key }));

		let updated_buyer_sections: any[] = buyer_info;
		updated_list.map((item: any, index: number) => {
			const section_item = _.find(order_details, (att) => {
				if (item?.value) {
					return att?.key === item?.value;
				} else {
					return att?.name === item?.label;
				}
			});
			updated_buyer_sections.push({ ...section_item, priority: index });
		});
		transform_document(updated_buyer_sections);
	};

	const handle_add_fields = (item: any) => {
		set_data(null);
		set_selected_section(item);
		set_type('add_field');
		set_drawer(true);
		set_section_key(item?.key);
	};

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>Order and quote</CustomText>
				{is_internal_app && (
					<Button
						onClick={() => {
							set_data(null);
							set_drawer(true);
							set_type('add_section');
						}}>
						Add Section
					</Button>
				)}
			</Grid>
			<Grid display='flex' flexDirection='column' py={'2rem'}>
				{is_internal_app && (
					<Grid display='flex' flexDirection='column' mb={'0.5rem'}>
						<Accordion
							content={[
								{
									title: (
										<Grid display='flex' gap={1}>
											<Icon iconName='IconGripVertical' sx={{ color: 'rgba(103, 109, 119, .3)' }} />
											<CustomText type='H6' style={{ marginBottom: '2rem' }}>
												Customer Info
											</CustomText>
										</Grid>
									),
									expandedContent: (
										<AgGridTableContainer
											columnDefs={buyer_config}
											hideManageColumn
											rowData={buyer_info}
											containerStyle={{ height: '350px' }}
											showStatusBar={false}
										/>
									),
								},
							]}
							id={'buyer_info_document'}
							style={{ borderBottom: '1px solid #D1D6DD' }}
							contentBackground='#FFF'
						/>
					</Grid>
				)}
				<Grid display='flex' flexDirection='column' justifyContent='flex-start' mb={2}>
					<DraggableList
						onDrop={handleDrop}
						droppable_id='sections'
						fixed_top_rows={0}
						list={_.map(show_details, (item: any) => {
							const handle_edit = (params: any) => {
								set_section_key(item?.key);
								set_data(params?.node?.data);
								set_type('edit_field');
								set_drawer(true);
							};

							const order_config = [...order_details_config, utils.create_action_config(actions, handle_edit, 'Actions')];

							const rowlength = item?.attributes.length;
							const rowData = _(item?.attributes).sortBy(['priority']).value();
							return {
								node: (
									<Accordion
										content={[
											{
												title: (
													<Grid display='flex' flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} mb={1}>
														<Grid display='flex' gap={1}>
															<Icon
																iconName='IconGripVertical'
																sx={{ color: item?.key !== 'order_details' ? 'rgba(103, 109, 119, 1)' : 'rgba(103, 109, 119, .3)' }}
															/>
															<CustomText type='H6'>{item?.name}</CustomText>
														</Grid>
														{
															<Grid display='flex' flexDirection='row' flexWrap='nowrap' alignItems='center' gap={1} ml={'auto'}>
																<CustomText type='Body'>Show in Order</CustomText>
																<Switch
																	checked={item?.is_display}
																	onClick={(e) => e.stopPropagation()}
																	onChange={() => {
																		handle_delete_section(item?.key, 'order_settings', 'is_display');
																	}}
																/>
																{!ORDER_CONSTANTS_PAYMENT.includes(item?.key) && (
																	<>
																		<CustomText type='Body'>Show in Quote</CustomText>
																		<Switch
																			onClick={(e) => e.stopPropagation()}
																			checked={item?.is_quote_display !== false}
																			onChange={() => {
																				handle_delete_section(item?.key, 'quote_settings', 'is_display');
																			}}
																		/>
																	</>
																)}
															</Grid>
														}
														{item?.key !== 'order_details' && (
															<Icon
																iconName='IconEdit'
																onClick={(e: any) => {
																	e.stopPropagation();
																	set_rename_modal(true);
																	set_selected_section(item);
																}}
															/>
														)}
													</Grid>
												),
												expandedContent: (
													<>
														<AgGridTableContainer
															onRowDragEnd={(e: any) => {
																handleRowDrag(e);
																set_section_key(item?.key);
															}}
															columnDefs={!ORDER_CONSTANTS_PAYMENT.includes(item?.key) ? order_config : payment_method_config}
															hideManageColumn
															rowData={rowData}
															containerStyle={{ height: `${50 + rowlength * 50}px`, maxHeight: '700px', minHeight: '150px' }}
															showStatusBar={false}
														/>
														{!EXCLUDE_ADD_MORE_FIELDS.includes(item?.key) && (
															<Button variant='text' sx={{ marginTop: '8px', width: '15rem' }} onClick={() => handle_add_fields(item)}>
																+ Add more fields
															</Button>
														)}
													</>
												),
											},
										]}
										style={{ borderBottom: '1px solid #D1D6DD' }}
										contentBackground='#FFF'
										id={'document_other_sections'}
									/>
								),
								label: item?.name,
								onDelete: () => {},
								deleteable: false,
								key: item?.key,
								dragable: item?.key !== 'order_details',
								show_icon: false,
							};
						})}
					/>
				</Grid>
			</Grid>
			{rename_modal && (
				<RenameSectionModal
					open={rename_modal}
					on_close={set_rename_modal}
					section={selected_section}
					form={'order_settings'}
					data={{ sections: configure?.order_settings?.sections }}
				/>
			)}
			{drawer && (
				<AddSection
					drawer={drawer}
					set_drawer={set_drawer}
					type={type}
					data={data}
					on_add={add}
					section={selected_section}
					source='order'
				/>
			)}
			{open_setting && (
				<ViewSettingDrawer
					drawer={open_setting}
					set_drawer={set_open_setting}
					attribute={attr}
					keys={'document'}
					template={order_info_setting}
					data={configure?.order_settings?.sections}
				/>
			)}
			{is_loading && (
				<Grid
					sx={{
						background: 'white',
						opacity: 0.4,
						width: '70%',
						position: 'fixed',
						top: '8rem',
						right: '8rem',
						height: '100vh',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<Loading />
				</Grid>
			)}
		</Grid>
	);
};

export default Document;
