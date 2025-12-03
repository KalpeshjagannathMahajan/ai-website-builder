import { Grid, Skeleton } from 'src/common/@the-source/atoms';
import TableSkeleton from 'src/common/TableSkeleton';

export default function ImportExportSkeleton() {
	const arr = [1, 2, 3, 4, 5, 6];

	return (
		<Grid my={3}>
			<Skeleton
				sx={{
					margin: '28px 0px 20px 0px',
				}}
				variant='text'
				width='150px'
			/>

			<Grid container bgcolor='white' width='100%' borderRadius={1}>
				<Grid display='flex' justifyContent='center' my={2.5} width='100%' gap={1.8}>
					{arr.map((item) => (
						<Skeleton
							key={item}
							variant='rectangular'
							sx={{
								borderRadius: 1,
							}}
							width='170px'
							height='160px'
						/>
					))}
				</Grid>
				<Grid container justifyContent='center' my={0.8}>
					<Skeleton variant='text' width='40rem' />
				</Grid>
				<Grid container justifyContent='center' gap={2} my={2} mb={2.8}>
					<Skeleton variant='rectangular' width='17rem' sx={{ borderRadius: 1 }} height='50px' />
					<Skeleton variant='rectangular' width='17rem' sx={{ borderRadius: 1 }} height='50px' />
				</Grid>
			</Grid>

			<Skeleton
				sx={{
					margin: '18px 0px 20px 0px',
				}}
				variant='text'
				width='70px'
			/>

			<TableSkeleton />
		</Grid>
	);
}
