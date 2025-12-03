import { Divider } from '@mui/material';
import { Grid, Skeleton } from 'src/common/@the-source/atoms';
import { useTheme } from '@mui/material/styles';

const FilterDrawerSkeleton = () => {
	const theme: any = useTheme();

	return (
		<Grid py={'1.4em'} px={'1em'} display={'flex'} direction={'column'} sx={{ minHeight: '100vh' }}>
			<Grid container display={'flex'} justifyContent={'space-between'}>
				<Skeleton variant='text' width='25%' height='3rem' sx={{ lineHeight: '24px', fontWeight: '400', fontSize: '16px' }} />
				<Skeleton variant='text' width='3.2rem' height='3rem' sx={{ lineHeight: '24px', fontWeight: '400', fontSize: '16px' }} />
			</Grid>
			<Grid>
				<Skeleton variant='text' width='100%' height='8rem' sx={{ lineHeight: '24px', fontWeight: '400', fontSize: '16px' }} />
				<Skeleton variant='text' width='100%' height='8rem' sx={{ lineHeight: '24px', fontWeight: '400', fontSize: '16px' }} />
				<Skeleton variant='text' width='100%' height='8rem' sx={{ lineHeight: '24px', fontWeight: '400', fontSize: '16px' }} />
				<Skeleton variant='text' width='100%' height='8rem' sx={{ lineHeight: '24px', fontWeight: '400', fontSize: '16px' }} />
				<Skeleton variant='text' width='100%' height='8rem' sx={{ lineHeight: '24px', fontWeight: '400', fontSize: '16px' }} />
			</Grid>
			<Divider sx={{ marginTop: 'auto', ...theme?.product?.filter?.all_filter_drawer?.skeleton_divider }} />
			<Grid container display={'flex'} justifyContent={'center'} gap={'8px'}>
				<Skeleton variant='text' width='48%' height='6rem' sx={{ lineHeight: '24px', fontWeight: '400', fontSize: '16px' }} />
				<Skeleton
					variant='text'
					width='48%'
					height='6rem'
					sx={{ bgcolor: '#04AA6D', lineHeight: '24px', fontWeight: '400', fontSize: '16px' }}
				/>
			</Grid>
		</Grid>
	);
};

export default FilterDrawerSkeleton;
