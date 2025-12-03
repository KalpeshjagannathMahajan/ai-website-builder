// import ToggleSwitchEditField from 'src/common/@the-source/atoms/FieldsNew/ToggleSwitchEditField';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import classes from '../../Settings.module.css';
import { SHOWROOM_MODE } from '../General/mock';
import { Button, Grid, Skeleton, Switch } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import utils from 'src/utils/utils';
import { useEffect, useState } from 'react';
import AddUserGroup from '../Common/Drawer/AddUserGroup';
import settings from 'src/utils/api_requests/setting';
import { showroom_mode_config } from '../../utils/constants';
import _ from 'lodash';
import { background_colors, text_colors } from 'src/utils/light.theme';
import { info } from 'src/utils/common.theme';
import { t } from 'i18next';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

const container_style = {
	background: background_colors?.secondary,
	width: '450px',
	height: '80px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	borderRadius: '12px',
};

const toggle_container = {
	background: info[50],
	padding: '1rem 3rem 1rem 2rem',
	borderRadius: '12px',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '100%',
};

const ShowroomModeSetting = () => {
	const [showroom_mode_enabled, set_showroom_mode_enabled] = useState(false);
	const [permissions, set_permissions] = useState([]);
	const [loading, set_loading] = useState(false);
	const [drawer, set_drawer] = useState<any>({ state: false, data: null });

	const height = (permissions?.length ?? 2) * 50;

	const handle_edit = (params: any, key: string) => {
		const data = _.find(permissions, (curr) => curr?.id === params?.node?.data?.id);
		if (key === 'edit') {
			set_drawer({ state: true, data, index: params?.rowIndex });
		}
	};

	const columnDef = [...showroom_mode_config, { ...utils.create_action_config(actions, handle_edit) }];

	const transform_data = (data: any) => {
		const _data: any = _.map(data, (curr) => {
			const transformKey = (value: any) => {
				if (value === 'all' || value === 'self') {
					return [{ label: _.capitalize(value), value }];
				} else if (value === 'self_with_assigned') {
					return [{ label: 'Self with assigned', value }];
				}
				return value;
			};

			return {
				...curr,
				order_access: transformKey(curr.order_access),
				buyer_access: transformKey(curr.buyer_access),
				catalog_access: transformKey(curr.catalog_access),
			};
		});

		return _data;
	};

	const get_table_data = () => {
		set_loading(true);
		settings
			.get_showroom_mode_setting()
			.then((res: any) => {
				if (res?.status === 200) {
					const data = res?.data || {};
					set_showroom_mode_enabled(data?.showroom_mode_enabled);
					set_permissions(data?.permissions);
				}
			})
			.catch((err) => console.error(err))
			.finally(() => set_loading(false));
	};

	const handle_update_setting = (payload: any) => {
		set_loading(true);
		settings
			.update_showroom_mode_setting({ showroom_mode_enabled, ...payload })
			.then((res: any) => {
				if (res?.status === 200) {
					const data = res?.data || {};
					set_showroom_mode_enabled(data?.showroom_mode_enabled);
					set_permissions(data?.permissions);
				}
			})
			.catch((err) => console.error(err))
			.finally(() => set_loading(false));
	};

	const handle_render_content = () => {
		if (loading) return <Skeleton variant='rounded' width={'100%'} height={200} />;
		const _permission: any = _.head(permissions)?.user_list?.length !== 0 || false;

		if (_.size(permissions) > 0 && _permission)
			return (
				<AgGridTableContainer
					columnDefs={columnDef}
					has_serials={false}
					hideManageColumn
					rowData={transform_data(permissions) ?? []}
					containerStyle={{ height: `${height + 50}px`, maxHeight: '500px', minHeight: '200px' }}
					showStatusBar={false}
				/>
			);

		return (
			<Grid
				sx={{ ...container_style, cursor: 'pointer' }}
				onClick={() => set_drawer({ state: true, data: permissions?.[0] || {}, index: 0 })}>
				<Button variant='text' sx={{ padding: 0 }}>
					{t('Settings.ShowroomMode.AddUserPermission')}
				</Button>
			</Grid>
		);
	};

	useEffect(() => {
		get_table_data();
	}, []);

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>{SHOWROOM_MODE}</CustomText>
			</Grid>
			<Grid container gap={2} mt={3}>
				<Grid sx={toggle_container}>
					<Grid gap={0.7} flexDirection={'column'}>
						<CustomText type='H3'>{t('Settings.ShowroomMode.EnableMode')}</CustomText>
						<CustomText color={text_colors?.primary} type='Body'>
							{t('Settings.ShowroomMode.EnableOrder')}
						</CustomText>
					</Grid>

					<Grid>
						<Switch checked={showroom_mode_enabled} onChange={(e) => handle_update_setting({ showroom_mode_enabled: e.target.checked })} />
					</Grid>
				</Grid>
				{showroom_mode_enabled && (
					<>
						<hr />
						<Grid container flexDirection={'column'}>
							<CustomText type='H3'>User permission settings</CustomText>
							<CustomText type='Body' color={text_colors?.primary}>
								{t('Settings.ShowroomMode.DefineUser')}
							</CustomText>
							<Grid my={2}>{handle_render_content()}</Grid>
						</Grid>
					</>
				)}
			</Grid>
			{drawer?.state && (
				<AddUserGroup
					is_visible={true}
					data={drawer?.data}
					close={() => set_drawer({ state: false, data: null })}
					handle_update_setting={handle_update_setting}
				/>
			)}
		</Grid>
	);
};

export default ShowroomModeSetting;
