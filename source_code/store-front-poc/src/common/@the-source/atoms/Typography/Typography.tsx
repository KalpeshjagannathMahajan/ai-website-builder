import { Typography as MuiTypography, TypographyProps as MuiTypographyProps } from '@mui/material';
import _ from 'lodash';

type TypographyBaseProps = Pick<MuiTypographyProps, 'align' | 'color' | 'sx' | 'noWrap' | 'paragraph' | 'onClick'>;

export interface TypographyProps extends TypographyBaseProps {
	children?: any;
	color?: string;
	className?: any;
	truncateIn?: number;
}

function Typography({ color, children, noWrap, sx, truncateIn, className, ...rest }: TypographyProps) {
	if (_.get(rest, 'variant') === 'body1' || _.get(rest, 'variant') === 'subtitle1') _.set(rest, 'variant', 'inherit');
	return (
		<MuiTypography
			color={color}
			className={className}
			sx={
				noWrap
					? {
							...sx,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							display: '-webkit-box',
							WebkitLineClamp: truncateIn,
							WebkitBoxOrient: 'vertical',
					  }
					: { ...sx }
			}
			{...rest}>
			{children}
		</MuiTypography>
	);
}

Typography.defaultProps = {
	variant: 'contained',
	size: 'medium',
	color: 'secondary',
	children: '',
	truncateIn: 1,
};
export default Typography;
