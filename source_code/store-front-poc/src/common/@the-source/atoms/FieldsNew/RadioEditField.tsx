import { useEffect } from 'react';
import { BaseTextFieldProps, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid } from 'src/common/@the-source/atoms';
import React from 'react';
import _ from 'lodash';

interface Props extends BaseTextFieldProps {
	data: any;
}

const RadioEditField = ({ data }: Props) => {
	const {
		control,
		setValue,
		getValues,
		formState: { errors },
	} = useFormContext();

	const name = data?.name ?? '';
	const defaultValue = data?.defaultValue;
	const [selectedOption, setSelectedOption] = React.useState(getValues(name) || defaultValue);

	const handle_change = (e: any) => {
		const value = e.target.value === 'true';
		setSelectedOption(value);
	};

	useEffect(() => {
		setValue(name, selectedOption);
	}, [selectedOption, setValue, name]);

	return (
		<Grid key={name}>
			<Controller
				name={name}
				control={control}
				defaultValue={defaultValue}
				render={({ field }) => (
					<FormControl component='fieldset' error={!!errors[name]} fullWidth style={{ margin: ' 0 1rem' }} {...data}>
						<RadioGroup row {...field} value={selectedOption} onChange={(e) => handle_change(e)} {...data}>
							{_.map(data?.options, (item: any) => (
								<FormControlLabel value={item?.value} control={<Radio />} label={item?.label} disabled={item?.disabled} key={item?.value} />
							))}
						</RadioGroup>
					</FormControl>
				)}
			/>
		</Grid>
	);
};

export default RadioEditField;
