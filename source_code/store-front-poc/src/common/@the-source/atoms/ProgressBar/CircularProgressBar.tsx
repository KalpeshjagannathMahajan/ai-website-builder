import { CircularProgress as MuiCircularProgress, CircularProgressProps as MuiCircularProgressProps } from '@mui/material';

type CircluarProgressBaseProps = Pick<MuiCircularProgressProps, 'variant' | 'value'>;

export interface CircluarProgessBarProps extends CircluarProgressBaseProps {
	value?: number;
	variant?: 'determinate' | 'indeterminate';
	style?: any;
}

const CircularProgressBar = ({ value, variant, style, ...rest }: CircluarProgessBarProps) => (
	<MuiCircularProgress style={style} variant={variant} value={value} {...rest} />
);

CircularProgressBar.defaultProps = {
	value: 50,
	variant: 'indeterminate',
};

export default CircularProgressBar;
