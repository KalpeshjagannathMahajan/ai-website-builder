//transform data
export const transform_data = (data: any) => {
	const map: any = {};
	data.forEach((ele: any) => {
		let hinge_id = ele.id;
		let hinge_value = ele.value;
		map[hinge_id] = hinge_value;
	});
	return map;
};

//compare transformed data with variant map data
export const compare_and_filter = (obj: any, data: any) => {
	return data.filter((item: any) => {
		for (const key in obj) {
			if (obj.hasOwnProperty(key) && item.hasOwnProperty(key) && item[key] === obj[key]) {
				continue;
			} else {
				return false;
			}
		}
		return true;
	});
};

export const convert_data_to_object = (data: any) => {
	const result = [];

	for (const key in data) {
		const obj: any = {};
		obj[key] = data[key];
		result.push(obj);
	}

	return result;
};

export const filter_data_by_id = (data: any, id_to_filter: any) => {
	const filtered_data = data.filter((item: any) => {
		const item_id = Object.keys(item)[0]; // Get the ID from the first (and only) key in the object
		return item_id !== id_to_filter;
	});

	return filtered_data.map((item: any) => {
		const item_id = Object.keys(item)[0];
		return {
			id: item_id,
			value: item[item_id].value,
		};
	});
};
