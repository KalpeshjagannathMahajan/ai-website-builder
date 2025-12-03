import { Grid } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';

interface MarkAsPaidProps {
	fields: any;
	set_attributes: any;
}

const MarkAsPaid = ({ set_attributes, fields }: MarkAsPaidProps) => {
	const methods = useForm({
		defaultValues: {},
	});

	const { control, getValues, setValue } = methods;

	const handle_change = (e: any) => {
		const { name, value } = e.target;
		set_attributes((prev: any) => ({ ...prev, [name]: value?.substring(0, 100) }));
	};

	return (
		<Grid display='flex' direction='column' gap={2}>
			<FormProvider {...methods}>
				{fields.map((field: any) => {
					return (
						<FormBuilder
							placeholder={field.name}
							label={field.name}
							name={field.id}
							validations={{
								required: Boolean(false),
							}}
							defaultValue={field.value}
							type={field.type}
							options={field.options}
							control={control}
							register={methods.register}
							getValues={getValues}
							setValue={setValue}
							disableFuture={field.type === 'date'}
							onChangeCapture={(e: any) => handle_change(e)}
						/>
					);
				})}
			</FormProvider>
		</Grid>
	);
};

export default MarkAsPaid;
