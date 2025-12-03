import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps, styled } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { IconNames } from '../Icon/baseTypes';
import Icon from '../Icon/Icon';
import Image from '../Image/Image';
import Typography from '../Typography/Typography';

type IconButtonBaseProps = Pick<MuiIconButtonProps, 'color' | 'disabled' | 'name' | 'sx'>;

export interface SidebarIconProps extends IconButtonBaseProps {
	name: IconNames;
	type?: 'rounded' | 'square' | 'circle';
	clicked?: boolean;
	size?: 'small' | 'medium' | 'large';
	text?: string;
	fullWidth?: boolean;
	hasChildren?: boolean;
	expandIcon?: boolean;
	is_icon?: boolean;
	active_name?: any;
}

const SidebarIconClicked = styled(MuiIconButton)({
	color: '#FFF',
});

const SidebarIcon = ({
	name,
	clicked,
	disabled,
	type,
	size,
	text,
	fullWidth,
	hasChildren,
	expandIcon,
	active_name,
	is_icon = true,
	...rest
}: SidebarIconProps) => {
	const getBorderRadius = (): number => {
		switch (type) {
			case 'rounded':
				return 8;
			case 'square':
				return 0;
			case 'circle':
				return 50;
			default:
				return 8;
		}
	};

	const theme: any = useTheme();

	return clicked ? (
		<SidebarIconClicked
			size={size}
			sx={{
				backgroundColor: theme?.palette?.primary[600],
				':hover': {
					backgroundColor: theme?.palette?.primary[600],
					color: '#FFF',
				},
			}}
			style={fullWidth ? { width: '100%', borderRadius: getBorderRadius(), padding: '10.2px' } : { borderRadius: getBorderRadius() }}
			{...rest}>
			{is_icon ? <Icon fontSize='medium' color='#FFF' iconName={name} /> : <Image src={clicked ? active_name || name : name} />}
			{text && (
				<Grid container sx={{ marginLeft: '.5em' }}>
					<Typography color='#FFF' variant='h6'>
						{text}
					</Typography>
				</Grid>
			)}
			{hasChildren &&
				!!text &&
				(expandIcon ? <Icon color='#FFF' iconName='IconChevronUp' /> : <Icon color='#FFF' iconName='IconChevronDown' />)}
		</SidebarIconClicked>
	) : (
		<MuiIconButton
			disabled={disabled}
			color='secondary'
			disableRipple
			style={fullWidth ? { width: '100%', borderRadius: getBorderRadius(), padding: '10.2px' } : { borderRadius: getBorderRadius() }}
			size={size}
			{...rest}>
			{is_icon ? <Icon fontSize='medium' color='#676D77' iconName={name} /> : <Image src={name} />}
			{text && (
				<Grid container sx={{ marginLeft: '.5em' }}>
					<Typography color={theme?.palette?.secondary[800]} variant='body1'>
						{text}
					</Typography>
				</Grid>
			)}
			{hasChildren &&
				!!text &&
				(expandIcon ? <Icon color='#676D77' iconName='IconChevronUp' /> : <Icon color='#676D77' iconName='IconChevronDown' />)}
		</MuiIconButton>
	);
};

SidebarIcon.defaultProps = {
	type: 'rounded',
	disabled: false,
	clicked: false,
	size: 'medium',
	onClick: () => {},
	text: '',
	fullWidth: false,
	hasChildren: false,
	expandIcon: false,
};
export default SidebarIcon;
