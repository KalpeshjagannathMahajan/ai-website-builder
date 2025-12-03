import { Chip as MuiChip, ChipProps as MuiChipProps } from '@mui/material';
type ChipBaseProps = Pick<MuiChipProps, 'size' | 'label' | 'variant' | 'onDelete' | 'deleteIcon' | 'sx' | 'color'>;
import { useTheme } from '@mui/material/styles';
export interface ChipProps extends ChipBaseProps {
	size?: any;
	label?: string | React.ReactNode;
	variant?: any;
	deleteIcon?: React.ReactElement;
	onDelete?: any;
	onClick?: any;
	bgColor?: string;
	textColor?: string;
	avatar?: React.ReactElement;
	className?: any;
	disabled?: boolean;
	icon?: React.ReactElement;
	sx?: any;
}

const Chip = ({
	size,
	label,
	variant,
	onDelete,
	deleteIcon,
	bgColor,
	textColor,
	sx,
	className,
	avatar,
	disabled,
	icon,
	...rest
}: ChipProps) => {
	const theme: any = useTheme();
	return (
		<MuiChip
			size={size}
			label={label}
			avatar={avatar}
			icon={icon}
			deleteIcon={deleteIcon}
			onDelete={onDelete}
			variant={variant}
			className={className}
			disabled={disabled}
			sx={{
				// MuiChip color prop only accepts certain enums.
				...sx,
				background: bgColor || sx?.background,
				color: textColor || sx?.color,
				borderRadius: theme?.chip_?.borderRadius,
				lineHeight: 'normal',
				...sx,
			}}
			{...rest}
		/>
	);
};

Chip.defaultProps = {
	size: 'medium',
	label: '',
	variant: '',
	deleteIcon: null,
	onDelete: '',
};

export default Chip;
