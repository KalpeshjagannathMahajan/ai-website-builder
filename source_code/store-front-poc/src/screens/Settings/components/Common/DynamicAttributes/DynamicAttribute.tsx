import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid } from 'src/common/@the-source/atoms';
import ToggleSwitchEditField from 'src/common/@the-source/atoms/FieldsNew/ToggleSwitchEditField';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { colors } from 'src/utils/theme';
import { tenants_dynamic_attr_config } from './configHelpers';

interface DynamicAttributeProps {
	data: any;
	is_dynamic_attribute: boolean;
}

const DynamicAttribute: React.FC<DynamicAttributeProps> = ({ data, is_dynamic_attribute = false }) => {
	const [dynamic_attrs_options, set_dynamic_attrs_options] = useState<any>([]);
	const methods = useForm();
	const { control, getValues, setValue } = methods;

	useEffect(() => {
		if (!data) return;
		const dtype_options = tenants_dynamic_attr_config?.[data?.type] || [];
		const options = _.map(dtype_options, (item: any) => ({
			label: item,
			value: item,
		}));
		set_dynamic_attrs_options(options);
	}, [data]);

	return (
		<Grid
			sx={{
				background: colors.grey_600,
				borderRadius: '12px',
				padding: '2px',
			}}>
			<ToggleSwitchEditField name='dynamic_attribute' key='dynamic_attribute' value={data?.dynamic_attribute} label='Set as dynamic' />
			{is_dynamic_attribute && (
				<FormBuilder
					placeholder='Select attribute class'
					label='Attribute class'
					name='attribute_class'
					validations={{ required: true }}
					type={'select'}
					control={control}
					register={methods.register}
					getValues={getValues}
					setValue={setValue}
					options={dynamic_attrs_options}
				/>
			)}
		</Grid>
	);
};

export default DynamicAttribute;
