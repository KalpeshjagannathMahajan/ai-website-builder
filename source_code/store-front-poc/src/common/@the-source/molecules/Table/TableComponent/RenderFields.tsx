import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '../../../atoms';
import {
	DecimalEditField,
	NumberEditField,
	TextEditField,
	MultiSelectEditField,
	SelectEditField,
	PriceEditField,
	SizeEditField,
	CategoryEditField,
	TagEditField,
	DateEditField,
	HtmlEditField,
	ImageTextEditField,
} from 'src/common/@the-source/atoms/Fields';
import { forwardRef } from 'react';

interface RenderFieldsProps {
	rowId: string;
	value: any;
	colDef: any;
	onChange: (eventOrValue: any) => void;
	defaultMap: any[];
	compositeKey: any;
}

const RenderFields = forwardRef<HTMLDivElement, RenderFieldsProps>(({ rowId, value, colDef, onChange, defaultMap, compositeKey }, ref) => {
	let type = colDef?.dtype;
	const methods = useForm({ mode: 'onChange' });

	const handleRenderFields = () => {
		switch (type) {
			case 'text':
				return (
					<TextEditField
						field_key={`${rowId}`}
						name=''
						refInput={ref}
						handleChange={onChange}
						onError={(message) => console.log(message)}
						required={true}
						dType={type}
						value={value}
						compositeKey={compositeKey}
					/>
				);
			case 'number':
				return (
					<NumberEditField
						field_key={`${rowId}`}
						name=''
						refInput={ref}
						handleChange={onChange}
						onError={(message) => console.log(message)}
						required={true}
						dType={type}
						value={value}
					/>
				);
			case 'decimal':
				return (
					<DecimalEditField
						field_key={`${rowId}`}
						name=''
						refInput={ref}
						handleChange={onChange}
						onError={(message) => console.log(message)}
						required={true}
						dType={type}
						value={value}
					/>
				);
			case 'singleSelect':
				return (
					<SelectEditField
						style={{ width: 200, backgroundColor: 'white' }}
						field_key={`${rowId}`}
						name={''}
						refInput={ref}
						handleChange={onChange}
						onError={(message) => console.log(message)}
						required={true}
						dType={type}
						value={value}
						options={defaultMap}
					/>
				);
			case 'multiSelect':
				return (
					<MultiSelectEditField
						options={defaultMap}
						value={value}
						error={false}
						handleChange={onChange}
						field_key={`${rowId}`}
						name=''
						complex={false}
						style={{ width: 200 }}
						dType='multiSelect'
						refInput={ref}
						required={true}
						onError={(message) => console.log(message)}
					/>
				);
			case 'textarea':
				return (
					<TextEditField
						field_key={`${rowId}`}
						name=''
						rows={4}
						refInput={ref}
						handleChange={onChange}
						onError={(message) => console.log(message)}
						required={true}
						dType={type}
						value={value}
						compositeKey={compositeKey}
					/>
				);
			case 'tags':
				return (
					<TagEditField
						field_key={`${rowId}`}
						name=''
						refInput={ref}
						handleChange={onChange}
						required={true}
						dType={type}
						filterName='Tags'
						value={value}
						options={defaultMap}
						onError={(message: any) => console.log(message)}
						onUpdate={(val: any) => console.log(val)}
						onClear={() => console.log('cleared')}
						style={{ backgroundColor: 'white' }}
					/>
				);
			case 'price':
				return (
					<PriceEditField
						field_key={`${rowId}`}
						name=''
						refInput={ref}
						handleChange={onChange}
						onError={(message) => console.log(message)}
						required={true}
						dType={type}
						value={value?.amount}
						startIcon={'IconCurrencyDollar'}
					/>
				);
			case 'category':
				return (
					<CategoryEditField
						field_key={`${rowId}`}
						name=''
						refInput={ref}
						handleChange={onChange}
						required={true}
						dType={type}
						value={value}
						appiled={value}
						label='testing'
					/>
				);
			case 'size':
			case 'uom':
				return (
					<SizeEditField
						field_key={`${rowId}`}
						name=''
						refInput={ref}
						handleChange={onChange}
						onError={(message) => console.log(message)}
						required={true}
						dType={type}
						options={defaultMap}
						style={{ width: 200, backgroundColor: 'white' }}
						value={value}
						compositeKey={compositeKey}
					/>
				);
			case 'date':
				return (
					<DateEditField
						field_key={`${rowId}`}
						name=''
						refInput={ref}
						type={'responsive'}
						required={true}
						dType={type}
						variant='date'
						value={value}
						handleChange={onChange}
					/>
				);
			case 'url':
				return (
					<TextEditField
						field_key={`${rowId}`}
						name=''
						rows={1}
						refInput={ref}
						handleChange={onChange}
						onError={(message) => console.log(message)}
						required={true}
						dType={type}
						value={value}
						compositeKey='url'
					/>
				);
			case 'imageText':
				return (
					<ImageTextEditField
						style={{ width: 200, backgroundColor: 'white' }}
						field_key={`${rowId}`}
						name={''}
						refInput={ref}
						handleChange={onChange}
						onError={(message) => console.log(message)}
						required={true}
						dType={type}
						value={value}
						options={defaultMap}
					/>
				);
			case 'html':
				return (
					<HtmlEditField field_key={`${rowId}`} name='' refInput={ref} handleChange={onChange} required={true} dType={type} value={value} />
				);
			default:
				return <Input ref={ref} children={null} onChange={onChange} variant='outlined' label='' value={value} />;
		}
	};

	return <FormProvider {...methods}>{handleRenderFields()}</FormProvider>;
});

export default RenderFields;
