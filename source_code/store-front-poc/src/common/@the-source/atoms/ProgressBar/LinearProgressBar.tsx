import { Box, LinearProgress as MuiLinearProgress, LinearProgressProps as MuiLinearProgressProps } from '@mui/material';

import Typography from '../Typography/Typography';

type LinearProgressBaseProps = Pick<MuiLinearProgressProps, 'value' | 'valueBuffer' | 'variant'>;

export interface LinearProgressProps extends LinearProgressBaseProps {
	value?: number;
	valueBuffer?: number;
	variant?: 'buffer' | 'determinate' | 'indeterminate';
	label?: boolean;
	sx?: any;
	progressStyles?: {
		[key: string]: string;
	};
}

const LinearProgressBar = ({ value, valueBuffer, variant, label, progressStyles, sx, ...rest }: LinearProgressProps) => {
	if (label) {
		return (
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Box sx={{ width: '100%', mr: 1 }}>
					<MuiLinearProgress sx={{ borderRadius: '8px' }} value={value} variant='determinate' {...rest} />
				</Box>
				<Box sx={{ minWidth: 35 }}>
					<Typography>{`${Math.round(Number(value))}%`}</Typography>
				</Box>
			</Box>
		);
	}
	return (
		<MuiLinearProgress
			sx={{
				width: '100%',
				borderRadius: '8px',
				'& .MuiLinearProgress-bar': {
					backgroundImage: 'linear-gradient(45deg, #6AB399, #7DA50E)',
					borderRadius: '8px',
					...progressStyles,
				},
				'& .css-lqhyza-MuiLinearProgress-bar1': {
					...progressStyles,
				},
				...sx,
			}}
			value={value}
			valueBuffer={valueBuffer}
			variant={variant}
			{...rest}
		/>
	);
};

LinearProgressBar.defaultProps = {
	value: 50,
	valueBuffer: 100,
	variant: 'indeterminate',
	label: false,
};

export default LinearProgressBar;
