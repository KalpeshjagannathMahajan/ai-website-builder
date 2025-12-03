import { DETAILS_BUYER_FORM } from './defaultSettings/buyer/details_buyer_form';
import { DOCUMENT_REVIEWS_PAGE_CART_SUMMARY } from './defaultSettings/order/document_review_page_cart_summary';
import { ORDER_AUTO_FILL_SETTINGS } from './defaultSettings/order/order_auto_fill_settings';
import { ORDER_FORM_PERMISSIONS } from './defaultSettings/order/order_form_permissions';
import { ORDER_SETTINGS } from './defaultSettings/order/order_settings';
import { QUOTE_AUTO_FILL_SETTINGS } from './defaultSettings/order/quote_auto_fill_settings';
import { QUOTE_FORM_PERMISSIONS } from './defaultSettings/order/quote_form_permissions';
import { QUOTE_SETTINGS } from './defaultSettings/order/quote_settings';

type AutoFillSetting = {
	buyer_field: string;
	document_field: string;
};

type Permission = {
	[key: string]: any;
};

export const merge_auto_fill_settings = (default_settings: AutoFillSetting[], new_settings: AutoFillSetting[]): AutoFillSetting[] => {
	let merged_settings: AutoFillSetting[] = JSON.parse(JSON.stringify(default_settings));

	new_settings.forEach((new_setting: AutoFillSetting) => {
		const index = merged_settings?.findIndex(
			(default_setting: AutoFillSetting) => default_setting?.buyer_field === new_setting?.buyer_field,
		);

		if (index !== -1) {
			merged_settings[index] = new_setting;
		} else {
			merged_settings.push(new_setting);
		}
	});

	return merged_settings;
};

export const merge_permissions = (default_permissions: Permission, new_permissions: Permission): Permission => {
	let merged_permissions: Permission = JSON.parse(JSON.stringify(default_permissions));

	Object.keys(new_permissions).forEach((key) => {
		if (Object.hasOwnProperty.call(merged_permissions, key)) {
			merged_permissions[key] = {
				...merged_permissions?.[key],
				...new_permissions?.[key],
			};
		} else {
			merged_permissions[key] = new_permissions?.[key];
		}
	});

	return merged_permissions;
};
export const merge_settings_optimized = (default_settings: any, new_settings: any) => {
	const preprocess_settings = (settings: any) => {
		const section_map: any = {};
		settings?.sections?.forEach((section: any) => {
			const attribute_map: any = {};
			section.attributes?.forEach((attr: any) => {
				attribute_map[attr?.id] = { ...attr };
			});
			section_map[section?.key] = { ...section, attributes: attribute_map };
		});
		return section_map;
	};

	// Create maps from the default settings
	const default_map = preprocess_settings(default_settings);

	// Iterate over the new settings and merge them into the default settings map
	new_settings?.sections.forEach((new_section: any) => {
		const default_section = default_map[new_section?.key];
		if (default_section) {
			new_section?.attributes?.forEach((new_attr: any) => {
				// Merge or overwrite attributes from new settings into default settings
				default_section.attributes[new_attr?.id] = {
					...default_section?.attributes[new_attr?.id],
					...new_attr,
				};
			});
			// Apply updates for section-level properties from new settings
			for (const prop in new_section) {
				if (prop !== 'attributes') {
					default_section[prop] = new_section?.[prop];
				}
			}
		} else {
			// If the section does not exist in the default settings, add it as is
			default_map[new_section?.key] = { ...new_section };
			default_map[new_section?.key].attributes = new_section?.attributes?.reduce((map: any, attr: any) => {
				map[attr?.id] = attr;
				return map;
			}, {});
		}
	});

	// Convert the attributes back from an object map to an array and sort sections
	let merged_sections = Object.values(default_map)?.map((section: any) => ({
		...section,
		attributes: Object.values(section?.attributes),
	}));

	// Assuming 'priority' is the property to sort by, adjust as necessary
	merged_sections = merged_sections?.sort((a, b) => a?.priority - b?.priority);

	return {
		...default_settings,
		sections: merged_sections,
		tags: new_settings?.tags || [],
	};
};

