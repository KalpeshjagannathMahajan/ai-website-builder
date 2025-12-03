import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { primary } from 'src/utils/light.theme';
import _ from 'lodash';
import { TextField } from '@mui/material';

const CustomContainerModal = ({
	custom_container_modal,
	selected_container,
	toggle_button_value,
	set_custom_container_modal,
	container_data,
	handle_change,
}: any) => {
	const [container_val, set_container_val] = useState(0);
	const methods = useForm({
		defaultValues: {
			capacity: container_val,
		},
	});

	const {
		watch,
		setValue,
		reset,
		handleSubmit,
		control,
		formState: { errors },
	} = methods;

	const show_reset_to_default = () => {
		const value = watch('capacity');
		return _.toNumber(value) !== container_val;
	};

	const handle_close = () => {
		set_custom_container_modal(false);
		reset();
	};

	const handle_submit = ({ capacity }: any) => {
		const container_capacity = _.get(selected_container, `container_volume_data[${toggle_button_value}]`, 0);
		if (container_capacity !== capacity) {
			const updated_container = {
				...selected_container,
				container_volume_data: {
					...selected_container?.container_volume_data,
					[toggle_button_value]: _.toNumber(capacity),
				},
			};

			handle_change('container', updated_container);
		}
		handle_close();
	};

	useEffect(() => {
		const original_container = _.find(container_data, (item) => item?.container_key === selected_container?.container_key);
		set_container_val(original_container?.container_volume_data?.[toggle_button_value]);
		setValue('capacity', selected_container?.container_volume_data?.[toggle_button_value]);
	}, [custom_container_modal]);

	return (
		<Modal
			width={450}
			open={custom_container_modal}
			onClose={handle_close}
			title={`Edit capacity for ${selected_container?.container_name}`}
			footer={
				<Grid container justifyContent='end'>
					<Button variant='outlined' onClick={handle_close} sx={{ marginRight: '1rem' }}>
						Cancel
					</Button>
					<Button onClick={handleSubmit(handle_submit)}>Done</Button>
				</Grid>
			}
			children={
				<FormProvider {...methods}>
					<Grid container sx={{ flexDirection: 'row', gap: '0.5rem', alignItems: 'center', margin: '0rem 0rem 2rem' }}>
						<CustomText>Capacity ({toggle_button_value})</CustomText>
						<Controller
							name='capacity'
							control={control}
							rules={{
								required: 'Capacity is required',
								validate: (value) => value > 1 || 'Capacity must be greater than 1',
							}}
							render={({ field }) => (
								<TextField
									{...field}
									fullWidth
									placeholder='Capacity'
									type='amount'
									error={Boolean(errors.capacity)}
									helperText={errors.capacity && errors.capacity.message}
								/>
							)}
						/>
					</Grid>
					<Grid mt={-1} mb={1}>
						{show_reset_to_default() && (
							<CustomText
								type='Subtitle'
								color={primary.main}
								style={{ cursor: 'pointer', width: 'fit-content' }}
								onClick={() => {
									setValue('capacity', container_val);
								}}>
								Reset to default capacity
							</CustomText>
						)}
					</Grid>
				</FormProvider>
			}
		/>
	);
};

export default CustomContainerModal;
