import { useEffect, useMemo } from 'react';
import { Drawer } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { CSVBoxButton } from '@csvbox/react';
import { useState } from 'react';

import { StepStatus, ImportSteps, Entity } from 'src/@types/manage_data';
import { Typography, Icon, Button } from 'src/common/@the-source/atoms';
import CircularProgressBar from 'src/common/@the-source/atoms/ProgressBar/CircularProgressBar';
import SelectTemplate from './components/SelectTemplate';
import ReviewAndSync from './components/ReviewAndSync';
import ReviewAndSnycInProgress from './components/ReviewAndSnycInProgress';
import Step from './components/Step';
import Retry from './components/Retry';
import DismissTaskModal from './components/DismissTaskModal';
import GoingAwayModal from './components/GoingAwayModal';
import useImport from './useImport';
import { useTranslation } from 'react-i18next';

const DRAWER_WIDTH = '480px';

const useStyles = makeStyles(() => ({
	panel_container: {
		width: DRAWER_WIDTH,
		height: '100vh',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		background: 'white',
	},
	header_section: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '16px 20px',
		borderBottom: '1px solid rgb(209, 214, 221)',
	},

	scroll_section: {
		height: '100%',
		overflow: 'scroll',
		padding: '20px',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	footer_section: {
		display: 'flex',
		justifyContent: 'flex-end',
		padding: '16px 24px',
		gap: '12px',
		background: 'white',
		borderTop: '1px solid rgb(209, 214, 221)',
	},
	// body
	body_container: {
		display: 'flex',
		flexDirection: 'column',
		gap: '10px',
	},
	step_separator: {
		width: '1px',
		minHeight: '92px',
		marginLeft: '12px',
		marginRight: '12px',
		background: '#BDBDBD',
	},
	step_container: {
		display: 'flex',
		flexDirection: 'column',
		gap: '8px',
	},
	step_section: {
		display: 'flex',
	},
	step_content: {
		paddingTop: '10px',
		paddingBottom: '10px',
	},
	loading_section: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	warning_box: {
		display: 'flex',
		alignItems: 'center',
		background: '#FEF7EA',
		borderRadius: '8px',
		gap: '14px',
		padding: '8px 12px',
	},
}));

interface Props {
	show_drawer: boolean;
	toggle_drawer: (value: boolean) => void;
	task_id?: string;
	entity: Entity;
	entity_ids?: string[];
	sub_entities?: any[];
	selected_sub_entity?: any;
	set_show_toast?: any;
}

