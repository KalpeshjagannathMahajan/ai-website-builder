import { Grid, Icon } from 'src/common/@the-source/atoms';
import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { useContext, useEffect, useState } from 'react';
import SettingsContext from '../../context';
import _ from 'lodash';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import { customer_permission_config } from '../../utils/constants';
import { user_management } from 'src/utils/api_requests/userManagement';
import { isUUID } from '../../utils/helper';
import utils from 'src/utils/utils';
import UpdatePermission from './UpdatePermission';
import { buyer_permission_data } from '../../utils/defaultSettings/buyer/buyer_permission';
import { useTheme } from '@mui/material/styles';
import { Alert } from '@mui/material';
import { t } from 'i18next';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

const dividerStyle: React.CSSProperties = {
	height: '1px',
	background: 'repeating-linear-gradient(90deg,#D1D6DD 0 4px,#0000 0 8px)',
	margin: '1rem 0',
};

const CustomerPermission = () => {
	const theme: any = useTheme();
	const [entity, set_entity] = useState<any>('');
	const [user_data, set_user_data] = useState([]);
	const [roles_data, set_roles_data] = useState([]);
	const [drawer_data, set_drawer_data] = useState({});
	const [permission_drawer, set_permission_drawer] = useState<boolean>(false);
	const { configure, att_list, get_keys_configuration, get_attributes_list, update_configuration } = useContext(SettingsContext);
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

	// declaring const for data
	let section_data: any[] = [];
	let attribute_data: any[] = [];

	// extraction data from config
	const temp_attr_data: any = _.get(configure, 'buyer_form_permissions.attributes') || {};
	const temp_section_data: any = _.get(configure, 'buyer_form_permissions.section') || {};

	// creating array of data from config
	Object.keys(temp_attr_data).forEach((key: any) => {
		attribute_data.push({ key, ...temp_attr_data?.[key] });
	});
	Object.keys(temp_section_data).forEach((key: any) => {
		section_data.push({ key, ...temp_section_data?.[key] });
	});

	//function for getting row data for permission
	const get_permission_vals = (section: any, key: any, options: any) => {
		if (_.isEmpty(section?.[key])) return [];
		else if (section?.[key] === 'all') return [{ label: 'All', value: 'all' }];
		else return _.filter(options, (item: any) => section?.[key].includes(item?.value));
	};

	// upating section config data for adding name and roles and users
	section_data = _.map(section_data, (section: any) => {
		return {
			...section,
			name: _.find(configure?.details_buyer_form?.sections, (temp: any) => temp?.key === section?.key)?.name || section?.key,
			users_with_add_permissions: get_permission_vals(section, 'users_with_add_permissions', user_data),
			roles_with_add_permissions: get_permission_vals(section, 'roles_with_add_permissions', roles_data),
			users_with_edit_permissions: get_permission_vals(section, 'users_with_edit_permissions', user_data),
			roles_with_edit_permissions: get_permission_vals(section, 'roles_with_edit_permissions', roles_data),
			users_with_delete_permissions: get_permission_vals(section, 'users_with_delete_permissions', user_data),
			roles_with_delete_permissions: get_permission_vals(section, 'roles_with_delete_permissions', roles_data),
		};
	});

	// upating section config data for adding name and roles and users
	attribute_data = _.map(attribute_data, (att: any) => {
		return {
			...att,
			name: isUUID(att?.key) ? _.find(att_list?.buyer, { id: att?.key })?.name : att?.key,
			users_with_edit_permissions: get_permission_vals(att, 'users_with_edit_permissions', user_data),
			roles_with_edit_permissions: get_permission_vals(att, 'roles_with_edit_permissions', roles_data),
		};
	});

	const section_permissions = (params: any) => {
		set_drawer_data(params?.node?.data);
		set_entity('section');
		set_permission_drawer(true);
	};

	const attribute_permissions = (params: any) => {
		set_drawer_data(params?.node?.data);
		set_entity('attributes');
		set_permission_drawer(true);
	};

	const section_column_defs = [...customer_permission_config?.section, utils.create_action_config(actions, section_permissions, 'Actions')];

	const attribute_column_defs = [
		...customer_permission_config?.attributes,
		utils.create_action_config(actions, attribute_permissions, 'Actions'),
	];

	const handle_on_save = (updated_data: any, type: any) => {
		let updated_confg: any = {
			...configure?.buyer_form_permissions,
			[entity]: { ...configure?.buyer_form_permissions?.[entity], [type]: { ...updated_data } },
		};

		_.map(att_list?.buyer, (att: any) => {
			if (!updated_confg?.attributes?.[att?.id]) {
				updated_confg = {
					...updated_confg,
					attributes: {
						...updated_confg?.attributes,
						[att?.id]: {
							users_with_edit_permissions: 'all',
							roles_with_edit_permissions: 'all',
						},
					},
				};
			}
		});
		update_configuration('buyer_form_permissions', updated_confg);
		set_drawer_data({});
		set_permission_drawer(false);
	};

	const get_style = (row_data: any) => {
		const height = row_data?.length * 50 || 200;

		return { height: `${height + 100}px`, maxHeight: '500px', minHeight: '300px' };
	};

	const handle_attribute_permissions = () => {
		let config_sample_data = configure?.buyer_form_permissions || buyer_permission_data;

		_.map(att_list?.buyer, (att: any) => {
			if (!config_sample_data?.attributes?.[att?.id]) {
				config_sample_data = {
					...config_sample_data,
					attributes: {
						...config_sample_data?.attributes,
						[att?.id]: {
							users_with_edit_permissions: 'all',
							roles_with_edit_permissions: 'all',
						},
					},
				};
			}
		});

		update_configuration('buyer_form_permissions', config_sample_data);
	};

	useEffect(() => {
		get_keys_configuration('details_buyer_form');
		get_keys_configuration('buyer_form_permissions');
		get_attributes_list('buyer');
		get_users();
		get_roles();
	}, []);

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>{t('Settings.BuyerPermission.Header')}</CustomText>
			</Grid>
			<Grid display='flex' flexDirection='column' gap={'2rem'} mt={2}>
				{_.isEmpty(configure?.buyer_form_permissions) && (
					<Grid mt={2}>
						<Alert
							severity={'warning'}
							icon={
								<Icon className={classes.icon_style} sx={{ color: theme?.settings?.import_export?.color }} iconName='IconAlertTriangle' />
							}
							className={classes.alert_style}
							sx={{
								border: `1px solid ${theme?.settings?.import_export?.color || 'transparent'}`,
							}}>
							<CustomText type='Body' color={theme?.settings?.import_export?.text}>
								{t('Settings.BuyerPermission.NoConfig')}
								<span onClick={handle_attribute_permissions} style={theme?.settings?.import_export?.span}>
									{t('Settings.BuyerPermission.Here')}
								</span>
								{t('Settings.BuyerPermission.Generate')}
							</CustomText>
						</Alert>
					</Grid>
				)}

				<CustomText type='H6'>{t('Settings.BuyerPermission.Section')}</CustomText>
				<AgGridTableContainer
					columnDefs={section_column_defs}
					hideManageColumn
					rowData={section_data}
					containerStyle={get_style(section_data)}
					showStatusBar={false}
				/>
				<div style={dividerStyle}></div>

				<CustomText type='H6'>{t('Settings.BuyerPermission.Attribute')}</CustomText>
				<AgGridTableContainer
					columnDefs={attribute_column_defs}
					hideManageColumn
					rowData={attribute_data}
					containerStyle={get_style(attribute_data)}
					showStatusBar={false}
				/>
			</Grid>
			{permission_drawer && (
				<UpdatePermission
					drawer={permission_drawer}
					set_drawer={set_permission_drawer}
					data={drawer_data}
					user_options={user_data}
					roles_options={roles_data}
					on_save={handle_on_save}
				/>
			)}
		</Grid>
	);
};
export default CustomerPermission;
