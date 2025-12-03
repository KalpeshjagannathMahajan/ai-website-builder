import { ReactNode } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '../Grid';

export interface PageHeaderProps {
	leftSection?: ReactNode;
	rightSection?: ReactNode;
	shiftToNextLine?: ReactNode;
	style?: any;
}

const PageHeader = ({ shiftToNextLine, leftSection, rightSection, style }: PageHeaderProps) => {
	const theme: any = useTheme();
	return (
		<Grid
			container
			display={'flex'}
			// padding={2}
			sx={{
				zIndex: theme?.page_header_component?.zIndex,
				background: theme?.palette?.background?.default,
				transition: 'background-color 0.2s ease-in-out',
				...style,
			}}
			// alignItems='center'
			// direction='row'
			justifyContent='space-between'
			className='breadcrumb-header'>
			{shiftToNextLine ? (
				<Grid display='flex' flexWrap='wrap' alignItems='center' width={'100%'} gap={1}>
					<Grid item xs={12} sm={12} md={5.9} lg={5.9}>
						{leftSection}
					</Grid>
					<Grid item xs={12} sm={12} md={5.9} lg={5.9} display='flex' justifyContent='flex-end' alignItems='center'>
						{rightSection}
					</Grid>
				</Grid>
			) : (
				<>
					<Grid item xs={6}>
						{leftSection}
					</Grid>
					<Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
						{rightSection}
					</Grid>
				</>
			)}
		</Grid>
	);
};

PageHeader.defaultProps = {
	style: {},
	shiftToNextLine: false,
	leftSection: <></>,
	rightSection: <></>,
};

export default PageHeader;
