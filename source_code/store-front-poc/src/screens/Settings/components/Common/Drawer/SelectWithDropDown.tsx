/* eslint-disable @typescript-eslint/no-shadow */
import { Button, Grid, Icon, Switch } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import MovableList from './MovableList';
import { TextField } from '@mui/material';
import _ from 'lodash';

const SelectWithDropDown = ({ type, control, getValues, setValue, methods, option = [], toggle, set_toggle, is_product }: any) => {
	const [label, set_label] = useState<string>('');
	const [value, set_value] = useState<string>('');
	const [options, set_options] = useState<any>(option);
	const [update_option, set_update_option] = useState<any>({ label: '', value: '' });
	const [update_key, set_update_key] = useState<any>('');
	const [value_change, set_value_change] = useState<boolean>(false);
	const default_value = is_product
		? getValues()?.meta?.default_value
			? getValues()?.meta?.default_value
			: ''
		: getValues()?.value ?? _.head(options)?.value ?? '';

	const handle_add = () => {
		const updated_options = options ? [...options, { label, value }] : [{ label, value }];
		set_options(updated_options);
		setValue('options', updated_options);
		set_label('');
		set_value('');
		set_value_change(false);
	};

	const handle_drop = (list?: any) => {
		const updated_list = _.map(list, ({ label, key }) => ({ label, value: key }));
		set_options(updated_list);
		setValue('options', updated_list);
	};

	useEffect(() => {
		if (!_.isEmpty(default_value) && options?.length > 0) {
			set_toggle(true);
			setValue('value', default_value);
		} else {
			setValue('value', []);
			set_toggle(false);
		}
	}, [type, options]);

	useEffect(() => {
		if (!value_change) {
			let val = _.toLower(label?.replace(/ /g, '_'));
			set_value(val);
		}
	}, [label]);

	const handle_toggle = () => {
		set_toggle((prev: any) => !prev);
	};
	const handleDelete = (key: any) => {
		let curr_options = _.filter(options, (item: any) => item.value !== key);
		set_options(curr_options);
		setValue('options', curr_options);
		set_label('');
		set_value('');
	};

	const handleUpdate = () => {
		// update_key
		const updated_options = _.map(options, (item: any, ind: any) => {
			if (ind === update_key) {
				return update_option;
			} else {
				return item;
			}
		});
		set_options(updated_options);
		set_value_change(false);
		setValue('options', updated_options);
		set_update_key('');
		set_update_option({ label: '', value: '' });
	};

	return (
		<Grid container xs={12} py={1}>
			<Grid item xs={12}>
				<CustomText type='Subtitle'>Add dropdown values</CustomText>
				<Grid p={1} pt={2}>
					<MovableList
						onDrop={handle_drop}
						list={options?.map((option: any, ind: any) => ({
							node:
								update_key !== '' && update_key === ind ? (
									<Grid display='flex' flexDirection={'column'} gap={1} mt={1} width={'323px'}>
										<Grid container gap={1}>
											<TextField
												onChange={(e) => set_update_option((prev: {}) => ({ ...prev, label: e.target.value }))}
												label='Label'
												name='Label'
												value={update_option.label}
												sx={{ width: '100%' }}
											/>
											<TextField
												onChange={(e) => set_update_option((prev: {}) => ({ ...prev, value: e.target.value }))}
												label='Value'
												name='Value'
												value={update_option.value}
												sx={{ width: '100%' }}
											/>
										</Grid>
										<Button
											variant='text'
											onClick={handleUpdate}
											disabled={
												update_option?.label.trim() === '' ||
												update_option?.value.trim() === '' ||
												_.some(options, (item: any, idx: any) => item.value === update_option?.value && idx !== update_key)
											}
											sx={{ alignSelf: 'flex-start' }}>
											Update value
										</Button>
									</Grid>
								) : (
									<Grid>
										<CustomText type='Body'>{option?.label}</CustomText>
										<CustomText type='Caption' color='rgba(103, 109, 119, 1)'>
											{option?.value}
										</CustomText>
									</Grid>
								),
							label: option.label,
							onDelete: (key: any) => {
								if (update_key === '') handleDelete(key);
								else set_update_key('');
							},
							onEdit: () => {
								set_update_key(ind);
								set_update_option(option);
								set_value_change(true);
							},
							deleteable: update_key === '' || update_key === ind,
							dragable: true,
							editable: update_key === '',
							key: option?.value,
						}))}
					/>
				</Grid>
				<Grid mt={1} display='flex' direction='column' gap={1} alignItems='center' px={2}>
					<Grid display='flex' gap={1} alignItems='center'>
						<Icon iconName='IconGripVertical' color='rgba(103, 109, 119, 0.6)' />
						<TextField onChange={(e) => set_label(e.target.value)} label='Label' name='Label' value={label} sx={{ width: '323px' }} />
						<Icon iconName='IconX' color='rgba(103, 109, 119, 0.6)' />
					</Grid>
					<TextField
						onChange={(e) => {
							set_value_change(true);
							set_value(e.target.value);
						}}
						label='Value'
						name='Value'
						value={value}
						sx={{ width: '323px' }}
					/>
					<Button
						variant='text'
						onClick={handle_add}
						disabled={
							label.trim() === '' || value.trim() === '' || _.some(options, (item: any) => item.value === value) || update_key !== ''
						}
						sx={{ alignSelf: 'flex-start' }}>
						+ Dropdown value
					</Button>
				</Grid>
			</Grid>

			{options?.length > 0 && (
				<Grid item xs={12} justifyContent='space-between' display='flex' alignItems='center'>
					<CustomText type='Subtitle'>Default value</CustomText>
					<Switch onChange={handle_toggle} checked={toggle} />
				</Grid>
			)}

			{options?.length > 0 && toggle && (
				<FormBuilder
					placeholder='Select default value'
					label='Select default value'
					name='value'
					validations={{ required: true }}
					options={options}
					type={type}
					control={control}
					register={methods.register}
					getValues={getValues}
					setValue={setValue}
					renderValue={(selected: any) => {
						const selected_options =
							type === 'select'
								? _.find(options, (opt: any) => opt?.value === selected)?.label
								: _.map(selected, (item: any) => _.find(options, (opt: any) => opt?.value === item)?.label).join(', ');
						return <>{selected_options}</>;
					}}
				/>
			)}
		</Grid>
	);
};

export default SelectWithDropDown;
