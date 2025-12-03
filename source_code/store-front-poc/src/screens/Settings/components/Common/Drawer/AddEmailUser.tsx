import { Divider } from '@mui/material';
import _ from 'lodash';
import { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import SettingsContext from 'src/screens/Settings/context';
import { email_config } from 'src/screens/Settings/utils/constants';

const AddEmailUser = ({ open, set_open, user, user_data }: any) => {
	const methods = useForm({ defaultValues: user });
	const { configure, update_configuration } = useContext(SettingsContext);
	const { getValues, setValue, handleSubmit } = methods;

	const handle_user = () => {
		let new_user = getValues();
		const is_present = _.some(user_data, (item) => item?.email === new_user?.email);
		let temp: any[] = _.isArray(user_data) ? user_data : [];

		if (!_.isEmpty(user)) {
			const findIndex = temp?.findIndex((cat: any) => cat === user);
			temp.splice(findIndex, 1);
		}

		if (_.isEmpty(user) && is_present) {
			const findIndex = temp?.findIndex((cat: any) => cat?.email === user?.email);
			temp.splice(findIndex, 1);
		}

		temp = _.isArray(temp) ? [...temp, new_user] : [new_user];
		if (temp?.length === 1) {
			temp = _.map(temp, (item) => {
				return { ...item };
			});
		}
		let new_settings = { ...configure?.emailer_settings, emails: temp };
		update_configuration('emailer_settings', new_settings);
		set_open(false);
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
				<Button onClick={handleSubmit(handle_user)} sx={{ padding: '10px 24px' }}>
					{!_.isEmpty(user) ? 'Update' : 'Add'}
				</Button>
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<FormProvider {...methods}>
					<Grid display='flex' direction='column' gap={2}>
						{_.map(email_config, (attribute: any) => {
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
				</FormProvider>
			</Grid>
		);
	};
	const handle_render_drawer = () => {
		return (
			<Grid className='drawer-container'>
				{handle_render_header()}
				<Divider sx={{ width: 'calc(100% + 40px)', marginLeft: '-20px' }} />
				{handle_render_drawer_content()}
				<Divider sx={{ width: 'calc(100% + 40px)', marginLeft: '-20px' }} />
				{handle_render_footer()}
			</Grid>
		);
	};
	return <Drawer width={480} open={open} onClose={() => set_open(false)} content={handle_render_drawer()} />;
};

export default AddEmailUser;
