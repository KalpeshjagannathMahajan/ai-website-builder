import { Divider } from '@mui/material';
import { Box, Grid, Skeleton } from 'src/common/@the-source/atoms';

function CategoryFilterSkeleton() {
	return (
		<Grid container>
			<Divider />
			<Grid container mt={2} mb={1.2} justifyContent={'space-between'}>
				<Box display='flex' gap={1}>
					{[1, 2, 3, 4]?.map((item) => (
						<Skeleton
							key={item}
							variant='rectangular'
							width={162}
							height={40}
							sx={{
								borderRadius: 1,
							}}
						/>
					))}
				</Box>

				<Box display='flex' gap={0.8}>
					<Skeleton
						variant='rectangular'
						width={40}
						height={40}
						sx={{
							borderRadius: 1,
						}}
					/>
					<Skeleton
						variant='rectangular'
						width={290}
						height={40}
						sx={{
							borderRadius: 1,
						}}
					/>
				</Box>
			</Grid>
			<Skeleton
				variant='text'
				width={140}
				height={20}
				sx={{
					borderRadius: 1,
				}}
			/>
		</Grid>
	);
}

export default CategoryFilterSkeleton;
