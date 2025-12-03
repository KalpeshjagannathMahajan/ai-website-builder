import { map } from 'lodash';
import { Grid, Skeleton } from 'src/common/@the-source/atoms';

const arr = Array.from({ length: 7 }).fill(null);

const EditRecurringDrawerSkeleton = () => {
	return (
		<Grid width='100%' display={'flex'} direction='column' gap={'40px'}>
			<Grid display='flex' direction='column' gap={'25px'} maxHeight={'50vh'}>
				{map(arr, () => (
					<Skeleton height={'50px'} variant='rounded' />
				))}
			</Grid>
		</Grid>
	);
};
export default EditRecurringDrawerSkeleton;
