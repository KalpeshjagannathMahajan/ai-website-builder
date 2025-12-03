import React from 'react';
import { Skeleton } from 'src/common/@the-source/atoms';

function CartSkeleton() {
	return (
		<React.Fragment>
			{Array.from({ length: 2 }).map((ele: any) => (
				<Skeleton key={ele} sx={{ width: '100%', marginBottom: '1rem' }} height={'10rem'} variant='rounded' />
			))}
		</React.Fragment>
	);
}

export default CartSkeleton;
