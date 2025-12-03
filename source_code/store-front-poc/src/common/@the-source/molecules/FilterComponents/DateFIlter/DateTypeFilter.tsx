import _ from 'lodash';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Menu, MenuItem, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button, Grid, Typography, Icon } from 'src/common/@the-source/atoms';
import {
	DATE_FORMAT,
	DATE_OPTIONS,
	DateFilterProps,
	FilterState,
	INVENTORY_ETA,
	INVENTORY_ETA_OPTIONS,
	date_picker_props,
	empty_state,
	handle_get_value,
} from './helper';
import useStyles from './styles';
import { useTheme } from '@mui/material/styles';

const DateTypeFilter = ({ filterName, filter_key, onUpdate, activeSelection = [] }: DateFilterProps) => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const is_inventory_eta = filter_key === INVENTORY_ETA;
	const options: any[] = is_inventory_eta ? INVENTORY_ETA_OPTIONS : DATE_OPTIONS;
	const initial_filter_state: FilterState = {
		from_date: is_inventory_eta ? dayjs()?.format(DATE_FORMAT) : dayjs(activeSelection[0])?.format(DATE_FORMAT) || null,
		to_date: !_.isEmpty(activeSelection) ? dayjs(activeSelection[1])?.format(DATE_FORMAT) : null,
	};
	const [selectedOption, setSelectedOption] = useState<any>('');
	const [date_value, set_date_value] = useState<FilterState>(initial_filter_state);
	const [from_error, set_from_error] = useState<string | null>(null);
	const [to_error, set_to_error] = useState<string | null>(null);
	const theme: any = useTheme();

	const handle_default_option = (applied: any[]) => {
		if (!applied) return;
		let value_selected = '';
		_.map(options, (option: any) => {
			const val = handle_get_value(option?.value);

			if (_.isEqual(val, applied)) {
				value_selected = option?.value;
			}
		});

		if (_.isEmpty(value_selected) && !_.isEmpty(applied)) {
			setSelectedOption('custom');
		} else if (!_.isEmpty(value_selected) && !_.isEmpty(applied)) {
			setSelectedOption(value_selected);
		} else {
			setSelectedOption('');
		}
	};

	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const handleApplyCustomRange = () => {
		const payload: any[] = [
			date_value?.from_date !== null && date_value?.from_date !== 'Invalid Date'
				? dayjs(date_value?.from_date).startOf('day').unix() * 1000
				: '',
			date_value?.to_date !== null && date_value?.to_date !== 'Invalid Date' ? dayjs(date_value?.to_date).startOf('day').unix() * 1000 : '',
		];
		onUpdate(payload);
		handleCloseMenu();
	};

	const handleSelectOption = (option: any) => {
		setSelectedOption(option?.value);

		if (option?.value !== 'custom') {
			const payload: any[] = handle_get_value(option?.value);
			onUpdate(payload);
			handleCloseMenu();
		}
	};

	useEffect(() => {
		handle_default_option(activeSelection);
	}, []);

	return (
		<Grid>
			<Grid
				className={(!anchorEl && activeSelection?.length) === 0 ? classes.filter_box : classes.selected_filter_box}
				onClick={handleOpenMenu}>
				<Grid item>
					{activeSelection?.length > 0 && <span className={classes.red_dot} />}{' '}
					<Typography sx={{ fontFamily: theme?.product?.filter?.date_filter?.fontFamily }} variant='body-2'>
						{filterName}
					</Typography>
				</Grid>
				<Grid item alignItems='center'>
					<Icon iconName={anchorEl ? 'IconChevronUp' : 'IconChevronDown'} sx={{ marginTop: '.2em' }} />
				</Grid>
			</Grid>
			<Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleCloseMenu}>
				<Grid my={-1}>
					<Grid className={classes.date_container}>
						{selectedOption === 'custom' && (
							<Grid className={classes.date_fields}>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									{!is_inventory_eta && (
										<DatePicker
											format={DATE_FORMAT}
											inputFormat={DATE_FORMAT}
											label='From'
											value={date_value?.from_date ? dayjs(date_value?.from_date) : null}
											onChange={(val) => set_date_value((prev: any) => ({ ...prev, from_date: dayjs(val)?.format(DATE_FORMAT) }))}
											renderInput={(params: any) => <TextField {...params} label='From' />}
											slotProps={date_picker_props}
											maxDate={dayjs(date_value?.to_date)}
											disableFuture={!is_inventory_eta}
											onError={(err: any) => set_from_error(err)}
										/>
									)}
									<DatePicker
										format={DATE_FORMAT}
										inputFormat={DATE_FORMAT}
										label='Till'
										value={date_value?.to_date ? dayjs(date_value.to_date) : null}
										onChange={(val) => set_date_value((prev: any) => ({ ...prev, to_date: dayjs(val)?.format(DATE_FORMAT) }))}
										renderInput={(params: any) => <TextField {...params} label='Till' />}
										slotProps={date_picker_props}
										minDate={dayjs(date_value?.from_date)}
										disableFuture={!is_inventory_eta}
										onError={(err: any) => set_to_error(err)}
									/>
								</LocalizationProvider>
							</Grid>
						)}
						<Grid>
							{_?.map(options, (option: any) => (
								<MenuItem
									key={option?.value}
									className={option.value === selectedOption ? classes.selected_item : classes.menu_item}
									onClick={() => handleSelectOption(option)}>
									{option?.label}
								</MenuItem>
							))}
						</Grid>
					</Grid>
					{selectedOption === 'custom' && (
						<Grid className={classes.button_container}>
							<Button
								onClick={() => {
									set_date_value(empty_state);
								}}
								className={classes.clear_button}
								disabled={!date_value?.from_date && !date_value?.to_date}
								variant='text'
								color='inherit'>
								Clear
							</Button>
							<Button onClick={handleCloseMenu} variant='text' color='inherit' className={classes.button}>
								Cancel
							</Button>
							<Button
								disabled={from_error !== null || to_error !== null}
								onClick={handleApplyCustomRange}
								variant='text'
								className={classes.button}>
								Apply
							</Button>
						</Grid>
					)}
				</Grid>
			</Menu>
		</Grid>
	);
};

export default DateTypeFilter;
