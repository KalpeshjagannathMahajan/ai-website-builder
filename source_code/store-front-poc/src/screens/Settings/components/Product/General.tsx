import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Icon } from 'src/common/@the-source/atoms';
import { general_field } from './mock';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import _ from 'lodash';
import settings from 'src/utils/api_requests/setting';

const General = ({ data = {}, set_refetch }: any) => {
	const methods = useForm({
		defaultValues: { ...data },
	});

	const { control, getValues, setValue, handleSubmit } = methods;

	const [is_general_edit, set_is_general_edit] = useState<boolean>(false);

	const handle_save = () => {
		settings
			.update_general_settings(getValues())
			.then((res: any) => {
				console.log(res);
			})
			.catch((err: any) => {
				console.error(err);
			})
			.finally(() => {
				set_is_general_edit(false);
				set_refetch((prev: any) => ({ state: !prev.state, key: 'general', id: 'general', type: 'general' }));
			});
	};

	const handle_render_edit_field = () => {
		return (
			<FormProvider {...methods}>
				<Grid display='flex' flexWrap={'wrap'} gap={2}>
					{_.map(general_field, (field: any, index: number) => (
						<Grid width={'48%'} key={field.id}>
							<FormBuilder
								placeholder={field.name}
								label={field.name}
								name={field.id}
								validations={{ required: field.required }}
								type={field.type}
								defaultValue={data?.[field.id]}
								control={control}
								register={methods.register}
								getValues={getValues}
								setValue={setValue}
								multiline={index === 2}
								rows={7}
							/>
						</Grid>
					))}
				</Grid>
			</FormProvider>
		);
	};

	const handle_render_view_fields = () => {
		return (
			<Grid display='flex' direction='column' gap={2.4}>
				<Grid display='flex' gap={5}>
					<Grid display='flex' direction='column'>
						<CustomText color='rgba(103, 109, 119, 1)'>Company Name</CustomText>
						<CustomText>{data?.company_name || '--'}</CustomText>
					</Grid>
					<Grid display='flex' direction='column'>
						<CustomText color='rgba(103, 109, 119, 1)'>Website URL</CustomText>
						<CustomText>{data?.website || '--'}</CustomText>
					</Grid>
				</Grid>
				<Grid display='flex' direction='column' gap={1.2} alignItems='flex-start'>
					<CustomText color='rgba(23, 23, 23, 1)'>Address</CustomText>
					<Grid display='flex' direction='column' gap={0.4} p={2} border='1px solid rgba(0, 0, 0, 0.12)' borderRadius='8px'>
						{data?.company_address?.split('\n').map((line: string, index: number) => (
							<CustomText key={`line-${index}`}>
								{line}
								<br />
							</CustomText>
						))}
					</Grid>
				</Grid>
			</Grid>
		);
	};

	return (
		<Grid
			id='general'
			border='1px solid rgba(0, 0, 0, 0.12)'
			borderRadius='8px'
			display='flex'
			direction='column'
			gap='24px'
			px={2.4}
			py={2}>
			<Grid display='flex' justifyContent='space-between' alignItems='center'>
				<CustomText type='H6'>General settings</CustomText>
				{!is_general_edit && (
					<Icon
						iconName='IconEdit'
						sx={{
							cursor: 'pointer',
						}}
						color='rgba(103, 109, 119, 1)'
						onClick={() => set_is_general_edit(true)}></Icon>
				)}
			</Grid>
			{is_general_edit ? handle_render_edit_field() : handle_render_view_fields()}
			{is_general_edit && (
				<Grid display='flex' justifyContent='flex-end' gap={2}>
					<Button variant='outlined' onClick={() => set_is_general_edit(false)}>
						Cancel
					</Button>
					<Button onClick={handleSubmit(handle_save)}>Save</Button>
				</Grid>
			)}
		</Grid>
	);
};

export default General;
