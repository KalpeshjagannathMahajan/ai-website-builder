import _ from 'lodash';
import { useEffect, useState } from 'react';
import settings from 'src/utils/api_requests/setting';
import { isUUID } from './utils/helper';
import { mergeWithDefaultSettings } from './utils/merger';
import { BUYER_INFO, PRE_FETCH_KEYS } from './utils/constants';
import { transform_rails_for_app } from './utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { cartContainerConfig } from 'src/actions/setting';
import { SECTION_DEFAULTS } from './components/Buyer/mock';

interface AddressHandlerProps {
	exclusion_values?: String[];
	mandatory_values?: String[];
	is_quick_block?: boolean;
	required?: boolean;
}

const useSettings = () => {
	const dispatch = useDispatch();
	const is_internal_tool = import.meta.env.VITE_APP_INTERNAL_TOOL === 'true';
	const show_settings = useSelector((state: any) => state?.settings?.enable_org_settings);
	const setting_to_customer = !is_internal_tool && show_settings;
	const [keys, set_keys] = useState<string[]>([]);
	const [configure, set_configure] = useState<any>({});
	const [super_set, set_super_set] = useState<any>(null);
	const [att_list, set_att_list] = useState<any>({});
	const [is_loading, set_is_loading] = useState<boolean>(false);
	const [container_config_data, set_container_config_data] = useState<any>({});
	const [attribute_list, set_attribute_list] = useState<any>([]);

	const get_keys_configuration = async (key: string) => {
		try {
			if (key === 'cart_container_config') {
				const response_config: any = await settings.get_containers_data();
				if (response_config) {
					set_configure((prev: any) => {
						return { ...prev, [key]: response_config?.data };
					});
					dispatch(cartContainerConfig(response_config));
				}
			} else {
				const response: any = await settings.get_configuration(key);
				if (response) {
					set_configure((prev: any) => {
						return { ...prev, [key]: response?.data };
					});
				}
			}
		} catch (err) {
			console.error(err);
		} finally {
			set_is_loading(false);
		}
	};
	const get_org_setting_keys_configuration = async (key: string) => {
		try {
			const response: any = await settings.get_org_setting_configuration(key);
			if (response) {
				set_configure((prev: any) => {
					return { ...prev, [key]: response?.data };
				});
			}
		} catch (err) {
			console.error(err);
		} finally {
			set_is_loading(false);
		}
	};

	const cleanup_contact_address = (buyer_sections_data: any) => {
		const contacts = _.find(buyer_sections_data, { key: 'contacts' });
		const addresses = _.find(buyer_sections_data, { key: 'addresses' });
		if (contacts) {
			contacts.contacts[0].attributes = _.filter(contacts.contacts[0].attributes, (att: any) => !isUUID(att?.id));
		}
		if (addresses) {
			addresses.addresses[0].attributes = _.filter(addresses.addresses[0].attributes, (att: any) => !isUUID(att?.id));
		}
		return buyer_sections_data;
	};

	const buyer_details_update = (items: any) => {
		let details = _.map(items, (item) => {
			if (item?.key === 'basic_details') {
				return {
					...item,
					attributes: _.map(item?.attributes, (att: any) => {
						return {
							...att,
							is_editable: att?.is_editable ?? false,
							is_display: att?.is_display ?? true,
							is_quick_add: att?.is_quick_add ?? true,
						};
					}),
					is_display: item?.is_display ?? true,
					is_quick_add: item?.is_quick_add ?? true,
				};
			} else if (item?.key === 'contacts' || item?.key === 'addresses') {
				let firstElement = item?.[item?.key]?.[0];
				firstElement.attributes = _.map(firstElement?.attributes, (att: any) => {
					return {
						...att,
						is_editable: att?.is_editable ?? false,
						is_display: att?.is_display ?? true,
						is_quick_add: att?.is_quick_add ?? true,
					};
				}).filter((att: any) => !isUUID(att?.id));
				return {
					...item,
					[item?.key]: [firstElement, ...item[item?.key].slice(1)],
					is_display: item?.is_display ?? true,
					is_quick_add: item?.is_quick_add ?? true,
				};
			} else if (item.key === 'other_details') {
				return {
					...item,
					custom_attributes: _.map(item?.custom_attributes, (att: any) => {
						return {
							...att,
							is_editable: true,
							required: att?.is_mandatory,
							type: att?.data_type,
							is_display: att?.is_display ? att?.include : true,
						};
					}),
					is_display: item?.is_display ?? true,
					is_attachment_display: item?.is_attachment_display ?? true,
					is_quick_add: item?.is_quick_add ?? false,
				};
			} else {
				return {
					...item,
					attributes: _.map(item?.attributes, (att: any) => {
						return {
							...att,
							is_editable: att?.is_editable ?? true,
							is_display: att?.is_display ?? true,
							is_quick_add: att?.is_quick_add ?? false,
						};
					}),
					is_display: item?.is_display ?? true,
					is_quick_add: item?.is_quick_add ?? false,
				};
			}
		});

		return details;
	};

	const update_configuration = async (section_key: string, key_value: any, close?: any, is_quick_updated: boolean = false) => {
		const merged_payload = mergeWithDefaultSettings(section_key, key_value);
		if (section_key === 'details_buyer_form') {
			let details_buyer = buyer_details_update(merged_payload?.sections);

			settings
				.update_setting({ key: section_key, value: { sections: details_buyer } })
				.then((res: any) => {
					if (res.status === 200) {
						!is_quick_updated && transform_quick_form(details_buyer);
						get_keys_configuration(section_key);
					}
				})
				.catch((err: any) => console.error(err));
		} else {
			settings
				.update_setting({ key: section_key, value: merged_payload })
				.then((res: any) => {
					if (res.status === 200) {
						get_keys_configuration(section_key);
						close && close();
					}
				})
				.catch((err: any) => console.error(err));
		}
	};

	const post_configs = async (key: string, data: any) => {
		const get_config_name = key.split('/')?.[0];
		try {
			const response = await settings.post_configuration(key, data);
			if (response.status === 200) {
				get_keys_configuration(get_config_name);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const update_org_setting_configuration = async (section_key: string, data: any) => {
		try {
			const response: any = await settings.update_org_setting(section_key, data);
			if (response?.status === 200) {
				get_org_setting_keys_configuration(section_key);
			}
		} catch {
			console.error('Something went wrong');
		}
	};

	const update_configuration_bulk = async (data: any, close?: any) => {
		settings
			.update_setting_bulk(data)
			.then((res: any) => {
				if (res.status === 200) {
					close && close();
				}
			})
			.catch((err: any) => console.error(err));
	};

	const transform_quick_form = (data: any) => {
		let quick = data?.filter((item: any) => item?.is_display !== false);

		quick = _.map(quick, (section) => {
			let quick_is_display_exclusion_key;
			if (section?.key === 'addresses') {
				const get_quick_buyer_address = _.find(configure?.quick_buyer_form?.sections, { key: 'addresses' });
				quick_is_display_exclusion_key = _.get(get_quick_buyer_address, 'is_display_exclusion_type');
			}
			if (_.includes(SECTION_DEFAULTS, section?.key)) {
				if (section?.key === 'addresses') return { ...section, is_display_exclusion_type: quick_is_display_exclusion_key };
				if (section?.is_quick_add !== false) return section;
				else return null;
			} else {
				let temp = section?.attributes.filter((item: any) => item?.is_quick_add !== false);
				if (!_.isEmpty(temp)) {
					return {
						...section,
						attributes: section?.attributes.filter((item: any) => item?.is_quick_add !== false),
					};
				} else {
					return null;
				}
			}
		}).filter((items) => items !== null);
		update_configuration('quick_buyer_form', { sections: quick });
	};

	const get_keys = async () => {
		try {
			const response: any = await settings.get_keys();
			if (response?.data) {
				set_keys(response?.data);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handle_rename_section = (key: string, name: string, field: string, data: any) => {
		set_is_loading(true);
		let temp = _.map(data?.sections, (item) => {
			if (item?.key === key) {
				return {
					...item,
					name,
				};
			}
			return item;
		});
		update_configuration(field, { ...configure?.[field], sections: temp });
		if (field === 'order_settings') {
			update_configuration('quote_settings', { ...configure.quote_settings, sections: temp });
		}
	};

	const handle_update_buyer_address = ({ exclusion_values, mandatory_values, is_quick_block, required }: AddressHandlerProps) => {
		set_is_loading(true);

		const updated_buyer_sections = configure?.details_buyer_form?.sections?.map((section: any) => {
			if (section?.key === 'addresses') {
				return {
					...section,
					is_display_exclusion_type: exclusion_values ? exclusion_values : section?.is_display_exclusion_type,
					required_exclusion_type: mandatory_values ? mandatory_values : section?.required_exclusion_type,
					required: required ?? section?.required,
				};
			}
			return section;
		});

		update_configuration(
			'details_buyer_form',
			{
				...configure?.details_buyer_form,
				sections: updated_buyer_sections,
			},
			false,
			is_quick_block,
		);
	};

	const handle_delete_section = (key: string, setting_key: string, delete_key: string) => {
		set_is_loading(true);
		const updated_buyer_sections = _.map(configure?.[setting_key]?.sections, (section: any) => {
			if (section?.key === key) {
				if (key === 'contacts' || key === 'addresses' || key === 'payment_methods') {
					const newValue = !section?.[delete_key];
					let updatedSection = { ...section };

					if (delete_key === 'is_quick_add') {
						updatedSection = {
							...updatedSection,
							is_quick_add: newValue,
							required: newValue && updatedSection?.is_quick_add,
						};
					} else if (delete_key === 'is_display') {
						updatedSection = {
							...updatedSection,
							is_display: newValue,
							required: newValue && updatedSection?.is_quick_add,
						};
					} else if (delete_key === 'required') {
						updatedSection = {
							...updatedSection,
							required: newValue && updatedSection?.is_quick_add,
						};
					}
					return updatedSection;
				} else if (key === 'payment_method_v2') {
					const att = _.map(section?.attributes, (sec_att: any) => {
						return { ...sec_att, [delete_key]: !section?.[delete_key] };
					});
					return { ...section, attributes: att, [delete_key]: !section?.[delete_key] };
				} else {
					return { ...section, [delete_key]: !section?.[delete_key] };
				}
			}
			return section;
		});
		/** Remove the uuid attribute in contact and addresses */
		const updated = cleanup_contact_address(updated_buyer_sections);
		update_configuration(setting_key, { ...configure?.[setting_key], sections: updated });
	};

	const handle_quick_add_section = (data: any, key: string) => {
		set_is_loading(true);
		const updated_buyer_sections = _.map(data, (section: any) => {
			if (section?.key === key) {
				return { ...section, is_quick_add: !section?.is_quick_add };
			}
			return section;
		});
		const updated = cleanup_contact_address(updated_buyer_sections);
		update_configuration('details_buyer_form', { sections: updated });
	};

	const get_attributes = async (key: string) => {
		try {
			const res: any = await settings.get_attributes_entity(key);

			if (res?.data) {
				return res?.data;
			}
		} catch (err) {
			console.error(err);
		}
	};

	const transform_buyer = async (items: any) => {
		return Promise.all(
			_.map(items, async (item) => {
				if (item?.key === 'basic_details') {
					return {
						...item,
						attributes: _.map(item?.attributes, (att: any) => {
							return {
								...att,
								is_editable: att?.is_editable ?? false,
								is_display: att?.is_display ?? true,
								is_quick_add: att?.is_quick_add ?? true,
							};
						}),
						is_display: item?.is_display ?? true,
						is_quick_add: item?.is_quick_add ?? true,
					};
				} else if (item?.key === 'contacts' || item?.key === 'addresses') {
					let firstElement = item?.[item?.key]?.[0];
					const custom = await get_attributes(item?.key === 'contacts' ? 'contact' : 'address');
					firstElement.attributes = _.filter(firstElement?.attributes, (att: any) => !isUUID(att?.id)).map((att: any) => {
						if (item?.key === 'addresses') {
							return {
								...att,
								required_exclusion_type: att?.required_exclusion_type
									? att?.required_exclusion_type
									: att?.required
									? []
									: ['billing', 'shipping'],
								is_display_exclusion_type: att?.is_display_exclusion_type
									? att?.is_display_exclusion_type
									: att?.is_display
									? []
									: ['billing', 'shipping'],
								is_editable: att?.is_editable ?? false,
								is_display: att?.is_display ?? true,
								is_quick_add: att?.is_quick_add ?? true,
							};
						} else {
							return {
								...att,
								is_editable: att?.is_editable ?? false,
								is_display: att?.is_display ?? true,
								is_quick_add: att?.is_quick_add ?? true,
							};
						}
					});
					_.map(custom, (sec: any) => {
						if (item?.key === 'addresses') {
							firstElement.attributes.push({
								...sec,
								required: sec?.is_mandatory,
								is_editable: sec?.is_editable ?? false,
								is_display: sec?.include ?? sec?.is_active ?? true,
								type: sec?.data_type,
								required_exclusion_type: sec?.configuration?.required_exclusion_type
									? sec?.configuration?.required_exclusion_type
									: sec?.is_mandatory
									? []
									: ['billing', 'shipping'],
								is_display_exclusion_type: sec?.configuration?.is_display_exclusion_type
									? sec?.configuration?.is_display_exclusion_type
									: sec?.include ?? sec?.is_active
									? []
									: ['billing', 'shipping'],
								options: sec?.configuration?.options ?? [],
								value: sec?.configuration?.value || sec?.configuration?.default_value || '',
							});
						} else {
							firstElement.attributes.push({
								...sec,
								required: sec?.is_mandatory,
								is_editable: sec?.is_editable ?? false,
								is_display: sec?.include ?? sec?.is_active ?? true,
								type: sec?.data_type,
								options: sec?.configuration?.options ?? [],
								value: sec?.configuration?.value || sec?.configuration?.default_value || '',
							});
						}
					});
					if (item?.key === 'addresses') {
						return {
							...item,
							[item?.key]: [firstElement, ...item[item?.key].slice(1)],
							is_display: item?.is_display ?? true,
							is_quick_add: item?.is_quick_add ?? true,
							required_exclusion_type: item?.required_exclusion_type
								? item?.required_exclusion_type
								: item?.required
								? []
								: ['billing', 'shipping'],
							is_display_exclusion_type: item?.is_display_exclusion_type
								? item?.is_display_exclusion_type
								: item?.is_display
								? []
								: ['billing', 'shipping'],
						};
					}
					return {
						...item,
						[item?.key]: [firstElement, ...item[item?.key].slice(1)],
						is_display: item?.is_display ?? true,
						is_quick_add: item?.is_quick_add ?? true,
					};
				} else if (item.key === 'other_details') {
					const custom = await get_attributes('buyer');
					return {
						...item,
						custom_attributes: _.map(custom, (att: any) => {
							return {
								...att,
								is_editable: true,
								required: att?.is_mandatory,
								type: att?.data_type,
								is_display: att?.include ?? att?.is_active ?? true,
								options: att?.configuration?.options ?? [],
								value: att?.configuration?.value || att?.configuration?.default_value || '',
							};
						}),
						is_display: item?.is_display ?? true,
						is_attachment_display: item?.is_attachment_display ?? true,
						is_quick_add: item?.is_quick_add ?? false,
					};
				} else {
					return {
						...item,
						attributes: _.map(item?.attributes, (att: any) => {
							return {
								...att,
								is_editable: att?.is_editable ?? true,
								is_display: att?.is_display ?? true,
								is_quick_add: att?.is_quick_add ?? false,
							};
						}),
						is_display: item?.is_display ?? true,
						is_quick_add: item?.is_quick_add ?? false,
					};
				}
			}),
		);
	};

	const transform_document = (items: any) => {
		let order: any[] = [];
		let quote: any[] = [];
		_.map(items, (section: any) => {
			if (BUYER_INFO?.includes(section?.key)) {
				order.push({ ...section });
			} else {
				order.push({ ...section, is_mandatory: _.some(section?.attribute, (ite) => ite?.required === true) });
			}
		});
		//** Make sure that items */
		order = _.uniqBy(order, 'key');
		update_configuration('order_settings', { ...configure.order_settings, sections: order });

		items?.map((section: any) => {
			const { is_quote_display, is_quote_mandatory, ...restOfSection } = section;
			if (section.key === 'payment_method_v2') {
				quote.push({
					...restOfSection,
					is_display: false,
					is_mandatory: false,
					attributes: section?.attributes.map((att: any) => {
						const { is_quote_mandatory: att_is_quote_mandatory, is_quote_display: attr_is_quote_display, ...restOfAttribute } = att;
						return {
							...restOfAttribute,
							is_display: false,
							required: false,
						};
					}),
				});
			} else if (BUYER_INFO?.includes(section?.key)) {
				quote.push({
					...restOfSection,
					is_display: is_quote_display,
					is_mandatory: is_quote_mandatory,
					attributes: section?.attributes.map((att: any) => {
						const { is_quote_mandatory: att_is_quote_mandatory, is_quote_display: attr_is_quote_display, ...restOfAttribute } = att;
						return {
							...restOfAttribute,
							is_display: attr_is_quote_display,
							required: att_is_quote_mandatory,
						};
					}),
				});
			} else {
				quote.push({
					...restOfSection,
					is_display: is_quote_display,
					is_mandatory: _.some(section?.attribute, (ite) => ite?.required === true),
					attributes: section?.attributes.map((att: any) => {
						const { is_quote_mandatory: att_is_quote_mandatory, is_quote_display: attr_is_quote_display, ...restOfAttribute } = att;
						return {
							...restOfAttribute,
							is_display: attr_is_quote_display,
							required: att_is_quote_mandatory,
						};
					}),
				});
			}
		});

		quote = _.uniqBy(quote, 'key');
		update_configuration('quote_settings', { ...configure.quote_settings, sections: quote });
	};

	const get_attributes_list = async (entity: any) => {
		const response: any = await settings.get_attributes_entity(entity);
		if (response) {
			set_att_list((prev: any) => {
				return { ...prev, [entity]: response?.data };
			});
		}
	};

	const get_super_set = () => {
		settings.get_super_set().then((res: any) => {
			set_super_set({
				buyer_settings: res?.data?.buyer_settings?.buyer_settings,
				product_settings: res?.data?.product_settings?.product_listing_page,
				document_settings: res?.data?.document_settings?.sales_page_settings,
			});
		});
	};

	const get_products = async (is_delete = false) => {
		const res: any = await get_attributes('product');
		let temp: any = [];
		if (res) {
			temp = _.map(res, (att) => ({
				...att,
				type: att?.data_type?.trim(),
				value: att?.id,
				label: att?.name,
			}));
		}
		set_attribute_list(temp);
		if (is_delete) {
			const tempIds = temp?.map((t: any) => t?.value); // Extract only the ids from temp to compare
			if (configure?.pdp_page_config_web?.sections) {
				let temp_ids = temp?.map((t: any) => t?.value);
				let updatedSections = configure?.pdp_page_config_web?.sections?.map((section: any) => ({
					...section,
					attributes: section?.attributes?.filter((attr: any) => temp_ids?.includes(attr?.attribute_id)),
				}));
				const finalSections = updatedSections?.filter(
					(section: any) => section?.type === 'open_section' || section?.attributes?.length > 0,
				);

				update_configuration('pdp_page_config_web', { ...configure?.pdp_page_config_web, sections: finalSections });
				/**
				 * Rails: {'rails': [
				 * {'name': 'Similar Products', 'priority': 1, 'type': 'similar_product'},
				 * {'name': 'Frequently Bought Together', 'priority': 2, 'type': 'frequently_bought_together'}
				 * ]
				 * }
				 * we have to transformed this to
				 * {'rails': [{'name': 'Similar Products', 'priority': 1, 'type': 'similar-products'},
				 * {'name': 'Frequently Bought Together', 'priority': 2, 'type': 'frequently-bought-products'}],
				 * data = { ...configure?.pdp_page_config_web, sections: finalSections }
				 * I want to do this transformation in the data object
				 */

				let pdp_page_config = transform_rails_for_app({ ...configure?.pdp_page_config_web, sections: finalSections });
				update_configuration('pdp_page_config', pdp_page_config);
			}

			if (configure?.product_listing_page_config) {
				const update_product_listing_page_config = {
					...configure?.product_listing_page_config,
					filters: _.filter(
						configure?.product_listing_page_config?.filters,
						(item: any) => item?.entity_name !== 'attribute' || tempIds?.includes(item?.entity_id),
					),
				};
				update_configuration_bulk([
					{ key: 'product_listing_page_config', value: update_product_listing_page_config },
					{ key: 'product_listing_page_config_web', value: update_product_listing_page_config },
					{ key: 'product_listing_page_config_v2', value: update_product_listing_page_config },
				]);
			}
			if (configure?.category_product_listing_page_config) {
				const update_category_product_listing_page_config = {
					...configure?.category_product_listing_page_config,
					filters: _.filter(
						configure?.category_product_listing_page_config?.filters,
						(item: any) => item?.entity_name !== 'attribute' || tempIds?.includes(item?.entity_id),
					),
				};
				update_configuration_bulk([
					{ key: 'category_product_listing_page_config', value: update_category_product_listing_page_config },
					{ key: 'category_product_listing_page_config_web', value: update_category_product_listing_page_config },
					{ key: 'category_product_listing_page_config_v2', value: update_category_product_listing_page_config },
				]);
			}
			if (configure?.collection_product_listing_page_config) {
				const update_collection_product_listing_page_config = {
					...configure?.collection_product_listing_page_config,
					filters: _.filter(
						configure?.collection_product_listing_page_config?.filters,
						(item: any) => item?.entity_name !== 'attribute' || tempIds?.includes(item?.entity_id),
					),
				};
				update_configuration_bulk([
					{ key: 'collection_product_listing_page_config', value: update_collection_product_listing_page_config },
					{ key: 'collection_product_listing_page_config_web', value: update_collection_product_listing_page_config },
					{ key: 'collection_product_listing_page_config_v2', value: update_collection_product_listing_page_config },
				]);
			}
			if (configure?.barcode_scanner_settings) {
				const update_barcode_scanner_settings = _.map(configure?.barcode_scanner_settings, (item) => {
					const key = item?.filter_logic?.key?.replace('transformed_attributes.', '');
					if (tempIds?.includes(key)) {
						return item;
					} else {
						return null;
					}
				})?.filter((dat) => dat !== null);

				const contain_default = _.some(update_barcode_scanner_settings, (barcode) => barcode?.is_default);

				if (!contain_default) {
					update_barcode_scanner_settings[0] = { ...update_barcode_scanner_settings?.[0], is_default: true };
				}
				update_configuration('barcode_scanner_settings', update_barcode_scanner_settings);
			}
		}
	};

	const get_containers_detail = async () => {
		try {
			const { data: response_data }: any = await settings.get_containers_data();
			if (response_data?.tenant_container_enabled === true) {
				set_container_config_data(response_data);
				dispatch(cartContainerConfig(response_data));
			} else {
				dispatch(cartContainerConfig({ tenant_container_enabled: false }));
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		get_keys();
		get_containers_detail();
		_.map(PRE_FETCH_KEYS, (key: string) => {
			get_keys_configuration(key);
		});
	}, []);

	return {
		handle_rename_section,
		handle_delete_section,
		handle_quick_add_section,
		keys,
		configure,
		att_list,
		setting_to_customer,
		get_keys_configuration,
		update_configuration,
		post_configs,
		transform_buyer,
		super_set,
		get_super_set,
		transform_document,
		get_attributes_list,
		get_attributes,
		transform_quick_form,
		buyer_details_update,
		is_loading,
		set_is_loading,
		cleanup_contact_address,
		update_configuration_bulk,
		attribute_list,
		set_attribute_list,
		get_products,
		container_config_data,
		handle_update_buyer_address,
		get_org_setting_keys_configuration,
		update_org_setting_configuration,
	};
};

export default useSettings;
