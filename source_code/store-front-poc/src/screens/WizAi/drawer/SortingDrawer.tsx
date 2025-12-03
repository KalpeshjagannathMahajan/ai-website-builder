import { Divider, Radio, useTheme } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import WizAiContext from '../context';
import _ from 'lodash';
import useStyles from '../style';
// import { useSearchParams } from 'react-router-dom';

interface Props {
	open: boolean;
	close: () => void;
	columnApi?: any;
}

const get_column_name = (key: any, columns: any) => {
	const completed_order: any = [];
	for (const column of columns) {
		completed_order.push(column?.field);
		if (column.field === key) {
			return column?.headerName || '';
		}

		if (column?.children) {
			// const childCol = _.find(column.children, { field: key })?.headerName;
			const child_value = _.map(column?.children, (child) => {
				if (!_.includes(completed_order, child?.field)) {
					completed_order.push(child?.field);
					if (child?.field === key) {
						return child?.headerName;
					} else {
						return null;
					}
				} else {
					const count = _.countBy(completed_order, (o) => o === child?.field)?.true;
					const new_key = `${child?.field}_${count}`;
					completed_order.push(child?.field);
					if (new_key === key) {
						return child?.headerName;
					} else {
						return null;
					}
				}
			}).filter((child) => child);
			const childCol = _.head(child_value);
			if (childCol) {
				if (column.field === 'abandoned_cart') {
					return `Abandoned Cart ${childCol}`;
				}
				if (_.includes(childCol, '$ change')) {
					return `${childCol} in ${column?.headerName}`;
				}
				return `${childCol} (${column?.headerName})`;
			}
		}
	}

	return '';
};
const global_sorting: any[] = []; //['display_index', 'recommended'];
const SortDrawer = ({ open, close, columnApi }: Props) => {
	const theme: any = useTheme();
	const classes = useStyles(theme);
	const searchParamsDrawer = new URLSearchParams(window.location.search);
	const { insights, sort, set_sort_data, all_sorting_dta, column_def, view } = useContext(WizAiContext);
	// const [searchParams] = useSearchParams();
	const [loading, set_loading] = useState<boolean>(false);

	const updated_data = () => {
		return _.map(_.size(sort) > 0 ? sort : insights?.config?.sorting, (ele) => {
			if (ele?.children) {
				return {
					...ele,
					value: `${ele?.label}`,
					children: _.map(ele?.children, (child) => {
						return {
							...child,
							value: `${child?.key?.key}_${child?.key?.order}`,
						};
					}),
				};
			} else
				return {
					...ele,
					value: `${ele?.key?.key}_${ele?.key?.order}`,
				};
		});
	};
	const new_data = updated_data();

	const [selected, set_selected] = useState(
		_.isEmpty(all_sorting_dta) && view?.is_default ? _.find(new_data, (ele) => ele?.is_default)?.value : sort?.[0]?.value,
	);
	const [selectedChild, setSelectedChild] = useState(null);
	const methods = useForm({});

	useEffect(() => {
		// Extract and set the initial sort settings from searchParams
		const sortParam = searchParamsDrawer
			.get('sort')
			?.split(',')
			?.map((item: any) => {
				const parts = item?.split('*');
				return { colId: parts?.[0], sort: parts?.[1], is_global: parts?.[2] === 'is_global' };
			})
			.find((item: any) => item?.is_global);

		if (sortParam) {
			const valueToSelect = `${sortParam?.colId}_${sortParam?.sort}`;
			const no_child = _.some(new_data, { value: valueToSelect });
			if (no_child) {
				set_selected(valueToSelect);
			} else {
				_.map(new_data, (item) => {
					if (item?.children) {
						_.map(item?.children, (child) => {
							if (child?.value === valueToSelect) {
								set_selected(item?.value);
								setSelectedChild(child?.value);
							}
						});
					}
				});
			}
		}
	}, []);

	const computeSortPayload = () => {
		let payload: any = [];

		if (selectedChild) {
			const selectedItem = _.find(new_data, (item) => item?.children?.some((child: any) => child?.value === selectedChild));
			const selectedChildItem = _.find(selectedItem?.children, (child) => child?.value === selectedChild);
			payload.push({
				colId: selectedChildItem?.key?.key,
				sort: selectedChildItem?.key?.order,
				is_global: true,
			});
		} else {
			const selectedItem = _.find(new_data, (item) => item?.value === selected);
			if (!_.includes(global_sorting, selectedItem?.key?.key)) {
				payload.push({
					colId: selectedItem?.key?.key,
					sort: selectedItem?.key?.order,
					is_global: true,
				});
			}
		}

		return payload;
	};

	const handleClick = () => {
		set_loading(true);

		// Reset column state if needed
		if (columnApi) {
			columnApi?.applyColumnState({
				state: null,
				defaultState: { sort: null },
			});
		}

		searchParamsDrawer.delete('sort');
		window.history.pushState({}, '', `${window.location.pathname}?${searchParamsDrawer.toString()}`);

		const payload = computeSortPayload();
		set_sort_data(payload);
		// Check if there is a valid payload to apply
		// if (payload) {
		// 	columnApi.applyColumnState({
		// 		state: payload,
		// 		applyOrder: true,
		// 	});
		// }

		set_loading(false);
		close();
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>Sorting</CustomText>
				<Icon iconName='IconX' onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Button variant='outlined' onClick={close}>
					Cancel
				</Button>
				<Button onClick={handleClick} loading={loading}>
					Save
				</Button>
			</Grid>
		);
	};
	const new_all_sorting = _.filter(all_sorting_dta, (item) => !item?.is_global);
	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body' gap={'5px'}>
				{new_all_sorting?.length > 0 && (
					<>
						<CustomText type='H3'>Custom Sorting</CustomText>
						<Grid className={classes.sorting_parent}>
							{_.map(new_all_sorting, (item) => {
								const column_name = get_column_name(item?.colId, column_def);
								const sorting_info = item?.sort === 'asc' ? 'Low to high' : 'High to low';

								return <CustomText>{`${column_name} - ${sorting_info}`}</CustomText>;
							})}
						</Grid>
					</>
				)}
				<FormProvider {...methods}>
					{_.map(new_data, (item) => {
						return (
							<>
								<Grid display={'flex'} direction={'row'} alignItems={'center'}>
									<Radio
										size='small'
										checked={item.value === selected}
										value={item?.value}
										sx={{ padding: '8px' }}
										onChange={() => {
											set_selected(item?.value);
											if (item?.children) {
												setSelectedChild(item?.children?.[0]?.value);
											} else {
												setSelectedChild(null);
											}
										}}
									/>
									<CustomText>{item?.label}</CustomText>
								</Grid>
								{item?.children && item.value === selected && (
									<Grid className={classes.sorting_child} ml={3.5}>
										{_.map(item?.children, (child) => {
											return (
												<Grid display={'flex'} direction={'row'} alignItems={'center'}>
													<Radio
														sx={{ padding: '8px' }}
														size='small'
														checked={child?.value === selectedChild}
														value={child?.value}
														onChange={() => {
															setSelectedChild(child?.value);
														}}
													/>
													<CustomText>{child?.label}</CustomText>
												</Grid>
											);
										})}
									</Grid>
								)}
							</>
						);
					})}
				</FormProvider>
			</Grid>
		);
	};

	const handle_render_content = () => {
		return (
			<Grid className='drawer-container'>
				{handle_render_header()}
				<Divider className='drawer-divider' />
				{handle_render_drawer_content()}
				<Divider className='drawer-divider' />
				{handle_render_footer()}
			</Grid>
		);
	};

	return <Drawer anchor='right' width={400} open={open} onClose={close} content={handle_render_content()} />;
};
export default SortDrawer;
