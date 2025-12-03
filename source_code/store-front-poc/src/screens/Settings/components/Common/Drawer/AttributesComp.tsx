import { Grid } from 'src/common/@the-source/atoms';
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';
import { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import MovableList from './MovableList';

const AttributesComp = ({ attributes, set_attributes, attributes_list }: any) => {
	const [all_attributes, set_all_attributes] = useState<any>(null);
	const [select_attr, set_select_attr] = useState<any>({});

	const get_all_attributes = (data: any[]) => {
		set_all_attributes(data);
		set_select_attr(data);
	};

	const handleDrop = (list?: any) => {
		const updated_list = _.map(list, ({ label, key }) => ({ label, value: key }));
		set_select_attr(updated_list);
		set_attributes(_.map(updated_list, (attribute: any) => attribute?.value));
	};

	const handleChange = (event: any) => {
		const {
			target: { value },
		} = event;
		set_attributes(value);
		let temp = all_attributes.filter((item: any) => value.includes(item?.value));
		set_select_attr(temp);
	};

	useEffect(() => {
		get_all_attributes(attributes_list);
	}, [attributes_list]);

	const handle_attribute_list = () => {
		const att_list = _.map(attributes, (item, index) => ({ id: item, priority: index }));
		const list = _.filter(select_attr, (attribute: any) => _.includes(attributes, attribute?.value));
		return _.map(att_list, (com) => _.find(list, (att) => att?.value === com?.id));
	};

	return (
		<>
			<Grid display='flex' direction='column' pt={1} gap={2.4} sx={{ '&::-webkit-scrollbar': { width: 0 } }}>
				<FormControl sx={{ width: '100%' }}>
					<InputLabel id='demo-multiple-name-label'>Select attributes</InputLabel>
					<Select
						labelId='demo-multiple-name-label'
						id='demo-multiple-name'
						multiple
						value={attributes}
						onChange={handleChange}
						input={<OutlinedInput label='Select attributes' />}
						MenuProps={{
							PaperProps: {
								style: {
									maxWidth: '450px',
									maxHeight: '300px',
								},
							},
						}}>
						{all_attributes?.map((attribute: any) => (
							<MenuItem key={attribute?.value} value={attribute?.value}>
								{attribute?.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<CustomText color='rgba(0, 0, 0, 0.6)'>Drag and drop to re-order</CustomText>
				<MovableList
					onDrop={handleDrop}
					list={handle_attribute_list()?.map((option: any) => ({
						node: <CustomText type='Body'>{option?.label}</CustomText>,
						label: option?.label,
						onDelete: (key: any) => {
							let curr_options = _.filter(attributes, (attribute: any) => attribute !== key);
							set_attributes(curr_options);
						},
						deleteable: true,
						dragable: true,
						key: option?.value,
					}))}
				/>
			</Grid>
		</>
	);
};

export default AttributesComp;
