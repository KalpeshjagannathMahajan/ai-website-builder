import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps } from '@mui/material';

type AvatarBaseProps = Pick<MuiAvatarProps, 'variant' | 'src' | 'children'>;

export interface AvatarProps extends AvatarBaseProps {
	size?: 'small' | 'medium' | 'large';
	backgroundColor?: string;
	color?: string;
	isImageAvatar?: boolean;
	content?: string | React.ReactNode;
	shadow?: string;
	style?: any;
	className?: any;
}

function getSize(size: string): number {
	switch (size) {
		case 'small':
			return 24;
		case 'medium':
			return 32;
		case 'large':
			return 40;
		default:
			return 40;
	}
}

const Avatar = ({ size, backgroundColor, color, children, isImageAvatar, content, shadow, style, className, ...rest }: AvatarProps) => (
	<MuiAvatar
		sx={{
			height: getSize(String(size)),
			width: getSize(String(size)),
			background: backgroundColor,
			boxShadow: shadow,
			color,
			...style,
		}}
		className={className}
		{...rest}>
		{!isImageAvatar && content}
	</MuiAvatar>
);

Avatar.defaultProps = {
	variant: 'rounded',
	size: 'medium',
	children: null,
	backgroundColor: '#B5BBC4',
	color: '#ffffff',
	content: <div />,
	shadow: '-4px 0px 8px rgba(0, 0, 0, 0.08)',
};

export default Avatar;
