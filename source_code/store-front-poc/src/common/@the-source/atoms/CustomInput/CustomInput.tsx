/* eslint-disable no-param-reassign */
import { Box, TextFieldProps } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useState } from 'react';
import Icon from '../Icon';
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
	| 'sx'
	| 'fullWidth'
	| 'className'
	| 'defaultValue'
	| 'size'
>;

export interface CustomInputProps extends InputBase {
	children?: any;
	type?: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>, status?: boolean) => void;
	startIcon?: any;
	endIcon?: any;
	submitOnEnter?: boolean;
	inputType?: 'password' | 'search' | 'default';
	background?: string;
	onSearch?: (value: string) => void;
	defaultValue?: string;
	input_style?: any;
}

const CustomInput = ({
	children,
	sx,
	label,
	onChange,
	startIcon,
	endIcon,
	submitOnEnter,
	inputType,
	fullWidth,
	background,
	defaultValue = '',
	onSearch,
	size,
	input_style = {},
	...rest
}: CustomInputProps) => {
	const [value, setValue] = useState<string>(defaultValue);
	const [allowClear, setAllowClear] = useState(value?.length > 0);
	const hasEndIcon = allowClear || endIcon;
	const theme: any = useTheme();

	switch (inputType) {
		case 'password':
			break;
		case 'search':
			allowClear;
			startIcon = <Icon iconName='IconSearch' sx={{ color: '#4F555E' }} color={theme?.palette?.secondary[800]} />;
			label = label || '';
			submitOnEnter = submitOnEnter || false;
			break;
		case 'default':
			break;
		default:
			break;
	}

	// const update_debounce = _.debounce((event: any) => {
	// 	onChange(event);
	// }, 300);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);
		setAllowClear(event.target.value !== '');
		onChange(event);
		// update_debounce(event);
	};

	const handleClear = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue('');
		event.target.value = '';
		onChange(event, true);
		setAllowClear(false);
	};

	return (
		<Box component='form' height={42} sx={input_style}>
			<FormControl variant='outlined' fullWidth={fullWidth} sx={{ width: '100%', fontSize: '1.4rem' }}>
				<InputLabel sx={{ fontSize: '1.4rem' }} id='outlined-adornment'>
					{label}
				</InputLabel>
				<OutlinedInput
					onKeyDown={(e) => e.stopPropagation()}
					size={size}
					autoComplete='off'
					style={{ height: 42, fontSize: '1.4rem', borderRadius: theme?.product?.filter?.multi_select_filter?.borderRadius }}
					id='outlined-adornment'
					label={label}
					onKeyPress={(e: any) => {
						if (e.key === 'Enter' && !submitOnEnter) {
							e.preventDefault();
							if (inputType === 'search') {
								onChange(e, false);
								if (onSearch) onSearch(e);
							}
						}
					}}
					onChange={handleChange}
					value={value}
					startAdornment={startIcon && <InputAdornment position='start'>{startIcon}</InputAdornment>}
					endAdornment={
						hasEndIcon && (
							<InputAdornment position='end' sx={allowClear ? { cursor: 'pointer' } : {}}>
								{allowClear ? <Icon iconName={'IconX'} onClick={handleClear} color={theme?.palette?.secondary[600]} /> : endIcon}
							</InputAdornment>
						)
					}
					sx={{ background }}
					{...rest}
				/>
			</FormControl>
		</Box>
	);
};

CustomInput.defaultProps = {
	type: 'text',
	allowClear: false,
	startIcon: null,
	endIcon: null,
	submitOnEnter: false,
	inputType: 'default',
	background: '#FFFFFF',
};

export default CustomInput;
