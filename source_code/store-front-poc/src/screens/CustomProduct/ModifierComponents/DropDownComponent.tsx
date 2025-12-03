import { FormControl, InputLabel, MenuItem, Radio, Select } from '@mui/material';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Checkbox, CustomInput, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { handle_field_validations } from '../helper';
import { makeStyles } from '@mui/styles';
import { t } from 'i18next';
import NoOption from '../Components/NoOption';
import utils from 'src/utils/utils';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { get_formatted_price_with_currency } from 'src/utils/common';

interface DropDownProps {
	values: any;
	label: string;
	options: string;
	show_checkbox: boolean;
	onChange: any;
	is_mandatory: boolean;
	id: string;
	max_selection_quantity: number;
	min_selection_quantity: number;
	handleError: any;
	is_retail_mode?: boolean;
	currency: string;
}

interface SelectedOptions {
	[key: string]: string[];
}

const useStyles = makeStyles(() => ({
	container: {
		maxWidth: '360px',
		borderRadius: '4px',
		marginTop: '1rem',
	},

	item_container: {
		display: 'flex',
		alignItems: 'center',
		gap: '5px',
		width: '100%',
	},
}));

const DropDownComponent = ({
	values,
	label,
	show_checkbox,
	onChange,
	options,
	is_mandatory,
	id,
	min_selection_quantity,
	max_selection_quantity,
	handleError,
	is_retail_mode,
	currency,
}: DropDownProps) => {
	const styles = useStyles();
	const modifier_settings = useSelector((state: any) => state?.settings?.modifier_mofications);
	const option_data = options ? options?.split(',').map((item) => item.trim()) : [];
	const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({ [id]: option_data });
	const [searchValues, setSearchValues] = useState<any>(values);
	const [selectedOptionArray, setSelectedOptionArray] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const theme: any = useTheme();
	const no_price_in_modifier = modifier_settings?.[id]?.no_price_in_modifier ?? false;
	const no_sorted_options = modifier_settings?.no_sorted_options ?? false;
	const handleSelectionChange = (itemName: string) => {
		setSelectedOptions((prevSelectedOptions: any) => {
			const currentSelected = new Set(prevSelectedOptions[id] || []);

			if (currentSelected?.has(itemName)) {
				currentSelected?.delete(itemName);
			} else if (!show_checkbox) {
				return { ...prevSelectedOptions, [id]: [itemName] };
			} else {
				currentSelected?.add(itemName);
			}
			return {
				...prevSelectedOptions,
				[id]:
					max_selection_quantity !== null && currentSelected.size > max_selection_quantity
						? Array.from(currentSelected).filter((item) => item !== itemName)
						: Array.from(currentSelected),
			};
		});

		if (!show_checkbox) {
			setIsOpen(false);
		}
	};

	const sort_items_on_selection = (selected_options_array: any, complete_array: any) => {
		const sorted_array = utils.get_sorted_array_on_selection(
			selected_options_array,
			complete_array,
			(item: any) => item?.display_name,
			no_sorted_options,
		);

		setSearchValues(sorted_array);
	};

	const handleSearch = (search_string: string) => {
		const filteredResults = utils.get_search_string_result(values, search_string, (item: any) => item?.display_name);
		const matchingSelectedOptions = utils.get_search_string_result(selectedOptionArray, search_string, (item: any) => item?.display_name);

		sort_items_on_selection(matchingSelectedOptions, filteredResults);
	};

	useEffect(() => {
		onChange(selectedOptions);
		handleError({
			[id]: handle_field_validations(selectedOptions[id]?.length, is_mandatory, min_selection_quantity, max_selection_quantity),
		});
		setSelectedOptionArray(values.filter((item: any) => selectedOptions[id].includes(item?.display_name)));
	}, [selectedOptions]);

	return (
		<FormControl className={styles.container}>
			<InputLabel>{label}</InputLabel>
			<Select
				value={selectedOptions[id]}
				label={label}
				open={isOpen}
				onOpen={() => {
					setIsOpen(true);
					sort_items_on_selection(selectedOptionArray, values);
				}}
				onClose={() => setIsOpen(false)}
				sx={{ borderRadius: theme?.product?.custom_product_drawer?.drop_down?.borderRadius }}
				renderValue={(selected: any) => {
					const data = Array.isArray(selected) ? selected : selected ? [selected] : [];
					const selected_values = values?.filter((val: any) => data?.includes(val?.name));

					return (
						<Grid sx={{ flexDirection: 'row', display: 'flex' }}>
							{selected_values?.map((val: any, ind: any) => (
								// eslint-disable-next-line react/no-array-index-key
								<React.Fragment key={ind}>
									<CustomText type='Subtitle' style={{ marginRight: '.4rem' }}>
										{val?.display_name}
										{ind !== selected_values?.length - 1 ? ',' : ''}
									</CustomText>
								</React.Fragment>
							))}
						</Grid>
					);
				}}
				IconComponent={() => (
					<Icon
						iconName='IconChevronDown'
						color={theme?.product?.custom_product_drawer?.drop_down?.color}
						sx={{
							padding: '10px',
							cursor: 'pointer',
							position: 'absolute !important',
							right: '0 !important',
							pointerEvents: 'none !important',
						}}
					/>
				)}>
				<>
					{values?.length >= 7 && (
						<CustomInput
							size='small'
							fullWidth
							inputType='search'
							input_style={{ margin: '0rem 1rem' }}
							startIcon={<Icon iconName='IconSearch' color={theme?.palette?.secondary[800]} />}
							onChange={(e) => handleSearch(e.target.value)}
							allowClear>
							{t('Common.FilterComponents.Search')}
						</CustomInput>
					)}

					<Grid item sx={{ maxHeight: '300px', overflowY: 'auto' }}>
						{_.isArray(searchValues) &&
							(searchValues.length > 0 ? (
								searchValues?.map((value: any) => (
									<MenuItem key={value?.id} value={value?.name} sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
										<Grid
											className={styles.item_container}
											onClick={(e) => {
												if (show_checkbox) e.stopPropagation();
												handleSelectionChange(value?.name);
											}}>
											{show_checkbox ? (
												<Checkbox checked={selectedOptions[id].includes(value?.name)} />
											) : (
												<Radio checked={selectedOptions[id].includes(value?.name)} />
											)}
											<CustomText type='Body'>{value?.display_name}</CustomText>
											{!no_price_in_modifier && (
												<>
													{!is_retail_mode && (
														<CustomText type='Subtitle'>
															{' '}
															{value?.display_name ? ' - ' : ''} {get_formatted_price_with_currency(currency, value?.price)}
														</CustomText>
													)}
												</>
											)}
										</Grid>
									</MenuItem>
								))
							) : (
								<NoOption />
							))}
					</Grid>
				</>
			</Select>
		</FormControl>
	);
};

export default DropDownComponent;
