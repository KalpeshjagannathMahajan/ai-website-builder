import React, { useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Divider, TextField } from '@mui/material';
import { Box, Grid, Button, Icon, Drawer } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { get, sortBy } from 'lodash';
import SettingsContext from '../../context';

interface DisplayDrawerProps {
	open: boolean;
	onClose: () => void;
	section_key: string;
	set_is_loading?: any;
}

interface Field {
	name: string;
	key: string;
	display_priority: number;
}

const disabled_fields = ['first_name', 'last_name'];

const DisplayDrawer: React.FC<DisplayDrawerProps> = ({ open, onClose, section_key, set_is_loading }) => {
	const { configure, update_org_setting_configuration } = useContext(SettingsContext);
	const get_section_data: Field[] = get(configure?.display_priority, section_key) || [];
	const sorted_section_data = sortBy(get_section_data, 'display_priority', 'asc');

	const { control, handleSubmit } = useForm({
		defaultValues: {
			fields: sorted_section_data.map((field) => ({
				key: field.key,
				display_priority: field.display_priority,
			})),
		},
	});

	const onSubmit = (data: any) => {
		set_is_loading(true);
		const updatedPriority = data.fields.reduce((acc: any, field: any) => {
			if (field.key !== null) {
				acc[field.key] = Number(field.display_priority);
			}
			return acc;
		}, {});

		const transformed_data = {
			entity: section_key,
			updated_priority: updatedPriority,
		};

		update_org_setting_configuration('display_priority', transformed_data);

		onClose();
	};

	const header_name = section_key === 'addresses' ? 'Addresses' : 'Contacts';

	const drawer_content = (
		<Box sx={{ background: '#fff', height: '100vh' }}>
			{/* Header */}
			<Grid container p={2}>
				<Grid item>
					<CustomText type='H6'>{header_name} display card setting</CustomText>
				</Grid>
				<Grid item ml='auto'>
					<Icon onClick={onClose} iconName='IconX' sx={{ cursor: 'pointer' }} />
				</Grid>
			</Grid>
			<Divider />
			<Box sx={{ height: '83vh', overflowY: 'auto' }}>
				<Box m={2.5} sx={{ lineHeight: '20px' }}>
					<CustomText type='Body'>Select the order in which you want to display the fields on the {section_key} card</CustomText>
				</Box>
				<Grid container px={2}>
					<Grid item ml={1}>
						<CustomText type='Subtitle'>Field</CustomText>
					</Grid>
					<Grid item ml='auto' mr={1}>
						<CustomText type='Subtitle'>Priority</CustomText>
					</Grid>
				</Grid>
				<form>
					{sorted_section_data.map((attr, index) => {
						if (attr?.key === 'country_code') {
							return null;
						}

						return (
							<Box
								key={attr.key}
								m={2}
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									padding: '12px',
									width: '95%',
								}}>
								{/* Field Name */}
								<CustomText type='Body'>{attr.name}</CustomText>
								{/* Priority Input */}
								<Controller
									name={`fields.${index}.display_priority`}
									control={control}
									rules={{ required: 'Required' }}
									render={({ field, fieldState: { error } }) => (
										<TextField
											{...field}
											type='number'
											variant='outlined'
											size='small'
											error={!!error}
											disabled={disabled_fields?.includes(attr.key)}
											helperText={<p>{error ? error.message : null}</p>}
											InputProps={{
												inputProps: { min: 1 },
											}}
											sx={{ width: '60px' }}
										/>
									)}
								/>
							</Box>
						);
					})}
					{/* Footer */}
					<Box sx={{ width: '400px', position: 'fixed', bottom: 10 }}>
						<Divider />
						<Grid container>
							<Grid item ml='auto' mt={1}>
								<Button variant='contained' type='submit' onClick={handleSubmit(onSubmit)}>
									Save
								</Button>
							</Grid>
						</Grid>
					</Box>
				</form>
			</Box>
		</Box>
	);

	return <Drawer open={open} onClose={onClose} title={section_key} content={drawer_content} />;
};

export default DisplayDrawer;
