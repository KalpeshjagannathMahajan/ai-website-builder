import React, { useState } from 'react';
import { Menu, MenuItem, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import _ from 'lodash';
import { Button, Grid } from 'src/common/@the-source/atoms';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { EXPORT_OPTIONS } from 'src/utils/api_requests/manageData';
import { useTheme } from '@mui/material/styles';

const date_options: any = [
	{ label: 'Today', value: 'today' },
	{ label: 'Last week', value: 'last_week' },
	{ label: 'Last month', value: 'last_month' },
	// { label: 'Last 3 months', value: 'last_3_months' },
	// { label: 'Last 6 months', value: 'last_6_months' },
	{ label: 'All time', value: 'all_time' },
	{ label: 'Custom', value: 'custom' },
];

interface Props {
	payload: EXPORT_OPTIONS;
	set_payload: (_payload: EXPORT_OPTIONS) => void;
}

const DateFilterComp = ({ payload, set_payload }: Props) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedOption, setSelectedOption] = useState<string>('last_month');
	const [date_value, set_date_value] = useState<{ from_date: string | null; to_date: string | null }>({ from_date: null, to_date: null });
	const [from_error, set_from_error] = useState<string | null>(null);
	const [to_error, set_to_error] = useState<string | null>(null);
	const theme: any = useTheme();
	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const handleApplyCustomRange = () => {
		set_payload({
			option: payload.option,
			from_date: date_value?.from_date !== null && date_value?.from_date !== 'Invalid Date' ? date_value?.from_date : '',
			to_date: date_value?.to_date !== null && date_value?.to_date !== 'Invalid Date' ? date_value?.to_date : '',
		});
		handleCloseMenu();
	};

	const handleSelectOption = (option: any) => {
		setSelectedOption(option?.value);
		set_payload({ option: option?.value });
		if (option?.value !== 'custom') {
			handleCloseMenu();
		}
	};

	const display_label = () => {
		const label = _.find(date_options, { value: selectedOption })?.label;
		if (label !== 'Custom') return label;
		if (payload?.from_date && payload?.to_date) {
			const fromDate = dayjs(payload?.from_date).format('MMM DD, YYYY');
			const toDate = dayjs(payload?.to_date).format('MMM DD, YYYY');
			return `${fromDate} - ${toDate}`;
		} else if (!payload?.from_date && !payload?.to_date) {
			return 'Custom';
		} else if (!payload?.from_date) {
			const toDate = dayjs(payload.to_date).format('MMM DD, YYYY');
			return `Till - ${toDate}`;
		} else if (!payload?.to_date) {
			const fromDate = dayjs(payload.from_date).format('MMM DD, YYYY');
			return `From - ${fromDate}`;
		}
	};

	return (
		<Grid>
			<TextField
				label='Select date'
				value={display_label()}
				onClick={handleOpenMenu}
				InputProps={{
					endAdornment: <>{anchorEl ? <KeyboardArrowUp /> : <KeyboardArrowDown />}</>,
				}}
				fullWidth
			/>
			<Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleCloseMenu}>
				<Grid my={-1}>
					<Grid display='flex'>
						{selectedOption === 'custom' && (
							<Grid
								width='282px'
								display='flex'
								direction='column'
								p={1.6}
								gap={2}
								borderRight={theme?.import_export?.date_filter_comp?.border}>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
										sx={{ width: '100%' }}
										format='MM-DD-YYYY'
										inputFormat='MM-DD-YYYY'
										label='From'
										value={date_value?.from_date ? dayjs(date_value?.from_date) : null}
										onChange={(val) => set_date_value((prev: any) => ({ ...prev, from_date: dayjs(val)?.format('MM-DD-YYYY') }))}
										renderInput={(params: any) => <TextField {...params} label='From' />}
										slotProps={{
											day: { sx: { fontSize: '14px' } },
											calendarHeader: { sx: { fontSize: '14px' } },
										}}
										maxDate={dayjs(date_value?.to_date)}
										disableFuture
										onError={(err: any) => set_from_error(err)}
									/>
									<DatePicker
										sx={{ width: '100%' }}
										format='MM-DD-YYYY'
										inputFormat='MM-DD-YYYY'
										label='Till'
										value={date_value?.to_date ? dayjs(date_value.to_date) : null}
										onChange={(val) => set_date_value((prev: any) => ({ ...prev, to_date: dayjs(val)?.format('MM-DD-YYYY') }))}
										renderInput={(params: any) => <TextField {...params} label='Till' />}
										slotProps={{
											day: { sx: { fontSize: '14px' } },
											calendarHeader: { sx: { fontSize: '14px' } },
										}}
										minDate={dayjs(date_value?.from_date)}
										disableFuture
										onError={(err: any) => set_to_error(err)}
									/>
								</LocalizationProvider>
							</Grid>
						)}
						<Grid>
							{date_options?.map((option: any) => (
								<MenuItem
									key={option?.value}
									onClick={() => handleSelectOption(option)}
									sx={{
										width: '440px',
										height: '48px',
										background: option.value === selectedOption ? theme?.import_export?.date_filter_comp?.background : '',
									}}>
									{option?.label}
								</MenuItem>
							))}
						</Grid>
					</Grid>
					{selectedOption === 'custom' && (
						<Grid display='flex' gap={1} px={1} borderTop={theme?.import_export?.date_filter_comp?.border}>
							<Button
								onClick={() => {
									set_payload({ option: 'custom' });
									set_date_value({ from_date: null, to_date: null });
								}}
								sx={{ marginRight: 'auto', fontSize: '16px' }}
								disabled={!date_value?.from_date && !date_value?.to_date}
								variant='text'
								color='inherit'>
								Clear
							</Button>
							<Button onClick={handleCloseMenu} variant='text' color='inherit' sx={{ fontSize: '16px' }}>
								Cancel
							</Button>
							<Button
								disabled={from_error !== null || to_error !== null}
								onClick={handleApplyCustomRange}
								variant='text'
								sx={{ fontSize: '16px' }}>
								Apply
							</Button>
						</Grid>
					)}
				</Grid>
			</Menu>
		</Grid>
	);
};

export default DateFilterComp;
