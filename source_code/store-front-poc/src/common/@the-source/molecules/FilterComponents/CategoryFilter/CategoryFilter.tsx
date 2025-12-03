import { Checkbox, Collapse, Divider, Grid, MenuItem } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Box, Button, Icon, Typography } from '../../../atoms';
import styles from './CategoryFilter.module.css';
import { CategoryFilterProps, CheckboxState, HashMap, ItemState } from './CategoryFilter.types';
import { flattenTree, getAllIds, updateItemStates } from './CategoryFilterUtils';
import { t } from 'i18next';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const useStyles = makeStyles(() => ({
	truncate_text: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		maxWidth: '300px',
	},
}));

const CategoryFilter = ({ categoryList, onApply, applied = [], setAnchorEl }: CategoryFilterProps) => {
	const flatList = getAllIds(categoryList);
	const classes = useStyles();
	const defaultItemStates: ItemState[] = flatList.map((i: any) => ({
		id: i,
		state: CheckboxState.UNCHECKED,
	}));
	const theme: any = useTheme();
	const [open, setOpen] = useState<string[]>([]);
	const [itemStates, setItemStates] = useState<ItemState[]>(defaultItemStates);
	const hashMap: HashMap[] = flattenTree(categoryList);
	// const idsOfApplied = applied.map((item: any) => hashMap.find((el: HashMap) => el.hierarchy === item)?.id)?.filter(Boolean);

	const handleUpdateState = () => {
		if (applied?.length > 0) {
			const idsOfApplied = applied
				.map((item: any) => {
					let data = hashMap.find((el: HashMap) => el.hierarchy === item)?.id;
					return data;
				})
				.filter(Boolean);

			// idsOfApplied.forEach((el: any) =>
			// 	setItemStates((state) => {
			// 		let data = updateItemStates(state, categoryList, el);
			// 		return data;
			// 	}),
			// );
			const data = updateItemStates(itemStates, categoryList, idsOfApplied);
			setItemStates(data);
		}
	};

	useEffect(() => {
		handleUpdateState();
	}, []);

	const getStateForId = useCallback((id: any) => itemStates.find((i: any) => i.id === id)?.state, [itemStates]);

	const onCheckboxClick = useCallback(
		(event: any) => setItemStates(updateItemStates(itemStates, categoryList, [event.target.value])),
		[itemStates],
	);

	const handleApply = () => {
		const selectedCategoryIds = itemStates
			.filter((item) => item.state === CheckboxState.CHECKED)
			.reduce((selectedIds, item) => {
				// Add the current item's ID to the list
				// selectedIds.push(item.id);
				// Get all children IDs for the current item, if any
				const childrenIds = flattenTree([item]).map((i) => i.id);
				// Add the children IDs to the list
				childrenIds.forEach((childId) => {
					const _temp = hashMap.filter((_h) => _h.id === childId)?.[0];
					if (_temp?.hierarchy?.includes(' > ')) {
						let parent_index = hashMap.filter((_h) => _h.id === childId)[0].hierarchy.lastIndexOf(' > ');
						let _parentHierarchy = hashMap.filter((_h) => _h.id === childId)[0].hierarchy.slice(0, parent_index);
						let parent = hashMap.filter((_h) => _h.hierarchy === _parentHierarchy)?.[0];
						if (parent.hierarchy?.includes(' > ')) {
							parent_index = hashMap.filter((_h) => _h.id === parent.id)[0].hierarchy.lastIndexOf(' > ');
							_parentHierarchy = hashMap.filter((_h) => _h.id === parent.id)[0].hierarchy.slice(0, parent_index);
							let _parent = hashMap.filter((_h) => _h.hierarchy === _parentHierarchy)?.[0];
							const parent_id = _parent.id;
							if (!selectedIds.includes(parent_id) && !selectedIds.includes(parent.id)) {
								selectedIds.push(childId);
							}
						} else {
							const parent_id = parent.id;
							if (!selectedIds.includes(parent_id) && !selectedIds.includes(childId)) {
								selectedIds.push(childId);
							}
						}
					} else if (!selectedIds.includes(childId)) {
						selectedIds.push(childId);
					}
				});
				return selectedIds;
			}, []);

		// Now, we have both the parent and child IDs in selectedCategoryIds
		const nodes = new Set(selectedCategoryIds);
		const nodesArray = Array.from(nodes);
		const hierarchyPayload = nodesArray?.map((item: any) => hashMap?.find((el: HashMap) => el.id === item)?.id ?? '');
		onApply(hierarchyPayload);
		setAnchorEl(null);
	};

	const handleClear = () => {
		onApply([]);
		setAnchorEl(null);
	};

	const handleClick = (id: string) => {
		// setItemStates(updateItemStates(itemStates, categoryList, [item]));
		if (open.includes(id)) {
			setOpen(open.filter((_item) => _item !== id));
		} else {
			setOpen([...open, id]);
		}
	};

	const row_menu_item_click = (item: any) => {
		setItemStates(updateItemStates(itemStates, categoryList, [item.id]));
		handleClick(item.id);
	};

	const renderMenu = (tree: any, level: number = 0) =>
		tree.map((item: any) => {
			const checkboxState = getStateForId(item.id);
			return (
				<div key={item.name} style={{ marginLeft: `${level * 0.5 + 0.5}em` }}>
					<Grid ml={2} item container alignItems='center'>
						<Divider
							sx={{
								borderStyle: 'dashed',
							}}
							orientation='vertical'
						/>
						<Grid item mt={1} ml={`${level * 0.5 + 0.5}em`}>
							{item.children.length > 0 &&
								(open.includes(item.id) ? (
									<Icon
										onClick={() => handleClick(item.id)}
										color={theme?.product?.filter?.category_filter?.icon_color?.primary}
										iconName='IconMinus'
									/>
								) : (
									<Icon
										onClick={() => handleClick(item.id)}
										color={theme?.product?.filter?.category_filter?.icon_color?.secondary}
										iconName='IconCirclePlus'
									/>
								))}
						</Grid>

						<Grid item xs mr={2} ml={item.children.length === 0 ? 2 : 0}>
							<MenuItem
								sx={{
									pl: 0.25,
									pr: 0,
									ml: 0.5,
									mr: 0.5,
									borderRadius: '8px',
								}}>
								<Grid container alignItems='center' onClick={() => row_menu_item_click(item)}>
									<Checkbox
										onChange={onCheckboxClick}
										checked={checkboxState === CheckboxState.CHECKED}
										indeterminate={checkboxState === CheckboxState.INDETERMINATE}
										value={item.id}
										size='small'
										sx={{
											'&.Mui-checked': { ...theme?.product?.filter?.category_filter?.checkbox },
										}}
									/>
									<Typography variant='inherit'>
										{item.name} ({item.count})
									</Typography>
								</Grid>
							</MenuItem>
						</Grid>
					</Grid>

					{item.children.length > 0 && (
						<Collapse in={open.includes(item.id)} timeout='auto' unmountOnExit>
							{renderMenu(item.children, level + 1)}
						</Collapse>
					)}
				</div>
			);
		});

	return (
		<>
			{categoryList.map((item: any) => {
				const checkboxState = getStateForId(item.id);
				return (
					<div key={item.name} style={{ margin: '.25em 0', overflowX: 'hidden', maxWidth: '400px' }}>
						<Grid ml={2} item container alignItems='center'>
							<Grid item mt={1}>
								{item.children.length > 0 &&
									(open.includes(item.id) ? (
										<Icon
											onClick={() => handleClick(item.id)}
											color={theme?.product?.filter?.category_filter?.icon_color?.primary}
											iconName='IconCircleMinus'
										/>
									) : (
										<Icon
											onClick={() => handleClick(item.id)}
											color={theme?.product?.filter?.category_filter?.icon_color?.secondary}
											iconName='IconCirclePlus'
										/>
									))}
							</Grid>
							<Grid item xs mr={2}>
								<MenuItem sx={{ pl: 0.25, ml: 0.5, mr: 0.5, borderRadius: '8px' }} onClick={() => row_menu_item_click(item)}>
									<Grid container alignItems='center'>
										<Checkbox
											value={item.id}
											checked={checkboxState === CheckboxState.CHECKED}
											indeterminate={checkboxState === CheckboxState.INDETERMINATE}
											onChange={onCheckboxClick}
											size='small'
											sx={{
												'&.Mui-checked': { ...theme?.product?.filter?.category_filter?.checkbox },
												'&.MuiCheckbox-indeterminate': { ...theme?.product?.filter?.category_filter?.checkbox },
											}}
										/>
										<Typography variant='inherit' className={classes.truncate_text}>
											{item.name} ({item.count})
										</Typography>
									</Grid>
								</MenuItem>
							</Grid>
						</Grid>
						{item.children.length > 0 && (
							<Collapse in={open.includes(item.id)} timeout='auto' unmountOnExit>
								{renderMenu(item.children, 0)}
							</Collapse>
						)}
					</div>
				);
			})}
			<Box
				className={styles['bottom-button-container']}
				sx={{
					...theme?.product?.filter?.category_filter?.bottom_button_container,
				}}>
				{applied?.length > 0 ? (
					<Grid container spacing={1} justifyContent='space-between'>
						<Grid item xs>
							<Button fullWidth color='secondary' variant='outlined' onClick={handleClear} sx={{ boxShadow: 'none' }}>
								{t('Common.FilterComponents.Clear')}
							</Button>
						</Grid>
						<Grid item xs>
							<Button fullWidth tonal={is_ultron} variant='contained' onClick={handleApply} sx={{ boxShadow: 'none' }}>
								{t('Common.FilterComponents.Update')}
							</Button>
						</Grid>
					</Grid>
				) : (
					<Button
						tonal
						variant='contained'
						fullWidth
						disabled={itemStates.filter((item) => item.state === CheckboxState.UNCHECKED).length === itemStates.length}
						onClick={handleApply}
						sx={{ boxShadow: 'none' }}>
						{t('Common.FilterComponents.Apply')}
					</Button>
				)}
			</Box>
		</>
	);
};

CategoryFilter.defaultProps = {
	label: 'Category',
	applied: [],
};
export default CategoryFilter;
