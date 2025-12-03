import React, { useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Drawer, Grid, Icon, Button } from 'src/common/@the-source/atoms';
import { Divider } from '@mui/material';
import _ from 'lodash';
import RadioGroup from 'src/common/@the-source/molecules/RadioGroup';
import { FormProvider, useForm } from 'react-hook-form';
import {
	ALLOWED_ADDING_DOCUMENT_ATTR_KEYS,
	BACKFLOW_PERMISSION_ALLOWED_ATTRIBUTES,
	include_type,
	include_type_add_permission_options,
} from 'src/screens/Settings/utils/constants';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';

interface Props {
	drawer: boolean;
	set_drawer: (state: boolean) => void;
	data: any;
	user_options: any[];
	roles_option: any[];
	on_save: any;
}

const options: any[] = [
	{ value: 'all', label: 'All' },
	{ value: 'specific', label: 'Specific' },
	{ value: 'none', label: 'None' },
];

const dividerStyle: React.CSSProperties = {
	height: '1px',
	background: 'repeating-linear-gradient(90deg,#D1D6DD 0 4px,#0000 0 8px)',
	margin: '1rem 0',
};

const radio_styling = { display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' };

const EditAttPermission = ({ drawer, set_drawer, data, user_options, on_save, roles_option }: Props) => {
	const get_permission_value = (key: string) => {
		if (_.isEmpty(data?.[key])) return 'none';
		else if (_.find(data?.[key], (item) => item?.value === 'all')) {
			return 'all';
		} else {
			return 'specific';
		}
	};
	const [back_flow_permission_length, set_back_flow_permission_length] = useState<string>(get_permission_value('back_flow_permission'));
	const [editing_permission_length, set_editing_permission_length] = useState<string>(get_permission_value('edit_permissions'));
	const [roles_back_flow_permission_length, set_roles_back_flow_permission_length] = useState<string>(
		get_permission_value('roles_back_flow_permission'),
	);
	const [roles_editing_permission_length, set_roles_editing_permission_length] = useState<string>(
		get_permission_value('roles_edit_permissions'),
	);
	const [adding_permission_val, set_adding_permission_val] = useState<string>(get_permission_value('add_permissions'));
	const [roles_adding_permission_val, set_roles_adding_permission_val] = useState<string>(get_permission_value('roles_add_permissions'));
	const attribute_key = _.get(data, 'id');
	const show_add_permission_options = _.includes(ALLOWED_ADDING_DOCUMENT_ATTR_KEYS, attribute_key);

	const methods = useForm({
		defaultValues: {
			users_with_edit_permissions: _.map(data?.edit_permissions, (item: any) => item?.value),
			roles_with_edit_permissions: _.map(data?.roles_edit_permissions, (item: any) => item?.value),
			users_with_back_saving_permissions: _.map(data?.back_flow_permission, (item: any) => item?.value),
			roles_with_back_saving_permissions: _.map(data?.roles_back_flow_permission, (item: any) => item?.value),
			back_flow_permission_allowed: _.includes(BACKFLOW_PERMISSION_ALLOWED_ATTRIBUTES, data?.id)
				? _.isEmpty(data?.users_with_back_saving_permissions) && _.isEmpty(data?.roles_with_back_saving_permissions)
					? 'no'
					: 'yes'
				: 'no',
			...(show_add_permission_options && {
				users_with_add_permissions: _.map(data?.add_permissions, (item: any) => item?.value),
				roles_with_add_permissions: _.map(data?.roles_add_permissions, (item: any) => item?.value),
			}),
		},
	});
	const {
		control,
		getValues,
		setValue,
		watch,
		handleSubmit,
		formState: { errors },
		clearErrors,
	} = methods;
	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'> Edit {data?.name}</CustomText>
				<Icon iconName='IconX' onClick={() => set_drawer(false)} />
			</Grid>
		);
	};

	useEffect(() => {
		if (watch('back_flow_permission_allowed') === 'no') {
			setValue('users_with_back_saving_permissions', []);
			setValue('roles_with_back_saving_permissions', []);
		}
		if (back_flow_permission_length === 'all') {
			setValue('users_with_back_saving_permissions', ['all']);
			clearErrors('users_with_back_saving_permissions');
		}
		if (roles_back_flow_permission_length === 'all') {
			setValue('roles_with_back_saving_permissions', ['all']);
			clearErrors('roles_with_back_saving_permissions');
		}
		if (editing_permission_length === 'all') {
			setValue('users_with_edit_permissions', ['all']);
			clearErrors('users_with_edit_permissions');
		}
		if (roles_editing_permission_length === 'all') {
			setValue('roles_with_edit_permissions', ['all']);
			clearErrors('roles_with_edit_permissions');
		}
		if (show_add_permission_options && adding_permission_val === 'all') {
			setValue('users_with_add_permissions' as Parameters<typeof setValue>[0], ['all']);
		}
		if (show_add_permission_options && roles_adding_permission_val === 'all') {
			setValue('roles_with_add_permissions' as Parameters<typeof setValue>[0], ['all']);
		}
		// updating value for none
		if (back_flow_permission_length === 'none') {
			setValue('users_with_back_saving_permissions', []);
			clearErrors('users_with_back_saving_permissions');
		}
		if (roles_back_flow_permission_length === 'none') {
			setValue('roles_with_back_saving_permissions', []);
			clearErrors('roles_with_back_saving_permissions');
		}
		if (editing_permission_length === 'none') {
			setValue('users_with_edit_permissions', []);
			clearErrors('users_with_edit_permissions');
		}
		if (roles_editing_permission_length === 'none') {
			setValue('roles_with_edit_permissions', []);
			clearErrors('roles_with_edit_permissions');
		}
		if (show_add_permission_options && adding_permission_val === 'none') {
			setValue('users_with_add_permissions' as Parameters<typeof setValue>[0], []);
			clearErrors('users_with_add_permissions');
		}
		if (show_add_permission_options && roles_adding_permission_val === 'none') {
			setValue('roles_with_add_permissions' as Parameters<typeof setValue>[0], []);
			clearErrors('roles_with_add_permissions');
		}
	}, [
		watch('back_flow_permission_allowed'),
		back_flow_permission_length,
		editing_permission_length,
		roles_back_flow_permission_length,
		roles_editing_permission_length,
		setValue,
		adding_permission_val,
		roles_adding_permission_val,
	]);

	const add_permissions_component = show_add_permission_options && (
		<>
			<CustomText>User adding permission to :</CustomText>
			<RadioGroup
				selectedOption={adding_permission_val}
				options={options}
				onChange={(val: string) => set_adding_permission_val(val)}
				label_style={radio_styling}
			/>
			{adding_permission_val === 'specific' && (
				<FormBuilder
					placeholder='Select users'
					label='Select users'
					name='users_with_add_permissions'
					validations={{ required: true }}
					type='multi_select'
					options={user_options}
					control={control}
					register={methods.register}
					getValues={getValues}
					setValue={setValue}
					disabled={false}
				/>
			)}

			<div style={dividerStyle}></div>

			<CustomText>Roles adding permission to :</CustomText>
			<RadioGroup
				selectedOption={roles_adding_permission_val}
				options={options}
				onChange={(val: string) => set_roles_adding_permission_val(val)}
				label_style={radio_styling}
			/>
			{roles_adding_permission_val === 'specific' && (
				<FormBuilder
					placeholder='Select roles'
					label='Select roles'
					name='roles_with_add_permissions'
					validations={{ required: true }}
					type='multi_select'
					options={roles_option}
					control={control}
					register={methods.register}
					getValues={getValues}
					setValue={setValue}
					disabled={false}
				/>
			)}
			<div style={dividerStyle}></div>
		</>
	);
	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body' gap={1}>
				<FormProvider {...methods}>
					<CustomText>Roles editing permission to :</CustomText>
					<RadioGroup
						selectedOption={roles_editing_permission_length}
						options={options}
						onChange={(val: string) => set_roles_editing_permission_length(val)}
						label_style={radio_styling}
					/>
					{roles_editing_permission_length === 'specific' && (
						<FormBuilder
							placeholder='Select roles'
							label='Select roles'
							name='roles_with_edit_permissions'
							validations={{ required: true }}
							type='multi_select'
							options={roles_option}
							control={control}
							register={methods.register}
							getValues={getValues}
							setValue={setValue}
							disabled={false}
						/>
					)}

					<CustomText>User editing permission to :</CustomText>
					<RadioGroup
						selectedOption={editing_permission_length}
						options={options}
						onChange={(val: string) => set_editing_permission_length(val)}
						label_style={radio_styling}
					/>
					{editing_permission_length === 'specific' && (
						<FormBuilder
							placeholder='Select users'
							label='Select users'
							name='users_with_edit_permissions'
							validations={{ required: true }}
							type='multi_select'
							options={user_options}
							control={control}
							register={methods.register}
							getValues={getValues}
							setValue={setValue}
							disabled={false}
						/>
					)}

					<div style={dividerStyle}></div>

					{add_permissions_component}

					{_.includes(BACKFLOW_PERMISSION_ALLOWED_ATTRIBUTES, data?.id) && (
						<>
							<CustomText>Sync to customer permission</CustomText>
							<RadioGroup
								selectedOption={watch('back_flow_permission_allowed')}
								options={show_add_permission_options ? include_type_add_permission_options : include_type}
								onChange={(val: string) => setValue('back_flow_permission_allowed', val)}
								label_style={{ ...radio_styling, flexDirection: show_add_permission_options ? 'column' : 'row' }}
							/>
						</>
					)}

					{getValues().back_flow_permission_allowed === 'yes' && (
						<Grid>
							<CustomText>Give sync to customer permissions to users:</CustomText>
							<RadioGroup
								selectedOption={back_flow_permission_length}
								options={options}
								onChange={(val: string) => set_back_flow_permission_length(val)}
								label_style={radio_styling}
							/>

							{back_flow_permission_length === 'specific' && (
								<FormBuilder
									placeholder='Select users'
									label='Select users'
									name='users_with_back_saving_permissions'
									validations={{ required: true }}
									type='multi_select'
									options={user_options}
									control={control}
									register={methods.register}
									getValues={getValues}
									setValue={setValue}
								/>
							)}

							<div style={dividerStyle}></div>

							<CustomText>Give sync to customer permissions to roles:</CustomText>
							<RadioGroup
								selectedOption={roles_back_flow_permission_length}
								options={options}
								onChange={(val: string) => set_roles_back_flow_permission_length(val)}
								label_style={radio_styling}
							/>

							{roles_back_flow_permission_length === 'specific' && (
								<FormBuilder
									placeholder='Select roles'
									label='Select roles'
									name='roles_with_back_saving_permissions'
									validations={{ required: true }}
									type='multi_select'
									options={roles_option}
									control={control}
									register={methods.register}
									getValues={getValues}
									setValue={setValue}
								/>
							)}
						</Grid>
					)}
				</FormProvider>
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Button variant='outlined' onClick={() => set_drawer(false)}>
					Cancel
				</Button>
				<Button disabled={!_.isEmpty(errors)} onClick={() => handleSubmit(on_save(getValues(), data?.id))}>
					Save
				</Button>
			</Grid>
		);
	};

	const handle_render_content = () => {
		return (
			<Grid className='drawer-container'>
				{handle_render_header()}
				<Divider className='drawer-divider' />
				{handle_render_drawer_content()}
				<Divider className='drawer-divider' />
				{handle_render_footer()}
			</Grid>
		);
	};

	return (
		<>
			<Drawer
				anchor='right'
				width={480}
				open={drawer}
				onClose={() => set_drawer(false)}
				content={<React.Fragment>{handle_render_content()}</React.Fragment>}
			/>
		</>
	);
};
export default EditAttPermission;
