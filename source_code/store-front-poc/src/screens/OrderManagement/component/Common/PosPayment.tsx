import { Grid } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import PosPaymentImage from 'src/assets/images/PosPayment.svg';
import { Image } from 'src/common/@the-source/atoms';
import { useEffect } from 'react';

interface PosPaymentProps {
	field: any;
	set_attributes: any;
}

const PosPayment = ({ set_attributes, field }: PosPaymentProps) => {
	const methods = useForm({
		defaultValues: {},
	});

	const { control, getValues, setValue } = methods;

	const handle_change = (e: any) => {
		const { name, value } = e.target;
		set_attributes((prev: any) => ({ ...prev, [name]: value }));
	};

	useEffect(() => {
		set_attributes((prev: any) => ({ ...prev, terminal_id: field.value || field?.options?.[0]?.value }));
	}, [field]);

	return (
		<Grid display='flex' direction='column' gap={2}>
			<FormProvider {...methods}>
				{/* {fields.map((field: any) => { */}
				{/* return ( */}
				<FormBuilder
					placeholder={field.name}
					label={field.name}
					name={field.id}
					validations={{
						required: Boolean(false),
					}}
					defaultValue={field.value || field?.options?.[0]?.value}
					type={field.type}
					options={field.options}
					control={control}
					register={methods.register}
					getValues={getValues}
					setValue={setValue}
					disableFuture={field.type === 'date'}
					onChangeCapture={(e: any) => handle_change(e)}
					show_clear={false}
				/>
				{/* ); */}
				{/* })} */}
			</FormProvider>
			<Image style={{ marginTop: '3rem' }} src={PosPaymentImage} width='100%' height={'auto'} />
		</Grid>
	);
};

export default PosPayment;
