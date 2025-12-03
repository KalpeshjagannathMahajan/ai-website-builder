import { Grid, Skeleton } from 'src/common/@the-source/atoms';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
	table_container: {
		display: 'flex',
		flexDirection: 'row',
		gap: '2px',
		justifyContent: 'space-between',
		border: '3px solid white',
		borderRadius: '10px',
	},
	column_container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	header_container: {
		width: '100%',
		minHeight: '78px',
	},
	cell_container: {
		borderTop: '1px solid lightgrey',
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		minHeight: '60px',
		justifyContent: 'center',
		alignItems: 'center',
	},
}));

export default function TableSkeleton({ cols = 8 }: { cols?: number }) {
	const columnArray = new Array(cols).fill(1);
	let rowArray = new Array(12).fill(0);
	const classes = useStyles();

	return (
		<Grid container className={classes.table_container}>
			{columnArray.map((item, index) => (
				<Grid flex={'1'} className={classes.column_container}>
					<Grid key={index} className={classes.header_container}>
						<Skeleton
							height={'39px'}
							width={'99%'}
							variant='rectangular'
							sx={{ borderTopLeftRadius: index === 0 ? '5px' : '0px', borderTopRightRadius: index === cols - 1 ? '5px' : '0px' }}
						/>
					</Grid>
					{rowArray.map((i, idx) => (
						<Grid key={idx} className={classes.cell_container}>
							<Skeleton height={'10px'} variant='rounded' width={'90%'} />
						</Grid>
					))}
				</Grid>
			))}
		</Grid>
	);
}