export const merge_buyer_form_settings = (defaultSettings: any, newSettings: any) => {
	let mergedSettings = JSON.parse(JSON.stringify(newSettings));

	defaultSettings?.sections?.forEach((defaultSection: any) => {
		const sectionIndex = mergedSettings?.sections?.findIndex((section: any) => section?.key === defaultSection?.key);

		if (sectionIndex !== -1) {
			const existingSection = mergedSettings?.sections?.[sectionIndex];

			if (!existingSection?.attributes) {
				existingSection.attributes = [];
			}

			if (defaultSection?.attributes) {
				defaultSection?.attributes.forEach((defaultAttribute: any) => {
					const attributeIndex = existingSection?.attributes?.findIndex((attribute: any) => attribute?.id === defaultAttribute?.id);

					if (attributeIndex === -1) {
						existingSection?.attributes?.push(defaultAttribute);
					}
				});
			}

			if (defaultSection?.contacts?.[0]?.attributes) {
				defaultSection?.contacts?.[0]?.attributes?.forEach((defaultAttribute: any) => {
					const attributeIndex = existingSection?.contacts?.[0]?.attributes?.findIndex(
						(attribute: any) => attribute?.id === defaultAttribute?.id,
					);

					if (attributeIndex === -1) {
						existingSection?.contacts?.[0]?.attributes?.push(defaultAttribute);
					}
				});
			}
			if (defaultSection?.addresses?.[0]?.attributes) {
				defaultSection?.addresses?.[0]?.attributes.forEach((defaultAttribute: any) => {
					const attributeIndex = existingSection?.addresses?.[0]?.attributes?.findIndex(
						(attribute: any) => attribute?.id === defaultAttribute?.id,
					);

					if (attributeIndex === -1) {
						existingSection?.addresses?.[0]?.attributes?.push(defaultAttribute);
					}
				});
			}

			if (defaultSection?.custom_attributes) {
				defaultSection?.custom_attributes?.forEach((defaultCustomAttribute: any) => {
					const customAttributeIndex = existingSection?.custom_attributes?.findIndex(
						(customAttribute: any) => customAttribute?.id === defaultCustomAttribute?.id,
					);

					if (customAttributeIndex === -1) {
						existingSection?.custom_attributes?.push(defaultCustomAttribute);
					}
				});
			}
		} else {
			mergedSettings?.sections?.push(defaultSection);
		}
	});

	return mergedSettings;
};

export const mergeWithDefaultSettings = (section_key: string, payload: any) => {
	const mergeStrategyMapping: any = {
		details_buyer_form: {
			mergeFunction: merge_buyer_form_settings,
			defaultSettingsKey: DETAILS_BUYER_FORM,
		},
		order_auto_fill_settings: {
			mergeFunction: merge_auto_fill_settings,
			defaultSettingsKey: ORDER_AUTO_FILL_SETTINGS,
		},
		quote_auto_fill_settings: {
			mergeFunction: merge_auto_fill_settings,
			defaultSettingsKey: QUOTE_AUTO_FILL_SETTINGS,
		},
		order_form_permissions: {
			mergeFunction: merge_permissions,
			defaultSettingsKey: ORDER_FORM_PERMISSIONS,
		},
		quote_form_permissions: {
			mergeFunction: merge_permissions,
			defaultSettingsKey: QUOTE_FORM_PERMISSIONS,
		},
		quote_settings: {
			mergeFunction: merge_settings_optimized,
			defaultSettingsKey: QUOTE_SETTINGS,
		},
		order_settings: {
			mergeFunction: merge_settings_optimized,
			defaultSettingsKey: ORDER_SETTINGS,
		},
		document_review_page_cart_summary: {
			mergeFunction: merge_permissions,
			defaultSettingsKey: DOCUMENT_REVIEWS_PAGE_CART_SUMMARY,
		},
	};

	const strategy = mergeStrategyMapping?.[section_key];

	if (!strategy) {
		return payload;
	}

	const defaultSetting = strategy?.defaultSettingsKey;

	if (!defaultSetting) {
		return payload;
	}

	return strategy.mergeFunction(defaultSetting, payload);
};
