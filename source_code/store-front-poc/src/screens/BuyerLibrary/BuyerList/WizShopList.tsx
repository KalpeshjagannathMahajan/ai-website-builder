/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Button, Grid, Icon, Modal, Toaster } from 'src/common/@the-source/atoms';
import api_requests from 'src/utils/api_requests';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import _ from 'lodash';
import { Alert } from '@mui/material';
import MenuCellRenderer from '../ViewBuyer/components/MenuCellRenderer';
import StoreFrontAddUser from '../AddEditBuyerFlow/components/StoreFrontAddUser';
import { attributes, checkbox_attribute } from './columns';
import SelectBuyerPanel from 'src/common/SelectBuyerPanel/SelectBuyerPanel';
import BuyerListContext from './context';
import TableSkeleton from 'src/common/TableSkeleton';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';
import { useSearchParams } from 'react-router-dom';
import CustomText from 'src/common/@the-source/CustomText';
import { Drawer, Button as DefaultButton } from '@mui/material';
import AddQuickBuyer from '../AddEditBuyerFlow/components/AddQuickBuyer/AddQuickBuyer';
import utils from 'src/utils/utils';
import useStyles from 'src/screens/BuyerLibrary/styles';
import { colors } from 'src/utils/theme';
import { get_value_from_current_url } from 'src/utils/common';
import { SECTIONS } from '../constants';
import SetPasswordModal from './SetPasswordModal';

const action_col: any = {
	headerName: '',
	field: 'menu',
	width: 120,
	minWidth: 120,
	pinned: 'right',
	visible: true,
	cellRenderer: 'menuCellRenderer',
};

