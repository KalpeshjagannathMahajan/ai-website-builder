import _ from 'lodash';
import React from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Modal, TextArea } from 'src/common/@the-source/atoms';

interface CatalogSearchProps {
	is_modal_open: boolean;
	set_is_modal_open: (value: boolean) => void;
	search_input: string;
	set_search_input: (value: string) => void;
	set_search_clicked: (value: boolean | ((prev: boolean) => boolean)) => void;
	handle_clear_filter: () => void;
}

const CatalogSearch = ({
	is_modal_open,
	set_is_modal_open,
	search_input,
	set_search_input,
	set_search_clicked,
	handle_clear_filter,
}: CatalogSearchProps) => {
	const handleInputChange = (event: any) => {
		const val = event.target.value;
		set_search_input(val);
	};

	const handleClear = () => {
		handle_clear_filter();
		set_search_input('');
		set_search_clicked((prev: boolean) => !prev);
		set_is_modal_open(false);
	};

	const handle_key_press = (e: any) => {
		if (_.isEmpty(search_input)) {
			return;
		}
		handle_clear_filter();
		set_search_clicked((prev: boolean) => !prev);
		set_is_modal_open(false);
		e.preventDefault();
		e.stopPropagation();
	};

	return (
		<Modal
			width={500}
			open={is_modal_open}
			onClose={() => set_is_modal_open(false)}
			title={'Search by SKU ID'}
			footer={
				<Grid container justifyContent='end'>
					<Button variant='outlined' sx={{ marginRight: '1rem' }} onClick={handleClear}>
						Clear
					</Button>
					<Button onClick={handle_key_press}>Search</Button>
				</Grid>
			}
			children={
				<React.Fragment>
					<CustomText type='Body'>Manually enter the SKUs in order to search for the respective catalogs</CustomText>
					<TextArea
						rows={4}
						placeholder={'Enter the SKU IDs'}
						value={search_input}
						handleChange={handleInputChange}
						sx={{ width: '100%', marginTop: '10px' }}
					/>
				</React.Fragment>
			}
		/>
	);
};

export default CatalogSearch;
