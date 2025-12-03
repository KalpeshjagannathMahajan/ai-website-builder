/* eslint-disable */
import { useEffect, useState } from 'react';
import { Grid, Switch, Toaster } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import utils from 'src/utils/utils';
import EmailDrawer from './EmailDrawer';
// import TemplateModal from './TemplateModal';
import EmailReciepentDrawer from './EmailReciepentDrawer';
import settings from 'src/utils/api_requests/setting';
import { transform_unique_module, table_columns, default_toast } from './helper';

interface EmailTriggerProps {
	type: 'external' | 'internal';
}

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

const EmailTrigger = ({ type }: EmailTriggerProps) => {
	const [data, set_data] = useState<any>({});
	const [drawer_open, set_drawer_open] = useState<boolean>(false);
	const [email_reciepent_drawer, set_email_reciepent_drawer] = useState<boolean>(false);
	const [edit_data, set_edit_data] = useState<any>({});
	const [events, set_events] = useState<String[]>([]);
	const [show_toast, set_show_toast] = useState(default_toast);

	const fetch_data = async (type: string) => {
		try {
			const res: any = await settings.get_email_config(type);
			set_data(res?.data);
			const _events = transform_unique_module(res?.data?.events);
			set_events(_events);
		} catch (err: any) {
			console.log(err?.message);
			set_show_toast({ state: true, title: 'Something went wrong', sub_title: err?.message, type_status: 'error' });
		}
	};

	useEffect(() => {
		if (type === 'external') {
			fetch_data('external');
		} else {
			fetch_data('internal');
		}
	}, [type]);

	const handle_edit = (params: any) => {
		set_drawer_open(true);
		set_edit_data(params?.node?.data);
	};

	const handle_emails_enabler_toggle = () => {
		if (type === 'external') {
			settings.update_email_config({ is_external_emails_enabled: !data?.is_external_emails_enabled }).then((res: any) => {
				if (res?.status === 200) {
					fetch_data('external');
					set_show_toast({ state: true, title: 'Email Config Updated', sub_title: '', type_status: 'success' });
				}
			});
			return;
		} else {
			settings.update_email_config({ is_internal_emails_enabled: !data?.is_internal_emails_enabled }).then((res: any) => {
				if (res?.status === 200) {
					fetch_data('internal');
					set_show_toast({ state: true, title: 'Email Config Updated', sub_title: '', type_status: 'success' });
				}
			});
		}
	};

	const column_defs = [...table_columns, utils.create_action_config(actions, handle_edit, 'Actions')];

	const render_email_template = () => {
		if (type === 'external') {
			return data?.is_external_emails_enabled || false;
		} else {
			return data?.is_internal_emails_enabled || false;
		}
	};

	const handle_section_email_switcher = (module_name: string, value: boolean) => {
		settings.update_email_config({ module_level_flags: { [module_name]: !value } }).then((res: any) => {
			if (res?.status === 200) {
				fetch_data(type);
				set_show_toast({ state: true, title: 'Email Config Updated', sub_title: '', type_status: 'success' });
			}
		});
	};

	return (
		<>
			<Grid p={4}>
				<Grid container>
					<Grid item>
						<CustomText type='H6'>{type === 'external' ? 'External emails' : 'Internal emails'}</CustomText>
					</Grid>
					<Grid item ml='auto'>
						<Switch checked={render_email_template()} onChange={handle_emails_enabler_toggle} />
					</Grid>
				</Grid>
				{events.map((module_name: any) => {
					const module_data = data?.events?.filter((item: any) => item?.module_name === module_name);
					const table_height = module_data?.length * 50;
					const email_switcher = `${type}_${module_name}`;
					const global_email_val = data?.module_level_flags?.[email_switcher] ?? true;
					return (
						<Grid key={module_name} mt={3}>
							<Grid container alignItems='center'>
								<Grid item>
									<CustomText type='H6'>{module_name.charAt(0).toUpperCase() + module_name.slice(1)} emails</CustomText>
								</Grid>
								<Grid item ml='auto'>
									<Switch
										checked={global_email_val}
										onChange={() => {
											handle_section_email_switcher(email_switcher, global_email_val);
										}}
									/>
								</Grid>
							</Grid>
							<Grid mt={1}>
								<AgGridTableContainer
									columnDefs={column_defs}
									hideManageColumn
									rowData={module_data}
									containerStyle={{ height: `${table_height + 50}px`, maxHeight: '700px', minHeight: '150px' }}
									showStatusBar={false}
									suppressFieldDotNotation
								/>
							</Grid>
						</Grid>
					);
				})}
			</Grid>

			{drawer_open && (
				<EmailDrawer
					open={drawer_open}
					set_open={set_drawer_open}
					data={edit_data}
					// set_template_modal={set_template_modal}
					set_email_reciepent_drawer={set_email_reciepent_drawer}
					set_data={set_edit_data}
					type={type}
					fetch_data={fetch_data}
					set_show_toast={set_show_toast}
				/>
			)}
			{email_reciepent_drawer && (
				<EmailReciepentDrawer
					open={email_reciepent_drawer}
					set_open={set_email_reciepent_drawer}
					data={edit_data}
					set_data={set_edit_data}
				/>
			)}
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

export default EmailTrigger;
