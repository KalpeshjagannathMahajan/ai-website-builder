import React, { useContext, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Drawer, Grid, Icon, Button } from 'src/common/@the-source/atoms';
import { Divider, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import RadioGroup from 'src/common/@the-source/molecules/RadioGroup';
import SettingsContext from 'src/screens/Settings/context';
import _ from 'lodash';
import { isUUID } from 'src/screens/Settings/utils/helper';

interface Props {
	drawer: boolean;
	set_drawer: (state: boolean) => void;
	data: any;
}

const EditAttDrawer = ({ drawer, set_drawer, data }: Props) => {
	const { configure, att_list, update_configuration } = useContext(SettingsContext); //update_configuration
	const [val, set_val] = useState<any>({ radio: data?.buyer_field ? 'yes' : 'no', attribute: data?.buyer_field ?? '' });

	const handleChange = (event: any) => {
		const {
			target: { value },
		} = event;
		set_val((prev: any) => ({ ...prev, attribute: value }));
	};

	const handle_save = (value: any) => {
		if (value.radio === 'yes') {
			let order = [...configure?.order_auto_fill_settings];
			let quote = [...configure?.quote_auto_fill_settings];

			const updateArray = (array: any, dataId: any, attributeValue: any) => {
				let found = false;
				const updatedArray = array.map((item: any) => {
					if (item?.document_field === dataId) {
						found = true;
						return { ...item, buyer_field: attributeValue };
					}
					return item;
				});

				if (!found) {
					updatedArray.push({ document_field: dataId, buyer_field: attributeValue ? attributeValue : '' });
				}

				return updatedArray;
			};

			order = updateArray(order, data?.id, value?.attribute);
			quote = updateArray(quote, data?.id, value?.attribute);

			//Filter order if document_field isUUID
			order = _.filter(order, (item) => !isUUID(item?.document_field));
			quote = _.filter(quote, (item) => !isUUID(item?.document_field));

			update_configuration('order_auto_fill_settings', order);
			update_configuration('quote_auto_fill_settings', quote);
		} else {
			let is_order = _.some(configure?.order_auto_fill_settings, (item) => item?.document_field === data?.document_field);
			let is_quote = _.some(configure?.quote_auto_fill_settings, (item) => item?.document_field === data?.document_field);

			if (is_order) {
				let sample = _.filter(configure?.order_auto_fill_settings, (item) => item?.document_field === data?.document_field);
				update_configuration('order_auto_fill_settings', sample);
			}
			if (is_quote) {
				let sample = _.filter(configure?.quote_auto_fill_settings, (item) => item?.document_field === data?.document_field);
				update_configuration('quote_auto_fill_settings', sample);
			}
		}
		set_drawer(false);
	};
	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'> {data?.document_field_name}</CustomText>
				<Icon iconName='IconX' onClick={() => set_drawer(false)} />
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<CustomText type='Title'>Connected to buyer</CustomText>
				<RadioGroup
					selectedOption={val?.radio}
					options={[
						{ value: 'yes', label: 'Yes' },
						{ value: 'no', label: 'No' },
					]}
					onChange={(option: string) => set_val((prev: any) => ({ ...prev, radio: option }))}
					label_style={{ display: 'flex', flexDirection: 'row' }}
				/>
				{val?.radio === 'yes' && (
					<FormControl sx={{ width: '100%' }}>
						<InputLabel id='demo-multiple-name-label'>Select attributes</InputLabel>
						<Select
							labelId='demo-multiple-name-label'
							id='demo-multiple-name'
							value={val?.attribute}
							onChange={handleChange}
							input={<OutlinedInput label='Name' />}>
							{att_list?.buyer?.map((attribute: any) => (
								<MenuItem key={attribute?.id} value={attribute?.id}>
									{attribute?.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)}
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Button variant='outlined' onClick={() => set_drawer(false)}>
					Cancel
				</Button>
				<Button onClick={() => handle_save(val)}>Save</Button>
			</Grid>
		);
	};

	const handle_render_content = () => {
		return (
			<>
				<Grid className='drawer-container'>
					{handle_render_header()}
					<Divider className='drawer-divider' />
					{handle_render_drawer_content()}
					<Divider className='drawer-divider' />
					{handle_render_footer()}
				</Grid>
			</>
		);
	};

	return (
		<>
			<Drawer
				anchor='right'
				width={480}
				open={drawer}
				onClose={() => set_drawer(false)}
				content={<React.Fragment>{handle_render_content()}</React.Fragment>}
			/>
		</>
	);
};
export default EditAttDrawer;
