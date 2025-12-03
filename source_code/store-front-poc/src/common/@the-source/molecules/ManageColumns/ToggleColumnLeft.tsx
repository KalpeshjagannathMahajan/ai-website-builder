/* eslint-disable */
import React, { useContext, useState } from 'react';
import { Grid, Icon, Typography, CustomInput, Switch } from '../../atoms';
import styles from './ManageColumn.module.css';

import { MyDataContext } from './context';

interface ToggleLeftProps {
	pinned_columns: string[];
}

const ToggleColumnLeft: React.FC<ToggleLeftProps> = ({ pinned_columns }) => {
	const context_value = useContext(MyDataContext);

	if (!context_value) {
		throw new Error('MyDataContext is not provided.');
	}

	const { data, set_reordered, new_array, set_new_array } = context_value;

	const handleSwitchToggle = (value: boolean, attrName: string) => {
		const filteredColumn = data.attributes.filter((attr) => attr.headerName === attrName);

		if (value) {
			set_new_array([...new_array, ...filteredColumn]);
		} else {
			set_new_array(new_array.filter((attr) => attr.headerName !== attrName));
		}
	};

	const [searchTerm, setSearchTerm] = useState('');

	const handleSearchFilter = (value: string) => {
		setSearchTerm(value.toLowerCase());
	};
	const allowClear = !!searchTerm;

	const getFilteredAttributes = () => {
		if (searchTerm === '') {
			return data.attributes;
		} else {
			return data.attributes.filter((attr) => attr.headerName?.toLowerCase()?.includes(searchTerm));
		}
	};

	const toggleOnArray = new_array?.map((attr) => attr.headerName);

	return (
		<Grid item xs={6}>
			<Grid item sx={{ marginLeft: '0.5rem', marginRight: '2rem' }}>
				<CustomInput
					label=''
					children=''
					placeholder='Search'
					onChange={(ele) => handleSearchFilter(ele.target.value)}
					variant='outlined'
					sx={{
						width: '272px',
						background: 'white',
						padding: '10px',
					}}
					type='text'
					startIcon={<Icon iconName='IconSearch' sx={{ marginRight: '0.4rem' }} />}
					allowClear={allowClear}
				/>
			</Grid>

			<Grid container className={styles.attrCont}>
				{getFilteredAttributes()
					.filter((attr) => attr.headerName !== '' && attr.headerName !== 'Action')
					.map((attr: any) => (
						<Grid className={styles.toggleField} key={attr.colId}>
							<Typography
								sx={{
									color: 'rgba(0, 0, 0, 0.87)',
									fontWeight: '400',
									padding: '10px',
								}}
								variant='body2'>
								{attr.headerName}
							</Typography>
							<Switch
								disabled={pinned_columns.includes(attr.headerName)}
								checked={toggleOnArray?.includes(attr.headerName)}
								onChange={(e) => {
									if (pinned_columns?.includes(attr.headerName)) {
									} else {
										return handleSwitchToggle(e.target.checked, attr.headerName);
									}
								}}
							/>
						</Grid>
					))}
			</Grid>
		</Grid>
	);
};

export default ToggleColumnLeft;
