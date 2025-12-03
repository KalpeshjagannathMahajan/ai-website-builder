import ImageLinks from 'src/assets/images/ImageLinks';
import styles from '../Cell.module.css';
import { Image } from 'src/common/@the-source/atoms';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import utils from 'src/utils/utils';

interface Props {
	value: any;
	valueFormatted?: any;
	checkboxSelection?: boolean;
	clickable?: boolean;
	node?: any;
	colDef?: {
		field: string;
		headerName: string;
		sortable?: boolean;
		filter?: boolean;
		cellRendererParams?: {
			isHyperlink?: boolean;
			hyperLinkUrl?: string;
		};
		checkboxSelection?: boolean;
		[key: string]: any;
	};
}

const ImageText2CellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	let { valueFormatted, checkboxSelection, clickable, node, colDef } = rest;
	const is_hyper_link = _.get(colDef, 'cellRendererParams.isHyperLink', false);
	const hyper_link_url = is_hyper_link ? utils.get_custom_hyper_link(colDef, node?.data) : '';

	if (checkboxSelection) {
		return;
	}

	const handle_render_image = (img: any) => {
		switch (img) {
			case 'shopify':
				return <Image width={20} height={20} style={{ marginRight: 10 }} src={ImageLinks.shopify_icon} alt='shopify' />;
			case 'zoho':
				return <Image width={35} height={35} style={{ marginRight: 10 }} src={ImageLinks.zoho_logo} alt='zoho' />;
			case 'sos_inventory':
				return <Image width={35} height={35} style={{ marginRight: 10 }} src={ImageLinks.sos_inventory_logo} alt='sos_inventory' />;
		}
	};

	if (String(valueFormatted).trim() === '') valueFormatted = '--';

	const content = (
		<div className={styles.agGridCustomCell} style={{ display: 'flex', alignItems: 'center', maxHeight: '40px' }}>
			{handle_render_image(node?.data?.source)}
			<span className={clickable ? styles.agGridCustomTextCell : ''}>{valueFormatted}</span>
		</div>
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
export default ImageText2CellRenderer;
