import { RadioGroup as MuiRadioGroup, FormControl, useMediaQuery } from '@mui/material';
import { IPriceList } from 'src/reducers/buyer';
import { Chip, Grid, Icon, Image, Radio } from '../../atoms';
import { useEffect, useState } from 'react';
import CustomText from '../../CustomText';
import _ from 'lodash';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import FormBuilder from '../FormBuilder/FormBuilder';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import { get_formatted_price_with_currency } from 'src/utils/common';
import { useSelector } from 'react-redux';

import { colors } from 'src/utils/theme';

// type RadioBaseProps = Pick<MuiRadioProps, 'size' | 'checked' | 'disabled' | 'onChange'>;

export interface RadioButtonProps {
	selectedOption: string;
	options: IPriceList[];
	onChange: (name: string) => any;
	disabled?: boolean;
	label_style?: any;
	radio_label_style?: any;
	container_styling?: any;
	sx?: object;
	children?: any;
	child_style?: any;
	radio_icon_style?: any;
	from_drawer?: boolean;
	set_temp_selected_card?: any;
}

const RadioGroup = ({
	selectedOption: _selectedOption,
	options,
	onChange,
	label_style = {},
	disabled = false,
	radio_label_style = {},
	container_styling = {},
	radio_icon_style = {},
	children,
	child_style,
	from_drawer = false,
	set_temp_selected_card,
}: RadioButtonProps) => {
	const [selectedOption, setSelectedOption] = useState(_selectedOption);
	const [has_assigned, set_has_assigned] = useState(false);
	const theme: any = useTheme();
	const currency = useSelector((state: any) => state?.settings?.currency);
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));

	const handleChange = (event: any) => {
		setSelectedOption(event.target.value);
		onChange(event.target.value);
		if (set_temp_selected_card) {
			set_temp_selected_card(event.target.value);
		}
	};

	useEffect(() => {
		setSelectedOption(_selectedOption);
	}, [_selectedOption]);

	const render_chips = (custom: any) => {
		if (custom?.is_authorized)
			return (
				<Chip
					sx={{ fontWeight: '700' }}
					bgColor='#F9DFAC'
					label={`${get_formatted_price_with_currency(currency, custom?.authorized_amount)} authorized`}
					textColor='#684500'
				/>
			);
		else if (has_assigned && custom.is_selected)
			return (
				<Chip
					sx={{ fontWeight: '700' }}
					bgColor={theme?.order_management?.payment_method_section?.chip_color}
					label='Assigned'
					textColor='#FFF'
				/>
			);
		else if (!has_assigned && custom.is_default)
			return (
				<Chip
					sx={{ fontWeight: '700' }}
					bgColor={theme?.order_management?.payment_method_section?.chip_color}
					label='Default'
					textColor='#FFF'
				/>
			);
	};

	const render_custom_label = (custom: any, type: string) => {
		const render_logo = () =>
			custom?.logo && (
				<Image style={{ marginLeft: type === 'card' && !custom?.is_authorized ? '1rem' : '0' }} src={custom.logo} width='40' />
			);

		const render_ach_chip = () =>
			type === 'ach' &&
			custom?.bank_account_type && (
				<Chip
					size='small'
					bgColor={theme?.palette?.info[100]}
					sx={{ padding: '0px 4px', marginLeft: '10px' }}
					icon={<Icon iconName='IconBuildingBank' color={theme?.palette?.info.main} />}
					label={
						<CustomText color={colors.black_8} type='Caption'>
							{custom?.bank_account_type}
						</CustomText>
					}
				/>
			);

		return (
			<Grid container alignItems='center' width='100%' justifyContent={'space-between'} pr='1rem'>
				<Grid>
					<Grid display='flex' alignItems='center'>
						<CustomText type='Title' children={custom.title} />
						{type === 'card' && !custom?.is_authorized && render_logo()}
						{!from_drawer && !is_small_screen && render_ach_chip()}
					</Grid>
					<Grid display='flex' alignItems='center'>
						<CustomText color='rgba(0, 0, 0, 0.60)' children={custom?.sub_title} />
						{type === 'card' && custom?.is_authorized && render_logo()}
					</Grid>
				</Grid>

				<Grid>{render_chips(custom)}</Grid>
			</Grid>
		);
	};
	const render_label = (option: any) => {
		return (
			<Grid>
				<CustomText style={{ ...radio_label_style }} type='Title'>
					{option?.label}
				</CustomText>
				<CustomText type='Body'>{option?.custom_labels}</CustomText>
			</Grid>
		);
	};

	useEffect(() => {
		const temp = _.filter(options, (option) => option?.custom_labels?.is_selected);
		if (temp?.length > 0) {
			set_has_assigned(true);
		}
	}, [options]);

	return (
		<FormControl fullWidth sx={{ minWidth: 150 }}>
			<MuiRadioGroup
				aria-labelledby='demo-controlled-radio-buttons-group'
				name='controlled-radio-buttons-group'
				value={selectedOption}
				sx={label_style}
				defaultValue={selectedOption}
				onChange={handleChange}>
				{options?.map((option: any) => (
					<>
						<Grid
							key={option?.value}
							sx={{
								display: 'flex',
								width: '100%',
								alignItems: 'center',
								border: option.value === (selectedOption || _selectedOption) ? theme?.order_management.payment_active_card?.border : '',
								...container_styling,
								...theme?.card_,
								[!is_ultron && theme.breakpoints.down('sm')]: {
									border:
										option.value === (selectedOption || _selectedOption)
											? theme?.order_management.payment_active_card?.border
											: theme?.order_management.payment_active_card?.small_screen_border,
								},
							}}>
							<Radio
								size='small'
								checked={option.value === (selectedOption || _selectedOption) && !disabled}
								value={option?.value}
								disabled={disabled}
								onChange={handleChange}
								sx={radio_icon_style}
							/>
							{!option.is_custom ? render_label(option) : render_custom_label(option.custom_labels, option?.type)}
						</Grid>
						<Grid sx={child_style}>
							{children && option.value === (selectedOption || _selectedOption) && (
								<Grid bgcolor={'#F7F8F8'} padding={2} borderRadius={1.6}>
									{_.map(children, (attribute) => (
										<React.Fragment key={attribute?.id}>
											<FormBuilder
												placeholder={attribute?.name}
												label={attribute?.name}
												name={`${attribute?.id}`}
												validations={{
													required: Boolean(attribute?.required),
												}}
												style={{ backgroundColor: 'white' }}
												defaultValue={attribute?.value}
												type={attribute?.type}
												disabled={attribute?.disabled}
											/>
										</React.Fragment>
									))}
								</Grid>
							)}
						</Grid>
					</>
				))}
			</MuiRadioGroup>
		</FormControl>
	);
};

export default RadioGroup;
