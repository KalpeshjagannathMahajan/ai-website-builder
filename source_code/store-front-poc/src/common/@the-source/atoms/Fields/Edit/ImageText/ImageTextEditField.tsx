import { MenuItem, Select } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { FieldInterface } from '../../FieldInterface';
import { useEffect, useState } from 'react';
import Grid from '../../../Grid/Grid';
import Image from '../../../Image/Image';
import Typography from '../../../Typography/Typography';
import Box from '../../../Box/Box';
import CustomInput from '../../../CustomInput/CustomInput';
import styles from '../../../../molecules/FilterComponents/MultiSelectFilter/MultiSelectFilter.module.css';
import Icon from '../../../Icon/Icon';

const ImageTextEditField: React.FC<FieldInterface> = ({
	field_key,
	value,
	name,
	required,
	refInput,
	style,
	options,
	handleChange,
	onError,
}) => {
	const {
		control,
		setValue,
		trigger,
		formState: { errors },
	} = useFormContext();
	const [isOpen, setIsOpen] = useState(true);
	const [filteredOption, setFilteredOption] = useState<string[]>(options || []);

	const handleOnChange = (onChange: any, val: any) => {
		let [getSrc]: any = options?.filter((item: any) => item?.value === val);
		let obj = { text_value: val, image_src: getSrc?.src };

		handleChange && handleChange(obj);
		onChange(obj);
		if (handleChange) {
			handleChange(obj);
		}
	};

	const handleOnError = (error: any) => {
		if (error && onError) {
			onError(error.message);
		}
	};

	useEffect(() => {
		setValue(field_key, value?.text_value);
		trigger(field_key);
	}, [value?.text_value, setValue, trigger, field_key]);
	const shouldShowError = errors[field_key];

	//   const errorMessage = shouldShowError ? errors[field_key]?.message?.toString() : '';

	const handleSearch = (e: any) => {
		const filtered = options?.filter((item: any) => item.value?.toLocaleLowerCase()?.includes(e.target.value));
		setFilteredOption(filtered || []);
	};

	const renderImagePlaceholder = () => {
		return (
			<Grid style={{ backgroundColor: '#F7F8FA', padding: 10, borderRadius: 8, marginRight: 10 }} display={'flex'} alignItems={'center'}>
				<Icon iconName='IconPhoto' color='grey' />
			</Grid>
		);
	};

	return (
		<Controller
			name={field_key}
			control={control}
			defaultValue={value?.text_value || ''}
			rules={{
				required,
			}}
			render={({ field, fieldState: { error } }) => {
				handleOnError(error);
				return (
					<Select
						{...field}
						open={isOpen}
						onClose={() => setIsOpen(false)}
						style={style}
						onOpen={() => setIsOpen(true)}
						inputRef={refInput}
						id={field_key}
						label={name}
						required={required}
						error={!!shouldShowError}
						onChange={(event) => handleOnChange(field.onChange, event.target.value)}>
						<Box className={styles['top-sticky-container']}>
							<CustomInput size='small' fullWidth variant='filled' placeholder='Search for an option' onChange={handleSearch}>
								Search
							</CustomInput>
						</Box>
						{filteredOption?.map(
							(item: any): JSX.Element => (
								<MenuItem value={item.value}>
									<Grid display={'flex'} alignItems={'center'}>
										{item.src ? (
											<Image width={35} height={35} style={{ borderRadius: 8, marginRight: 10 }} src={item.src} alt='test' />
										) : (
											renderImagePlaceholder()
										)}
										<Typography variant='subtitle1' sx={{ opacity: 0.6 }}>
											{item.label}
										</Typography>
									</Grid>
								</MenuItem>
							),
						)}
						{/* {shouldShowError && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
					</Select>
				);
			}}
		/>
	);
};

export default ImageTextEditField;
