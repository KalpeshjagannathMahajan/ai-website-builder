import _ from 'lodash';
import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid, Button, Icon, Modal } from 'src/common/@the-source/atoms';
import { useEffect, useState } from 'react';
import Menu from 'src/common/Menu';
import settings from 'src/utils/api_requests/setting';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import { INCREMENTAL_SYNC_COLUMN_DEF, INCREMENTAL_SYNC_SETTINGS_KEYS, STARTED_INCREMENTAL_SYNC_TASK_STATUSES } from './constant';
import CircularProgressBar from 'src/common/@the-source/atoms/ProgressBar/CircularProgressBar';
import { colors } from 'src/utils/theme';
import { text_colors } from 'src/utils/light.theme';
import useTenantSettings from 'src/hooks/useTenantSettings';
import { useTheme } from '@mui/material/styles';

const IncrementalSync = () => {
	const [row_data, set_row_data] = useState<any[]>([]);
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const [is_sync_in_progress, set_is_sync_in_progress] = useState<boolean>(true);
	const [is_modal_visible, set_is_modal_visible] = useState<any>({ open: false, type: '' });
	const { manual_pull_enabled, manual_push_enabled, integration_type } = useTenantSettings({
		[INCREMENTAL_SYNC_SETTINGS_KEYS.MANUAL_PULL_ENABLED]: false,
		[INCREMENTAL_SYNC_SETTINGS_KEYS.MANUAL_PUSH_ENABLED]: false,
		[INCREMENTAL_SYNC_SETTINGS_KEYS.INTEGRATION_TYPE]: 'quickbooks',
	});
	const theme = useTheme();

	const menu = [
		{
			id: 'push',
			title: 'Push',
			sub_title: `Push data from WizCommerce to ${integration_type}`,
			disabled: !manual_push_enabled,
		},
		{
			id: 'pull',
			title: 'Incremental Pull',
			sub_title: `Pull data from ${integration_type} to WizCommerce`,
			disabled: !manual_pull_enabled,
		},
	];

	const get_incremental_sync_logs = () => {
		settings
			.incremental_sync_logs()
			.then((res: any) => {
				console.log(res);
				set_row_data(res?.data);
				set_is_sync_in_progress(_.includes(STARTED_INCREMENTAL_SYNC_TASK_STATUSES, _.head(res?.data)?.task_status));
			})
			.catch((error: any) => {
				console.error(error);
				set_is_sync_in_progress(false);
			})
			.finally(() => {
				is_loading && set_is_loading(false);
			});
	};

	const debounced_get_sync_logs = _.debounce(() => {
		get_incremental_sync_logs();
	}, 500);

	const handle_incremental_sync = async (type: string) => {
		set_is_modal_visible({ open: false, type: '' });
		settings
			.incremental_sync(type)
			.then((res: any) => {
				console.log(res);
				get_incremental_sync_logs();
			})
			.catch((error: any) => {
				console.error(error);
			});
	};

	const get_task_status_text = () => {
		return _.head(row_data)?.sync_type === 'integration_push'
			? `Push data from WizCommerce to ${integration_type} is in progress`
			: `Pull data from ${integration_type} to WizCommerce is in progress`;
	};

	useEffect(() => {
		get_incremental_sync_logs();
	}, []);

	return (
		<Grid className={classes.content}>
			{is_loading ? (
				<CustomText type='H2'>Loading...</CustomText>
			) : (
				<>
					<Grid className={classes.content_header}>
						<CustomText type='H2'>Incremental Sync</CustomText>
						<Menu
							disable={is_sync_in_progress}
							LabelComponent={
								<Button disabled={is_sync_in_progress}>
									Sync <Icon iconName='IconChevronDown' color={is_sync_in_progress ? text_colors.disabled : 'white'} sx={{ ml: 1 }} />
								</Button>
							}
							menu={menu}
							commonMenuComponent={(_item: any) => {
								return (
									<Grid display='flex' flexDirection='column' gap={1} p={1} minWidth={230}>
										<CustomText type='Subtitle'>{_item.title}</CustomText>
										<CustomText type='Caption'>{_item.sub_title}</CustomText>
									</Grid>
								);
							}}
							commonMenuOnClickHandler={(item: any) => {
								set_is_modal_visible({ open: true, type: item?.id });
							}}
							position='right'
							closeOnItemClick
						/>
					</Grid>
					<Grid display='flex' flexDirection='column' gap={2} my={2}>
						{is_sync_in_progress && (
							<Grid bgcolor={theme?.palette?.info[50]} px={2.5} py={1.5} borderRadius={1.5} display='flex' alignItems='center' gap={2}>
								<CircularProgressBar style={{ width: '15px', height: '15px', color: colors.dark_charcoal }} variant='indeterminate' />
								<Grid display='flex' flexDirection='column' gap={0.5} flex={1}>
									<CustomText type='Subtitle'>{get_task_status_text()}</CustomText>
								</Grid>
								<Button variant='text' onClick={debounced_get_sync_logs}>
									Refresh status
								</Button>
							</Grid>
						)}
						<AgGridTableContainer columnDefs={INCREMENTAL_SYNC_COLUMN_DEF} rowData={row_data} showStatusBar={false} />
					</Grid>
					<Modal
						width={480}
						open={is_modal_visible.open}
						onClose={() => set_is_modal_visible({ open: false, type: '' })}
						title={'Start syncing?'}
						footer={
							<Grid display='flex' gap={1} justifyContent='flex-end'>
								<Button variant='outlined' onClick={() => set_is_modal_visible({ open: false, type: '' })}>
									Cancel
								</Button>
								<Button onClick={() => handle_incremental_sync(is_modal_visible.type)}>Start</Button>
							</Grid>
						}
						children={
							<Grid display='flex' flexDirection='column' gap={2}>
								<CustomText>Are you sure you want to start incremental {is_modal_visible.type}?</CustomText>
							</Grid>
						}
					/>
				</>
			)}
		</Grid>
	);
};

export default IncrementalSync;
