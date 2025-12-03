import React from 'react';
import { Grid, Typography } from '../../atoms';
import { useTheme } from '@mui/material/styles';

const chip_container_style = {
	borderRadius: '40px',
	display: 'flex',
	gap: '0.5rem',
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 2,
	left: '5px',
	top: '8px',
	position: 'absolute',
	padding: '2px 8px',
};

interface Props {
	style?: any;
	text: string;
	color?: string;
}

const OutOfStock: React.FC<Props> = ({ style, text, color }) => {
	const theme: any = useTheme();

	return (
		<React.Fragment>
			<Grid sx={{ ...chip_container_style, ...theme?.product?.inventory_status?.out_of_stock?.container_style, ...style }}>
				<Typography
					color={color || theme?.product?.inventory_status?.out_of_stock?.color}
					sx={{
						fontSize: '11px',
						fontWeight: '700',
					}}>
					{text}
				</Typography>
			</Grid>
		</React.Fragment>
	);
};

export default OutOfStock;
