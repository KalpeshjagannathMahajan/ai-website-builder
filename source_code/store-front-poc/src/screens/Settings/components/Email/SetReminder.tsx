/* eslint-disable */
import classes from '../../Settings.module.css';
import { useContext, useEffect, useState } from 'react';
import { Grid, Icon, Toaster, Tooltip } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import utils from 'src/utils/utils';
// import TemplateModal from './TemplateModal';
// import settings from 'src/utils/api_requests/setting';
import { default_toast, reminder_description, reminder_table_column } from './helper';
import _ from 'lodash';
import ReminderDrawer from './ReminderDrawer';
import SettingsContext from '../../context';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

const SetReminder = () => {
	const { configure, get_keys_configuration } = useContext(SettingsContext);
	const [drawer_open, set_drawer_open] = useState<boolean>(false);
	// const [template_modal_open, set_template_modal] = useState<boolean>(false);
	const [edit_data, set_edit_data] = useState<any>({});
	const [type, set_type] = useState<any>('');
	// const [events, set_events] = useState<String[]>([]);
	const [show_toast, set_show_toast] = useState(default_toast);

	useEffect(() => {
		get_keys_configuration('scheduled_event_config');
	}, []);

	return (
		<>
			<Grid className={classes.content}>
				<Grid className={classes.content_header}>
					<CustomText type='H6'>Set Reminders</CustomText>
				</Grid>
				{_.map(configure?.scheduled_event_config, (module: any, key: string) => {
					const label = module?.label;
					const entity = module?.entity;
					const row_data = module?.scheduled_events;
					const table_height = _.size(row_data) * 50;
					const desciption = reminder_description?.[key];

					// table actions and tranformation
					const handle_edit = (params: any) => {
						set_type(key);
						set_edit_data({ ...params?.node?.data, index: params?.rowIndex });
						set_drawer_open(true);
					};

					const column_defs = [...reminder_table_column, utils.create_action_config(actions, handle_edit, 'Actions')];

					return (
						<Grid key={entity} mt={3}>
							<Grid container alignItems='center'>
								<Grid item sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									<CustomText type='H6'>{_.capitalize(label)}</CustomText>
									<Tooltip arrow title={desciption} placement='right' textStyle={{ fontSize: '1.2rem' }}>
										<div>
											<Icon iconName='IconInfoCircle' />
										</div>
									</Tooltip>
								</Grid>
							</Grid>
							<Grid mt={1}>
								<AgGridTableContainer
									columnDefs={column_defs}
									hideManageColumn
									rowData={row_data}
									containerStyle={{ height: `${table_height + 50}px`, maxHeight: '700px', minHeight: '150px' }}
									showStatusBar={false}
									suppressFieldDotNotation
								/>
							</Grid>
						</Grid>
					);
				})}
			</Grid>

			{drawer_open && <ReminderDrawer open={drawer_open} close={() => set_drawer_open(false)} data={edit_data} type={type} />}

			{/* {template_modal_open && <TemplateModal data={edit_data} open={template_modal_open} set_open={set_template_modal} />} */}
			<Toaster
				open={show_toast.state}
				showCross={false}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				autoHideDuration={3000}
				onClose={() => set_show_toast(default_toast)}
				state={show_toast?.type_status === 'error' ? 'error' : 'success'}
				title={show_toast.title}
				subtitle={show_toast.sub_title}
				showActions={false}
			/>
		</>
	);
};

export default SetReminder;
