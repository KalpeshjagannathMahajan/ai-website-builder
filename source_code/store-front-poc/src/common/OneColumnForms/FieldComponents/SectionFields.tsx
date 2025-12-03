import TextEditField from 'src/common/@the-source/atoms/FieldsNew/TextEditField';
import { makeStyles } from '@mui/styles';
import { get_validators } from '../helper';
import SelectEditField from 'src/common/@the-source/atoms/FieldsNew/SelectEditField';
import DateEditField from 'src/common/@the-source/atoms/FieldsNew/DateEditField';
import PhoneNumberEditField from 'src/common/@the-source/atoms/FieldsNew/PhoneNumberEditField';
import RadioGroup from 'src/common/@the-source/molecules/RadioGroup';
import MultiSelectEditField from 'src/common/@the-source/atoms/FieldsNew/MultiSelectEditField';
import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import _ from 'lodash';

interface Attribute {
	key: string;
	name: string;
	type: string;
	dType: string;
	value: any;
	priority: number;
	required: boolean;
	attribute_id: string;
	options: [];
	disabled?: boolean;
}
interface SectionsProps {
	attributes: Attribute[];
	getValues?: any;
	setValue?: any;
	register?: any;
	fetchFromForm?: boolean;
	multi_select_value?: String;
	clearErrors: any;
}

const useStyles = makeStyles(() => ({
	inputField: {
		padding: '10px 0',
		width: '100%',

		'.MuiFormControl-root': {
			width: '100% !important',
		},
	},
}));

const SectionFields = ({
	attributes,
	getValues,
	setValue,
	register,
	fetchFromForm = true,
	multi_select_value,
	clearErrors,
}: SectionsProps) => {
	const styles = useStyles();
	const [show_multi_select, set_show_multi_select] = useState<boolean>(false);
	const additional_attributes = _.chain(attributes?.[0]?.options)
		?.find((option) => option?.value === 'select')
		?.get('additional_attributes[0]')
		?.value();

	useEffect(() => {
		const dtype_attribute = _.find(attributes, { dType: 'radio' });
		if (dtype_attribute?.value === 'select' || _.isArray(dtype_attribute?.value)) set_show_multi_select(true);
	}, []);

	return (
		<div>
			{attributes.map((attribute: any) => {
				switch (attribute.dType) {
					case 'textarea':
					case 'text':
					case 'number':
						return (
							<div className={styles.inputField} key={attribute.key}>
								{attribute.type === 'phone' ? (
									<PhoneNumberEditField
										defaultValue={attribute.value}
										sx={{ width: '100%' }}
										name={attribute.key}
										label={attribute.name}
										type={attribute.type}
										validations={{
											required: Boolean(attribute.required),
											number: attribute?.type === 'number',
											email: attribute?.id === 'email',
											phone: attribute?.type === 'phone',
										}}
										register={register}
										getValues={getValues}
										setValue={setValue}
										show_copy_drawer={false}
									/>
								) : (
									<TextEditField
										sx={{ width: '100%' }}
										name={attribute.key}
										label={attribute.name}
										type={attribute.type}
										multiline={attribute.dType === 'textarea' ? true : false}
										validations={get_validators(attribute.type, attribute.required, attribute.name)}
										defaultValue={attribute.value}
										disabled={attribute.disabled}
									/>
								)}
							</div>
						);
					case 'select':
						return (
							<div className={styles.inputField} key={attribute.key}>
								{Array.isArray(attribute?.options) && (
									<SelectEditField
										style={{ width: '100%' }}
										name={attribute.key}
										defaultValue={attribute?.value}
										label={attribute.name}
										options={attribute?.options || []}
										validations={get_validators(attribute.type, attribute.required, attribute.name)}
										disabled={attribute?.disabled}
									/>
								)}
							</div>
						);
					case 'date':
						return (
							<DateEditField
								validations={{
									required: attribute.required,
								}}
								name={attribute?.name}
								key={attribute?.key}
								label={attribute.name}
								type='responsive'
							/>
						);

					case 'radio':
						const val = getValues(attribute?.key);
						if (!val) setValue(attribute?.key, attribute?.options?.[0]?.value);
						const radio_value = _.isArray(attribute.value) ? 'select' : attribute?.value;
						return (
							<Grid container gap={2}>
								<RadioGroup
									selectedOption={radio_value || attribute?.options?.[0]?.value}
									options={attribute?.options || []}
									onChange={(newValue) => {
										if (newValue === 'select') {
											setValue(attribute?.key, multi_select_value);
											set_show_multi_select(true);
										} else {
											setValue(attribute?.key, newValue);
											set_show_multi_select(false);
											clearErrors(attribute?.key);
										}
									}}
								/>
								{show_multi_select && additional_attributes && (
									<MultiSelectEditField
										style={{ width: '100%' }}
										name={attribute?.key}
										label={additional_attributes?.name}
										type='multi_select'
										options={additional_attributes?.value || []}
										defaultValue={
											multi_select_value || _.filter(additional_attributes?.value, { toggle: true }).map((item) => item.value) || []
										}
										complex
										checkmarks
										handleChange={(values) => setValue(attribute?.key, values)}
										fetchFromForm={fetchFromForm}
										validations={{
											required: show_multi_select,
										}}
									/>
								)}
							</Grid>
						);

					default:
						return null;
				}
			})}
		</div>
	);
};

export default SectionFields;
