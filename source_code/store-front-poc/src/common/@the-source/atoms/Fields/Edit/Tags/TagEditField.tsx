import { Controller, useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import CustomInput from '../../../CustomInput/CustomInput';
import Icon from '../../../Icon/Icon';
import Typography from '../../../Typography/Typography';
import Checkbox from '../../../Checkbox/Checkbox';
import { MenuProps } from '../../../Menu/Menu';
import styles from '../../../../molecules/FilterComponents/MultiSelectFilter/MultiSelectFilter.module.css';
import { MultiSelectFilterFieldProps } from '../../FieldInterface';

const DropdownIcon = () => <Icon iconName='IconChevronDown' sx={{ mr: '.5em' }} />;

const TagEditField: React.FC<MultiSelectFilterFieldProps> = ({
	options,
	value,
	onError,
	handleChange,
	field_key,
	style,
	refInput,
	filterName,
}) => {
	const {
		control,
		setValue,
		trigger,
		formState: { errors },
	} = useFormContext();
	const [isOpen, setIsOpen] = useState(true);
	const [filteredOption, setFilteredOption] = useState<string[]>(options);
	const [selectedOptions, setSelectedOptions] = useState<string[]>(value);

	const handleOnError = (error: any) => {
		if (error && onError) {
			onError(error.message);
		}
	};

	const handleOptionSelect = (onChange: any, event: SelectChangeEvent<string[]>) => {
		if (event.target.value) {
			const filtered = Array.isArray(event.target.value) ? event.target.value.filter(Boolean) : [];

			handleChange && handleChange(filtered);
			onChange(filtered);
			if (handleChange) {
				handleChange(filtered);
			}

			setSelectedOptions(filtered as string[]);
		}
	};

	const handleSearch = (e: any) => {
		const filtered = options?.filter((item: any) => item?.toLocaleLowerCase()?.includes(e.target.value));
		setFilteredOption(filtered);
	};

	useEffect(() => {
		setValue(field_key, value);
		trigger(field_key);
	}, [value, setValue, trigger, field_key]);

	const shouldShowError = errors[field_key];

	//   const errorMessage = shouldShowError ? errors[props.field_key]?.message?.toString() : '';

	return (
		<Controller
			name={field_key}
			control={control}
			defaultValue={value || ''}
			rules={{
				required: field_key,
				validate: (val) => val.length > 0 || 'Please select an option',
			}}
			render={({ field, fieldState: { error } }) => {
				handleOnError(error);
				return (
					<Select
						{...field}
						multiple
						style={style}
						inputRef={refInput}
						displayEmpty={true}
						error={!!shouldShowError}
						value={selectedOptions}
						onKeyDown={(e) => e.stopPropagation()}
						defaultValue={value}
						onChange={(event) => handleOptionSelect(field.onChange, event)}
						onClose={() => setIsOpen(false)}
						onOpen={() => setIsOpen(true)}
						IconComponent={DropdownIcon}
						renderValue={(selected) => {
							if (selected.length !== 0 && value?.length > 0) {
								return (
									<>
										{filterName} ({selected.length})
									</>
								);
							}

							return filterName;
						}}
						sx={{
							pl: 0.25,
						}}
						open={isOpen}
						MenuProps={
							{
								PaperProps: {
									style: {
										maxHeight: 420,
										width: 240,
									},
								},
								anchorOrigin: {
									vertical: 'bottom',
									horizontal: 'left',
								},
								transformOrigin: {
									vertical: 'top',
									horizontal: 'left',
								},
								getContentAnchorEl: null,
							} as Partial<MenuProps>
						}>
						<Box className={styles['top-sticky-container']}>
							<CustomInput size='small' fullWidth variant='filled' placeholder='Search for an option' onChange={handleSearch}>
								Search
							</CustomInput>
						</Box>
						{filteredOption?.map((option) => (
							<MenuItem onKeyDown={(e) => e.stopPropagation()} sx={{ pl: 1 }} key={option} value={option}>
								<Checkbox size='small' checked={selectedOptions.indexOf(option) > -1} />
								<Typography noWrap>{option}</Typography>
							</MenuItem>
						))}
					</Select>
				);
			}}
		/>
	);
};

export default TagEditField;
