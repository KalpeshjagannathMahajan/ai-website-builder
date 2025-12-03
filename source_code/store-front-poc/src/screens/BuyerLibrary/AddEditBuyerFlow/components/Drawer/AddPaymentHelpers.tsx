import Lottie from 'react-lottie';
import { Box, Grid, Skeleton } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import LoaderLottie from 'src/assets/animations/redirect_loader.json';
import { map } from 'lodash';

export const iframe_loading_skeleton = () => {
	return (
		<Grid mt={1}>
			<Skeleton height={80} />
			<Box display='flex' justifyContent='space-between'>
				<Skeleton height={80} width={'48%'} />
				<Skeleton height={80} width={'48%'} />
			</Box>
			<Box display='flex' justifyContent='flex-end' mt={1}>
				<Skeleton width={90} height={60} />
			</Box>
		</Grid>
	);
};

export const payfabric_loader = () => {
	const skeletons = Array.from({ length: 10 }, (_, i) => i);
	return (
		<Grid width='100%' display='flex' gap={2} flexDirection='column'>
			{map(skeletons, (item) => (
				<Skeleton key={`skeleton-${item}`} height={35} />
			))}
		</Grid>
	);
};

export const redirect_component = () => {
	return (
		<Grid>
			<Box display='flex' justifyContent='center' alignItems='center' height='100%'>
				<Lottie
					options={{
						loop: true,
						autoplay: true,
						animationData: LoaderLottie,
						rendererSettings: {
							preserveAspectRatio: 'xMidYMid slice',
						},
					}}
					height={100}
					width={200}
				/>
			</Box>
			<Grid textAlign='center'>
				<CustomText type='H6'>Redirecting ...</CustomText>
			</Grid>
		</Grid>
	);
};

export const payment_attributes_validation: any = {
	first_name: {
		maxLength: 50,
	},
	last_name: {
		maxLength: 50,
	},
	address_1: {
		maxLength: 50,
	},
	address_2: {
		maxLength: 50,
	},
	city: {
		maxLength: 40,
	},
	state: {
		maxLength: 30,
	},
	zip: {
		maxLength: 20,
	},
	phone: {
		// being used in cybersource (as per docs)
		minLength: 6,
		maxLength: 32,
	},
};
