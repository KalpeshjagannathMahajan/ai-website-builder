import { Grid, Menu, MenuList } from '@mui/material';
import { useEffect, useState } from 'react';
import { Icon, Typography } from '../../../atoms';
import CategoryFilter from './CategoryFilter';
import styles from './CategoryFilter.module.css';
import { CategoryProps } from './CategoryFilter.types';
import { useTheme } from '@mui/material/styles';

const Category = ({ label, categoryList, onApply, applied = [] }: CategoryProps) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const dropdownOpen = Boolean(anchorEl);
	const theme: any = useTheme();
	const [category_list, set_category_list] = useState(categoryList);

	const handleBoxClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	useEffect(() => {
		set_category_list(categoryList);
	}, [categoryList]);

	return (
		<>
			<Grid
				container
				id={'category-filter'}
				className={styles['category-filter-box']}
				sx={{
					border: !anchorEl && applied?.length === 0 ? 'none' : theme?.product?.filter?.category_filter?.border,
					padding: (!anchorEl && applied?.length) === 0 ? '0em 1em 0em 1.4em' : '0em 1em 0em 1.4em',
					'&:hover': { border: applied.length === 0 ? theme?.product?.filter?.category_filter?.hover_border : '' },
					...theme?.product?.filter?.category_filter?.category_filter_box,
				}}
				direction='row'
				minWidth={150}
				height={42}
				justifyContent='space-between'
				alignItems='center'
				onClick={(e: any) => {
					handleBoxClick(e);
				}}>
				<Grid item sx={{ display: 'flex', alignItems: 'center' }}>
					{applied?.length > 0 && (
						<span
							style={{
								...theme?.product?.filter?.red_dot,
							}}
							className={styles['red-dot']}
						/>
					)}{' '}
					<Typography
						sx={{ fontFamily: theme?.product?.filter?.category_filter?.fontFamily }}
						className='category_filter_label'
						variant='body-2'>
						{label}
					</Typography>
				</Grid>
				<Grid item alignItems='center'>
					<Icon iconName={anchorEl ? 'IconChevronUp' : 'IconChevronDown'} sx={{ marginTop: '.2em' }} />
				</Grid>
			</Grid>
			<Menu
				open={dropdownOpen}
				onClose={handleMenuClose}
				anchorEl={anchorEl}
				slotProps={{
					paper: {
						sx: {
							borderRadius: theme?.dropdown_border_radius?.borderRadius,
							// border: '1px solid blue',
							'& ul': {
								borderRadius: theme?.dropdown_border_radius?.borderRadius,
								// border: '1px solid green',
								// padding: 0
							},
						},
					},
				}}
				sx={{
					height: '100vh',
					// overflow: 'scroll',
					// '&::-webkit-scrollbar': {
					// 	display: 'none',
					// },
					pt: 0,
					minWidth: 200,
				}}>
				<MenuList
					sx={{
						maxHeight: 300,
						minHeight: 100,
						overflow: 'scroll',
						'&::-webkit-scrollbar': {
							display: 'none',
						},
						minWidth: 300,
						p: 0,
						mt: '-.5em',
						mb: '-.5em',
						'&:focus-visible': {
							outline: 'none',
						},
						borderRadius: theme?.dropdown_border_radius?.borderRadius,
						// border: '1px solid red',
					}}>
					<CategoryFilter categoryList={category_list} onApply={onApply} applied={applied} setAnchorEl={setAnchorEl} />
				</MenuList>
			</Menu>
		</>
	);
};

Category.defaultProps = {
	label: 'Category',
	applied: [],
};
export default Category;
