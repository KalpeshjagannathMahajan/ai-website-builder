import { Box as MuiBox, BoxProps as MuiBoxProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export interface BoxProps extends MuiBoxProps {}

const Box = ({ children, ...rest }: BoxProps) => {
	const theme: any = useTheme();
	return (
		<MuiBox borderRadius={theme?.thumbnail_?.borderRadius} {...rest}>
			{children}
		</MuiBox>
	);
};

Box.defaultProps = {};
export default Box;
