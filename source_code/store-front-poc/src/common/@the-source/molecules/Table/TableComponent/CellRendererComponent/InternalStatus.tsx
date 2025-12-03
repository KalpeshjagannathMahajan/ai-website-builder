import React from 'react';
import styles from '../Cell.module.css';
import utils from 'src/utils/utils';
import { Grid, Icon } from 'src/common/@the-source/atoms';
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';

interface Props {
	value: string[];
	valueFormatted?: any;
}

const InternalStatus: React.FC<Props> = ({ value, ...rest }) => {
	const { valueFormatted } = rest;
	const { icon_name, color }: any = utils.get_icon_info(String(valueFormatted));

	return (
		<Grid container alignItems='center' justifyContent='center' className={styles.agGridCustomCell}>
			{_.isEmpty(icon_name) ? <CustomText>--</CustomText> : <Icon iconName={icon_name} sx={{ width: '2.5rem', height: '2.5rem', color }} />}
		</Grid>
	);
};

export default InternalStatus;
