import CustomText from 'src/common/@the-source/CustomText';
import _ from 'lodash';
import { Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { handle_field_validations } from '../helper';
import { Grid } from 'src/common/@the-source/atoms';
import { useTheme } from '@mui/material/styles';
import { get_formatted_price_with_currency } from 'src/utils/common';

interface ChipProps {
	values: { display_name: string; price: number }[];
	prevent_overflow: {};
	onChange: any;
	default_value: any;
	id: string;
	is_mandatory: boolean;
	handleError: any;
	search_string_style?: any;
	is_retail_mode?: boolean;
	currency: string;
}

const chip_style = {
	borderRadius: '40px',
	width: 'fit-content',
	maxWidth: '40rem',
	cursor: 'pointer',
};

const container_style = {
	display: 'flex',
	gap: '10px',
	flexWrap: 'wrap',
	marginTop: '1rem',
};

const ChipComponent = ({
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
}: ChipProps) => {
	const [selectedChip, setSelectedChip] = useState(default_value ?? '');
	const theme: any = useTheme();

	const handleChipClick = (chipValue: string) => {
		if (selectedChip?.includes(chipValue)) {
			setSelectedChip('');
		} else {
			setSelectedChip(chipValue);
		}
	};

	useEffect(() => {
		onChange({ [id]: selectedChip });
		handleError({ [id]: handle_field_validations(_.isEmpty(selectedChip) ? 0 : 1, is_mandatory, is_mandatory ? 1 : 0, 1) });
	}, [selectedChip]);

	return (
		<Grid sx={{ ...container_style, ...search_string_style }}>
			{_.isArray(values) &&
				values?.map((curr: any) => {
					const selected = selectedChip === curr?.display_name;
					return (
						<Chip
							key={curr.id}
							sx={{
								...chip_style,
								borderRadius: theme?.product?.custom_product_drawer?.chips?.borderRadius,
								border: selected
									? theme?.product?.custom_product_drawer?.modifier_select_value?.active_border
									: theme?.product?.custom_product_drawer?.modifier_select_value?.inactive_border,
								...theme?.product?.custom_product_drawer?.chips?.chip_style,
							}}
							label={
								<Grid sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
									<CustomText
										type='Body'
										style={{ color: theme?.product?.custom_product_drawer?.modifier_select_value?.color, ...prevent_overflow }}>
										{`${curr?.display_name}`}
										{!is_retail_mode && ' -'}
									</CustomText>
									{!is_retail_mode && (
										<CustomText type='Subtitle' style={{ color: theme?.product?.custom_product_drawer?.modifier_select_value?.color }}>
											{get_formatted_price_with_currency(currency, curr?.price)}
										</CustomText>
									)}
								</Grid>
							}
							onClick={() => handleChipClick(curr?.display_name)}
						/>
					);
				})}
		</Grid>
	);
};

export default ChipComponent;
