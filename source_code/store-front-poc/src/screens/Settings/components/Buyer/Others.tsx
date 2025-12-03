import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid } from 'src/common/@the-source/atoms';
import { useContext, useEffect } from 'react';
import SettingsContext from '../../context';
import SsrmFilterSorting from '../Common/SsrmFilterSorting';
import { useTranslation } from 'react-i18next';

const BuyerOthers = () => {
	const { t } = useTranslation();
	const { get_keys_configuration, get_super_set } = useContext(SettingsContext);

	useEffect(() => {
		get_keys_configuration('buyer_ssrm_settings');
		get_keys_configuration('buyer_filter_config');
		get_super_set();
	}, []);

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>{t('Settings.Buyer.listing')}</CustomText>
			</Grid>
			<SsrmFilterSorting entity={'buyer'} />
		</Grid>
	);
};

export default BuyerOthers;
