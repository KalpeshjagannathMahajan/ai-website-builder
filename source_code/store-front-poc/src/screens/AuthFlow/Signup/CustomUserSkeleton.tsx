import React from 'react';
import { Box, Grid } from 'src/common/@the-source/atoms';
import { Skeleton } from '@mui/material';

interface Props {
	data: any;
}

const SkeletonHeader: React.FC<{ isNew: boolean }> = ({ isNew }) => (
	<Grid
		justifyContent='space-between'
		alignItems='center'
		sx={{ width: '100%', maxWidth: 425, margin: 'auto', marginTop: '50px', overflowY: 'auto' }}>
		<Box display='flex' flexDirection='row' gap='16px' sx={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
			<Skeleton variant='circular' width='28px' height={28} />
			<Skeleton variant='text' width='300px' height={50} />
		</Box>
		{isNew && (
			<Box display='flex' flexDirection='row' sx={{ justifyContent: 'space-around', alignItems: 'center', marginTop: '28px' }}>
				{[...Array(3)].map((_, index) => (
					<Grid key={index} display='flex' flexDirection='column' gap='10px' sx={{ justifyContent: 'center', alignItems: 'center' }}>
						<Skeleton variant='circular' width={30} height={30} />
						<Skeleton variant='text' width='100px' height='30px' />
					</Grid>
				))}
			</Box>
		)}
		<Grid display='flex' flexDirection='column' gap='12px' mt='30px'>
			{[...Array(isNew ? 6 : 7)].map((_, index) => (
				<Skeleton key={index} variant='rectangular' width='425px' height='56px' />
			))}
		</Grid>
	</Grid>
);

const CustomUserSkeleton: React.FC<Props> = ({ data }) => {
	return (
		<Grid className='form-container'>
			<SkeletonHeader isNew={data === 'new'} />
		</Grid>
	);
};

export default CustomUserSkeleton;
