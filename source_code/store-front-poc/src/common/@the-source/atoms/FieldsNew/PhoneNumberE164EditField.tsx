/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import apply_validations from 'src/utils/apply_validations';
import { areaCodes } from './help';
import { parsePhoneNumber } from 'awesome-phonenumber';
import _ from 'lodash';
import { colors } from 'src/utils/theme';

const PhoneNumberE164EditField = ({
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
	type,
	...props
}: any) => {
	const [phone_value, set_phone_value] = useState('');
	const { control, watch } = useFormContext();
	const phoneInputRef = useRef<any>(null);

	const value = watch(name);

	const input_style = {
		width: '99%',
		borderRadius: 8,
		marginLeft: 2,
		marginRight: 2,
	};

	const input_props = {
		name: 'Phone number',
		required: true,
		autoFocus: false,
	};

	useEffect(() => {
		if (value) {
			set_phone_value(value);
		} else {
			set_phone_value(defaultValue);
		}
	}, [defaultValue]);

	useEffect(() => {
		setValue && setValue(name, phone_value);
	}, [phone_value]);

	useEffect(() => {
		if (value && setValue) {
			const new_value = _.head(value) === '+' ? value : `+${value}`;
			setValue(name, new_value);
		}
	}, [phone_value]);

	const handle_blur = (event: any) => {
		set_phone_value(event?.target?.value);
		if (props?.on_blur) {
			const formatted_value = _.head(value) === '+' ? value : `+${value}`;
			props.on_blur(formatted_value);
		}
	};

	return (
		<Controller
			name={name}
			control={control}
			rules={apply_validations({ ...validations, name, label, val: value })}
			render={({ field, fieldState: { error } }) => {
				const num = _.includes(value, '+') ? value : `+${value}`;
				const phone_number = parsePhoneNumber(num);
				return (
					<React.Fragment>
						<PhoneInput
							{...field}
							value={phone_value}
							disabled={disabled}
							areaCodes={areaCodes}
							onBlur={handle_blur}
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
							inputProps={input_props}
							inputStyle={input_style}
							searchStyle={{
								width: '80%',
							}}
							searchPlaceholder='search country code'
							enableSearch
							ref={phoneInputRef}
						/>
						{!phone_number?.valid && (
							<p style={{ margin: '8px 14px 0px 14px', color: colors.red }}>{error?.message || value ? 'Invalid number' : ''}</p>
						)}
						{phone_number?.valid && error && error?.message && (
							<p style={{ margin: '8px 14px 0px 14px', color: colors.red }}>{error?.message}</p>
						)}
					</React.Fragment>
				);
			}}
		/>
	);
};

export default PhoneNumberE164EditField;
