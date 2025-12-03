import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid } from 'src/common/@the-source/atoms';
import _ from 'lodash';
import { handle_field_validations } from '../helper';
import { makeStyles } from '@mui/styles';
import { get_formatted_price_with_currency } from 'src/utils/common';

interface RadioProps {
	values: [{}];
	default_value: string;
	prevent_overflow: {};
	onChange: any;
	id: string;
	is_mandatory: boolean;
	handleError: any;
	search_string_style?: {};
	is_retail_mode?: boolean;
	currency: string;
}

const useStyles = makeStyles(() => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		marginTop: '1rem',
	},

	radio_group_container: {
		display: 'flex',
		flexDirection: 'row',
		gap: '30px',
	},

	radio_group_item: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
}));

const RadioComponent = ({
	values,
	default_value,
	prevent_overflow,
	onChange,
	id,
	is_mandatory,
	handleError,
	search_string_style,
	is_retail_mode,
	currency,
}: RadioProps) => {
	const styles = useStyles();
	const [selectedOption, setSelectedOption] = useState(default_value || '');

	const handleOption = (e: any) => {
		if (selectedOption === e.target.value) setSelectedOption('');
		else setSelectedOption(e.target?.value);
	};
	useEffect(() => {
		onChange({ [id]: selectedOption });
		handleError({ [id]: handle_field_validations(_.isEmpty(selectedOption) ? 0 : 1, is_mandatory, is_mandatory ? 1 : 0, 1) });
	}, [selectedOption]);
	return (
		<div className={styles.container} style={search_string_style}>
			<RadioGroup className={styles.radio_group_container} name='radio-buttons-group' value={selectedOption}>
				{_.isArray(values) &&
					values?.map((curr: any) => (
						<FormControlLabel
							key={curr?.id}
							value={curr?.name}
							control={<Radio onClick={handleOption} />}
							label={
								<Grid className={styles.radio_group_item}>
									<CustomText type='Body' style={prevent_overflow}>
										{curr?.display_name}
									</CustomText>
									{curr?.price !== null && !is_retail_mode && (
										<CustomText type='Subtitle'>{get_formatted_price_with_currency(currency, curr?.price)}</CustomText>
									)}
								</Grid>
							}
						/>
					))}
			</RadioGroup>
		</div>
	);
};

export default RadioComponent;
