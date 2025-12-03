import { Controller, useFormContext } from 'react-hook-form';
import { FieldInterface } from '../../FieldInterface';
import { useState } from 'react';
import CATEGORYDATA from '../../../../molecules/FilterComponents/CategoryFilter/categoryMock.json';
import Grid from '../../../Grid/Grid';
import styles from '../../../../molecules/FilterComponents/CategoryFilter/CategoryFilter.module.css';
import Icon from '../../../Icon/Icon';
import Typography from '../../../Typography/Typography';
import { Menu, MenuList } from '@mui/material';
import CategoryFilter from 'src/common/@the-source/molecules/FilterComponents/CategoryFilter/CategoryFilter';

interface CategoryEditFieldProps extends FieldInterface {
	label: string;
	appiled: any[];
}

const CategoryEditField: React.FC<CategoryEditFieldProps> = ({ field_key, value, appiled, label, required, handleChange }) => {
	const { control } = useFormContext();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const dropdownOpen = Boolean(anchorEl);

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleBoxClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleFormatValue = (val: any[]) => {
		if (val) {
			const convertedString = val?.map((item: any) => `${item}`)?.join(',');
			if (convertedString?.length > 10) {
				return `${convertedString?.substring(0, 20)}....`;
			} else {
				return convertedString;
			}
		} else {
			return '';
		}
	};

	const handleApply = (payload: any) => {
		if (handleChange) {
			handleChange(payload);
		}
	};

	const style = {
		border: appiled?.length > 0 ? '2px solid green' : '2px solid #cf4646',
	};

	return (
		<Controller
			name={field_key}
			control={control}
			defaultValue={value || ''}
			rules={{
				required,
			}}
			render={() => {
				return (
					<>
						<Grid
							container
							className={styles['category-filter-box']}
							direction='row'
							justifyContent='space-between'
							alignItems='center'
							style={{ ...style }}
							onClick={(e: any) => {
								handleBoxClick(e);
							}}>
							<Grid style={{ width: 155 }} item>
								<Typography variant='body-2'>{handleFormatValue(value)}</Typography>
							</Grid>
							<Grid item alignItems='center'>
								<Icon iconName='IconChevronDown' sx={{ marginTop: '.2em' }} />
							</Grid>
						</Grid>
						<Menu
							open={dropdownOpen}
							onClose={handleMenuClose}
							anchorEl={anchorEl}
							sx={{
								height: 700,
								overflow: 'scroll',
								pt: 0,
								minWidth: 200,
							}}>
							<MenuList
								sx={{
									maxHeight: 415,
									overflow: 'scroll',
									minWidth: 200,
									p: 0,
									mt: '-.5em',
									mb: '-.5em',
									'&:focus-visible': {
										outline: 'none',
									},
								}}>
								<CategoryFilter
									categoryList={CATEGORYDATA?.category}
									onApply={handleApply}
									applied={appiled}
									setAnchorEl={setAnchorEl}
									label={label}
								/>
							</MenuList>
						</Menu>
					</>
				);
			}}
		/>
	);
};

export default CategoryEditField;
