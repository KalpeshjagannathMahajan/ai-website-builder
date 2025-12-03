import { FormControl, FormControlLabel, MenuProps, Radio, RadioGroup, Select } from '@mui/material';
import { useState } from 'react';
import { Icon, Box, Button } from '../../../atoms';
import styles from './SingleSelectFilter.module.css';
import { useTheme } from '@mui/material/styles';
import { t } from 'i18next';
import _ from 'lodash';

const DropdownIcon = () => <Icon iconName='IconChevronDown' sx={{ mr: '.5em' }} />;
const UpIcon = () => <Icon iconName='IconChevronUp' sx={{ mr: '.5em' }} />;

export interface SingleSelectDropdownProps {
	filterName: string;
	onUpdate: (val: string[]) => any;
	activeSelection?: string;
	options: object[];
	onClear: () => any;
}

const SingleSelectFilter = ({ filterName, onUpdate, options, activeSelection = '', onClear }: SingleSelectDropdownProps) => {
	const [selectedOption, setSelectedOption] = useState<string>(activeSelection);
	const [isOpen, setIsOpen] = useState(false);
	const theme: any = useTheme();

	const handleSelect = (event: any) => {
		setSelectedOption(event.target.value as string);
		onUpdate(event.target.value);
	};

	const handleClear = () => {
		setSelectedOption('');
		onClear();
		setIsOpen(false);
	};

	return (
		<FormControl fullWidth sx={{ minWidth: 150 }}>
			<Select
				displayEmpty
				value={selectedOption}
				defaultValue={activeSelection}
				onChange={handleSelect}
				onClose={() => setIsOpen(false)}
				onOpen={() => setIsOpen(true)}
				IconComponent={isOpen ? UpIcon : DropdownIcon}
				renderValue={(selected) => {
					if (selected.length === 0) {
						return filterName;
					}

					return (
						<>
							<span className={styles['red-dot']} style={{ ...theme?.product?.filter?.range_filter?.red_dot }} />
							{filterName}
						</>
					);
				}}
				sx={{
					pl: 0.25,
					height: 44,
					textOverflow: 'ellipsis',
				}}
				open={isOpen}
				MenuProps={
					{
						PaperProps: {
							style: {
								maxHeight: 420,
								width: 240,
								borderRadius: theme?.dropdown_border_radius?.borderRadius,
							},
							sx: {
								'& ul': {
									borderRadius: theme?.dropdown_border_radius?.borderRadius,
								},
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
				<RadioGroup
					aria-labelledby='demo-controlled-radio-buttons-group'
					name='controlled-radio-buttons-group'
					value={selectedOption}
					defaultValue={selectedOption}
					onChange={handleSelect}
					sx={{ pl: 1, ml: 1 }}>
					{options?.map((option: any) => (
						<FormControlLabel key={option?.value} value={option?.value} control={<Radio size='small' />} label={option.label} />
					))}
				</RadioGroup>
				<Box className={styles['bottom-button-container']}>
					{!_.isEmpty(selectedOption) && (
						<Button fullWidth color='secondary' variant='outlined' onClick={handleClear} sx={{ boxShadow: 'none' }}>
							{t('Common.FilterComponents.Clear')}
						</Button>
					)}
				</Box>
			</Select>
		</FormControl>
	);
};

SingleSelectFilter.defaultProps = {
	activeSelection: '',
};

export default SingleSelectFilter;
