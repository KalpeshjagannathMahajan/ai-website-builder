import { Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Grid, Skeleton } from 'src/common/@the-source/atoms';

const useStyles = makeStyles(() => ({
	container: {
		padding: '24px',
		height: 'calc(100vh - 53px)',
		overflow: 'scroll',
		background: 'white',
	},
	itemContainer: {
		marginRight: '8px',
		width: 75,
		display: 'flex',
		flexDirection: 'column',
		gap: 4,
		justifyContent: 'center',
		alignItems: 'center',
	},
}));

const SkeletonCustomProduct = () => {
	const classes = useStyles();
	const rows = [1, 2, 3];
	const items = [1, 2, 3, 4, 5];

	return (
		<Grid className={classes.container}>
			{rows.map((row, index) => (
				<>
					<Grid key={row} item xs={12}>
						<Grid container flexDirection='column' gap={2}>
							<Skeleton variant='rounded' width={75} height={16} sx={{ background: '#D1D6DD' }} />

							<Grid item container sx={{ display: 'flex', flexDirection: 'row' }}>
								{items.map((item) => (
									<Grid key={item} className={classes.itemContainer}>
										<Skeleton variant='rectangular' width={75} height={75} sx={{ borderRadius: '4px' }} />
										<Skeleton variant='rounded' width={49.5} height={11} />
									</Grid>
								))}
							</Grid>
						</Grid>

						<Divider sx={{ width: '100%', margin: '28px 0' }} />

						<Grid container flexDirection='column' gap={2}>
							<Skeleton variant='rounded' width={75} height={16} sx={{ background: '#D1D6DD' }} />
							<Grid item container sx={{ display: 'flex', flexDirection: 'row' }}>
								{items.map((item) => (
									<Grid key={item} item container sx={{ marginRight: '10px' }} width={65}>
										<Skeleton variant='rectangular' width={65} height={32} sx={{ borderRadius: '40px' }} />
									</Grid>
								))}
							</Grid>
						</Grid>

						<Divider sx={{ width: '100%', margin: '28px 0' }} />

						<Grid container flexDirection='column' gap={2}>
							<Skeleton variant='rounded' width={75} height={16} sx={{ background: '#D1D6DD' }} />
							<Grid item container sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
								<Skeleton variant='rounded' width={495} height={11} />
								<Skeleton variant='rounded' width={174} height={11} />
							</Grid>
						</Grid>
					</Grid>
					{index !== rows.length - 1 && <Divider sx={{ width: '100%', margin: '28px 0' }} />}
				</>
			))}
		</Grid>
	);
};

export default SkeletonCustomProduct;
