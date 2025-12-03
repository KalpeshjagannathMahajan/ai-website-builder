import React from 'react';
import { Skeleton } from 'src/common/@the-source/atoms';

const SkeletonLoader = () => {
	const arr = [1, 2, 3, 4, 5, 6];

	return (
		<React.Fragment>
			{arr.map((ele) => (
				<Skeleton key={ele} variant='rounded' width='100%' sx={{ my: 0.2 }} height='110px' />
			))}
		</React.Fragment>
	);
};

export default SkeletonLoader;
