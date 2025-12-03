import { Radio as MuiRadio, RadioProps as MuiRadioProps, SxProps, Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type RadioBaseProps = Pick<MuiRadioProps, 'size' | 'checked' | 'disabled' | 'onChange' | 'onClick'>;

export interface RadioProps extends RadioBaseProps {
	checked?: boolean;
	size?: any;
	onChange?: any;
	disabled?: boolean;
	style?: any;
	sx?: SxProps<Theme>;
}

const Radio = ({ checked, size, disabled, onChange, style, ...rest }: RadioProps) => {
	const theme: any = useTheme();

	return (
		<MuiRadio
			size={size}
			checked={checked}
			disabled={disabled}
			onChange={onChange}
			{...rest}
			sx={{
				'&.Mui-checked': {
					...theme?.product?.filter?.accordion_radio,
				},
				...style,
			}}
		/>
	);
};

Radio.defaultProps = {
	size: 'medium',
	checked: false,
	onChange: () => {},
	disabled: false,
};
export default Radio;
