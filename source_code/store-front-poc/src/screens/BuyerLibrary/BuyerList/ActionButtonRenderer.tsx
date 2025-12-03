/* eslint-disable */
import styles from 'src/common/@the-source/molecules/Table/TableComponent/Cell.module.css';
import { useTheme } from '@mui/material/styles';
import { Button } from 'src/common/@the-source/atoms';
import { t } from 'i18next';
import { useSelector } from 'react-redux';
import _ from 'lodash';

const ActionButtonRenderer = ({ node, re_order_loading, ...rest }: any) => {
	const theme: any = useTheme();
	// const checking_source = ['Website', 'website', 'wizshop', 'Wizshop'];
	// const website_rep_order = _.includes(checking_source, node?.data?.entity_source) || _.includes(checking_source, node?.data?.source);

	const { enable_reorder_flow = false } = useSelector((state: any) => state?.settings);

	const handle_click = async () => {
		try {
			rest?.colDef?.handle_action_click && (await rest?.colDef?.handle_action_click({ node, ...rest }));
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className={styles.agGridCustomCell}>
			{enable_reorder_flow ? (
				<Button disabled={re_order_loading?.loading} onClick={handle_click}>
					{t('Common.ReOrderFlow.ReOrder')}
				</Button>
			) : (
				<span
					style={{ color: theme?.table_?.color, fontWeight: '700' }}
					onClick={() => rest?.colDef?.handle_action_click && rest?.colDef?.handle_action_click({ node, ...rest })}>
					View
				</span>
			)}
		</div>
	);
};

export default ActionButtonRenderer;
