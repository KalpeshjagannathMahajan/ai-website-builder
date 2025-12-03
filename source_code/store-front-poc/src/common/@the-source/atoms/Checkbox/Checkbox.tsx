import { Checkbox as MuiCheckBox, CheckboxProps as MuiCheckBoxProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type CheckBoxBaseProps = Pick<MuiCheckBoxProps, 'size' | 'checked' | 'disabled' | 'onChange' | 'onClick'>;

export interface CheckboxProps extends CheckBoxBaseProps {
	checked?: boolean;
	size?: any;
	onChange?: any;
	disabled?: boolean;
	inputRef?: any;
	name?: any;
	indeterminate?: boolean;
	sx?: any;
	className?: any;
}

const Checkbox = ({ checked, size, disabled, onChange, inputRef, name, indeterminate, sx, className, ...rest }: CheckboxProps) => {
	const theme: any = useTheme();

	return (
		<MuiCheckBox
			name={name}
			size={size}
			indeterminate={indeterminate}
			checked={checked}
			disabled={disabled}
			onChange={onChange}
			inputRef={inputRef}
			sx={{
				...sx,
				'&.Mui-checked': { ...theme?.product?.filter?.category_filter?.checkbox },
				'&.MuiCheckbox-indeterminate': { ...theme?.product?.filter?.category_filter?.checkbox },
			}}
			className={className}
			{...rest}
		/>
	);
};

Checkbox.defaultProps = {
	size: 'medium',
	checked: false,
	onChange: () => {},
	disabled: false,
};
export default Checkbox;
