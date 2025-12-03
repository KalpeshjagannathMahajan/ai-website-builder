import { Box, Icon, Typography } from '../../../atoms';
import styles from './FilterIcon.module.css';
import { useTheme } from '@mui/material/styles';

export interface FilterIconProps {
	onClick?: () => void;
	btnPrefix?: string;
}

const FilterIcon = ({ onClick, btnPrefix }: FilterIconProps) => {
	const theme: any = useTheme();
	return (
		<Box
			onClick={onClick}
			className={styles['icon-container']}
			sx={{
				...theme?.product?.filter?.filter_icon?.container,
			}}>
			<Typography color={theme?.product?.filter?.filter_icon?.color} variant='body1'>
				{btnPrefix}
			</Typography>
			<Icon iconName='IconFilter' fontSize='small' color={theme?.palette?.secondary?.[700]} />
		</Box>
	);
};

FilterIcon.defaultProps = {
	onClick: () => {},
	btnPrefix: '',
};
export default FilterIcon;