const ImportSidePanel = ({
	task_id,
	show_drawer,
	toggle_drawer,
	entity,
	entity_ids,
	sub_entities,
	selected_sub_entity,
	set_show_toast,
}: Props) => {
	const classes = useStyles();
	const {
		set_csv_ready,
		csv_ready,
		handle_register_import,
		update_import_options,
		set_import_step,
		import_step,
		user_id,
		selected_template,
		config,
		cancel_current_task,
		sub_entity,
		set_sub_entity,
		reset_to_init_state,
		confirm_load,
		is_discard_loading,
	} = useImport(entity, task_id, entity_ids, sub_entities);

	const [show_dismiss_task_modal, toggle_dismiss_task_modal] = useState(false);
	const [show_going_away_modal, toggle_going_away_modal] = useState(false);
	const [is_import_modal, set_is_import_modal] = useState(false);
	const { t } = useTranslation();

	const handle_close_panel = (toast = false) => {
		reset_to_init_state();
		set_show_toast && set_show_toast(toast);
		toggle_drawer(false);
	};

	useEffect(() => {
		if (import_step === ImportSteps.REVIEW_AND_SYNC_IN_PROGRESS) {
			setTimeout(() => {
				handle_close_panel(true);
			}, 2000);
		}
	}, [import_step]);

	const handle_before_unload = (event: BeforeUnloadEvent) => {
		event.preventDefault();
	};

	const handle_popstate = (event: PopStateEvent) => {
		event?.preventDefault();
		if (import_step === ImportSteps.DATA_VALIDATION_SUCCESS || is_import_modal) {
			const user_confirmed = window.confirm(t('ManageData.ImportSidePanel.BackNavigationWarning'));
			if (!user_confirmed) {
				window.history.replaceState(null, '', window.location.href);
			} else {
				window.removeEventListener('beforeunload', handle_before_unload);
				window.removeEventListener('popstate', handle_popstate);
				window.history.back();
			}
		}
	};

	useEffect(() => {
		if (import_step === ImportSteps.DATA_VALIDATION_SUCCESS || is_import_modal) {
			window.addEventListener('beforeunload', handle_before_unload);
			window.addEventListener('popstate', handle_popstate);

			window.history.pushState(null, '', window.location.href);

			return () => {
				window.removeEventListener('beforeunload', handle_before_unload);
				window.removeEventListener('popstate', handle_popstate);
			};
		}
	}, [import_step, is_import_modal]);

	const handle_close = () => {
		if (import_step === ImportSteps.DATA_VALIDATION) {
			toggle_dismiss_task_modal(true);
		} else if (import_step === ImportSteps.DATA_VALIDATION_SUCCESS) {
			toggle_going_away_modal(true);
		} else {
			handle_close_panel();
		}
	};

	const handle_resume = async () => {
		toggle_going_away_modal(false);
	};

	const handle_yes = async () => {
		toggle_dismiss_task_modal(false);
		handle_close_panel();
	};

	const handle_discard = async () => {
		await cancel_current_task();
		toggle_going_away_modal(false);
		handle_close_panel();
	};

	const render_body = (_blocked: boolean) => {
		if (config && _blocked) {
			return (
				<div className={classes.body_container}>
					<div className={classes.warning_box}>
						<Icon iconName='IconAlertCircle' color='#F0AF30' />

						<Typography sx={{ fontSize: '12px', fontWeight: 400 }}>Can’t start another import if one is already in progress</Typography>
					</div>
					<SelectTemplate
						entity={entity}
						sub_entities={sub_entities}
						blocked={_blocked}
						csv_ready={csv_ready}
						selected_template={selected_template}
						sub_entity={sub_entity}
						set_sub_entity={set_sub_entity}
					/>
				</div>
			);
		}
		if (import_step === ImportSteps.INIT_STATE && config) {
			return (
				<div className={classes.body_container}>
					<SelectTemplate
						entity={entity}
						sub_entities={sub_entities}
						blocked={_blocked}
						csv_ready={csv_ready}
						selected_template={selected_template}
						sub_entity={sub_entity}
						set_sub_entity={set_sub_entity}
					/>
				</div>
			);
		}
		if (import_step === ImportSteps.RETRY) {
			return (
				<div className={classes.step_container}>
					<Step title={t('ManageData.ImportSidePanel.Upload')} status={StepStatus.TakeAction} step_number={1} />
					<div className={classes.step_section}>
						<div className={classes.step_separator} />
						<div className={classes.step_content}>
							<Retry />
						</div>
					</div>
					<Step title={t('ManageData.ImportSidePanel.ReviewAndSync')} status={StepStatus.Pending} step_number={3} />

					<div className={classes.step_separator} />

					<Step title={t('ManageData.ImportSidePanel.ReviewAndSync')} status={StepStatus.Pending} step_number={3} />
				</div>
			);
		}

		if (import_step === ImportSteps.DATA_VALIDATION) {
			return (
				<div className={classes.step_container}>
					<Step title={t('ManageData.ImportSidePanel.Uploaded')} status={StepStatus.Done} />
					<div className={classes.step_separator} />
					<Step
						title={t('ManageData.ImportSidePanel.Validation')}
						subtitle={t('ManageData.ImportSidePanel.Wait')}
						status={StepStatus.InProgress}
					/>
					<div className={classes.step_separator} />

					<Step title={t('ManageData.ImportSidePanel.ReviewAndSync')} status={StepStatus.Pending} step_number={3} />
				</div>
			);
		}

		if (import_step === ImportSteps.DATA_VALIDATION_SUCCESS) {
			return (
				<div className={classes.step_container}>
					<Step title={t('ManageData.ImportSidePanel.Uploaded')} status={StepStatus.Done} />
					<div className={classes.step_separator} />
					<Step title={t('ManageData.ImportSidePanel.Completed')} status={StepStatus.Done} />
					<div className={classes.step_separator} />
					<Step title={t('ManageData.ImportSidePanel.ReviewAndSync')} status={StepStatus.TakeAction} step_number={3} />

					<div style={{ marginLeft: '32px' }}>
						<ReviewAndSync update_import_options={update_import_options} confirm_load={confirm_load} entity={entity} />
					</div>
				</div>
			);
		}

		if (import_step === ImportSteps.REVIEW_AND_SYNC_IN_PROGRESS) {
			return (
				<div className={classes.step_container}>
					<Step title={t('ManageData.ImportSidePanel.Uploaded')} status={StepStatus.Done} />
					<div className={classes.step_separator} />
					<Step title={t('ManageData.ImportSidePanel.Completed')} status={StepStatus.Done} />

					<div className={classes.step_separator} />

					<Step title={t('ManageData.ImportSidePanel.ReviewAndSync')} status={StepStatus.InProgress} />
					<div style={{ marginLeft: '32px' }}>
						<ReviewAndSnycInProgress />
					</div>
				</div>
			);
		}
		return null;
	};

	const render_body_section = () => {
		if (task_id) {
			return <div className={classes.scroll_section}>{render_body(false)}</div>;
		}
		if (config) {
			return <div className={classes.scroll_section}>{render_body(config.blocked)}</div>;
		} else {
			return (
				<div className={classes.loading_section}>
					<CircularProgressBar style={{ width: '95px', height: '95px' }} />
				</div>
			);
		}
	};

	const csvBoxKey = useMemo(() => `${config?.license_key}-${JSON.stringify(selected_template?.dynamic_col)}`, [config, selected_template]);

	const handle_launch = (launch_callback: () => void) => {
		set_is_import_modal(true);
		launch_callback();
	};

	const render_footer_section = () => {
		if (task_id) return null;
		if (config && !config.blocked) {
			return (
				<div
					className={classes.footer_section}
					style={import_step === ImportSteps.INIT_STATE || import_step === ImportSteps.RETRY ? {} : { display: 'none' }}>
					<Button onClick={() => handle_close_panel()} variant='outlined' color='secondary'>
						{t('ManageData.Main.Cancel')}
					</Button>
					<CSVBoxButton
						licenseKey={config?.license_key}
						key={csvBoxKey}
						user={{
							user_id,
							entity,
							sub_entity: selected_sub_entity ? selected_sub_entity : sub_entity?.value,
							selected_template: config?.data[0]?.dynamic_col,
						}}
						onSubmit={() => {
							set_import_step(ImportSteps.DATA_VALIDATION);
						}}
						onReady={() => {
							set_csv_ready(true);
						}}
						onImport={(result: any, data: any) => {
							if (result) {
								handle_register_import(data);
							} else {
								set_import_step(ImportSteps.RETRY);
							}
						}}
						onClose={() => {
							set_is_import_modal(false);
						}}
						dynamicColumns={selected_template?.dynamic_col}
						render={(launch: any) => {
							return (
								<Button
									loading={!csv_ready}
									loaderSize={'16px'}
									disabled={!selected_template}
									onClick={() => handle_launch(launch)}
									color='primary'>
									{import_step === ImportSteps.INIT_STATE ? t('ManageData.Main.Import') : t('ManageData.Main.Retry')}
								</Button>
							);
						}}></CSVBoxButton>
				</div>
			);
		}
		return (
			<div className={classes.footer_section}>
				<Button onClick={() => handle_close_panel()} variant='outlined' color='secondary'>
					{t('ManageData.Main.Cancel')}
				</Button>
				<Button loading={!config?.blocked} loaderSize={'16px'} disabled={true} onClick={() => {}} variant='outlined' color='secondary'>
					{t('ManageData.Main.Import')}
				</Button>
			</div>
		);
	};

	return (
		<Drawer
			PaperProps={{
				sx: { width: DRAWER_WIDTH, overflow: 'hidden' },
			}}
			anchor='right'
			open={show_drawer}
			onClose={handle_close}>
			<div className={classes.panel_container}>
				<div className={classes.header_section}>
					<Typography sx={{ fontSize: '18px', fontWeight: 700 }}>Import data</Typography>
					<Icon iconName='IconX' color='#4F555E' sx={{ cursor: 'pointer' }} onClick={handle_close} />
				</div>
				{render_body_section()}
				{render_footer_section()}
			</div>

			<DismissTaskModal handle_yes={handle_yes} show_modal={show_dismiss_task_modal} toggle_modal={toggle_dismiss_task_modal} />
			<GoingAwayModal
				handle_discard={handle_discard}
				handle_resume={handle_resume}
				show_modal={show_going_away_modal}
				toggle_modal={toggle_going_away_modal}
				is_discard_loading={is_discard_loading}
			/>
		</Drawer>
	);
};

export default ImportSidePanel;
