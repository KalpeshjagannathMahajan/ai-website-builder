import size from 'lodash/size';
import map from 'lodash/map';
import { FormProvider, useForm } from 'react-hook-form';
import { Grid } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { ACH_EDIT_FORM_FIELDS } from 'src/screens/BuyerLibrary/constants';

interface Props {
	height?: string;
	ach_payment_values?: any;
}

const EditAchPaymentFields = ({ height, ach_payment_values }: Props) => {
	const methods = useForm();
	const { control, getValues, setValue } = methods;

	const render_field = (attribute: any, index: number) => {
		return (
			<Grid mb={index === size(ACH_EDIT_FORM_FIELDS) - 1 ? 0 : 2.5} key={index}>
				<FormBuilder
					placeholder={attribute?.name}
					label={attribute?.label}
					name={attribute?.id}
					validations={{
						required: !attribute?.disabled && Boolean(attribute?.required),
					}}
					defaultValue={ach_payment_values?.[attribute?.id] ?? '******'}
					type={attribute?.type}
					options={attribute?.options}
					control={control}
					register={methods.register}
					getValues={getValues}
					setValue={setValue}
					disabled={attribute?.disabled}
					is_payment={true}
				/>
			</Grid>
		);
	};

	return (
		<Grid height={height} width='100%'>
			<FormProvider {...methods}>{map(ACH_EDIT_FORM_FIELDS, (attribute: any, i: number) => render_field(attribute, i))}</FormProvider>
		</Grid>
	);
};

export default EditAchPaymentFields;
