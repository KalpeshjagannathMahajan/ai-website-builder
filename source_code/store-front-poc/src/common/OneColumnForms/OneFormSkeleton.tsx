import { Grid, Skeleton } from '../@the-source/atoms';
import { useTheme } from '@mui/material/styles';

const OneFormSkeleton = () => {
	const arr = [1, 2, 3, 4, 5, 6];
	const theme: any = useTheme();
	return (
		<Grid sx={{ backgroundColor: theme?.palette?.colors?.white, borderRadius: '20px', padding: '20px 40px' }}>
			{arr.map((a) => (
				<Grid key={a}>
					<Skeleton height='8rem' />
				</Grid>
			))}
			;
		</Grid>
	);
};

export default OneFormSkeleton;
