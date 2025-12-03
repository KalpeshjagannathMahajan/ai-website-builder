import { memo } from 'react';
import { makeStyles } from '@mui/styles';

import { Icon, Typography } from 'src/common/@the-source/atoms';
import Menu from 'src/common/Menu';
import { useTheme } from '@mui/material/styles';
import { time_range_list } from './helper';

const useStyles = makeStyles(() => ({
	container: {
		width: '150px',
		display: 'flex',
		paddingTop: '6px',
		paddingBottom: '6px',
		justifyContent: 'space-between',
	},
	label_container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '10px 12px',
		borderRadius: '8px',
		gap: '4px',
		cursor: 'pointer',
		maxHeight: '40px',
	},
	redDot: {
		height: '7px',
		width: '7px',
		borderRadius: '50%',
		display: 'inline-block',
		marginRight: '0.5em',
	},
}));

interface TimeRangeTempProps {
	time_range: any;
	handle_time_range: any;
}

const TimeRangeTemp = ({ time_range, handle_time_range }: TimeRangeTempProps) => {
	const classes = useStyles();
	const theme: any = useTheme();
	return (
		<Menu
			LabelComponent={
				<div
					className={classes.label_container}
					style={{
						background: theme?.dashboard?.time_range?.label_container?.background,
						border: time_range.id !== 'last_30_days' ? theme?.dashboard?.time_range?.label_container?.border : 'none',
					}}
					onClick={() => {}}>
					{time_range.id !== 'last_30_days' && (
						<span className={classes.redDot} style={{ background: theme?.dashboard?.time_range?.red_dot?.background }} />
					)}
					<Typography
						color={theme?.dashboard?.time_range?.typography?.color}
						sx={{ fontWeight: time_range.id !== 'last_30_days' ? 700 : 400, fontSize: '14px' }}>
						{time_range.data.label}
					</Typography>
					<Icon iconName='IconChevronDown' color={theme?.dashboard?.time_range?.icon?.color} />
				</div>
			}
			closeOnItemClick={true}
			commonMenuOnClickHandler={(data: any) => {
				handle_time_range(data);
			}}
			commonMenuComponent={(_item: any) => {
				return (
					<div className={classes.container}>
						<Typography sx={{ fontWeight: 400, fontSize: '16px' }} color={theme?.palette?.colors?.black_8}>
							{_item.data.label}
						</Typography>
					</div>
				);
			}}
			menu={Object?.values(time_range_list)}
			selectedId={time_range?.id}
		/>
	);
};

const TimeRange = memo(TimeRangeTemp);

export default TimeRange;
