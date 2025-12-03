import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent, SelectProps as MuiSelectProps } from '@mui/material/Select';
import { useState } from 'react';
import { custom_stepper_text_color, text_colors } from 'src/utils/light.theme';

import Icon from '../Icon/Icon';

type SelectBaseProps = Pick<MuiSelectProps, 'error' | 'value' | 'label' | 'disabled'>;

interface OptionProp {
	label: string;
	value: string;
}

export interface SelectProps extends SelectBaseProps {
	label?: string;
	checkmarks?: boolean;
	value?: string;
	helperText?: string;
	handleChange: (value: any) => any;
	name?: any;
	defaultValue?: string;
	options: Array<string> | OptionProp[];
	complex?: boolean;
	style?: any;
	max_selection?: number;
}

const chip_style = {
	background: text_colors.light_grey,
	color: custom_stepper_text_color.grey,
	padding: '0.6rem 0.3rem',
	maxWidth: 'fit-content',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	flex: '0.5',
};

const MultiSelect = ({
	options,
	label,
	value,
	error,
	checkmarks,
	helperText,
	name,
	handleChange,
	defaultValue,
	complex,
	style,
	max_selection = Infinity,
	...rest
}: SelectProps) => {
	const optionsTemp: Array<string> = complex
		? (options as OptionProp[]).map((option: OptionProp) => option.value)
		: (options as Array<string>);

	const optionsMapping: Record<string, string> = complex
		? (options as OptionProp[]).reduce((acc, item) => {
				acc[item.value] = item.label;
				return acc;
		  }, {} as Record<string, string>)
		: {};

	const [option, setOption] = useState<string[]>(defaultValue ? defaultValue.split(',') : []);

	const handleMultiSelect = (event: SelectChangeEvent<typeof option>) => {
		const selected = event.target.value;
		// On autofill we get a stringified value.
		const selectedValue = typeof selected === 'string' ? selected.split(',') : selected;

		if (selectedValue.length > max_selection) return;

		setOption(selectedValue);
		handleChange(selectedValue);
	};

	const handleDelete = (event: React.MouseEvent, val: string) => {
		event.preventDefault();
		const updatedOptions = option?.filter((item) => item !== val);
		setOption(updatedOptions);
		handleChange(updatedOptions);
	};

	const displayValue = (item: string) => (complex ? optionsMapping[item] : item);

	return (
		<FormControl fullWidth error={error}>
			<InputLabel id='simple-select-label'>{label}</InputLabel>
			<Select
				labelId='simple-select-label'
				multiple
				id='select-id'
				type='multiple'
				label={label}
				value={option}
				name={name}
				style={style}
				onChange={handleMultiSelect}
				renderValue={(selected) => (
					<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
						{selected?.slice(0, 2)?.map((val) => (
							<Chip
								key={val}
								label={complex ? optionsMapping[val] : val}
								onDelete={(e) => handleDelete(e, val)}
								deleteIcon={<Icon iconName='IconX' fontSize='small' />}
							/>
						))}
						{selected?.length > 2 && (
							<Chip
								size='small'
								label={`+${selected?.length - 2}`}
								sx={{
									...chip_style,
									minWidth: '50px',
								}}
							/>
						)}
					</Box>
				)}
				{...rest}>
				{optionsTemp?.map(
					(item: any): JSX.Element => (
						<MenuItem key={item} value={item}>
							{checkmarks ? (
								<>
									<Checkbox checked={option.indexOf(item) > -1} />
									<ListItemText primary={complex ? optionsMapping[item] : item} />
								</>
							) : (
								displayValue(item)
							)}
						</MenuItem>
					),
				)}
			</Select>
			<FormHelperText>{helperText}</FormHelperText>
		</FormControl>
	);
};

MultiSelect.defaultProps = {
	label: 'Mulit-Select',
	value: '',
	helperText: '',
	checkmarks: false,
	name: 'multi-select',
	complex: false,
};
export default MultiSelect;
