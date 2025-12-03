import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Grid, Toaster } from 'src/common/@the-source/atoms';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import _ from 'lodash';
import storefront from 'src/utils/api_requests/storefront';
import StorefrontLeadExistCustomer from 'src/screens/Storefront/Drawer/StorefrontLeadExistCustomer';
import ActionButtonRenderer from './ActionButtonRenderer';
import TableSkeleton from 'src/common/TableSkeleton';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';
import { useSearchParams } from 'react-router-dom';
import utils from 'src/utils/utils';
import CustomText from 'src/common/@the-source/CustomText';
import { Button } from '@mui/material';
import { colors } from 'src/utils/theme';
import useStyles from '../styles';
import { get_value_from_current_url, remove_field_of_session_storage_item } from 'src/utils/common';
import { SECTIONS } from '../constants';

const transformData = (data: any) => {
	return _.map(data, (item: any) => {
		const getName = (firstName: string, lastName: string) => {
			if (firstName || lastName) {
				return `${firstName} ${lastName}`.trim();
			}
		};

		let firstName = _.get(item, 'lead_basic_details.first_name') || '';
		let lastName = _.get(item, 'lead_basic_details.last_name') || '';
		let company_name = _.get(item, 'lead_basic_details.company_name') || '';
		let email = _.get(item, 'lead_basic_details.email') || '';
		let updated_first_name = _.get(item, 'lead_updated_by.first_name') || '';
		let updated_last_name = _.get(item, 'lead_updated_by.last_name') || '';
		let updated_at = _.get(item, 'updated_at') || '';
		const name = getName(firstName, lastName);
		const type = _.get(item, 'customer_type') || '';
		const updated_name = getName(updated_first_name, updated_last_name);
		return {
			...item,
			name,
			company_name,
			email,
			updated_name,
			updated_at,
			type: _.capitalize(_.split(type, '_').join(' ')),
		};
	});
};

