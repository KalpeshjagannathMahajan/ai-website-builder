import { LooseObject } from '../Interfaces/LooseObject';
import { Section, PermissionSection } from '../Interfaces/SectionsInterface';
import _ from 'lodash';

export const get_attribute_id_from_key = (field_key: string, sections: Section[]) => {
	for (const section of sections) {
		const attribute = _.find(section.attributes, (attr) => attr.key === field_key);
		if (attribute) {
			return { attribute_id: attribute.attribute_id, value: attribute.value || '', _section: section.key };
		}
	}

	return {};
};

export const is_submit_disabled = (access_map = {}, isDirty = false, disable_cta_if_not_dirty = false) => {
	if (!isDirty && disable_cta_if_not_dirty) {
		return true;
	}
	const result = Object.keys(access_map).reduce((acc: any, key) => {
		acc[key] = access_map[key].value;
		return acc;
	}, {});

	return !(Object.values(result)?.filter((value) => value)?.length > 0);
};

export const get_form_data = (data: any, access_map: any, is_permission_form: boolean, is_manager_role: boolean) => {
	const form_data: LooseObject = {};
	if (is_permission_form) {
		for (const key in data) {
			if (!_.has(form_data, 'basic_details')) {
				form_data.basic_details = {};
			}
			form_data.basic_details[key] = data[key];
		}
		if (access_map) {
			const result = Object.keys(access_map).reduce((acc: any, key) => {
				acc[key] = access_map[key].value;
				return acc;
			}, {});

			form_data.access_permission = result;
		}
		form_data.is_manager_role = is_manager_role;
	} else {
		return { ...data };
	}

	return form_data;
};

export const get_default_values = (sections: Section[]) => {
	const default_values: any = {};

	sections.forEach((section) => {
		section.attributes?.forEach((attr) => {
			default_values[attr.key] = attr.value;
		});
	});

	return default_values;
};

export const get_validators = (type: string, required: boolean, name: string) => {
	let validations: any = {
		required,
		name,
	};

	switch (type) {
		case 'email':
			validations = {
				...validations,
				email: true,
			};
			break;
		case 'phone':
			validations = {
				...validations,
				phone: true,
			};
			break;
		default:
			break;
	}
	return validations;
};

export const get_permissions = (permissions: any, permission_id: string, new_value: boolean) => {
	try {
		const toggle_value = (_permission_id: string, _new_value: boolean) => {
			permissions[_permission_id].value = new_value;
			if (!_new_value) {
				for (let i = 0; i < permissions[_permission_id].childDeps.length; i++) {
					if (!_.isEqual(permissions[permissions[_permission_id].childDeps[i]].value, _new_value)) {
						toggle_value(permissions[_permission_id].childDeps[i], _new_value);
					}
				}
			} else {
				for (let i = 0; i < permissions[_permission_id].parentDeps.length; i++) {
					if (!_.isEqual(permissions[permissions[_permission_id].parentDeps[i]].value, _new_value)) {
						toggle_value(permissions[_permission_id].parentDeps[i], _new_value);
					}
				}
			}
		};
		toggle_value(permission_id, new_value);
		return permissions;
	} catch (error) {
		return permissions;
	}
};

export const get_sections = (sections: Section[]): { other_sections: Section[]; access_permission?: PermissionSection } => {
	let access_permission;
	const other_sections: any = [];
	sections.forEach((section) => {
		if (section.key === 'access_permission') access_permission = section;
		else {
			other_sections.push(section);
		}
	});

	return { other_sections, access_permission };
};

export const is_toggle_allowed = (id: string, permissions: any) => {
	if (!permissions?.[id]?.parentDeps?.length) return true;
	return permissions?.[id]?.parentDeps?.every((dep_id: string) => permissions[dep_id].value);
};

export const get_key = (name: string): string => name?.toLowerCase()?.split(' ')?.join('_');
