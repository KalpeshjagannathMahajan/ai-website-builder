import utils from 'src/utils/utils';
import styles from '../Cell.module.css';
import { Chip } from 'src/common/@the-source/atoms';
import isObject from 'lodash/isObject';

interface Props {
	value: any;
	valueFormatted?: any;
	node?: any;
}

const SelectCellRenderer: React.FC<Props> = ({ value, node, ...rest }) => {
	const { valueFormatted } = rest;
	const style: any = {};
	if (rest?.colDef?.field === 'transaction_mode_info') {
		style.color = node?.data?.transaction_mode_info?.label === 'Collect' ? 'rgba(125, 165, 14, 1)' : 'rgba(107, 166, 254, 1)';
		style.fontWeight = 700;
		style.fontSize = '16px';
		return (
			<div className={styles.agGridCustomCell} style={style}>
				{valueFormatted?.label || '--'}
			</div>
		);
	} else if (rest?.colDef?.field === 'transaction_status_info') {
		const { textColor, bgColor } = utils.get_chip_color_by_tag(String(valueFormatted?.label));
		return (
			<div className={styles.agGridCustomCell}>
				<Chip
					textColor={textColor}
					bgColor={bgColor}
					label={valueFormatted?.label || '--'}
					sx={{ marginRight: 1, fontSize: 12, border: '2px solid white' }}
				/>
			</div>
		);
	}

	return (
		<div className={styles.agGridCustomCell}>{!isObject(valueFormatted) ? valueFormatted || '--' : valueFormatted?.label || '--'}</div>
	);
};

export default SelectCellRenderer;