const LeadList = () => {
	const value = SECTIONS.leads;

	const classes = useStyles();
	const [column_def, set_column_def] = useState<any>([]);
	const [row_data, set_row_data] = useState<any>([]);
	const [total_rows, set_total_rows] = useState<any>();
	const [data, set_data] = useState<any>({});
	const [open_drawer, set_drawer] = useState<boolean>(false);
	const [refetch, set_refetch] = useState<boolean>(false);
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const [search_params, setSearchParams] = useSearchParams();
	const [gridApi, setGridApi] = useState<any>(null);
	const [show_toast, set_show_toast] = useState({ state: false, title: '', sub_title: '', type_status: 'success' });
	const [is_filter_active, set_is_filter_active] = useState(false);

	const actionColumn = {
		headerName: '',
		field: 'action',
		editable: false,
		filter: false,
		dtype: 'action',
		lockPinned: true,
		resizable: false,
		pinned: 'right',
		cellStyle: {
			background: 'transparent',
			width: '120px',
			justifyContent: 'center',
			alignItems: 'center',
			minWidth: '120px',
			textAlign: 'center',
			borderRadius: '0px',
			borderWidth: '0px 0px 0px 1px',
			borderColor: '#ddd4d1',
		},
		sortable: false,
		headerStyle: {
			width: '120px',
		},
		width: 120,
		flex: 1,
		minWidth: 120,
		suppressMenu: true,
		handle_edit: (params: any) => {
			set_data(params?.data);
			set_drawer(true);
		},
		cellRenderer: ActionButtonRenderer,
	};

	const get_columns = async () => {
		try {
			const columns: any = await storefront?.get_storefront_leads_ssrm();
			let col_def = columns?.data;
			col_def = _.map(col_def, (item) => {
				if (item?.field === 'customer_type') {
					return {
						...item,
						field: 'type',
					};
				}
				return item;
			});
			const columnDef12 = [...col_def, actionColumn];

			set_column_def(columnDef12);
		} catch (err) {
			console.error(err);
		}
	};

	const get_rows = () => {
		storefront
			.get_storefront_lead_table()
			.then((res: any) => {
				if (res.status === 200) {
					delete res?.status;
					const temp: any[] = [];
					_.mapValues(res, (dataValue: any) => {
						temp.push(dataValue);
					});

					const newData = transformData(temp);
					set_row_data(newData);
					// set_total_rows(temp?.length);
					set_is_loading(false);
				}
			})
			.catch((err: any) => {
				set_is_loading(false);
				console.error(err);
			});
	};

	useEffect(() => {
		get_rows();
	}, [refetch]);

	useEffect(() => {
		get_columns();
	}, []);

	const handle_get_rows = (params: any) => {
		set_total_rows(params);
	};

	const handle_clear_filter = () => {
		if (is_filter_active) {
			setSearchParams('');
			remove_field_of_session_storage_item('customer_params_data', value);
			gridApi?.setFilterModel(null);
			gridApi?.onFilterChanged();
		}
	};

	useEffect(() => {
		let filterData: any = sessionStorage.getItem('customer_params_data');
		let filter = '';
		try {
			filterData = JSON.parse(filterData) || {};
			filter = filterData[value];
		} catch (err) {}
		const storedFilter = new URLSearchParams(filter).get('filter') || '';
		const urlFilters = get_value_from_current_url() === value ? search_params.get('filters') : '';

		if ((urlFilters || (storedFilter && storedFilter !== '')) && gridApi) {
			const storedFilters = utils.parse_and_check_json(urlFilters && urlFilters !== '' ? urlFilters : storedFilter);
			if (urlFilters && urlFilters !== '') {
				filterData[value] = search_params.toString();
				sessionStorage.setItem('customer_params_data', JSON.stringify(filterData));
			}
			if (Object.keys(storedFilters).length !== 0) {
				set_is_filter_active(true);
			} else {
				set_is_filter_active(false);
			}
			gridApi.setFilterModel(storedFilters);
		}
	}, [search_params, gridApi]);

	const onFilterChanged = useCallback(() => {
		if (get_value_from_current_url() === value) {
			if (gridApi) {
				const filterModel = gridApi.getFilterModel();
				const filterModelToStore = JSON.stringify(filterModel);
				setSearchParams({ filters: filterModelToStore });
			}
		}
	}, [gridApi, setSearchParams]);

	const onGridReady = useCallback((params: any) => {
		setGridApi(params.api);
	}, []);

	useLayoutEffect(() => {
		let params: any = sessionStorage.getItem('customer_params_data');
		let urlParams = new URLSearchParams(window.location.search);
		if (typeof params === 'string') {
			try {
				params = JSON.parse(params);
				if (get_value_from_current_url() === value && !urlParams.get('filter')) {
					if (value in params) {
						setSearchParams(params[value]);
					}
				}
			} catch (err) {}
		}
	}, [location.pathname]);

	return (
		<Grid my={2} sx={{ position: 'relative' }}>
			{is_filter_active && (
				<Button onClick={handle_clear_filter} className={classes.clear_filter_button}>
					<CustomText type='Subtitle' color={colors.primary_600}>
						Clear filters
					</CustomText>
				</Button>
			)}
			{!is_loading ? (
				<>
					<AgGridTableContainer
						showSWHeader={false}
						rowData={row_data}
						totalRows={row_data.length}
						customRowName='Total Leads'
						get_total_rows={handle_get_rows}
						columnDefs={column_def}
						containerStyle={{ height: 'calc(100vh - 140px)' }}
						onFilterChanged={onFilterChanged}
						onGridReady={onGridReady}
					/>
					{total_rows === 0 && <EmptyTableComponent top={'120px'} height={'calc(100vh - 300px)'} />}
				</>
			) : (
				<TableSkeleton />
			)}
			{open_drawer && (
				<StorefrontLeadExistCustomer
					drawer={open_drawer}
					set_drawer={set_drawer}
					data={data}
					set_refetch={set_refetch}
					set_show_toast={set_show_toast}
				/>
			)}
			<Toaster
				open={show_toast.state}
				showCross={false}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				autoHideDuration={3000}
				onClose={() => set_show_toast({ state: false, title: '', sub_title: '', type_status: '' })}
				state={show_toast?.type_status === 'error' ? 'error' : 'success'}
				title={show_toast.title}
				subtitle={show_toast.sub_title}
				showActions={false}
			/>
		</Grid>
	);
};

export default LeadList;
