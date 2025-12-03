import { TextField, TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';
import { useTheme } from '@mui/material/styles';

type InputBase = Pick<
	TextFieldProps,
	| 'label'
	| 'variant'
	| 'value'
	| 'title'
	| 'error'
	| 'helperText'
	| 'disabled'
	| 'onClick'
	| 'onChange'
	| 'placeholder'
	| 'onFocus'
	| 'onBlur'
	| 'required'
	| 'InputProps'
	| 'autoComplete'
	| 'sx'
	| 'defaultValue'
>;

export interface IconProps extends InputBase {
	children: any;
	label: string;
	disableEnter?: any;
	type?: string;
	handleKeyPress?: any;
	variant?: 'filled' | 'standard' | 'outlined';
	sx?: any;
	id?: any;
	size?: 'small' | 'normal';
	autoFocus?: boolean;
}

const InputField = forwardRef(({ children, sx, label, variant, onChange, handleKeyPress = () => {}, id, ...rest }: IconProps, ref: any) => {
	const theme: any = useTheme();
	return (
		<TextField
			id={id}
			{...rest}
			sx={{ ...sx, ...theme?.form_elements_ }}
			inputRef={ref}
			onChange={onChange}
			label={label}
			variant={variant}
			onKeyPress={handleKeyPress}>
			{children}
		</TextField>
	);
});

InputField.defaultProps = {
	variant: 'filled',
	type: 'text',
	disableEnter: true,
	handleKeyPress: () => {},
};

export default InputField;
