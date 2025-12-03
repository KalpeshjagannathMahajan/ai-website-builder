import { BaseTextFieldProps, InputAdornment, TextField } from '@mui/material';
import _ from 'lodash';
import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';

import constants from 'src/utils/constants';
import apply_validations, { ValidationProps } from 'src/utils/apply_validations';

const { DATA_TYPES } = constants;
const upper_text_type = ['text', 'textarea', 'long_text'];
interface Props extends BaseTextFieldProps {
	name: string;
	multiline?: boolean;
	label?: string;
	validations?: ValidationProps;
	refInput?: any;
	rows?: number;
	autoFocus?: boolean;
	on_blur?: (text: string, is_unique?: boolean) => void;
	is_unique?: boolean;
	disabled?: boolean;
	start_icon?: any;
	end_icon?: any;
	show_asterisk?: boolean;
	enable_capitalization?: boolean;
	style?: any;
	inputProps?: any;
}

const TextEditField = ({
	name,
	multiline = false,
	validations,
	rows = 4,
	label = '',
	refInput,
	autoFocus,
	FormHelperTextProps = {},
	type,
	defaultValue,
	on_blur,
	is_unique = false,
	start_icon,
	end_icon,
	show_asterisk = true,
	enable_capitalization = true,
	style,
	inputProps,
	...rest
}: Props) => {
	const { setValue, watch, control } = useFormContext();
	const val = watch(name);

	const handle_blur = (field: any) => {
		// Ensure value is a string for trimming
		if (typeof val === DATA_TYPES.STRING) {
			setValue(name, val?.trim());
		} else {
			setValue(name, val);
		}
		if (type === 'amount' && _.endsWith(val, '.')) setValue(name, _.trimEnd(val, '.'));
		field?.onBlur();
		on_blur?.(field?.value, is_unique);
	};

	useEffect(() => {
		if (val) {
			setValue(name, val);
		}
	}, [val, setValue]);
	const theme: any = useTheme();

	const _label = `${label}${validations?.required && show_asterisk ? '*' : ''}`;

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			rules={apply_validations({ label, name, ...validations, val })}
			render={({ field, fieldState: { error } }) => (
				<TextField
					{...field}
					multiline={multiline}
					rows={rows}
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					onBlur={(e) => handle_blur(field)}
					autoFocus={autoFocus}
					inputRef={refInput}
					label={_label}
					error={!!error}
					InputProps={{
						startAdornment: start_icon && <InputAdornment position='start'>{start_icon}</InputAdornment>,
						endAdornment: end_icon && <InputAdornment position='end'>{end_icon}</InputAdornment>,
						sx: { borderRadius: theme?.form_elements_?.borderRadius },
					}}
					InputLabelProps={{ shrink: field?.value || !!error ? true : false }}
					helperText={error ? error?.message : ''}
					inputProps={{
						...inputProps,
						style: {
							...style,
						},
						pattern: type === 'number' ? '^-?[0-9]+(?:.[0-9]*)?$' : name === 'expiry' ? '^(0[1-9]|1[0-2])/[0-9]{2}$' : '',
						type: type === 'number' && 'tel',
					}}
					onChange={(e) => {
						let value = e.target.value;
						if (_.includes(upper_text_type, type)) {
							value = enable_capitalization ? _.upperFirst(value) : value;
						}
						if (name === 'expiry') {
							if (value === '/') value = '';
							else if (value.length === 3 && !value.includes('/')) {
								const month = parseInt(value?.substring(0, 2));
								if (month > 0 && month <= 12) {
									value = `${value?.substring(0, 2)}/${value?.substring(2)}`;
								}
							} else if (!value?.includes('/')) value = value?.slice(0, 4);
							else value = value?.slice(0, 5);
						}
						if (type === 'number') {
							value = value.replace(/[^0-9.-]/g, '');

							if (!/^-?\d*(\.\d*)?$/.test(value)) {
								return;
							}
						}

						if (type === 'email') {
							value = value?.toLowerCase();
						}
						if (type === 'amount' || type === 'percentage') {
							value = value.replace(/^0+/, '');
							if (value === '' || value[0] === '.') value = `0${value}`;
							const isValidNumber = /^\d*(\.\d{0,2})?$/.test(value);
							if (!isValidNumber) {
								return;
							}
						}

						field.onChange(value);
					}}
					FormHelperTextProps={{ style: { fontSize: '1.4rem' }, ...FormHelperTextProps }}
					{...rest}
				/>
			)}
		/>
	);
};

export default TextEditField;
