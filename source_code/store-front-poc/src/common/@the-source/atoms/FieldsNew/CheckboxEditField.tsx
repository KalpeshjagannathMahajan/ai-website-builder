import { Checkbox, FormControl, FormControlLabel, FormHelperText, CheckboxProps, Box } from '@mui/material';
import _ from 'lodash';
import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import apply_validations, { ValidationProps } from 'src/utils/apply_validations';
import { useTheme } from '@mui/material/styles';
interface Props extends CheckboxProps {
	name: string;
	label?: string;
	validations?: ValidationProps;
	refInput?: any;
	attribute?: any;
	defaultValue?: any;
	checkbox_value: string | number | boolean;
	is_array?: boolean;
	color?: any;
}

const CheckboxEditField = ({
	name,
	refInput,
	label,
	validations,
	attribute,
	defaultValue,
	is_array,
	checkbox_value,
	color,
	...rest
}: Props) => {
	const theme: any = useTheme();
	const { control, setValue } = useFormContext();

	useEffect(() => {
		setValue(name, defaultValue);
	}, [defaultValue]);

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			rules={apply_validations({ ...validations, name, label })}
			render={({ field: { onChange, value }, fieldState: { error } }) => {
				let is_checked: boolean;

				if (is_array) {
					is_checked = _.includes(value, checkbox_value);
				} else {
					is_checked = value === checkbox_value;
				}
				return (
					<FormControl error={!!error} fullWidth>
						<FormControlLabel
							control={
								<Box sx={{ width: 48, display: 'flex', justifyContent: 'center' }}>
									<Checkbox
										style={{ ...theme?.check_box_style }}
										{...rest}
										inputRef={refInput}
										checked={value}
										onChange={() => {
											if (is_array) {
												const _value = _.cloneDeep(value) || [];
												const index = _.indexOf(_value, checkbox_value);

												if (index !== -1) {
													_value.splice(index, 1);
												} else {
													_value.push(checkbox_value);
												}
												onChange(_value);
											} else {
												onChange(is_checked ? false : checkbox_value);
											}
										}}
									/>
								</Box>
							}
							label={label}
							sx={{ display: 'flex', alignItems: 'center', color }}
							labelPlacement='end'
						/>
						{error && <FormHelperText style={{ fontSize: '1.4rem', color: theme?.palette?.colors?.red }}>{error.message}</FormHelperText>}
					</FormControl>
				);
			}}
		/>
	);
};

export default CheckboxEditField;
