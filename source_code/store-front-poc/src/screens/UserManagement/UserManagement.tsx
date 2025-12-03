import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Tabs } from 'src/common/@the-source/atoms';

import { tabs } from './constants';
import AddEditUser from './components/AddEditUser';
import AddEditRole from './components/AddEditRole';
import AccessComp from './components/AccessComp';
import UserComp from './components/UserComp';
import RouteNames from 'src/utils/RouteNames';
import { user_management } from 'src/utils/api_requests/userManagement';
import { AgGridTableContainer } from 'src/common/@the-source/molecules/Table/table';
import { updateBreadcrumbs } from 'src/actions/topbar';
import { useDispatch } from 'react-redux';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';
import _ from 'lodash';
import TableSkeleton from 'src/common/TableSkeleton';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';
import CustomCellRenderer from 'src/common/@the-source/molecules/Table/TableComponent/CustomCellRenderer';
import { useSelector } from 'react-redux';
import TagRenderer from './components/TagRenderer';
import { useTheme } from '@mui/material/styles';
import UserActionComp from './components/UserActionComp';
import { close_toast, show_toast } from 'src/actions/message';
import types from 'src/utils/types';
import { t } from 'i18next';

const UserManagement = () => {
	const [tab_value, set_tab_value] = useState<number | 0>(0);
	const [_columns, set_columns] = useState([]);
	const [data_source, set_data_source] = useState([]);
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [row_count, set_row_count] = useState<null | number>(null);
	const theme: any = useTheme();
	const _path_name = _.capitalize(window.location.pathname.split('/')?.pop());
	// const current_email = useSelector((state: any) => state?.login?.userDetails?.email);
	const permissions = useSelector((state: any) => state?.login?.permissions);
	const is_user_edit = permissions?.find((permission: any) => permission?.slug === PERMISSIONS.edit_user.slug)?.toggle;
	const is_role_edit = permissions?.find((permission: any) => permission?.slug === PERMISSIONS.edit_role.slug)?.toggle;
	const view_user = permissions?.find((item: any) => item?.slug === PERMISSIONS?.view_user?.slug)?.toggle;
	const view_role = permissions?.find((item: any) => item?.slug === PERMISSIONS?.view_role?.slug)?.toggle;

	function get_rows(total_rows: number) {
		set_row_count(total_rows);
	}

	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Dashboard',
			link: RouteNames.dashboard.path,
		},
		{
			id: 2,
			linkTitle: 'User Management',
			link: RouteNames.user_management.users.path,
		},
	];

	useEffect(() => {
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, []);

	const handle_action_click = (params: any, type: string) => {
		const id: string = params?.node?.data?.reference_id;

		const path =
			type === 'user'
				? `${RouteNames.user_management.edit_user.routing_path}${id}`
				: `${RouteNames.user_management.edit_role.routing_path}${id}`;
		navigate(path);
	};

	const GetStyleByTab = () => {
		const path = window.location.pathname.split('/')?.pop() || '';
		return path;
	};

	const handle_user_actions = (params: any) => {
		const current_user_email = params?.node?.data?.email;
		user_management
			.get_reset_password_link({ email: current_user_email })
			.then((response: any) => {
				if (response?.status_code === 200) {
					navigator.clipboard.writeText(response?.data?.reset_url);
					dispatch<any>(
						show_toast({
							open: true,
							showCross: false,
							anchorOrigin: {
								vertical: types.VERTICAL_TOP,
								horizontal: types.HORIZONTAL_CENTER,
							},
							autoHideDuration: 5000,
							onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
								console.log(event);
								if (reason === types.REASON_CLICK) {
									return;
								}
								dispatch(close_toast(''));
							},
							state: types.SUCCESS_STATE,
							title: t('Common.Common.CopiedToClipboard'),
							subtitle: '',
							showActions: false,
						}),
					);
				}
			})
			.catch((error: any) => {
				console.error(error);
				dispatch<any>(
					show_toast({
						open: true,
						showCross: false,
						anchorOrigin: {
							vertical: types.VERTICAL_TOP,
							horizontal: types.HORIZONTAL_CENTER,
						},
						autoHideDuration: 5000,
						onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
							console.log(event);
							if (reason === types.REASON_CLICK) {
								return;
							}
							dispatch(close_toast(''));
						},
						state: types.ERROR_STATE,
						title: types.ERROR_TITLE,
						subtitle: '',
						showActions: false,
					}),
				);
			});
	};

	const table_column_transform = (columns: any, type: string) => {
		const _temp: any = [];

		columns.forEach((column: any) => {
			if (column.headerName === 'User Name' || column.headerName === 'Role Name') {
				column.onCellClicked = (params: any) => {
					if (params?.data?.status === 'active' && !params?.data?.is_admin) {
						handle_action_click(params, type);
					}
				};
			}

			if (column.dtype === 'action') {
				if (type === 'user' && is_user_edit) {
					_temp.push({
						...column,
						width: 80,
						headerName: 'Action',
						autoSize: true,
						resizable: true,
						suppressSizeToFit: true,
						suppressMenu: true,
						hideFilter: true,
						filter: false,
						cellStyle: {
							textAlign: 'center',
							width: 80,
							borderRadius: '0px',
							background: theme?.user_management?.user_manage?.background,
							borderWidth: '0px 0px 0px 1px',
							borderColor: theme?.user_management?.user_manage?.borderColor,
						},
						minWidth: 80,
					});
				}
				if (type === 'role' && is_role_edit) {
					_temp.push({
						...column,
						width: 100,
						headerName: '',
						autoSize: true,
						resizable: true,
						suppressSizeToFit: true,
						suppressMenu: true,
						hideFilter: true,
						filter: false,
						cellStyle: {
							textAlign: 'center',
							width: 100,
							borderRadius: '0px',
							background: theme?.user_management?.user_manage?.background,
							borderWidth: '0px 0px 0px 1px',
							borderColor: theme?.user_management?.user_manage?.border_color,
						},
						actions: {
							actions: column?.action?.map((action: any) => ({
								...action,
								hide: window.location.pathname.includes(RouteNames.user_management.users.path),
								onClick: (params: any) => {
									if (params?.node?.data?.status === 'active' && tab_value === 0) {
										handle_action_click(params, type);
									} else {
										handle_action_click(params, type);
									}
								},
							})),
						},
					});
				}
			} else {
				let applyStyleByTab = GetStyleByTab();
				const style = applyStyleByTab === 'roles' ? { flex: 2 } : { flex: 1 };
				_temp.push({
					...column,
					minWidth: 200,
					...style,
					// cellStyle: { width: 200 },
					resizable: true,
					suppressSizeToFit: true,
					autoSize: true,
				});
			}
		});

		return _temp.map((col: any) => {
			if (col.field === 'access') {
				return {
					...col,
					cellRenderer: AccessComp,
				};
			}
			if (col.dtype === 'tags') {
				return {
					...col,
					cellRenderer: TagRenderer,
				};
			}
			if (col.field === 'users') {
				return {
					...col,
					cellRenderer: UserComp,
				};
			}
			if (col.dtype === 'action') {
				return {
					...col,
					cellRenderer: (params: any) => {
						// if (params?.data?.is_admin || params?.data?.email === current_email) return <div />;
						if (type === 'user') {
							return UserActionComp(params, handle_user_actions, handle_action_click);
						}
						const Comp = CustomCellRenderer(params);
						return Comp;
					},
				};
			}
			return col;
		});
	};

	const get_list_by_path = async () => {
		set_is_loading(true);
		if (
			window.location.pathname.includes(RouteNames.user_management.users.path) ||
			window.location.pathname.includes(RouteNames.user_management.roles.path)
		) {
			set_columns([]);
			set_data_source([]);
			let response: any = {};
			let type: string = '';
			try {
				if (window.location.pathname.includes(RouteNames.user_management.users.path)) {
					response = await user_management.get_users_list();
					type = 'user';
				} else if (window.location.pathname.includes(RouteNames.user_management.roles.path)) {
					response = await user_management.get_roles_list_ssrm();
					type = 'role';
				}

				if (response?.status_code === 200) {
					const { columns, rows } = response?.data;

					set_columns(table_column_transform(columns, type));
					set_data_source(rows);
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			set_columns([]);
			set_data_source([]);
		}
		set_is_loading(false);
	};

	const set_tab_value_index = () => {
		const path = window.location.pathname.split('/')?.pop() || '';
		const index = tabs.findIndex((tab) => tab.name.toLowerCase() === path?.toLowerCase());
		set_tab_value(index);
	};

	useEffect(() => {
		set_tab_value_index();
		get_list_by_path();
	}, []);

	useEffect(() => {
		set_tab_value_index();
		get_list_by_path();
	}, [window?.location?.pathname]);

	const handle_tab_change = (index: number) => {
		set_tab_value(index);
		navigate(index === 0 ? `${RouteNames.user_management.users.path}` : RouteNames.user_management.roles.path);
	};

	const handle_add_click = () => {
		navigate(tab_value === 0 ? `${RouteNames.user_management.add_user.path}` : RouteNames.user_management.add_role.path);
	};

	const render_forms = () => {
		const path_name: string[] = window.location.pathname.split('/');

		if (window.location.pathname.includes(RouteNames.user_management.add_user.path)) {
			return <AddEditUser />;
		}
		if (window.location.pathname.includes(RouteNames.user_management.add_role.path)) {
			return <AddEditRole />;
		}
		if (window.location.pathname.includes(RouteNames.user_management.edit_user.routing_path)) {
			const path = path_name.pop();
			return <AddEditUser is_edit={true} id={path} />;
		}
		if (window.location.pathname.includes(RouteNames.user_management.edit_role.routing_path)) {
			const path = path_name.pop();
			return <AddEditRole is_edit={true} id={path} />;
		}
	};

	return (
		<>
			{tab_value >= 0 ? (
				<>
					<Tabs
						tabContainerStyle={{ paddingTop: '0.6rem', marginBottom: '16px' }}
						label='userMgmt'
						style={{ paddingBottom: 0 }}
						handleChange={handle_tab_change}
						value={view_role && view_user ? tab_value : 0}
						noOftabs={
							view_role && view_user
								? tabs
								: view_role
								? [
										{
											name: 'Roles',
										},
								  ]
								: [
										{
											name: 'Users',
										},
								  ]
						}>
						{tab_value === 0 ? (
							<Can I={PERMISSIONS.create_user.slug} a={PERMISSIONS.create_user.permissionType}>
								<Button sx={{ boxShadow: 'none !important', width: '11rem' }} onClick={handle_add_click}>
									Add User
								</Button>
							</Can>
						) : (
							<Can I={PERMISSIONS.create_role.slug} a={PERMISSIONS.create_role.permissionType}>
								<Button sx={{ boxShadow: 'none !important', width: '11rem' }} onClick={handle_add_click}>
									Create Role
								</Button>
							</Can>
						)}
					</Tabs>
					<Grid key={tab_value}>
						{!is_loading ? (
							// _columns?.length > 0 && data_source?.length > 0 &&
							<div style={{ position: 'relative' }}>
								<AgGridTableContainer
									get_total_rows={get_rows}
									showSWHeader={false}
									columnDefs={_columns}
									rowData={data_source}
									customRowName={`Total ${_path_name}`}
									containerStyle={{ height: 'calc(100vh - 14rem)' }}
								/>
								{row_count === 0 && <EmptyTableComponent top={'83px'} height={'calc(100vh - 270px)'} />}
							</div>
						) : (
							<TableSkeleton />
						)}
					</Grid>
				</>
			) : (
				render_forms()
			)}
		</>
	);
};

export default UserManagement;
