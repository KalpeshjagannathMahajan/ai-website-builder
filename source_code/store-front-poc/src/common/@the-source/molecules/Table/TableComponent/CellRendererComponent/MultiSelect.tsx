import styles from '../Cell.module.css';
import { Chip } from 'src/common/@the-source/atoms';
import { useState } from 'react';

import { Typography } from 'src/common/@the-source/atoms';
import MenuHover from 'src/common/MenuHover';
import _ from 'lodash';

const ChipStyles = { cursor: 'pointer', fontSize: 12, border: '2px solid white' };

interface Props {
	value: any;
	valueFormatted?: any;
}

interface Option {
	value: any;
	label: string;
}

const MultiSelectCellRenderer: React.FC<Props> = ({ ...rest }) => {
	const { valueFormatted } = rest;

	return <div className={styles.agGridCustomCell}>{valueFormatted}</div>;
};

export const MultiSelect2CellRenderer: React.FC<Props> = ({ value }) => {
	const [meta, set_meta] = useState([]);
	const [loading, set_loading] = useState(true);

	const calculate_meta = () => {
		try {
			const transformed_meta = value?.map((item: Option) => {
				return {
					id: item.value,
					data: item,
				};
			});
			if (transformed_meta && transformed_meta?.length) set_meta(transformed_meta);
		} catch (error) {
		} finally {
			set_loading(false);
		}
	};

	return (
		<div className={styles.agGridCustomCell}>
			{value?.length > 1 ? (
				<MenuHover
					loading={loading}
					LabelComponent={
						<div style={{ cursor: 'pointer' }}>
							<Chip textColor='black' bgColor='#EEF1F7' label={value[0]?.label} sx={{ ...ChipStyles, marginRigh: 1 }} />
							<Chip textColor='black' bgColor='#EEF1F7' label={`+${value?.length - 1}`} sx={ChipStyles} />
						</div>
					}
					commonMenuComponent={(_item: any) => {
						return <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{_item?.data?.label}</Typography>;
					}}
					onOpen={calculate_meta}
					menu={meta}
				/>
			) : _.head(value)?.label?.trim() ? (
				<Chip textColor='black' bgColor='#EEF1F7' label={value?.[0]?.label} sx={{ ...ChipStyles, marginRigh: 1 }} />
			) : (
				<span className={styles.agGridCustomTextCell}>--</span>
			)}
		</div>
	);
};

export default MultiSelectCellRenderer;
