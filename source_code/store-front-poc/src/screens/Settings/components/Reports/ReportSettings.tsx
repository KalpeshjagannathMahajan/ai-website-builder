import { useEffect, useState } from 'react';
import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid } from 'src/common/@the-source/atoms';
import settings from 'src/utils/api_requests/setting';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import { report_columns } from '../../utils/constants';
import utils from 'src/utils/utils';
import AddEditReports from './AddEditReportDrawer';
import { user_management } from 'src/utils/api_requests/userManagement';
import _ from 'lodash';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
	{
		name: 'Delete',
		action: 'delete',
		icon: 'IconTrash',
		key: 'delete',
	},
];

const ReportSettings = () => {
	const [report_data, set_report_data] = useState<any>([]);

	const [drawer, set_drawer] = useState<boolean>(false);
	const [data, set_data] = useState<any>({});
	const [user_data, set_user_data] = useState<any>([]);
	const [roles_data, set_roles_data] = useState<any>([]);

	//functions
	const get_users = async () => {
		const res: any = await user_management.get_users_list();
		const user_options = res?.data?.rows?.map((item: any) => {
			return {
				label: item?.name || 'Admin',
				value: item?.reference_id,
			};
		});
		set_user_data(user_options);
	};
	const get_roles = async () => {
		const res: any = await user_management.get_roles_list();
		const user_options = res?.data?.rows?.map((item: any) => {
			return {
				label: item?.name || 'Admin',
				value: item?.reference_id,
			};
		});
		set_roles_data(user_options);
	};
	const get_reporting = async () => {
		try {
			const response: any = await settings.get_reports_settings();
			if (response) {
				delete response?.status;
				const jsonString = Object.keys(response)
					.sort((a, b) => parseInt(a) - parseInt(b))
					.map((key) => response[key])
					.join('');

				const jsonObject = JSON.parse(jsonString);

				set_report_data(jsonObject);
			}
		} catch (err) {
			console.error(err);
		}
	};

	//actions
	const delete_reporting = async (report_tab: any) => {
		const report_tab_data: any = {
			id: report_tab?.id,
		};
		try {
			await settings.delete_reporting(report_tab_data);
			get_reporting();
		} catch (err) {
			console.error(err);
		}
	};
	const update_reporting = async (update_report_data: any) => {
		try {
			await settings.update_reporting(update_report_data);
			get_reporting();
			set_drawer(false);
		} catch (err) {
			console.error(err);
		}
	};
	const create_reporting = async (new_report_data: any) => {
		try {
			await settings.create_reporting(new_report_data);
			get_reporting();
			set_drawer(false);
		} catch (err) {
			console.error(err);
		}
	};

	const handle_save = (report_details: any) => {
		if (!_.isEmpty(data)) {
			report_details.id = data?.id;
			update_reporting(report_details);
		} else {
			create_reporting(report_details);
		}
	};
	const handle_edit = (params: any, key: string) => {
		if (key === 'edit') {
			set_data(params?.node?.data);
			set_drawer(true);
		} else {
			delete_reporting(params?.node?.data);
		}
	};

	const columnDef = [...report_columns, { ...utils.create_action_config(actions, handle_edit) }]; //cellRendererParams: { should_disable_button }
	const row_data = _.map(report_data, (item: any) => {
		return {
			...item,
			users: _.filter(user_data, (user) => item?.users?.split(',')?.includes(user?.value)),
			roles: _.filter(roles_data, (role) => item?.roles?.split(',')?.includes(role?.value)),
		};
	});

	useEffect(() => {
		get_users();
		get_roles();
		get_reporting();
	}, []);

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>Reports Settings</CustomText>
			</Grid>
			<Grid py={2}>
				{report_data?.length > 0 && (
					<AgGridTableContainer
						columnDefs={columnDef}
						hideManageColumn
						rowData={row_data}
						containerStyle={{ height: '400px', maxHeight: '500px' }}
						showStatusBar={false}
					/>
				)}
			</Grid>
			<Button
				variant='text'
				sx={{ width: '12rem' }}
				onClick={() => {
					set_data({});
					set_drawer(true);
				}}>
				+ Add Report
			</Button>
			{drawer && (
				<AddEditReports
					open={drawer}
					set_open={set_drawer}
					data={data ?? {}}
					users={user_data}
					roles={roles_data}
					handle_save={handle_save}
				/>
			)}
		</Grid>
	);
};

export default ReportSettings;
