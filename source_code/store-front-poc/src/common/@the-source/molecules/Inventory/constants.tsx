/* eslint-disable @typescript-eslint/no-shadow */
import dayjs from 'dayjs';
import _ from 'lodash';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

const CUSTOM_KEYS = ['backorder_allowed', 'on_order_details', 'in_transit_details', 'notes'];
const SPECIAL_KEYS = ['available_quantity', 'reserved_quantity', 'in_stock_quantity', 'total_reserved'];
export const INVENTORY_STATUS = {
	out_of_stock: 'OUT_OF_STOCK',
	back_order: 'BACKORDER',
	in_stock: 'IN_STOCK',
};
export const INVENTORY_ICON_META = {
	available_quantity: {
		label: 'Available',
		show: true,
	},
	reserved_quantity: {
		label: 'Reserved',
		show: true,
	},
	in_stock_quantity: {
		label: 'In stock',
		show: true,
	},
	backorder_allowed: {
		label: 'Back order allowed',
		show: true,
	},
	in_transit_details: {
		label: 'In transit',
		show: true,
		entries: 5,
	},
	on_order_details: {
		label: 'On order',
		show: true,
		entries: 5,
	},
	notes: {
		label: 'Notes',
		show: true,
	},
};
const handle_transform_value = (inventoryData: any, data: any) => {
	const updated_data = _.take(_.sortBy(inventoryData, 'date'), data?.entries);

	return _.map(updated_data, (item: any) => {
		const date = item?.date ? dayjs(item?.date * 1000)?.format("Do MMM'YY") : null;
		const quantity = item?.quantity || 0;

		const item_info = date ? `${quantity} units arriving by ${date}` : `${quantity} units arriving soon`;

		return item_info;
	});
};

const transformData = (inventoryData: any, metaData: any, reserved_quantity: number) => {
	return _.map(metaData, (value, key) => {
		let transformedValue = inventoryData?.[key] || 0;
		let is_show = true;

		switch (key) {
			case 'backorder_allowed':
				const backorder_quantity = inventoryData?.backorder_available_quantity || 0;
				transformedValue = inventoryData[key] ? (backorder_quantity !== 0 ? `upto ${backorder_quantity} units` : '') : '';
				break;

			case 'on_order_details':
			case 'in_transit_details':
				const filter_data = _.filter(inventoryData[key], (item: any) => item?.quantity > 0);
				transformedValue = handle_transform_value(filter_data, value);
				is_show = !_.isEmpty(filter_data);
				break;

			case 'reserved_quantity':
				transformedValue = inventoryData?.[key] - reserved_quantity || 0;
				break;

			case 'total_available':
				transformedValue = inventoryData?.[key] + reserved_quantity || 0;
				break;

			default:
				break;
		}

		return {
			data: {
				label: value.label,
				value: _.includes(SPECIAL_KEYS, key) ? `${transformedValue}` : transformedValue,
			},
			is_custom: _.includes(CUSTOM_KEYS, key),
			id: key,
			entries: value?.entries,
			is_notes: key === 'notes',
			is_shown: _.includes(SPECIAL_KEYS, key) ? value?.show : value?.show && is_show,
		};
	});
};

export const handle_get_menu = (inventory_data: any, meta: any, reserved: number) => {
	const menu = transformData(inventory_data, meta, reserved);

	return menu.filter((item: any) => item?.is_shown && item?.data?.value);
};
