import { t } from 'i18next';
import { Button, Image } from 'src/common/@the-source/atoms';
import { useSelector } from 'react-redux';

import { makeStyles } from '@mui/styles';
import ImageLinks from 'src/assets/images/ImageLinks';
import { PERMISSIONS } from 'src/casl/permissions';
import CustomText from '../CustomText';

const useStyles = makeStyles(() => ({
	no_recent_orders: {
		backgroundColor: 'rgba(255, 255, 255, 0.7)',
		borderRadius: '10px',
		width: '100%',
		top: '160px',
		display: 'flex',
		gap: '24px',
		flexDirection: 'column',
		minHeight: '60vh',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: '2rem',
	},
}));

interface DashboardEmptyScreenProps {
	handle_create_order: () => any;
}

const DashboardEmptyScreen = ({ handle_create_order }: DashboardEmptyScreenProps) => {
	const classes = useStyles();

	const permissions = useSelector((state: any) => state?.login?.permissions);
	const create_order_permission = permissions.find((item: any) => item.slug === PERMISSIONS?.create_orders.slug);

	return (
		<div className={classes.no_recent_orders}>
			<Image src={ImageLinks.EmptyBuyerDashboardImage} width={170} height={120} />
			<CustomText type='H2'>{t('BuyerDashboard.Main.StartOrdering')}</CustomText>
			<CustomText type='Title' style={{ marginTop: '-20px' }}>
				{t('BuyerDashboard.Main.Explore')}
			</CustomText>
			{create_order_permission.toggle ? <Button onClick={handle_create_order}>{t('BuyerDashboard.Main.CreateOrder')}</Button> : null}
		</div>
	);
};

export default DashboardEmptyScreen;
