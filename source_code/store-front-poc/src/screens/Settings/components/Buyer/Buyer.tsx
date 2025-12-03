/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable array-callback-return */
import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Accordion, Button, Grid, Icon, Switch } from 'src/common/@the-source/atoms';
import RenameSectionModal from '../Common/Modals/RenameSectionModal';
import { useContext, useState, useEffect } from 'react';
import { SECTION_DEFAULTS, buyer_sections } from './mock';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import AddSection from '../Common/Drawer/AddSectionDrawer';
import SettingsContext from '../../context';
import utils from 'src/utils/utils';
import _ from 'lodash';
import settings from 'src/utils/api_requests/setting';
import { isUUID } from '../../utils/helper';
import Loading from 'src/screens/Loading/Loading';
import DraggableList from '../Common/Dnd/DraggableList';
import { Divider } from '@mui/material';
import DisplayDrawer from './DisplayDrawer';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

const SECTIONS_ADD_FIELDS = ['other_details', 'contacts', 'addresses'];
export const SECTION_DISPLAY_FIELDS = ['contacts', 'addresses'];

const Buyer = () => {
	const {
		configure,
		update_configuration,
		get_keys_configuration,
		get_org_setting_keys_configuration,
		handle_delete_section,
		transform_buyer,
		handle_quick_add_section,
		is_loading,
		set_is_loading,
		cleanup_contact_address,
		handle_update_buyer_address,
		buyer_details_update,
	} = useContext(SettingsContext);
	const [rename_modal, set_rename_modal] = useState<boolean>(false);
	const [selected_section, set_selected_section] = useState<any>({});
	const [drawer, set_drawer] = useState<boolean>(false);
	const [display_drawer, set_display_drawer] = useState<{ open: boolean; key: string }>({ open: false, key: '' });
	const [type, set_type] = useState<string>('');
	const [data, set_data] = useState<any>(null);
	const [section_key, set_section_key] = useState<string>('');
	const [buyer_form_items, set_buyer_form_items] = useState<any>([]);
	const quick_buyer_sections = configure?.quick_buyer_form?.sections || [];
	const buyer_address = _.find(configure?.details_buyer_form?.sections, { key: 'addresses' });
	let quick_buyer_address_section = _.find(quick_buyer_sections, { key: 'addresses' });

	quick_buyer_address_section = quick_buyer_address_section
		? {
				...quick_buyer_address_section,
				is_display_exclusion_type: quick_buyer_address_section?.is_display_exclusion_type
					? quick_buyer_address_section?.is_display_exclusion_type
					: quick_buyer_address_section?.is_display
					? []
					: ['billing', 'shipping'],
		  }
		: {
				...buyer_address,
				is_display_exclusion_type: ['billing', 'shipping'],
				required_exclusion_type: buyer_address?.required ? [] : ['billing', 'shipping'],
		  };

	const handle_buyer = async () => {
		let temp_sol = await transform_buyer(configure?.details_buyer_form?.sections);
		set_buyer_form_items(temp_sol);
		set_is_loading(false);
	};
	const get_entity = (entity_key: string) => {
		switch (entity_key) {
			case 'contacts':
				return 'contact';
			case 'addresses':
				return 'address';
			default:
				return 'buyer';
		}
	};

	const handle_buyer_permission = (field_key: string) => {
		let updated_data: any = {};

		updated_data = {
			...configure?.buyer_form_permissions,
			attributes: {
				...configure?.buyer_form_permissions?.attributes,
				[field_key]: {
					...configure?.buyer_form_permissions?.[field_key],
					users_with_edit_permissions: 'all',
					roles_with_edit_permissions: 'all',
				},
			},
		};

		update_configuration('buyer_form_permissions', updated_data);
	};
	const handle_attribute = async (att_data: any, action: string, entity_name: string) => {
		let template: any = {
			entity: entity_name,
			id: '',
			name: att_data?.name,
			data_type: att_data?.type,
			include: att_data?.is_display,
			configuration: { default_value: att_data?.value, validations: att_data?.validations || {} },
			priority: att_data?.priority,
			is_mandatory: att_data?.required,
		};

		if (action === 'edit') {
			template = { ...template, id: att_data?.id };
		}

		if (entity_name === 'address') {
			template = {
				...template,
				configuration: {
					...template.configuration,
					required_exclusion_type: att_data?.required_exclusion_type,
					is_display_exclusion_type: att_data?.is_display_exclusion_type,
					is_label_display: att_data?.is_label_display,
				},
				is_mandatory: att_data?.required_exclusion_type?.length < 2 ? true : false,
				include: true,
			};
		}

		if (entity_name === 'contact') {
			template = {
				...template,
				configuration: {
					...template.configuration,
					is_label_display: att_data?.is_label_display,
				},
			};
		}

		if (att_data?.options) {
			template = { ...template, configuration: { ...template.configuration, options: att_data.options } };
		}

		const response_attribute: any = await settings.update_attribute(template);
		get_org_setting_keys_configuration('display_priority');
		if (action !== 'edit' && entity_name === 'buyer') {
			handle_buyer_permission(response_attribute?.data?.id);
		}
		handle_buyer();
	};

	const add = async (new_val: any, is_edit: boolean) => {
		set_is_loading(true);

		if (new_val?.validations) {
			new_val.validations = _.omitBy(new_val.validations, _.isUndefined);

			if (new_val?.validations?.maxLength) {
				new_val.validations.maxLength = Number(new_val.validations.maxLength);
			}
			if (new_val?.validations?.minLength) {
				new_val.validations.minLength = Number(new_val.validations.minLength);
			}
		}

		const val = { ...new_val, value: new_val?.type === 'percentage' ? _.toNumber(new_val?.value) : new_val?.value };

		const section_data = _.find(buyer_form_items, { key: section_key });
		let section_attributes =
			section_key === 'contacts' || section_key === 'addresses'
				? section_data?.[section_key]?.[0]?.attributes
				: section_key === 'other_details'
				? section_data.custom_attributes
				: section_data?.attributes;

		if (!is_edit) {
			await handle_attribute(val, 'create', get_entity(section_key));
		} else if (isUUID(val?.id)) {
			await handle_attribute(val, 'edit', get_entity(section_key));
		} else {
			section_attributes = _.map(section_attributes, (attribute: any) => (attribute?.id === val.id ? val : attribute));
			const filtered_section_attributes = _.filter(section_attributes, (att: any) => !isUUID(att?.id));
			const updated_buyer_sections = _.map(buyer_form_items, (section: any) => {
				if (section_key === section?.key) {
					if (section_key === 'contacts' || section_key === 'addresses') {
						let firstElement = { ...section[section_key][0] };
						firstElement.attributes = filtered_section_attributes;
						return {
							...section,
							[section?.key]: [firstElement, ...section[section?.key].slice(1)],
						};
					} else if (section_key === 'other_details') {
						return { ...section, custom_attributes: section_attributes };
					} else {
						return { ...section, attributes: section_attributes };
					}
				} else {
					return section;
				}
			});

			/** Remove the uuid attribute in contact and addresses */
			const updated = cleanup_contact_address(updated_buyer_sections);

			update_configuration('details_buyer_form', { sections: updated });
		}

		set_drawer(false);
	};

	const handle_row_drop = (list?: any) => {
		set_is_loading(true);
		const updated_list = _.map(list, ({ label, key }) => ({ label, value: key }));
		let updated_buyer_sections: any[] = [];
		updated_list.map((item: any, index: number) => {
			const section_item = _.find(buyer_form_items, (att) => att.key === item?.value);
			updated_buyer_sections.push({ ...section_item, priority: index });
		});
		update_configuration('details_buyer_form', { sections: cleanup_contact_address(updated_buyer_sections) });
	};

	const handle_mandatory_buyer_address = (section: any, key: string, is_included: boolean) => {
		const updated_required_exclusion_type = is_included
			? section.required_exclusion_type.filter((item: string) => item !== key)
			: [...(section.required_exclusion_type || []), key];

		const unique_values = Array.from(new Set(updated_required_exclusion_type));
		const required_key = updated_required_exclusion_type?.length < 2 ? true : false;

		const updated_quick_section = _.map(quick_buyer_sections, (item) => {
			if (item?.key === 'addresses') {
				return { ...item, required_exclusion_type: unique_values, required: required_key };
			}
			return item;
		});

		update_configuration('quick_buyer_form', { sections: updated_quick_section });
		handle_update_buyer_address({ mandatory_values: unique_values, required: required_key, is_quick_block: true });
	};

	const handle_exclusions_buyer_address = (section: any, key: string, is_included: boolean) => {
		const updated_exclusion_type = is_included
			? section.is_display_exclusion_type.filter((item: string) => item !== key)
			: [...(section.is_display_exclusion_type || []), key];

		const unique_exclusion_values = Array.from(new Set(updated_exclusion_type));

		const updated_required_exclusion_type =
			!is_included && !section?.required_exclusion_type?.includes(key)
				? [...(section.required_exclusion_type || []), key]
				: section.required_exclusion_type;

		const unique_required_values = Array.from(new Set(updated_required_exclusion_type));

		const required_key = unique_required_values?.length < 2 ? true : false;

		handle_update_buyer_address({
			exclusion_values: unique_exclusion_values,
			mandatory_values: unique_required_values,
			is_quick_block: true,
			required: required_key,
		});
		const updated_sections = _.map(quick_buyer_sections, (section: any) => {
			if (section?.key === 'addresses') {
				return {
					...section,
					is_display_exclusion_type: is_included ? section.is_display_exclusion_type : [...(section.is_display_exclusion_type || []), key],
					required_exclusion_type: is_included ? unique_required_values : section.required_exclusion_type,
					required: (is_included ? unique_required_values : section.required_exclusion_type)?.length < 2 ? true : false,
				};
			}

			return section;
		});
		const updated_data = buyer_details_update(updated_sections);
		update_configuration('quick_buyer_form', { sections: updated_data });
	};

	const handle_quick_add_address = (type: any, is_included: boolean) => {
		set_is_loading(true);
		const is_address_present = _.find(quick_buyer_sections, { key: 'addresses' });
		const new_sections = is_address_present ? quick_buyer_sections : [...quick_buyer_sections, quick_buyer_address_section];
		const updated_sections = _.map(new_sections, (section: any) => {
			if (section?.key === 'addresses') {
				const display_exclusions = is_included
					? section.is_display_exclusion_type.filter((item: string) => item !== type)
					: [...(section.is_display_exclusion_type || []), type];
				const required_exclusions = is_included ? section.required_exclusion_type : [...(section.required_exclusion_type || []), type];

				const unique_exclusion_values = Array.from(new Set(display_exclusions));
				const unique_required_values = Array.from(new Set(required_exclusions));

				return {
					...section,
					is_display_exclusion_type: unique_exclusion_values,
					required_exclusion_type: unique_required_values,
					required: unique_required_values?.length < 2 ? true : false,
				};
			}

			return section;
		});

		const updated_details_buyer = _.map(configure?.details_buyer_form?.sections, (section: any) => {
			if (section?.key === 'addresses') {
				const default_exclusion = section.required_exclusion_type
					? section?.required_exclusion_type
					: section?.required
					? []
					: ['billing', 'shipping'];
				const required_exclusions = is_included ? default_exclusion : [...(default_exclusion || []), type];
				const unique_required_values = Array.from(new Set(required_exclusions));

				return {
					...section,
					required_exclusion_type: unique_required_values,
					required: unique_required_values?.length < 2 ? true : false,
				};
			}

			return section;
		});

		update_configuration('quick_buyer_form', { sections: updated_sections });
		{
			!is_included && update_configuration('details_buyer_form', { sections: updated_details_buyer }, false, true);
		}
	};

	const handle_render_title = (section: any) => {
		return (
			<Grid display='flex' flexDirection='row' justifyContent='space-between' alignItems='center' mb={-1}>
				<Grid display='flex' gap={1}>
					<Icon
						iconName='IconGripVertical'
						sx={{ color: section?.key === 'basic_details' ? 'rgba(103, 109, 119, .3)' : 'rgba(103, 109, 119, 1)' }}
					/>
					<CustomText type='H6'> {section?.name}</CustomText>
				</Grid>
				{section?.key === 'addresses' ? (
					<Grid display='flex' gap={1.4} alignItems='center'>
						<Grid display='flex' flexDirection='row' flexWrap='nowrap' alignItems='center' gap={1}>
							<CustomText type='Body'>Show billing address</CustomText>
							<Switch
								checked={!_.includes(section?.is_display_exclusion_type, 'billing')}
								onChange={() => {
									handle_exclusions_buyer_address(section, 'billing', _.includes(section?.is_display_exclusion_type, 'billing'));
								}}
								onClick={(e) => e.stopPropagation()}
							/>
						</Grid>

						<Grid display='flex' flexDirection='row' flexWrap='nowrap' alignItems='center' gap={1}>
							<CustomText type='Body'>Show shipping address</CustomText>
							<Switch
								checked={!_.includes(section?.is_display_exclusion_type, 'shipping')}
								onChange={() =>
									handle_exclusions_buyer_address(section, 'shipping', _.includes(section?.is_display_exclusion_type, 'shipping'))
								}
								onClick={(e) => e.stopPropagation()}
							/>
						</Grid>

						<Icon
							iconName='IconEdit'
							onClick={(e: any) => {
								e.stopPropagation();
								set_rename_modal(true);
								set_selected_section(section);
							}}
						/>
					</Grid>
				) : (
					<Grid display='flex' gap={1.4} alignItems='center'>
						{_.includes(SECTION_DEFAULTS, section?.key) && (
							<Grid display='flex' flexDirection='row' flexWrap='nowrap' alignItems='center' gap={1}>
								<CustomText type='Body'>Quick Add</CustomText>
								<Switch
									checked={section?.is_display && section?.is_quick_add}
									onChange={() => {
										handle_quick_add_section(buyer_form_items, section?.key);
									}}
									disabled={!section?.is_display}
									onClick={(e) => e.stopPropagation()}
								/>
							</Grid>
						)}

						{section?.key !== 'basic_details' && (
							<Grid display='flex' flexDirection='row' flexWrap='nowrap' alignItems='center' gap={1}>
								<CustomText type='Body'>Show</CustomText>
								<Switch
									checked={section?.is_display}
									onChange={() => handle_delete_section(section?.key, 'details_buyer_form', 'is_display')}
									onClick={(e) => e.stopPropagation()}
								/>
							</Grid>
						)}

						<Icon
							iconName='IconEdit'
							onClick={(e: any) => {
								e.stopPropagation();
								set_rename_modal(true);
								set_selected_section(section);
							}}
						/>
					</Grid>
				)}
			</Grid>
		);
	};

	const handle_render_content = (section: any, columnDef: any, rowData: any, height: any) => {
		const get_section_key = _.get(configure?.display_priority, section?.key);
		const get_sorted_list = _.orderBy(get_section_key, ['display_priority'], ['asc']);
		const display_text = _.map(get_sorted_list, 'name').join(', ');
		return (
			<Grid pb={1}>
				<Grid mb={2}>
					{section?.key === 'contacts' && (
						//Switch button at right side
						<Grid
							bgcolor='#F7F8FA'
							sx={{ borderRadius: '8px' }}
							display='flex'
							flexDirection='row'
							flexWrap='nowrap'
							alignItems='center'
							justifyContent='space-between'>
							<CustomText style={{ marginLeft: '10px' }} type='Body'>
								{`Do you want ${section?.key === 'contacts' ? 'contact' : 'address'} to be mandatory?`}
							</CustomText>
							<Switch
								checked={section?.required && section?.is_display && section?.is_quick_add}
								disabled={!section?.is_display || !section?.is_quick_add}
								onChange={() => {
									handle_delete_section(section?.key, 'details_buyer_form', 'required');
								}}
							/>
						</Grid>
					)}
					{section?.key === 'addresses' && (
						<Grid bgcolor='#F7F8FA' sx={{ borderRadius: '8px', padding: '10px' }}>
							<Grid display={'flex'} flexDirection='row' alignItems='center' my={1}>
								<Grid xs={3}>
									<CustomText style={{ marginLeft: '10px' }} type='Subtitle'>
										Billing Address
									</CustomText>
								</Grid>

								<Grid container direction='row' alignItems='center' justifyContent='flex-end'>
									<CustomText type='Body'>Mandatory</CustomText>
									<Switch
										checked={!_.includes(section?.required_exclusion_type, 'billing')}
										onChange={() => {
											handle_mandatory_buyer_address(section, 'billing', _.includes(section?.required_exclusion_type, 'billing'));
										}}
										disabled={
											_.includes(section?.is_display_exclusion_type, 'billing') ||
											_.includes(quick_buyer_address_section?.is_display_exclusion_type, 'billing')
										}
									/>

									<CustomText style={{ marginLeft: 2 }} type='Body'>
										Quick Add
									</CustomText>
									<Switch
										checked={!quick_buyer_address_section?.is_display_exclusion_type?.includes('billing')}
										disabled={section?.is_display_exclusion_type?.includes('billing')}
										onChange={() =>
											handle_quick_add_address('billing', quick_buyer_address_section?.is_display_exclusion_type?.includes('billing'))
										}
									/>
								</Grid>
							</Grid>
							<Divider sx={{ borderBottom: '1px dotted #D1D6DD' }} />
							<Grid display={'flex'} flexDirection='row' alignItems='center' my={1}>
								<Grid xs={3}>
									<CustomText style={{ marginLeft: '10px' }} type='Subtitle'>
										Shipping Address
									</CustomText>
								</Grid>

								<Grid container direction='row' alignItems='center' justifyContent='flex-end'>
									<CustomText type='Body'>Mandatory</CustomText>
									<Switch
										checked={!_.includes(section?.required_exclusion_type, 'shipping')}
										onChange={() => {
											handle_mandatory_buyer_address(section, 'shipping', _.includes(section?.required_exclusion_type, 'shipping'));
										}}
										disabled={
											_.includes(section?.is_display_exclusion_type, 'shipping') ||
											_.includes(quick_buyer_address_section?.is_display_exclusion_type, 'shipping')
										}
									/>

									<CustomText style={{ marginLeft: 2 }} type='Body'>
										Quick Add
									</CustomText>
									<Switch
										checked={!quick_buyer_address_section?.is_display_exclusion_type?.includes('shipping')}
										disabled={section?.is_display_exclusion_type?.includes('shipping')}
										onChange={() =>
											handle_quick_add_address('shipping', quick_buyer_address_section?.is_display_exclusion_type?.includes('shipping'))
										}
									/>
								</Grid>
							</Grid>
						</Grid>
					)}
				</Grid>

				<AgGridTableContainer
					columnDefs={columnDef}
					hideManageColumn
					rowData={rowData}
					containerStyle={{ height: `${height + 50}px`, maxHeight: '700px', minHeight: '150px' }}
					showStatusBar={false}
				/>
				{section?.key === 'other_details' && (
					<Grid display='flex' flexDirection='row' flexWrap='nowrap' alignItems='center' gap={1} pt={3}>
						<CustomText type='Body'>To show attachment</CustomText>
						<Switch
							checked={section?.is_attachment_display}
							onChange={() => {
								handle_delete_section(section?.key, 'details_buyer_form', 'is_attachment_display');
							}}
						/>
					</Grid>
				)}
				{SECTIONS_ADD_FIELDS.includes(section?.key) && (
					<Button
						variant='text'
						sx={{ marginTop: '8px' }}
						onClick={() => {
							set_data({ priority: rowData?.length });
							set_selected_section(section);
							set_type('add_field');
							set_drawer(true);
							set_section_key(section?.key);
						}}>
						+ Add more fields
					</Button>
				)}

				{SECTION_DISPLAY_FIELDS.includes(section?.key) && (
					<Grid mt={4} p={2} sx={{ border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '12px' }}>
						<Grid container>
							<Grid item>
								<CustomText type='Subtitle'>{section?.name} card display setting</CustomText>
							</Grid>
							<Grid item ml='auto'>
								<Icon
									iconName='IconEdit'
									sx={{ cursor: 'pointer' }}
									onClick={() => {
										set_display_drawer({ open: true, key: section?.key });
									}}
								/>
							</Grid>
						</Grid>
						<Grid>
							<CustomText type='Body'>{display_text}</CustomText>
						</Grid>
					</Grid>
				)}
			</Grid>
		);
	};

	const handle_render_data = (item: any) => {
		return (
			<>
				<DraggableList
					onDrop={handle_row_drop}
					droppable_id='sections'
					list={item?.map((section: any) => {
						let rowData =
							section?.key === 'addresses'
								? section?.addresses?.[0]?.attributes
								: section?.key === 'contacts'
								? section?.contacts?.[0]?.attributes
								: section?.key === 'other_details'
								? section?.custom_attributes
								: section?.attributes;

						const handle_edit = (params: any) => {
							if (params?.node?.data?.name === 'Address Type') {
								return;
							}
							set_selected_section(section);
							set_section_key(section?.key);
							set_data(params?.node?.data);
							set_type('edit_field');
							set_drawer(true);
						};
						const temp = buyer_sections?.[section?.key]?.columns || buyer_sections?.custom_fields?.columns;

						const columnDef = [...temp, utils.create_action_config(actions, handle_edit, 'Actions')];

						rowData = _(rowData)
							.filter((item) => item?.id !== 'country_code')
							.sortBy(['priority'])
							.value();

						const updated_row_data =
							section?.key === 'addresses'
								? _.map(rowData, (item) => ({
										...item,
										required_in_billing: !_.includes(item?.required_exclusion_type, 'billing'),
										required_in_shipping: !_.includes(item?.required_exclusion_type, 'shipping'),
										included_in_billing: !_.includes(item?.is_display_exclusion_type, 'billing'),
										included_in_shipping: !_.includes(item?.is_display_exclusion_type, 'shipping'),
								  }))
								: rowData;

						const height = rowData?.length * 50;

						return {
							node: (
								<>
									<Accordion
										content={[
											{
												title: handle_render_title(section),
												expandedContent: handle_render_content(
													section,
													section?.key !== 'payment_methods' ? columnDef : temp,
													updated_row_data,
													height,
												),
											},
										]}
										style={{ borderBottom: '1px solid #D1D6DD' }}
										contentBackground='#FFF'
										id={'buyer_expanded_content'}
									/>
								</>
							),
							label: section?.name,
							onDelete: () => {},
							deleteable: false,
							dragable: section?.key !== 'basic_details',
							key: section?.key,
							show_icon: false,
						};
					})}
				/>
			</>
		);
	};

	useEffect(() => {
		handle_buyer();
	}, [configure?.details_buyer_form]);
	useEffect(() => {
		get_keys_configuration('details_buyer_form');
		get_keys_configuration('buyer_form_permissions');
		get_keys_configuration('quick_buyer_form');
		get_org_setting_keys_configuration('display_priority');
	}, []);

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>Customer forms</CustomText>
			</Grid>
			<Grid py={1}>{configure?.details_buyer_form && handle_render_data(buyer_form_items)}</Grid>
			{rename_modal && (
				<RenameSectionModal
					open={rename_modal}
					on_close={set_rename_modal}
					section={selected_section}
					form={'details_buyer_form'}
					data={{ sections: buyer_form_items }}
				/>
			)}
			{drawer && <AddSection drawer={drawer} set_drawer={set_drawer} type={type} data={data} on_add={add} section={selected_section} />}
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
			{display_drawer.open && (
				<DisplayDrawer
					open={display_drawer.open}
					section_key={display_drawer.key}
					onClose={() => set_display_drawer({ open: false, key: '' })}
					set_is_loading={set_is_loading}
				/>
			)}
		</Grid>
	);
};

export default Buyer;
