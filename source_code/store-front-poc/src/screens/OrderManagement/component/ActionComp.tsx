import { Grid, Icon, Tooltip } from 'src/common/@the-source/atoms';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { document } from 'src/screens/OrderManagement/mock/document';
import React from 'react';
import { useSelector } from 'react-redux';
import utils, { check_permission, should_handle_click } from 'src/utils/utils';
import useCatalogActions from 'src/hooks/useCatalogActions';

interface Event {
	event: MouseEvent;
}

const useStyles = makeStyles((theme: any) => ({
	iconStyle: {
		cursor: 'pointer',
		color: theme?.order_management?.action_comp?.icon_style_color,
		margin: '8px',
		transition: '0.2s ease-in-out',
		'&:hover': {
			color: theme?.order_management?.action_comp?.icon_hover_color,
			transform: 'scale(1.2)',
		},
	},
	tooltipText: {
		fontSize: '1.2rem',
	},
}));

const ActionComp: React.FC<any> = ({ value, type, ...rest }) => {
	const { actions } = rest?.colDef?.actions || {};
	const { valueFormatted, node } = rest;
	const permissions = useSelector((state: any) => state?.login?.permissions);
	const classes = useStyles();
	const edit_disallowed = useSelector((state: any) => state?.settings?.Edit_Disallowed_After_Pending_Approval);
	const is_hyper_link = _.get(rest?.colDef, 'cellRendererParams.isHyperLink', false);
	const hyper_link_url = is_hyper_link ? utils.get_custom_hyper_link(rest?.colDef, rest?.data) : '';
	const { handle_reset_catalog_mode } = useCatalogActions();

	const is_confirmed_order_editable =
		useSelector((state: any) => state?.settings?.enable_confirmed_order_editing) &&
		check_permission(permissions, ['edit_confirmed_orders']);

	const check_if_next_is_null = (documentType: any) => {
		const elements_with_next_null = Object.keys(document[documentType]).filter((key) => document[documentType][key].next === null);
		return node?.data?.document_status === 'confirmed' ? false : elements_with_next_null.includes(node?.data?.document_status);
	};

	const get_icon_name = (documentType: any) => {
		if (node?.data?.document_status === 'confirmed') {
			return is_confirmed_order_editable ? 'IconEdit' : 'IconEye';
		} else {
			return check_if_next_is_null(documentType) ||
				(node?.data?.document_status === 'pending-approval' && edit_disallowed) ||
				node?.data?.type === 'invoice'
				? 'IconEye'
				: 'IconEdit';
		}
	};

	const render_icon = (ele: any) => {
		const documentType = node?.data?.type === 'order' ? 'ORDER_ACTIONS' : 'QUOTE_ACTIONS';
		const iconName = get_icon_name(documentType);
		const title = iconName === 'IconEye' ? 'View' : 'Edit';

		const handle_click = (event: Event) => {
			if (!should_handle_click(event)) return;
			ele.onClick({ valueFormatted, type, ...rest }, ele.action);
		};

		const icon_content = (
			<Tooltip title={title} placement='right' textStyle={classes.tooltipText} arrow>
				<div>
					<Icon className={classes.iconStyle} key={ele.key} onClick={handle_click} iconName={iconName} size='large' />
				</div>
			</Tooltip>
		);

		return is_hyper_link ? (
			<Link
				to={hyper_link_url}
				onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
					utils.prevent_default_link_click(event);
					handle_reset_catalog_mode();
				}}>
				{icon_content}
			</Link>
		) : (
			icon_content
		);
	};

	return (
		<Grid container mt={1} justifyContent='center' alignItems='center'>
			{actions && actions.map(render_icon)}
		</Grid>
	);
};

export default ActionComp;
