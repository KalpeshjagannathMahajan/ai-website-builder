import { t } from 'i18next';
import ImageLinks from 'src/assets/images/ImageLinks';
import { Grid, Image, Typography } from 'src/common/@the-source/atoms';
import SkeletonLoader from '../Skeleton';

interface BuyerSkeletonProps {
	loading: boolean;
}

const BuyerCardSkeleton = ({ loading }: BuyerSkeletonProps) => {
	if (loading) {
		return <SkeletonLoader />;
	}
	return (
		<Grid container height='50vh' justifyContent='center' alignItems='center' flexDirection='column' gap={1}>
			<Image src={ImageLinks.empty_buyer_list} width='200px' height='200px' />
			<Typography sx={{ fontSize: '18px', fontWeight: '700' }}>{t('BuyerDashboard.BuyerList.BuyersNotFound')}</Typography>
		</Grid>
	);
};

export default BuyerCardSkeleton;
