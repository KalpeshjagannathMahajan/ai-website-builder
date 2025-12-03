import { ChipProps as MuiChipProps, Typography } from '@mui/material';
import Grid from '../Grid/Grid';
import { document } from 'src/screens/OrderManagement/mock/document';
import { useTheme } from '@mui/material/styles';

type ChipBaseProps = Pick<MuiChipProps, 'size' | 'label' | 'sx' | 'color'>;
export interface ChipProps extends ChipBaseProps {
	size?: any;
	label: any;
	statusColor: any;
	textStyle?: any;
	sx?: any;
}

const chipContainerStyle = {
	padding: '0.2rem 1.5rem',
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	background: 'white',
};

const chipStyle = {
	width: '1rem',
	height: '1rem',
	borderRadius: '50%',
	margin: '0.1rem 0.6rem 0rem 0rem',
};

const handleRenderStatus = (color: string) => {
	return <div style={{ ...chipStyle, backgroundColor: color }}></div>;
};

const StatusChip = ({ size, statusColor, label, textStyle, sx, ...rest }: ChipProps) => {
	const theme: any = useTheme();
	return (
		<Grid style={{ ...chipContainerStyle, ...theme?.statusChip_, ...sx }} {...rest}>
			{handleRenderStatus(statusColor)}
			<Typography variant='inherit' style={{ textTransform: 'capitalize', fontSize: '14px', ...textStyle }}>
				{label === document.DocumentStatus?.accepted
					? 'Converted to order'
					: label || <span style={{ backgroundColor: 'red', height: 20 }}></span>}
			</Typography>
		</Grid>
	);
};

StatusChip.defaultProps = {
	size: 'medium',
	label: '',
	statusColor: '',
};

export default StatusChip;
