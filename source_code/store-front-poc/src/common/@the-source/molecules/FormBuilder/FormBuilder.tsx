import PhoneNumberEditField from '../../atoms/FieldsNew/PhoneNumberEditField';
import CheckboxEditField from '../../atoms/FieldsNew/CheckboxEditField';
import SelectEditField from '../../atoms/FieldsNew/SelectEditField';
import TextEditField from '../../atoms/FieldsNew/TextEditField';
import MultiSelectEditField from '../../atoms/FieldsNew/MultiSelectEditField';
import RadioEditField from '../../atoms/FieldsNew/RadioEditField';
import DateEditField from '../../atoms/FieldsNew/DateEditField';
import ToggleSwitchEditField from '../../atoms/FieldsNew/ToggleSwitchEditField';
import { Grid, Icon } from '../../atoms';
import PhoneNumberE164EditField from '../../atoms/FieldsNew/PhoneNumberE164EditField';
import CalculateButton from 'src/common/CalculateDynamicAttribute';

const end_percentage_icon = () => {
	return (
		<Icon
			iconName='IconPercentage'
			color='#16885F'
			sx={{
				height: '30px',
				width: '28px',
				paddingY: 1.6,
				paddingLeft: 1.2,
				borderLeft: '1px solid #D1D6DD',
			}}
		/>
	);
};

const FormBuilder = (props: any) => {
	const { is_dynamic_attribute = false, has_dynamic_attrs = false, attribute_id = '', name = '' } = props;

	const render_form_fields_by_type = () => {
		switch (props.type) {
			case 'text':
			case 'number':
				return (
					<TextEditField sx={{ width: '100%', ...props.style }} onChangeCapture={props?.on_change} autoFocus={props.autoFocus} {...props} />
				);
			case 'amount':
			case 'email':
				return <TextEditField sx={{ width: '100%' }} onChangeCapture={props?.on_change} autoFocus={props.autoFocus} {...props} />;
			case 'textarea':
			case 'html':
			case 'long_text':
				return <TextEditField required={props.validations.required} multiline={true} sx={{ width: '100%' }} {...props} />;
			case 'multi_select':
				return (
					<MultiSelectEditField
						style={{ width: '100%' }}
						{...props}
						options={props?.options ?? props?.configuration?.options}
						onChangeCapture={props?.on_change}
						complex={true}
						required={props.validations.required}
						checkmarks={true}
						disabled={props.disabled}
					/>
				);
			case 'percentage':
				return (
					<TextEditField
						sx={{ width: '100%', background: '#FFF' }}
						onChangeCapture={props?.on_change}
						autoFocus={props.autoFocus}
						{...props}
						end_icon={end_percentage_icon()}
					/>
				);
			case 'radio':
				return <RadioEditField data={props} />;
			case 'select':
			case 'single_select':
				return (
					<SelectEditField
						required={props.validations.required}
						options={props?.options ?? props?.configuration?.options}
						sx={{ width: '99%' }}
						defaultValue={props?.getValues ? props?.getValues(name) : ''}
						{...props}
					/>
				);
			case 'checkbox':
				return <CheckboxEditField required={props.validations.required} sx={{ width: '100%' }} {...props} />;
			case 'switch':
				return <ToggleSwitchEditField required={props.validations.required} sx={{ width: '100%' }} {...props} />;
			case 'phone':
				return (
					<PhoneNumberEditField
						disabled={props.disabled}
						required={props.validations.required}
						is_edit_mode={props.is_edit_mode}
						defaultValue={props.defaultValue}
						{...props}
					/>
				);
			case 'phone_e164':
				return (
					<PhoneNumberE164EditField
						disabled={props.disabled}
						required={props.validations.required}
						is_edit_mode={props.is_edit_mode}
						defaultValue={props.defaultValue}
						{...props}
					/>
				);
			case 'date':
				return (
					<DateEditField
						validations={{
							required: props?.validations.required,
						}}
						onChangeCapture={props?.on_change}
						{...props}
						type='responsive'
					/>
				);
			default:
				return null;
		}
	};
	return has_dynamic_attrs ? (
		<Grid container display={'flex'} width={'100%'} alignItems={'center'}>
			<Grid item width='70%'>
				{render_form_fields_by_type()}
			</Grid>
			{is_dynamic_attribute && (
				<Grid item width={'25%'} ml={1}>
					<CalculateButton
						field={{
							attribute_id,
							field_name: name,
						}}
					/>
				</Grid>
			)}
		</Grid>
	) : (
		render_form_fields_by_type()
	);
};

export default FormBuilder;
