import { useContext, useEffect, useState } from 'react';
import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import SettingsContext from '../../context';
import { Grid } from 'src/common/@the-source/atoms';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import {
	order_permissions_config,
	order_buyer_map_config,
	charge_permissions_config,
	ALLOWED_ADDING_DOCUMENT_ATTR_KEYS,
} from '../../utils/constants';
import { user_management } from 'src/utils/api_requests/userManagement';
import _ from 'lodash';
import utils from 'src/utils/utils';
import EditAttPermission from '../Common/Drawer/EditAttPermission';
import { isUUID } from '../../utils/helper';
import EditAttDrawer from '../Common/Drawer/EditAttDrawer';

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

const attribute_names: { [key: string]: string } = {};

const DocumentPermission = () => {
	const { configure, att_list, get_keys_configuration, update_configuration, get_attributes_list } = useContext(SettingsContext);
	const [data, set_data] = useState<any>(null);
	const [edit_doc, set_edit_doc] = useState<string>('order');
	const [document_tye, set_document_tye] = useState<string>('order_form_permissions');
	const [attr_drawer, set_attr_drawer] = useState<boolean>(false);
	const [permission_drawer, set_permission_drawer] = useState<boolean>(false);
	const [user_data, set_user_data] = useState<any>([]);
	const [roles_data, set_roles_data] = useState<any>([]);
	const [order_setting_loading, set_order_setting_loading] = useState<boolean>(true);
	const order_buyer: any[] = [];
	const order_permissions: any[] = [];
	const quote_permissions: any[] = [];
	const charges_order_permissions: any[] = [];
	const charges_quote_permissions: any[] = [];

	/**
	 * Generate the configuration for the buyer attribute mapping
	 *
	 */

	const handle_charges_permission_rows = (item: any, type: string) => {
		_.map(Object.keys(item), (key: any) => {
			const charges = item?.[key];

			let charge_item = {
				id: key,
				name: _.capitalize(_.split(key, '_')?.join(' ')),
				users_with_edit_permissions: charges?.users_with_edit_permissions,
				edit_permissions:
					charges?.users_with_edit_permissions === 'all'
						? [{ label: 'All', value: 'all' }]
						: _.isEmpty(charges?.users_with_edit_permissions)
						? []
						: _.filter(user_data, (user) => charges?.users_with_edit_permissions?.includes(user?.value)),
				roles_edit_permissions:
					charges?.roles_with_edit_permissions === 'all'
						? [{ label: 'All', value: 'all' }]
						: _.isEmpty(charges?.roles_with_edit_permissions)
						? []
						: _.filter(user_data, (user) => charges?.roles_with_edit_permissions?.includes(user?.value)),
			};

			if (type === 'order') {
				charges_order_permissions.push(charge_item);
			} else {
				charges_quote_permissions.push(charge_item);
			}
		});
	};

	useEffect(() => {
		if (configure?.order_settings?.sections) {
			_.each(configure?.order_settings?.sections, (section: any) => {
				if (section?.attributes) {
					_.each(section?.attributes, (attribute: any) => {
						if (attribute?.id) attribute_names[attribute.id] = attribute?.name;
					});
				}
			});
			set_order_setting_loading(false);
		}
	}, [configure?.order_settings]);
	if (!order_setting_loading) {
		_.map(configure?.order_auto_fill_settings || [], (item: any) => {
			let temp = {
				id: item?.document_field, // same as document_field
				buyer_field: item?.buyer_field,
				document_field: item?.document_field,
				buyer_field_name: '',
				document_field_name: '',
			};

			if (item?.document_field && isUUID(item?.document_field)) {
				temp = {
					...temp,
					buyer_field_name: _.find(att_list?.buyer, (val) => val?.id === item?.buyer_field)?.name ?? 'Cus',
					document_field_name: _.find(att_list?.document, (val) => val?.id === item?.document_field)?.name ?? 'Doc',
				};
			} else {
				temp = {
					...temp,
					buyer_field_name: _.capitalize(item?.buyer_field.replaceAll('_', ' ')),
					document_field_name: _.capitalize(item?.document_field.replaceAll('_', ' ')),
				};
			}

			order_buyer.push(temp);
		});

		_.map(att_list?.document || [], (section: any) => {
			let test = _.find(order_buyer, (item) => item?.id === section?.id);
			if (test) {
				return null;
			} else if (!_.isEmpty(section)) {
				order_buyer.push({
					id: section?.id, // same as document_field
					buyer_field: '',
					document_field: section?.id,
					buyer_field_name: '',
					document_field_name: section?.name,
				});
			}
		});

		_.map(Object.keys(configure?.order_form_permissions || {}), (key: string) => {
			const order_item = configure?.order_form_permissions?.[key];
			if (key === 'charges_') {
				handle_charges_permission_rows(order_item, 'order');
			}

			if (attribute_names?.[key]) {
				let key_item: any = {
					id: key,
					name: attribute_names?.[key] ? attribute_names?.[key] : key,
					users_with_edit_permissions: order_item?.users_with_edit_permissions,
					users_with_back_saving_permissions: order_item?.users_with_back_saving_permissions,
					edit_permissions:
						order_item?.users_with_edit_permissions === 'all'
							? [{ label: 'All', value: 'all' }]
							: _.isEmpty(order_item?.users_with_edit_permissions)
							? []
							: _.filter(user_data, (user) => order_item?.users_with_edit_permissions.includes(user?.value)),
					roles_edit_permissions:
						order_item?.roles_with_edit_permissions === 'all'
							? [{ label: 'All', value: 'all' }]
							: _.isEmpty(order_item?.roles_with_edit_permissions)
							? []
							: _.filter(roles_data, (user) => order_item?.roles_with_edit_permissions.includes(user?.value)),
					back_flow_permission:
						order_item?.users_with_back_saving_permissions === 'all'
							? [{ label: 'All', value: 'all' }]
							: !_.isEmpty(order_item?.users_with_back_saving_permissions)
							? _.filter(user_data, (user) => order_item?.users_with_back_saving_permissions.includes(user?.value))
							: {},
					roles_back_flow_permission:
						order_item?.roles_with_back_saving_permissions === 'all'
							? [{ label: 'All', value: 'all' }]
							: !_.isEmpty(order_item?.roles_with_back_saving_permissions)
							? _.filter(roles_data, (user) => order_item?.roles_with_back_saving_permissions.includes(user?.value))
							: {},
				};
				if (ALLOWED_ADDING_DOCUMENT_ATTR_KEYS.includes(key)) {
					key_item = {
						...key_item,
						users_with_add_permissions: order_item?.users_with_add_permissions,
						add_permissions:
							order_item?.users_with_add_permissions === 'all'
								? [{ label: 'All', value: 'all' }]
								: _.isEmpty(order_item?.users_with_add_permissions)
								? []
								: _.filter(user_data, (user) => order_item?.users_with_add_permissions.includes(user?.value)),
						roles_add_permissions:
							order_item?.roles_with_add_permissions === 'all'
								? [{ label: 'All', value: 'all' }]
								: _.isEmpty(order_item?.roles_with_add_permissions)
								? []
								: _.filter(roles_data, (user) => order_item?.roles_with_add_permissions.includes(user?.value)),
					};
				}
				order_permissions.push(key_item);
			}
		});

		_.map(Object.keys(configure?.quote_form_permissions || {}), (key: string) => {
			const quote_item = configure?.quote_form_permissions?.[key];
			if (key === 'charges_') {
				handle_charges_permission_rows(quote_item, 'quote');
			}
			if (attribute_names?.[key]) {
				let key_item: any = {
					id: key,
					name: attribute_names?.[key] ?? key,
					users_with_edit_permissions: quote_item?.users_with_edit_permissions,
					users_with_back_saving_permissions: quote_item?.users_with_back_saving_permissions,
					edit_permissions:
						quote_item?.users_with_edit_permissions === 'all'
							? [{ label: 'All', value: 'all' }]
							: _.isEmpty(quote_item?.users_with_edit_permissions)
							? []
							: _.filter(user_data, (user) => quote_item?.users_with_edit_permissions.includes(user?.value)),
					roles_edit_permissions:
						quote_item?.roles_with_edit_permissions === 'all'
							? [{ label: 'All', value: 'all' }]
							: _.isEmpty(quote_item?.roles_with_edit_permissions)
							? []
							: _.filter(roles_data, (user) => quote_item?.roles_with_edit_permissions.includes(user?.value)),
					back_flow_permission:
						quote_item?.users_with_back_saving_permissions === 'all'
							? [{ label: 'All', value: 'all' }]
							: !_.isEmpty(quote_item?.users_with_back_saving_permissions)
							? _.filter(user_data, (user) => quote_item?.users_with_back_saving_permissions.includes(user?.value))
							: {},
					roles_back_flow_permission:
						quote_item?.roles_with_back_saving_permissions === 'all'
							? [{ label: 'All', value: 'all' }]
							: !_.isEmpty(quote_item?.roles_with_back_saving_permissions)
							? _.filter(roles_data, (user) => quote_item?.roles_with_back_saving_permissions.includes(user?.value))
							: {},
				};
				if (ALLOWED_ADDING_DOCUMENT_ATTR_KEYS.includes(key)) {
					key_item = {
						...key_item,
						users_with_add_permissions: quote_item?.users_with_add_permissions,
						add_permissions:
							quote_item?.users_with_add_permissions === 'all'
								? [{ label: 'All', value: 'all' }]
								: _.isEmpty(quote_item?.users_with_add_permissions)
								? []
								: _.filter(user_data, (user) => quote_item?.users_with_add_permissions.includes(user?.value)),
						roles_add_permissions:
							quote_item?.roles_with_add_permissions === 'all'
								? [{ label: 'All', value: 'all' }]
								: _.isEmpty(quote_item?.roles_with_add_permissions)
								? []
								: _.filter(roles_data, (user) => quote_item?.roles_with_add_permissions.includes(user?.value)),
					};
				}
				quote_permissions.push(key_item);
			}
		});
	}

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
		const roles_options = res?.data?.rows?.map((item: any) => {
			return {
				label: item?.name || 'Admin',
				value: item?.reference_id,
			};
		});
		set_roles_data(roles_options);
	};

	const handle_permission_order = (params: any) => {
		set_data(params?.node?.data);
		set_permission_drawer(true);
		set_edit_doc('order');
		set_document_tye('order_form_permissions');
	};
	const handle_permission_quote = (params: any) => {
		set_data(params?.node?.data);
		set_permission_drawer(true);
		set_edit_doc('quote');
		set_document_tye('quote_form_permissions');
	};
	const handle_permission_order_charge = (params: any) => {
		set_data(params?.node?.data);
		set_permission_drawer(true);
		set_edit_doc('order_charges');
		set_document_tye('order_form_permissions');
	};
	const handle_permission_quote_charge = (params: any) => {
		set_data(params?.node?.data);
		set_permission_drawer(true);
		set_edit_doc('quote_charges');
		set_document_tye('quote_form_permissions');
	};

	const get_style = (row_data: any) => {
		const height = row_data?.length * 50;

		return { height: `${height + 50}px`, maxHeight: '500px', minHeight: '200px' };
	};

	const handle_document_permission = (permission: any, field_key: string) => {
		const transformed_permission = _.mapValues(permission, (value) => (_.isArray(value) && value?.[0] === 'all' ? 'all' : value));
		let updated_data: any = {};
		updated_data = {
			...configure?.[document_tye],
			[field_key]: {
				...configure?.[document_tye]?.[field_key],
				users_with_edit_permissions: transformed_permission?.users_with_edit_permissions || 'all',
				users_with_back_saving_permissions:
					transformed_permission?.back_flow_permission_allowed === 'yes'
						? transformed_permission?.users_with_back_saving_permissions ?? []
						: [],
				roles_with_edit_permissions: transformed_permission?.roles_with_edit_permissions || 'all',
				roles_with_back_saving_permissions:
					transformed_permission?.back_flow_permission_allowed === 'yes'
						? transformed_permission?.roles_with_back_saving_permissions ?? []
						: [],
			},
		};
		if (ALLOWED_ADDING_DOCUMENT_ATTR_KEYS.includes(field_key)) {
			updated_data = {
				...updated_data,
				[field_key]: {
					...updated_data?.[field_key],
					users_with_add_permissions: transformed_permission?.users_with_add_permissions || 'all',
					roles_with_add_permissions: transformed_permission?.roles_with_add_permissions || 'all',
				},
			};
		}
		update_configuration(document_tye, updated_data);
		set_permission_drawer(false);
	};

	const handle_document_charges_permission = (permission: any, field_key: any) => {
		const transformed_permission = _.mapValues(permission, (value) => (_.isArray(value) && value?.[0] === 'all' ? 'all' : value));
		const get_charges = configure?.[document_tye]?.charges_;
		let updated_data: any = {};

		updated_data = {
			...get_charges,
			[field_key]: {
				...get_charges?.[field_key],
				users_with_edit_permissions: transformed_permission?.users_with_edit_permissions || 'all',
				roles_with_edit_permissions: transformed_permission?.roles_with_edit_permissions || 'all',
			},
		};
		const updated_permission_data = { ...configure?.[document_tye], charges_: updated_data };
		update_configuration(document_tye, updated_permission_data);
		set_permission_drawer(false);
	};

	const handle_on_save = (edit_type: string) => {
		switch (edit_type) {
			case 'order':
				return handle_document_permission;
			case 'quote':
				return handle_document_permission;
			case 'order_charges':
				return handle_document_charges_permission;
			case 'quote_charges':
				return handle_document_charges_permission;
			default:
				return null;
		}
	};

	const order_buyer_map = [...order_buyer_map_config];
	const order_config = [...order_permissions_config, utils.create_action_config(actions, handle_permission_order, 'Actions')];
	const quote_config = [...order_permissions_config, utils.create_action_config(actions, handle_permission_quote, 'Actions')];
	const charge_order_config = [
		...charge_permissions_config,
		utils.create_action_config(actions, handle_permission_order_charge, 'Actions'),
	];
	const charge_quote_config = [
		...charge_permissions_config,
		utils.create_action_config(actions, handle_permission_quote_charge, 'Actions'),
	];

	const document_permissions = [
		{
			key: 'order_config',
			header: 'Order Permissions',
			columnDef: order_config,
			rowData: order_permissions,
		},
		{
			key: 'charge_order_config',
			header: 'Order Charges  Permissions',
			columnDef: charge_order_config,
			rowData: charges_order_permissions,
		},
		{
			key: 'quote_config',
			header: 'Quote Permissions',
			columnDef: quote_config,
			rowData: quote_permissions,
		},

		{
			key: 'charge_quote_config',
			header: 'Quote Charges Permissions',
			columnDef: charge_quote_config,
			rowData: charges_quote_permissions,
		},
	];

	useEffect(() => {
		get_keys_configuration('order_settings');
		get_keys_configuration('quote_settings');
		get_keys_configuration('order_auto_fill_settings');
		get_keys_configuration('order_form_permissions');
		get_keys_configuration('quote_auto_fill_settings');
		get_keys_configuration('quote_form_permissions');
		get_users();
		get_roles();
		get_attributes_list('buyer');
		get_attributes_list('document');
	}, []);

	if (order_setting_loading) return null;
	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>Order and quote permisions</CustomText>
			</Grid>
			<Grid display='flex' flexDirection='column' gap={'2rem'} mt={2}>
				<Grid>
					<CustomText type='H6' style={{ marginBottom: '2rem' }}>
						Buyer Attribute Mapping
					</CustomText>
					<AgGridTableContainer
						columnDefs={order_buyer_map}
						hideManageColumn
						rowData={order_buyer}
						containerStyle={get_style(order_buyer)}
						showStatusBar={false}
					/>
				</Grid>
				<div style={dividerStyle}></div>

				{_.map(document_permissions, (section: any, index: number) => {
					return (
						<Grid key={section?.key}>
							<CustomText type='H6' style={{ marginBottom: '2rem' }}>
								{section?.header}
							</CustomText>

							{!order_setting_loading && (
								<AgGridTableContainer
									columnDefs={section?.columnDef}
									hideManageColumn
									rowData={section?.rowData}
									containerStyle={get_style(section?.rowData)}
									showStatusBar={false}
								/>
							)}
							{index === 1 && <div style={dividerStyle}></div>}
						</Grid>
					);
				})}
				{attr_drawer && <EditAttDrawer drawer={attr_drawer} set_drawer={set_attr_drawer} data={data} />}
				{permission_drawer && (
					<EditAttPermission
						drawer={permission_drawer}
						set_drawer={set_permission_drawer}
						data={data}
						user_options={user_data}
						roles_option={roles_data}
						on_save={handle_on_save(edit_doc)}
					/>
				)}
			</Grid>
		</Grid>
	);
};

export default DocumentPermission;
