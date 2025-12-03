import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from '@mui/material';

import Typography from '../Typography/Typography';

// type TooltipBaseProps = Pick<
// MuiTooltipProps
// >;

export interface TooltipProps extends MuiTooltipProps {}

const Tooltip = ({ children, title, textStyle, ...rest }: any) => (
	<MuiTooltip
		title={
			<Typography color='#FFF' sx={textStyle} variant='h6'>
				{title}
			</Typography>
		}
		{...rest}>
		{children}
	</MuiTooltip>
);

Tooltip.defaultProps = {};
export default Tooltip;
