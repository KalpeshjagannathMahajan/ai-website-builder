import { FormControl, FormControlLabel, FormHelperText, CheckboxProps, Box, Switch } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import apply_validations, { ValidationProps } from 'src/utils/apply_validations';
import { useTheme } from '@mui/material/styles';
import CustomText from '../../CustomText';

interface Props extends CheckboxProps {
	name: string;
	label?: string;
	validations?: ValidationProps;
	refInput?: any;
	defaultValue?: any;
	color?: any;
	labelStyle?: any;
}

const ToggleSwitchEditField = ({ name, refInput, label, validations, defaultValue, color, labelStyle = {}, ...rest }: Props) => {
	const { control } = useFormContext();
	const theme: any = useTheme();
	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			rules={apply_validations({ ...validations, name, label })}
			render={({ field: { onChange, value }, fieldState: { error } }) => {
				return (
					<FormControl error={!!error} fullWidth>
						<FormControlLabel
							control={
								<Box>
									<Switch {...rest} inputRef={refInput} checked={value} onChange={() => onChange(!value)} />
								</Box>
							}
							label={
								<CustomText type='Title' style={{ ...labelStyle }}>
									{label}
								</CustomText>
							}
							sx={{ display: 'flex', justifyContent: 'space-between', color, paddingRight: '24px' }}
							labelPlacement='start'
						/>
						{error && <FormHelperText style={{ fontSize: '1.4rem', color: theme?.palette?.colors?.red }}>{error.message}</FormHelperText>}
					</FormControl>
				);
			}}
		/>
	);
};

export default ToggleSwitchEditField;
