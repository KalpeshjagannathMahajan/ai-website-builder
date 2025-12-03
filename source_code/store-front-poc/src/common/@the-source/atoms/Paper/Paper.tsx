import { Paper as MuiPaper, PaperProps as MuiPaperProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export interface PaperProps extends MuiPaperProps {
	borderRadius?: 'string';
	minHeight?: 'string';
	background?: 'string';
	padding?: 'string';
	boxShadow?: string;
}

const Paper = ({ children, borderRadius, minHeight, background, padding, boxShadow, sx, ...rest }: PaperProps) => {
	const theme = useTheme();
	return (
		<MuiPaper
			{...rest}
			sx={{
				...sx,
				backgroundColor: theme?.palette?.background?.default,
				minHeight,
				borderRadius: 0,
				padding,
				boxShadow,
				transition: 'background-color 0.2s ease-in-out',
			}}>
			{children}
		</MuiPaper>
	);
};

Paper.defaultProps = {
	boxShadow: 'none',
};

export default Paper;
