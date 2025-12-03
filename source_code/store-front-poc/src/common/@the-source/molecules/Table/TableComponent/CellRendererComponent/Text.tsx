import _ from 'lodash';
import styles from '../Cell.module.css';
import utils from 'src/utils/utils';
import { Link } from 'react-router-dom';
import { Tooltip } from 'src/common/@the-source/atoms';

interface Props {
	value: any;
	valueFormatted?: any;
	checkboxSelection?: boolean;
	clickable?: boolean;
	colDef?: any;
	node?: any;
}

const TextCellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	let { valueFormatted, checkboxSelection, clickable, colDef, node } = rest;
	const is_hyper_link = _.get(colDef, 'cellRendererParams.isHyperLink', false);
	const hyper_link_url = is_hyper_link ? utils.get_custom_hyper_link(colDef, node?.data) : '';

	if (checkboxSelection) {
		return;
	}

	if (String(valueFormatted).trim() === '') valueFormatted = '--';
	const content =
		valueFormatted === '--' ? (
			<div className={styles.agGridCustomCell}>
				<span className={clickable ? styles.agGridCustomTextCell : ''}>{valueFormatted}</span>
			</div>
		) : (
			<Tooltip title={valueFormatted} arrow placement='bottom'>
				<div className={styles.agGridCustomCell}>
					<span className={clickable ? styles.agGridCustomTextCell : ''}>{valueFormatted}</span>
				</div>
			</Tooltip>
		);
	return is_hyper_link ? (
		<Link
			to={hyper_link_url}
			className={styles.agGridCustomCellHyperLink}
			onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => utils.prevent_default_link_click(event)}>
			{content}
		</Link>
	) : (
		content
	);
};
export default TextCellRenderer;
