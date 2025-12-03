import { TextField } from '@mui/material';
import size from 'lodash/size';
import { useEffect, useState } from 'react';
import { handle_field_validations } from '../helper';

const CustomTextComponent = ({
	id,
	is_error,
	handle_errors,
	is_mandatory,
	min_quantity,
	max_quantity,
	handleValues,
	defaultValue,
}: any) => {
	const [text, set_text] = useState(defaultValue ?? '');
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';

	const on_change = (e: any) => {
		handleValues({ [id]: e.target.value });
		set_text(e.target.value);
	};

	useEffect(() => {
		handle_errors({
			[id]: handle_field_validations(size(text), is_mandatory, min_quantity, max_quantity),
		});
	}, [text, is_mandatory, min_quantity, max_quantity]);

	return (
		<TextField
			size='medium'
			onChange={on_change}
			id={id}
			sx={{
				marginTop: '12px',
				...(!is_ultron && {
					'& .MuiInputBase-root': {
						borderRadius: '0px',
					},
				}),
			}}
			label='Enter Text'
			error={is_error}
			inputProps={{
				minLength: min_quantity,
				maxLength: max_quantity,
			}}
			required={is_mandatory}
			defaultValue={defaultValue}
		/>
	);
};

export default CustomTextComponent;
