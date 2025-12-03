import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid } from 'src/common/@the-source/atoms';
import ChargeSection from '../Common/ChargeSection';
import { useContext, useEffect } from 'react';
import SettingsContext from '../../context';
import { useTranslation } from 'react-i18next';

const CartSummarySettings = () => {
	const { t } = useTranslation();
	const { configure, get_keys_configuration } = useContext(SettingsContext);
	useEffect(() => {
		get_keys_configuration('document_review_page_cart_summary');
	}, []);
	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>{t('Settings.Charges')}</CustomText>
			</Grid>
			{configure?.document_review_page_cart_summary && <ChargeSection />}
		</Grid>
	);
};

export default CartSummarySettings;
