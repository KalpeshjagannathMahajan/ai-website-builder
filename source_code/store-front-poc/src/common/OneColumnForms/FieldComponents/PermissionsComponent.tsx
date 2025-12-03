import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Box, Checkbox } from 'src/common/@the-source/atoms';
import { Module, PermissionEntity, Permission } from 'src/common/Interfaces/SectionsInterface';
import { makeStyles } from '@mui/styles';
import { get_permissions, get_key } from '../helper';
import { useSelector } from 'react-redux';
import _ from 'lodash';

interface PermissionsProps {
	modules: Module[];
	access_map: { [key: string]: PermissionEntity };
	set_access_map: (data: any) => void;
}

const useStyles = makeStyles((theme: any) => ({
	module_permission: {
		width: '100%',
		border: theme?.permissions_component?.border,
		borderRadius: '8px',
		margin: '20px 0 ',
	},
	module_header: {
		display: 'flex',
		width: '100%',
		backgroundColor: theme?.palette?.colors?.grey_600,
		padding: '0 20px',
		borderBottom: theme?.permissions_component?.border,
		borderRadius: '8px 8px 0px 0px',
	},
	submodule: {
		padding: '10px 20px',
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
	},
	submodule_name: {
		margin: 'auto 0',
		width: '100%',
	},
}));

const permission_org_pairing = [
	{
		permission_key: 'delete_cancelled_orders',
		org_key: 'enable_delete_cancelled_order',
	},
	{
		permission_key: 'edit_confirmed_orders',
		org_key: 'enable_confirmed_order_editing',
	},
];

interface ModulePermissionProps {
	module: Module;
	handle_change: (event: any, permission_id: string) => void;
	access_map: { [key: string]: PermissionEntity };
	handle_toggle_full_access: (value: boolean, module_key: string) => void;
}

const ModulePermission = ({ module, handle_change, access_map, handle_toggle_full_access }: ModulePermissionProps) => {
	const styles = useStyles();
	const [full_access, set_full_access] = useState(false);
	const settings = useSelector((state: any) => state?.settings);

	const module_key = get_key(module?.name);

	useEffect(() => {
		const result = module.submodules?.every((submodule) => {
			return submodule.permissions.every((p: Permission) => access_map[p?.permissionId]?.value);
		});
		set_full_access(result);
	}, [access_map]);

	const toggle_full_access = (e: any) => {
		set_full_access(e.target.checked);
		handle_toggle_full_access(e?.target?.checked, module_key);
	};

	return (
		<Grid container className={styles.module_permission}>
			<Grid justifyContent='space-between' className={styles.module_header}>
				<Typography variant='h6' sx={{ padding: '10px 0' }}>
					{module.name === 'Buyer' ? 'Customer' : module.name}
				</Typography>
				<Box style={{ fontSize: '1.4rem', paddingTop: '0.5rem' }}>
					<Checkbox onChange={toggle_full_access} checked={full_access} />
					Full access
				</Box>
			</Grid>
			{module?.submodules?.map((submodule) => {
				return (
					<Grid className={styles.submodule}>
						<Grid xs={3}>
							<p className={styles.submodule_name}>{submodule?.name === 'Buyer' ? 'Customer' : submodule.name}</p>
						</Grid>
						<Grid xs={9} display='flex' justifyContent='flex-end' container>
							{submodule.permissions?.map((permission) => {
								const org_permission = _.find(permission_org_pairing, (item) => item?.permission_key === permission?.key) || {};
								const value = _.get(settings, org_permission?.org_key, true);

								if (!_.isEmpty(org_permission) && !value) return <></>;

								return (
									<Grid item>
										<Box style={{ fontSize: '1.4rem' }}>
											<Checkbox
												checked={access_map[permission?.permissionId]?.value}
												onChange={(e: any) => handle_change(e, permission?.permissionId)}
											/>
											{permission.label}
										</Box>
									</Grid>
								);
							})}
						</Grid>
					</Grid>
				);
			})}
		</Grid>
	);
};

const PermissionsComponent = ({ modules, access_map, set_access_map }: PermissionsProps) => {
	const org_enable = useSelector((state: any) => state?.settings?.enable_org_settings);
	const handle_change = (e: any, permission_id: string) => {
		const value = e?.target?.checked;
		let _temp = JSON.parse(JSON.stringify(access_map));
		const new_access_map = get_permissions(_temp, permission_id, value);
		set_access_map(new_access_map);
	};

	const handle_toggle_full_access = (value: boolean, module_key: string) => {
		let _temp = JSON.parse(JSON.stringify(access_map));

		const _module = modules?.filter((module) => get_key(module?.name) === module_key)?.[0];

		_module?.submodules?.forEach((submodule) => {
			submodule?.permissions?.forEach((permission) => {
				_temp[permission?.permissionId].value = value;
				_temp = get_permissions(_temp, permission.permissionId, value);
			});
		});
		set_access_map(_temp);
	};

	return (
		<>
			{modules.map((module) => {
				if (module?.name === 'Org Settings' && org_enable) {
					return (
						<ModulePermission
							module={module}
							handle_change={handle_change}
							access_map={access_map}
							handle_toggle_full_access={handle_toggle_full_access}
						/>
					);
				} else if (module?.name !== 'Org Settings') {
					return (
						<ModulePermission
							module={module}
							handle_change={handle_change}
							access_map={access_map}
							handle_toggle_full_access={handle_toggle_full_access}
						/>
					);
				}
			})}
		</>
	);
};

export default PermissionsComponent;
