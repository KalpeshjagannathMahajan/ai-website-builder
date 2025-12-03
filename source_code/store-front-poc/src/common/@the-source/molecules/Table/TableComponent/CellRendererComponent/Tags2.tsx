import React from 'react';
import styles from '../Cell.module.css';
import { Chip } from 'src/common/@the-source/atoms';
import { Trans } from 'react-i18next';
interface Props {
	value: string[];
	valueFormatted?: any;
}

const Tags2CellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	let { valueFormatted } = rest;
	if (valueFormatted.trim() === '') valueFormatted = '0';
	valueFormatted = Number(valueFormatted);
	let count;
	count = valueFormatted <= 1 ? 1 : valueFormatted;

	return (
		<div className={styles.agGridCustomCell}>
			{valueFormatted === 0 ? (
				'--'
			) : (
				<Chip
					textColor={'black'}
					bgColor={'#EEF1F7'}
					label={
						<Trans i18nKey='Tables.Tags.ShowingItems' count={count}>
							{{ valueFormatted }} item
						</Trans>
					}
					sx={{ marginRight: 1, fontSize: 12, border: '2px solid white' }}
				/>
			)}
		</div>
	);
};

export default Tags2CellRenderer;
