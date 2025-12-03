import { Divider } from '@mui/material';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { report_config, report_user_roles } from '../../utils/constants';
import ToggleSwitchEditField from 'src/common/@the-source/atoms/FieldsNew/ToggleSwitchEditField';
import { background_colors } from 'src/utils/light.theme';
import CustomToast from 'src/common/CustomToast';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const dividerStyle: React.CSSProperties = {
	height: '1px',
	background: 'repeating-linear-gradient(90deg,#D1D6DD 0 4px,#0000 0 8px)',
	margin: '.5rem 0',
};

const AddEditReports = ({ open, set_open, data, users, roles, handle_save }: any) => {
	const [show_toast, set_show_toast] = useState({ state: false, title: '', sub_title: '' });
	const user_details = useSelector((state: any) => state?.login?.userDetails);

	const methods = useForm({
		defaultValues: {
			...data,
			is_filter: !_.isEmpty(data?.filters),
			users: data?.users?.map((item: any) => item?.value),
			roles: data?.roles?.map((item: any) => item?.value),
		},
	});
	const { getValues, setValue, handleSubmit, watch }: any = methods;

	const on_submit = () => {
		const report_users = getValues()?.users?.join(',');
		const report_roles = getValues()?.roles?.join(',');
		const filter_tenant = getValues()?.filters?.tenant_id;
		const filter_users = getValues()?.filters?.user_id;
		const filter_data = getValues()?.is_filter
			? {
					tenant_id: filter_tenant ?? user_details?.tenant_id,
					user_id: filter_users ?? user_details?.id,
			  }
			: {};

		if (getValues()?.is_specific) {
			if (!report_users && !report_roles) {
				set_show_toast({ state: true, title: 'At least one of the fields (users or roles) is required', sub_title: '' });
				return; // Prevent form submission
			}
		}

		const report_details: any = {
			dashboard_id: getValues()?.dashboard_id,
			tab_name: getValues()?.tab_name,
			roles: report_roles ?? '',
			users: report_users ?? '',
			filters: filter_data,
			is_specific: getValues()?.is_specific,
		};
		handle_save(report_details);
	};

	const handle_render_toast = () => {
		return (
			<CustomToast
				open={show_toast.state}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				show_icon={true}
				autoHideDuration={5000}
				onClose={() => set_show_toast({ state: false, title: '', sub_title: '' })}
				state='warning'
				title={show_toast.title}
				subtitle={show_toast.sub_title}
				showActions={false}
			/>
		);
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H2'>Add User</CustomText>
				<Icon size='24' iconName='IconX' sx={{ cursor: 'pointer' }} onClick={() => set_open(false)} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Button onClick={() => set_open(false)} variant='outlined' sx={{ padding: '10px 24px' }}>
					Cancel
				</Button>
				<Button onClick={handleSubmit(on_submit)} sx={{ padding: '10px 24px' }}>
					{!_.isEmpty(data) ? 'Update' : 'Add'}
				</Button>
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<FormProvider {...methods}>
					<Grid display='flex' direction='column' gap={2} pt={0.5}>
						{_.map(report_config, (attribute: any) => {
							return (
								<Grid flex={1}>
									<FormBuilder
										placeholder={attribute?.name}
										label={attribute?.name}
										name={attribute?.id}
										validations={{
											required: Boolean(attribute?.required),
											number: attribute?.type === 'number',
											email: attribute?.type === 'email',
											...attribute?.validations,
										}}
										defaultValue={attribute?.value}
										disabled={attribute?.disabled}
										type={attribute?.type}
										options={attribute?.options ?? []}
										getValues={getValues}
										setValue={setValue}
									/>
								</Grid>
							);
						})}
					</Grid>
					<div style={dividerStyle}></div>
					<CustomText type='H3'> Specific Report Section</CustomText>
					<Grid borderRadius={'12px'} p={'2px'} bgcolor={background_colors.secondary}>
						<ToggleSwitchEditField
							name={'is_specific'}
							key={'is_specific'}
							defaultValue={data?.is_specific ?? false}
							label={'Is Specific Report'}
						/>
					</Grid>
					{watch('is_specific') && (
						<Grid display='flex' direction='column' gap={2}>
							{_.map(report_user_roles, (attribute: any) => {
								return (
									<Grid flex={1}>
										<FormBuilder
											placeholder={attribute?.name}
											label={attribute?.name}
											name={attribute?.id}
											validations={{
												required: Boolean(attribute?.required),
											}}
											defaultValue={attribute?.value}
											disabled={attribute?.disabled}
											type={attribute?.type}
											options={attribute?.id === 'users' ? users : roles ?? []}
											getValues={getValues}
											setValue={setValue}
										/>
									</Grid>
								);
							})}
						</Grid>
					)}
					<div style={dividerStyle}></div>
					<CustomText type='H3'> Filter Section</CustomText>
					<Grid borderRadius={'12px'} p={'2px'} bgcolor={background_colors.secondary}>
						<ToggleSwitchEditField
							name={'is_filter'}
							key={'is_filter'}
							defaultValue={!_.isEmpty(data?.filters)}
							label={'You want filter on this report'}
						/>
					</Grid>
					{watch('is_filter') && (
						<Grid display={'flex'} gap={2} direction={'column'}>
							<FormBuilder
								label={'Tenant ID'}
								name={'filters.tenant_id'}
								validations={{
									required: true,
								}}
								defaultValue={data?.filters?.tenant_id}
								type={'text'}
								getValues={getValues}
								setValue={setValue}
							/>
							<FormBuilder
								label={'Select Users'}
								name={'filters.user_id'}
								validations={{
									required: true,
								}}
								defaultValue={data?.filters?.user_id}
								type={'text'}
								getValues={getValues}
								setValue={setValue}
							/>
						</Grid>
					)}
				</FormProvider>
			</Grid>
		);
	};
	const handle_render_drawer = () => {
		return (
			<>
				{handle_render_toast()}
				<Grid className='drawer-container'>
					{handle_render_header()}
					<Divider className='drawer-divider' />
					{handle_render_drawer_content()}
					<Divider className='drawer-divider' />
					{handle_render_footer()}
				</Grid>
			</>
		);
	};
	return <Drawer width={480} open={open} onClose={() => set_open(false)} content={handle_render_drawer()} />;
};

export default AddEditReports;
