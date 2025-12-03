import React from 'react';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { Attribute } from './interfaces';
import { Grid } from 'src/common/@the-source/atoms';
import { includes } from 'lodash';
import { useParams } from 'react-router-dom';

const RenderAttributes: React.FC<{
	attributes: Attribute[];
	getValues?: any;
	setValue?: any;
	sectionName: string;
	watch?: any;
	isEmailValid?: any;
}> = ({ attributes, getValues, setValue, sectionName, isEmailValid }) => {
	const all_values = getValues();
	const { action } = useParams();
	return (
		<>
			{attributes.map((attribute: any) => {
				if (sectionName === 'contacts') {
					const name = `${attribute?.id}`;
					if (
						name === 'is_default_billing_address' ||
						name === 'is_default_shipping_address' ||
						name === 'country_code' ||
						name === 'type'
					) {
						return;
					}
					const show_attribute = !includes(attribute?.exclude_display || [], action);
					if (show_attribute) {
						return (
							<Grid item xs={12}>
								<FormBuilder
									placeholder={attribute.name}
									label={attribute.name}
									name={`${sectionName}.${attribute.id}`}
									validations={{
										required: Boolean(attribute?.required),
										number: attribute.type === 'number',
										email: attribute.type === 'email',
										phone: attribute.type === 'phone',
									}}
									on_blur={attribute.type === 'email' && isEmailValid}
									disabled={attribute.disabled}
									defaultValue={all_values?.contacts?.[attribute?.id]}
									type={attribute.type}
									options={attribute.options}
									getValues={getValues}
									setValue={setValue}
								/>
							</Grid>
						);
					}
				} else if (sectionName === 'basic_details') {
					const show_attribute = !includes(attribute?.exclude_display || [], action);
					if (show_attribute) {
						return (
							<Grid item xs={12} key={attribute.id}>
								<FormBuilder
									placeholder={attribute.name}
									label={attribute.name}
									name={`${sectionName}.${attribute.id}`}
									validations={{
										required: Boolean(attribute.required),
										number: attribute.type === 'number',
										email: attribute.type === 'email',
										phone: attribute.type === 'phone',
									}}
									disabled={attribute.disabled}
									defaultValue={attribute.value}
									type={attribute.type}
									options={attribute.options}
									getValues={getValues}
									setValue={setValue}
								/>
							</Grid>
						);
					}
				} else {
					return (
						<Grid item xs={12} key={attribute.id}>
							<FormBuilder
								placeholder={attribute.name}
								label={attribute.name}
								name={`${sectionName}.${attribute.id}`}
								validations={{
									required: Boolean(attribute?.required),
									number: attribute.type === 'number',
									email: attribute.type === 'email',
									phone: attribute.type === 'phone',
								}}
								disabled={attribute.disabled}
								defaultValue={attribute.value}
								type={attribute.type}
								options={attribute.options}
								getValues={getValues}
								setValue={setValue}
							/>
						</Grid>
					);
				}
			})}
		</>
	);
};

export default RenderAttributes;
