import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps as MuiSelectProps } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import { select_colors } from '../../../../utils/light.theme';
import Icon from '../Icon/Icon';
import Grid from '../Grid';
import CustomText from '../../CustomText';
import Image from '../Image';
import Chip from '../Chips';
import { get_formatted_price_with_currency } from 'src/utils/common';
import { filter } from 'lodash';
import { colors } from 'src/utils/theme';

type SelectBaseProps = Omit<MuiSelectProps, 'IconComponent' | 'minRows' | 'maxRows' | 'rows'>;

export interface SelectProps extends SelectBaseProps {
	// label: string;
	// error?: boolean;
	// value?: string;
	helperText?: string;
	options: OptionProps[];
	// displayEmpty?: boolean;
	handleChange: (value: any) => any;
	name?: any;
	useDefaultValue?: boolean;
}

export interface OptionProps {
	label: string;
	value: any;
	is_custom?: boolean;
	custom_labels?: any;
}

const SingleSelect = ({
	options,
	label,
	value,
	error,
	helperText,
	displayEmpty,
	size,
	name,
	handleChange,
	defaultValue,
	useDefaultValue = false,
	...rest
}: SelectProps) => {
	const theme: any = useTheme();
	const [option, setOption] = useState(defaultValue);
	const [has_assigned, set_has_assigned] = useState(false);
	const currency = useSelector((state: any) => state?.settings?.currency);
	const warning = theme?.palette?.warning;

	const handleSelectChange = (event: any) => {
		setOption(event.target.value);
		handleChange(event.target);
	};

	const getIcon = (props: any) => {
		if (error) {
			return <ErrorOutlineIcon htmlColor={select_colors.secondary} sx={{ marginRight: '.5em' }} />;
		} else {
			return <Icon iconName='IconChevronDown' color={theme?.palette?.secondary?.[600]} sx={{ marginRight: '.5em' }} {...props} />;
		}
	};

	const render_chips = (custom: any) => {
		if (custom?.is_authorized)
			return (
				<Chip
					sx={{ fontWeight: '700' }}
					bgColor={warning[200]}
					label={`${get_formatted_price_with_currency(currency, custom?.authorized_amount)} authorized`}
					textColor={warning[900]}
				/>
			);
		else if (has_assigned && custom.is_selected)
			return <Chip sx={{ fontWeight: '700' }} bgColor={warning[500]} label='Assigned' textColor={select_colors.primary} />;
		else if (!has_assigned && custom.is_default)
			return <Chip sx={{ fontWeight: '700' }} bgColor={warning[500]} label='Default' textColor={select_colors.primary} />;
	};

	const render_card_content = (custom: any) => (
		<React.Fragment>
			<Image src={custom?.logo} width='40' />
			<CustomText type='Title'>{custom.title}</CustomText>
			<CustomText color={select_colors.text}>{custom.sub_title}</CustomText>
		</React.Fragment>
	);

	const render_ach_content = (custom: any) => (
		<React.Fragment>
			<CustomText type='Title'>{custom.title}</CustomText>
			<Chip
				size='small'
				bgColor={theme?.palette?.info[100]}
				sx={{ padding: '0px 4px' }}
				icon={<Icon iconName='IconBuildingBank' color={theme?.palette?.info?.main} />}
				label={
					<CustomText color={colors.black_8} type='Caption'>
						{custom?.bank_account_type}
					</CustomText>
				}
			/>
		</React.Fragment>
	);

	const render_custom_label = (custom: any, type: string) => {
		return (
			<Grid container alignItems='center' width='100%' justifyContent={'space-between'}>
				<Grid>
					<Grid display='flex' alignItems='center' gap={2}>
						{type === 'card' ? render_card_content(custom) : render_ach_content(custom)}
					</Grid>
					{type === 'ach' && <CustomText color={select_colors.text} children={custom?.sub_title} />}
				</Grid>

				<Grid>{render_chips(custom)}</Grid>
			</Grid>
		);
	};

	useEffect(() => {
		const temp = filter(options, (item: any) => item?.custom_labels?.is_selected);
		if (temp?.length > 0) {
			set_has_assigned(true);
		}
	}, [options]);

	useEffect(() => {
		if (defaultValue && useDefaultValue) {
			setOption(defaultValue);
		}
	}, [useDefaultValue, defaultValue]);

	return (
		<FormControl fullWidth error={error} size={size}>
			<InputLabel id='simple-select-label'>{label}</InputLabel>
			<Select
				labelId='simple-select-label'
				id='select-id'
				label={label}
				value={option}
				defaultValue={defaultValue ? defaultValue : options[0]?.value}
				displayEmpty={displayEmpty}
				onChange={handleSelectChange}
				IconComponent={getIcon}
				name={name}
				sx={{ ...theme?.form_elements_ }}
				{...rest}>
				{options?.map(
					(item: any): JSX.Element => (
						<MenuItem value={item.value}>{item?.is_custom ? render_custom_label(item?.custom_labels, item?.type) : item.label}</MenuItem>
					),
				)}
			</Select>
			<FormHelperText>{helperText}</FormHelperText>
		</FormControl>
	);
};

SingleSelect.defaultProps = {
	disabled: false,
	error: false,
	value: '',
	helperText: '',
	displayEmpty: false,
	name: 'select',
};
export default SingleSelect;
