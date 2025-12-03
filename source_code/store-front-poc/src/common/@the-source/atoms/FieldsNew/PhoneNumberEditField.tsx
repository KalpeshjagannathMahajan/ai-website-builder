import React, { useState, useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import apply_validations from 'src/utils/apply_validations';
import { areaCodes } from './help';
import { parsePhoneNumber } from 'awesome-phonenumber';
import _ from 'lodash';
import { useTheme } from '@mui/material/styles';
import { Grid } from 'src/common/@the-source/atoms';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const handle_remove_dial_code = (dial_code: any) => {
	if (dial_code?.includes('+')) {
		return dial_code?.slice(1);
	}
	return dial_code || '';
};

const PhoneNumberEditField = ({
	defaultValue,
	name,
	getValues,
	setValue,
	register,
	show_copy_drawer,
	is_edit_mode,
	required,
	validations,
	label = '',
	disabled,
	allow_check_box,
	type,
	...props
}: any) => {
	const handle_default_value = () => {
		if (getValues()?.country_code && getValues()?.phone) {
			return handle_remove_dial_code(getValues()?.country_code) + getValues()?.phone;
		}
	};

	const [phone_value, set_phone_value] = useState(defaultValue || handle_default_value);
	const [country_code, set_country_code] = useState(getValues()?.country_code);
	const { control, watch } = useFormContext();
	const phoneInputRef = useRef<any>(null);
	const theme: any = useTheme();

	const value = watch(name);

	const input_style = {
		width: '99%',
		borderRadius: theme?.form_elements_?.borderRadius || 8,
		marginLeft: 2,
		marginRight: 2,
	};

	useEffect(() => {
		if (allow_check_box) {
			const phone_data = _.get(getValues(), name);
			set_country_code(`+${phone_data?.slice(0, -10)}` || '');
			set_phone_value(phone_data?.slice(-12) || '');
		}
	}, [allow_check_box]);

	useEffect(() => {
		if (register) {
			country_code && setValue('country_code', country_code || '');
			set_country_code(getValues()?.country_code);
		}
	}, [phone_value, register, country_code]);

	useEffect(() => {
		if (is_edit_mode) {
			setValue('country_code', country_code || '');
		}
	}, []);

	useEffect(() => {
		if (!show_copy_drawer && getValues()?.phone) {
			getValues()?.country_code &&
				getValues()?.phone &&
				set_phone_value(handle_remove_dial_code(getValues()?.country_code) + getValues()?.phone);

			setValue('phone', handle_remove_dial_code(getValues()?.country_code) + getValues()?.phone);
		}
	}, [show_copy_drawer, getValues()?.country_code]);

	const handle_country_change = (country: any, countryCode: any) => {
		set_country_code(`+${countryCode?.dialCode}`);
	};

	return (
		<Controller
			name={name}
			control={control}
			rules={apply_validations({ ...validations, name, label, val: value })}
			render={({ field, fieldState: { error } }) => {
				const num = `+${value}`;
				const phone_number = parsePhoneNumber(num);
				return (
					<Grid id={is_ultron ? 'ultron' : 'storefront_phone'}>
						<PhoneInput
							{...field}
							value={phone_value}
							disabled={disabled}
							areaCodes={areaCodes}
							onBlur={(event) => set_phone_value(event.target.value)}
							onChange={(country, countryCode) => {
								handle_country_change(country, countryCode), field.onChange(country);
							}}
							{...props}
							country='us'
							isValid={() => {
								if (!error && !phone_number?.valid) {
									return !value;
								}
								if (error) {
									return phone_number?.valid ? true : error?.message;
								}
								return true;
							}}
							inputProps={{
								name,
								required: true,
							}}
							inputStyle={input_style}
							searchStyle={{
								width: '80%',
							}}
							searchPlaceholder='search country code'
							enableSearch
							ref={phoneInputRef}
						/>
						{!phone_number?.valid && (
							<p style={{ margin: '8px 14px 0px 14px', color: theme?.palette?.error?.main, ...theme?.edit_field_error_style }}>
								{error?.message || value ? 'Invalid number' : ''}
							</p>
						)}
					</Grid>
				);
			}}
		/>
	);
};

export default PhoneNumberEditField;
