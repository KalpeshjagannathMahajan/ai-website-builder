import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid } from 'src/common/@the-source/atoms';
import { useContext, useEffect } from 'react';
import SettingsContext from '../../context';
import SsrmFilterSorting from '../Common/SsrmFilterSorting';

const Sales = () => {
	const { get_keys_configuration, get_super_set } = useContext(SettingsContext);

	useEffect(() => {
		get_keys_configuration('document_ssrm_settings');
		get_keys_configuration('document_filter_config');
		get_super_set();
	}, []);

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>Sales view page settings</CustomText>
			</Grid>

			<SsrmFilterSorting entity={'document'} />
		</Grid>
	);
};

export default Sales;