const WizShopList = () => {
	const {
		drawer,
		set_drawer,
		column_def,
		set_column_def,
		row_data,
		set_row_data,
		selected_row,
		set_selected_row,
		gridApi,
		setGridApi,
		buyer_data,
		set_buyer_data,
		is_loading,
		set_is_loading,
		toggle_toast,
		set_toggle_toast,
		storefront_edit_user,
		set_storefront_edit_user,
	} = useContext(BuyerListContext);
	const value = SECTIONS.wizshop_users;

	const [delete_modal, set_delete_modal] = useState(false);
	const [copy_modal, set_copy_modal] = useState(false);
	const [copy_url, set_copy_url] = useState('');
	const [current_params, set_current_params] = useState({ user_id: '', buyer_id: '', action: '' });
	const [reload, set_reload] = useState(false);
	const [total_rows, set_total_rows] = useState<any>();
	const [search_params, setSearchParams] = useSearchParams();
	const [is_buyer_add_form, set_is_buyer_add_form] = useState(false);
	const [is_filter_active, set_is_filter_active] = useState(false);
	const [open_set_pass_modal, set_open_set_pass_modal] = useState(false);
	const [user_data, set_user_data] = useState({});
	const classes = useStyles();
	const handle_copy_invite = () => {
		navigator.clipboard.writeText(copy_url);
		set_toggle_toast({
			show: true,
			message: '',
			title: 'URL Copied to Clipboard',
			status: '',
		});
		set_copy_modal(false);
	};

	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';

	const handle_drawer = (params: any) => {
		set_storefront_edit_user({ index: params?.rowIndex, user: params?.data });
		set_drawer(true);
	};
	const get_link = async (payload: any) => {
		try {
			const res: any = await api_requests?.wizshop?.get_copy_invite(_.head(payload?.email_invites));
			set_copy_url(res?.data?.reset_password_link);
			set_copy_modal(true);
		} catch (err) {
			console.log(err);
		}
	};

	const handle_action_click = (dataValue: string, buyer_id: string, params: any) => {
		const payload = {
			email_invites: [
				{
					user_id: params?.data?.reference_id || '',
					buyer_id: params?.data?.buyer_id || '',
				},
			],
		};

		switch (dataValue) {
			case 'resend_invite':
				return api_requests.wizshop.send_email(payload);
			case 'send_invite':
				return api_requests.wizshop.send_email(payload);
			case 'mark_as_active':
				return api_requests.wizshop
					.post_action({
						user_id: params?.data?.reference_id || '',
						buyer_id: params?.data?.buyer_id || '',
						action: 'active',
					})
					.then(() => {
						set_toggle_toast({
							show: true,
							message: 'Status changed to Active successfully',
							title: 'Success',
							status: 'success',
						});
						set_reload(!reload);
					});

				return;
			case 'mark_as_inactive':
				api_requests.wizshop
					.post_action({
						user_id: params?.data?.reference_id || '',
						buyer_id: params?.data?.buyer_id || '',
						action: 'inactive',
					})
					.then(() => {
						set_toggle_toast({
							show: true,
							message: 'Status changed to Inactive successfully',
							title: 'Success',
							status: 'success',
						});
						set_reload(!reload);
					});

				return;
			case 'delete_user':
				set_current_params({ user_id: params?.data?.reference_id || '', buyer_id: params?.data?.buyer_id || '', action: 'delete' });
				return set_delete_modal(true);
			case 'copy_invite':
				get_link(payload);
				return;
			case 'set_password':
				set_user_data(params?.data);
				set_open_set_pass_modal(true);
				return;
			case 'edit':
				return handle_drawer(params);
			default:
				return Promise.resolve();
		}
	};

	const handle_delete_modal_btn = async () => {
		try {
			await api_requests.wizshop.post_action({
				user_id: current_params?.user_id,
				buyer_id: current_params?.buyer_id,
				action: 'delete',
			});
			set_delete_modal(false);
			set_toggle_toast({
				show: true,
				message: 'User deleted successfully',
				title: 'Success',
				status: 'success',
			});
			set_reload(!reload);
		} catch (err) {
			console.error(err);
		}
	};

	const transform_cols = (data: any) => {
		const width_data = _.map(data, (item: any) => {
			return {
				...item,
				// width: item?.field === 'name' ? 200 : 300,
				flex: 1,
			};
		});

		return [...width_data, action_col];
	};

	const fetch_users = () => {
		api_requests.wizshop
			.get_users()
			.then((res: any) => {
				const transformed_cols = transform_cols(res?.data?.columns || []);
				set_column_def(transformed_cols);

				const sorted_rows = _.orderBy(res?.data?.rows || [], ['created_at'], ['desc']);
				set_row_data(sorted_rows);
				set_is_loading(false);
			})
			.catch((err) => {
				set_is_loading(false);
				console.error(err);
			});
	};

	useEffect(() => {
		fetch_users();
	}, [reload]);

	const handle_selection = (params: any) => {
		const prevSelectedSet = [...selected_row];

		params.api.forEachNode((node: any) => {
			if (node.selected) {
				const alreadySelected = prevSelectedSet.some((item: any) => item.user_id === (node?.data?.reference_id || ''));
				if (!alreadySelected) {
					prevSelectedSet.push({
						user_id: node?.data?.reference_id || '',
						buyer_id: node?.data?.buyer_id || '',
					});
				}
			} else {
				const indexToRemove = prevSelectedSet.findIndex((item: any) => item.user_id === (node?.data?.reference_id || ''));
				if (indexToRemove > -1) {
					prevSelectedSet.splice(indexToRemove, 1);
				}
			}
		});

		set_selected_row(prevSelectedSet);
	};

	const clear_selection = () => {
		set_selected_row([]);
		if (gridApi) {
			gridApi.deselectAll();
			gridApi.setFilterModel(null);
		}
	};

	const handle_bulk_email = () => {
		const payload = {
			email_invites: selected_row,
		};

		api_requests.wizshop
			.send_email(payload)
			.then(() => {
				clear_selection();
				set_toggle_toast({
					show: true,
					message: 'Invites sent successfully',
					title: 'Success',
					status: 'success',
				});
				fetch_users();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const alertMessage = () => {
		if (selected_row.length === 0) {
			return null;
		}

		return (
			<Alert
				icon={<Icon sx={{ mr: -1, opacity: 0.8 }} iconName='IconCircleCheck' />}
				sx={{ my: 1, width: '100%', height: '40px', display: 'flex', alignItems: 'center', background: '#E1EDFF' }}
				severity='success'
				color='info'>
				<Grid container alignItems='center' justifyContent='space-between' sx={{ width: '87vw' }}>
					<Grid item>
						<Grid container alignItems='center'>
							<Grid item sx={{ fontWeight: 400, color: '#4F555E' }}>
								{selected_row.length} users selected
							</Grid>
							<Grid
								item
								onClick={clear_selection}
								sx={{ ml: 3, cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 700, opacity: 0.8 }}>
								<Icon sx={{ mr: 0.5, opacity: 0.8 }} iconName='IconCircleX' />
								<p>Clear Selection</p>
							</Grid>
						</Grid>
					</Grid>
					<Grid onClick={handle_bulk_email} item sx={{ cursor: 'pointer', color: '#16885F', fontWeight: 700 }}>
						<strong>Send email invite</strong>
					</Grid>
				</Grid>
			</Alert>
		);
	};

	const transformed_columns = column_def.map((item: any) => {
		if (item.field === 'menu') {
			return {
				...item,
				headerName: '',
				editable: false,
				dtype: 'action',
				lockPinned: true,
				resizable: false,
				pinned: 'right',
				suppressMenu: true,
				cellRenderer: MenuCellRenderer,
				cellRendererParams: {
					set_toggle_toast,
					handle_action_click,
					fetch_data: fetch_users,
				},
			};
		}

		if (item?.field === 'phone') {
			return {
				...item,
				dtype: 'text',
				cellRenderer: (params: any) => {
					const phone_number = params?.data?.phone;
					const country = params?.data?.country_code;

					const formatted_value = phone_number ? `${country} ${phone_number}` : '--';

					return <CustomText>{formatted_value}</CustomText>;
				},
			};
		}
		if (item.field === 'customer_name') {
			return {
				...item,
				field: 'company_name',
			};
		}

		return item;
	});

	const handle_selected_buyer_wizshop = (buyer: any) => {
		set_drawer(true);
		set_storefront_edit_user((prev: any) => {
			return {
				index: prev.index ?? null,
				user: {
					...prev?.user,
					buyer_id: buyer?.id || '',
					company_name: buyer?.buyer_name || '',
				},
			};
		});
	};

	const handle_selected_buyer_wizshop_create = (buyer: any) => {
		set_drawer(true);
		set_storefront_edit_user((prev: any) => {
			return {
				index: prev.index ?? null,
				user: {
					...prev?.user,
					buyer_id: buyer?.id || '',
					company_name: buyer?.name || '',
				},
			};
		});
	};

	const handle_get_rows = (params: any) => {
		set_total_rows(params);
	};

	const handle_clear_function = () => {
		if (is_filter_active) {
			setSearchParams('');
			let params: any = sessionStorage.getItem('params_data');
			if (params) {
				try {
					params = JSON.parse(params);
					delete params[value];
					sessionStorage.setItem('params_data', JSON.stringify(params));
				} catch (err) {}
			}
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
				<DefaultButton onClick={handle_clear_function} className={classes.clear_filter_button}>
					<CustomText type='Subtitle' color={colors.primary_600}>
						Clear filters
					</CustomText>
				</DefaultButton>
			)}
			{!is_loading ? (
				<>
					<AgGridTableContainer
						columnDefs={transformed_columns}
						rowData={row_data}
						onSelectionChanged={handle_selection}
						customRowName='Total Users'
						get_total_rows={handle_get_rows}
						alertMessage={alertMessage()}
						onFirstDataRendered={(params) => {
							setGridApi(params.api);
						}}
						onFilterChanged={onFilterChanged}
						containerStyle={{ height: selected_row.length > 0 ? 'calc(100vh - 230px)' : 'calc(100vh - 170px)' }}
					/>
					{total_rows === 0 && <EmptyTableComponent top={'120px'} height={'calc(100vh - 300px)'} />}
				</>
			) : (
				<TableSkeleton />
			)}
			{drawer && storefront_edit_user?.user?.company_name && (
				<StoreFrontAddUser
					open={drawer}
					set_open={set_drawer}
					wizshop_attributes={attributes}
					checkbox_attributes={checkbox_attribute}
					all_wizshop_users={row_data}
					storefront_edit_user={storefront_edit_user}
					set_storefront_edit_user={set_storefront_edit_user}
					from_ums
					fetch_data={fetch_users}
					set_toggle_toast={set_toggle_toast}
				/>
			)}
			{drawer && !storefront_edit_user?.user?.company_name && is_ultron && (
				<SelectBuyerPanel
					set_is_buyer_add_form={set_is_buyer_add_form}
					show_drawer={drawer}
					toggle_drawer={set_drawer}
					buyer_data={buyer_data}
					set_buyer_data={set_buyer_data}
					show_add_quick_buyer={true}
					show_guest_buyer={false}
					from_ums
					handle_selected_buyer_wizshop={handle_selected_buyer_wizshop}
				/>
			)}
			{is_buyer_add_form && (
				<Drawer
					PaperProps={{ sx: { width: 600, background: '#fff' } }}
					anchor='right'
					open={is_buyer_add_form}
					onClose={() => set_is_buyer_add_form(false)}>
					<AddQuickBuyer
						is_detailed={false}
						from_cart
						exist_lead={true}
						set_is_buyer_add_form={set_is_buyer_add_form}
						set_buyer_data={set_buyer_data}
						handle_selected_buyer_wizshop_create={handle_selected_buyer_wizshop_create}
						set_add_drawer={set_drawer}
					/>
				</Drawer>
			)}

			{toggle_toast?.show && (
				<Toaster
					open={toggle_toast?.show}
					showCross={true}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					autoHideDuration={3000}
					state={toggle_toast?.status}
					title={toggle_toast.title}
					onClose={() => set_toggle_toast({ show: false, message: '', title: '', status: '' })}
					subtitle={toggle_toast.message}
					showActions={false}
				/>
			)}

			{delete_modal && (
				<Modal
					open={delete_modal}
					onClose={() => set_delete_modal(false)}
					title={'Delete user?'}
					children={
						<Grid>
							<p>Are you sure you want to delete this user?</p>
						</Grid>
					}
					footer={
						<Grid sx={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
							<Button
								variant='outlined'
								sx={{
									color: '#4F555E',
									border: '1px solid #4F555E',
									'&:hover': {
										border: '1px solid #4F555E',
									},
								}}
								onClick={() => set_delete_modal(false)}>
								Cancel
							</Button>
							<Button variant='contained' color='error' onClick={handle_delete_modal_btn}>
								Yes, Delete
							</Button>
						</Grid>
					}
				/>
			)}
			{open_set_pass_modal && (
				<SetPasswordModal
					open={open_set_pass_modal}
					on_close={() => set_open_set_pass_modal(false)}
					data={user_data}
					set_reload={set_reload}
				/>
			)}
			{copy_modal && (
				<Modal
					width={500}
					open={copy_modal}
					onClose={() => set_copy_modal(false)}
					title={'Copy invite'}
					children={
						<Grid className={classes.modal_container}>
							<CustomText className={classes.modal_custom_text}>{copy_url}</CustomText>
							<Button variant='contained' onClick={handle_copy_invite} className={classes.button}>
								<Icon iconName='IconCopy' color='#FFF' />
								Copy
							</Button>
						</Grid>
					}
				/>
			)}
		</Grid>
	);
};

export default WizShopList;
