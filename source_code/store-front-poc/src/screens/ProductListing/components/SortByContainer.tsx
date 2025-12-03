import { Drawer, Grid, Icon, Button } from 'src/common/@the-source/atoms';
import React, { useState, useEffect } from 'react';
import { Divider } from '@mui/material';
import CustomText from 'src/common/@the-source/CustomText';
import RadioGroup from 'src/common/@the-source/molecules/RadioGroup';
import _ from 'lodash';

interface Props {
	drawer: boolean;
	sort: any;
	sort_data: any;
	handle_sort_change: any;
	set_drawer: (state: boolean) => void;
}

const normalizeSortOptions = (sortOptions: any[]) => {
	return sortOptions.map((option) => ({
		...option,
		value: option.label,
	}));
};

const handle_default_sort_option = (sort_value: any, sorting_option: any[]) => {
	const val = _.find(
		sorting_option,
		(item: any) => `${item?.key?.field}_${item?.key?.order}` === `${sort_value?.field}_${sort_value?.order}`,
	)?.value;

	return val;
};
const SortByContainer = ({ drawer, sort, sort_data, handle_sort_change, set_drawer }: Props) => {
	const [selected_sort, set_selected_sort] = useState<any>(null);
	useEffect(() => {
		const normalizedSortData = normalizeSortOptions(sort_data);
		const default_sort_option = handle_default_sort_option(sort, normalizedSortData);
		set_selected_sort(default_sort_option);
	}, [sort, sort_data]);

	const handle_sorting = () => {
		const data = _.find(normalizeSortOptions(sort_data), { value: selected_sort })?.key;
		handle_sort_change(data);
		set_drawer(false);
	};
	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>All Sorting </CustomText>
				<Icon iconName='IconX' onClick={() => set_drawer(false)} />
			</Grid>
		);
	};
	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer' pb={1} gap='8px'>
				<Button variant='outlined' onClick={() => set_drawer(false)} sx={{ flex: 1 }}>
					Cancel
				</Button>
				<Button onClick={handle_sorting} sx={{ flex: 1 }}>
					Show Results
				</Button>
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<RadioGroup
					selectedOption={selected_sort}
					options={normalizeSortOptions(sort_data)}
					onChange={(e) => set_selected_sort(e)}
					child_style={{ marginBottom: '10px' }}
				/>
			</Grid>
		);
	};
	const handle_render_content = () => {
		return (
			<Grid className='drawer-container' style={{ height: '100dvh' }}>
				{handle_render_header()}
				<Divider className='drawer-divider' />
				{handle_render_drawer_content()}
				<Divider className='drawer-divider' />
				{handle_render_footer()}
			</Grid>
		);
	};

	return (
		<>
			<Drawer
				anchor='right'
				width={435}
				open={drawer}
				onClose={() => set_drawer(false)}
				content={<React.Fragment>{handle_render_content()}</React.Fragment>}
			/>
		</>
	);
};
export default SortByContainer;
