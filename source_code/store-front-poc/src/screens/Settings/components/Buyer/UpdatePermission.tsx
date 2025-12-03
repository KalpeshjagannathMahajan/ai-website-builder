import React, { useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Drawer, Grid, Icon, Button } from 'src/common/@the-source/atoms';
import { Divider } from '@mui/material';
import _ from 'lodash';
import RadioGroup from 'src/common/@the-source/molecules/RadioGroup';
import { FormProvider, useForm } from 'react-hook-form';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';

interface Props {
	drawer: boolean;
	set_drawer: (state: boolean) => void;
	data: any;
	user_options: any[];
	roles_options: any[];
	on_save: any;
}

const dividerStyle: React.CSSProperties = {
	height: '1px',
	background: 'repeating-linear-gradient(90deg,#D1D6DD 0 4px,#0000 0 8px)',
	margin: '1rem 0',
};

const PERMISSIONS_ARRAY = [
	'users_with_add_permissions',
	'roles_with_add_permissions',
	'users_with_edit_permissions',
	'roles_with_edit_permissions',
	'users_with_delete_permissions',
	'roles_with_delete_permissions',
	'max_number_of_entities',
];

const UpdatePermission = ({ drawer, set_drawer, data, user_options, roles_options, on_save }: Props) => {
	const sample_data: any = {};
	_.map(PERMISSIONS_ARRAY, (permission: any) => {
		if (data?.[permission] && permission === 'max_number_of_entities') {
			sample_data[permission] = data?.[permission];
		} else if (data?.[permission]) {
			let temprary_val = _.isEmpty(data?.[permission])
				? []
				: _.find(data?.[permission], (item: any) => item?.value === 'all')
				? 'all'
				: _.map(data?.[permission], (item: any) => item?.value);
			sample_data[permission] = temprary_val;
		}
	});
	const temp: any = {};
	_.map(PERMISSIONS_ARRAY, (permission: any) => {
		temp[permission] = _.isEmpty(data?.[permission])
			? 'none'
			: _.find(data?.[permission], (item: any) => item?.value === 'all')
			? 'all'
			: 'specific';
	});
	const [permission_state, set_permission_state] = useState<any>(temp);
	const methods = useForm({
		defaultValues: {
			...sample_data,
		},
	});
	const { control, getValues, setValue, handleSubmit } = methods;

	const handle_on_submit = () => {
		const value_data = { ...getValues(), max_number_of_entities: _.toInteger(getValues().max_number_of_entities) };

		on_save(value_data, data?.key);
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'> Edit {data?.name}</CustomText>
				<Icon iconName='IconX' onClick={() => set_drawer(false)} />
			</Grid>
		);
	};
	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body' gap={1}>
				<FormProvider {...methods}>
					{_.map(PERMISSIONS_ARRAY, (permission: any) => {
						const form_option = permission.includes('roles') ? roles_options : user_options;
						const form_label = permission.includes('roles') ? 'Select Role' : 'Select User';
						const permission_name = _.capitalize(permission?.replaceAll('_', ' '));

						if (data?.[permission] && permission === 'max_number_of_entities') {
							return (
								<>
									<CustomText style={{ marginBottom: '10px' }}>{`${permission_name} to:`}</CustomText>
									<FormBuilder
										placeholder={'Max number of entities'}
										label={'Max number of entities'}
										name={permission}
										validations={{ required: true }}
										type='number'
										control={control}
										register={methods.register}
										getValues={getValues}
										setValue={setValue}
										disabled={false}
									/>
									<div style={dividerStyle}></div>
								</>
							);
						} else if (data?.[permission]) {
							return (
								<>
									<CustomText>{`${permission_name} to:`}</CustomText>
									<RadioGroup
										selectedOption={permission_state?.[permission]}
										options={[
											{ value: 'all', label: 'All' },
											{ value: 'specific', label: 'Specific' },
											{ value: 'none', label: 'None' },
										]}
										onChange={(val: string) => {
											if (val === 'all') {
												setValue(permission, 'all');
											} else if (val === 'none') {
												setValue(permission, []);
											}
											set_permission_state((prev: any) => {
												return { ...prev, [permission]: val };
											});
										}}
										label_style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}
									/>
									{permission_state?.[permission] === 'specific' && (
										<FormBuilder
											placeholder={form_label}
											label={form_label}
											name={permission}
											validations={{ required: true }}
											type='multi_select'
											options={form_option}
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
						}
					})}
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
				<Button onClick={handleSubmit(handle_on_submit)}>Save</Button>
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
export default UpdatePermission;
