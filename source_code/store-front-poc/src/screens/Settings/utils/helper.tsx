import _ from 'lodash';
import { add_field, add_product_field, add_section, edit_field, edit_product_field } from '../components/Common/Drawer/template';

export const handle_select_template = (type: string) => {
	switch (type?.toLowerCase()) {
		case 'add_section':
			return add_section;
		case 'add_field':
			return add_field;
		case 'edit_field':
			return edit_field;
	}
};
export const handle_product_template = (type: string) => {
	switch (type?.toLowerCase()) {
		case 'add_field':
			return add_product_field;
		case 'edit_field':
			return edit_product_field;
	}
};
export function isUUID(str: any) {
	const regexExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	return regexExp.test(str);
}
export const handle_conversion = (conversion: any, updated_data: any) => {
	const volume = parseFloat(_.get(updated_data, 'container_volume', 0));
	const unit = _.get(updated_data, 'container_unit', '');
	const valueCBM = _.get(conversion, [unit, 'CBM'], 0);
	const valueCFT = _.get(conversion, [unit, 'CFT'], 0);

	const data = {
		CBM: unit === 'CBM' ? volume.toFixed(2) : (volume * valueCBM).toFixed(2),
		CFT: unit === 'CFT' ? volume.toFixed(2) : (volume * valueCFT).toFixed(2),
	};

	return {
		CBM: parseFloat(data.CBM),
		CFT: parseFloat(data.CFT),
	};
};
