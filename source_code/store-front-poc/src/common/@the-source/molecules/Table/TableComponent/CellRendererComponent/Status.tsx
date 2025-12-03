import React from 'react';
import styles from '../Cell.module.css';
import StatusChip from 'src/common/@the-source/atoms/Chips/StatusChip';
import utils from 'src/utils/utils';
import TagsCellRenderer from './Tag';
import { TABLE_CONSTANTS } from '../../constants';
import CustomText from 'src/common/@the-source/CustomText';
import _ from 'lodash';
import { useTheme } from '@mui/material/styles';

interface Props {
	value?: string[];
	valueFormatted?: any;
}

const StatusCellRenderer: React.FC<Props> = ({ value, valueFormatted }) => {
	const theme: any = useTheme();
	if (value && TABLE_CONSTANTS.PAYMENT_STATUS?.includes(valueFormatted?.toLowerCase())) {
		const helper = (str: string) => _.replace(str, /_/g, ' ');
		return <TagsCellRenderer value={value} valueFormatted={helper(valueFormatted)} />;
	} else {
		return (
			<div className={styles.agGridCustomCell}>
				{value ? (
					<StatusChip
						statusColor={utils.get_chip_color_by_status(valueFormatted)}
						textStyle={{ fontSize: '1.4rem' }}
						sx={{ padding: '2px 10px', lineHeight: 'normal', ...theme?.chip_, ...theme?.view_buyer?.status_chip_style }}
						label={value}
					/>
				) : (
					<CustomText>--</CustomText>
				)}
			</div>
		);
	}
};

export default StatusCellRenderer;
