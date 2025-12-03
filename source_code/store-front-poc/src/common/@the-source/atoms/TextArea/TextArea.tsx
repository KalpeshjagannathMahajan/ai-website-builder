import { TextField } from '@mui/material';

export interface TextareaProps {
	label?: string;
	value?: string;
	handleChange?: any;
	rows?: any;
	placeholder?: string;
	sx?: Object;
	name?: any;
	required?: boolean;
	inputRef?: React.Ref<any>;
}

const TextArea: React.FC<TextareaProps> = ({ label, value, handleChange, rows = 4, placeholder = '', sx, name, required, inputRef }) => (
	<TextField
		label={label}
		multiline
		rows={rows}
		placeholder={placeholder}
		value={value}
		sx={sx}
		name={name}
		onChange={handleChange}
		required={required}
		inputRef={inputRef}
	/>
);

TextArea.defaultProps = {
	rows: 3,
	placeholder: 'Write here...',
	sx: {},
	handleChange: () => {},
	name: '',
	value: '',
	required: false,
};

export default TextArea;
