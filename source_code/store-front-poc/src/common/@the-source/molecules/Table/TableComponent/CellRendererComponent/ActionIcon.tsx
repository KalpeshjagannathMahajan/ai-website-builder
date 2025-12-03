import { Link } from 'react-router-dom';
import { Grid, Icon, Tooltip, Menu } from 'src/common/@the-source/atoms';
import { makeStyles } from '@mui/styles';
import { TABLE_CONSTANTS } from '../../constants';
import _ from 'lodash';
import React from 'react';
import utils, { should_handle_click } from 'src/utils/utils';

const useStyles = makeStyles({
	tooltip: {
		position: 'relative',
		transition: '0.2s ease-in-out',
		'&:hover': {
			color: 'black',
			transform: 'scale(1.2)',
		},
		'&:hover .tooltiptext': {
			visibility: 'visible',
		},
	},
	iconStyle: {
		cursor: 'pointer',
		color: '#676D77',
		margin: '8px',
		transition: '0.2s ease-in-out',
		'&:hover': {
			color: 'black',
			transform: 'scale(1.2)',
		},
	},
	menuStyle: {
		cursor: 'pointer',
		color: '#676D77',
		margin: '8px',
		transition: '0.2s ease-in-out',
		'&:hover': {
			color: 'black',
			transform: 'scale(1.2)',
			background: 'none',
		},
	},
	tooltiptext: {
		visibility: 'hidden',
		position: 'absolute',
		zIndex: '1',
	},
});

const ActionIconCellRenderer: React.FC<any> = ({ value, type, ...rest }) => {
	const { actions } = rest?.colDef?.actions || {};
	const { valueFormatted, node, cellRendererParams } = rest;
	const { data } = node;
	const classes = useStyles();
	const is_hyper_link = _.get(rest?.colDef, 'cellRendererParams.isHyperLink', false);
	const hyper_link_url = is_hyper_link ? utils.get_common_action_link(rest?.colDef, node?.data) : '';

	const handle_check_disable = (ele: any) => {
		return cellRendererParams?.should_disable_button && typeof cellRendererParams?.should_disable_button === 'function'
			? cellRendererParams.should_disable_button(data, ele?.key)
			: false;
	};

	const handle_render_icon = (action_icon: any, ele: any) => {
		switch (action_icon) {
			case TABLE_CONSTANTS.ACTION_LINK_ICON:
				return (
					<Link to={data?.href} key={ele?.key} title={ele?.name}>
						<Tooltip title={_.capitalize(ele?.key)} placement='right' textStyle={{ fontSize: '1.2rem' }} arrow>
							<Icon key={ele?.key} className={classes.iconStyle} iconName={ele?.icon} size='large' />
						</Tooltip>
					</Link>
				);
			case TABLE_CONSTANTS.ACTION_DOWNLOAD_ICON:
				const is_custom_download = _.get(rest, 'colDef.is_custom_download', false);
				return (
					<Link
						to={data?.href}
						key={ele?.key}
						title={ele?.name}
						onClick={
							is_custom_download
								? (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => should_handle_click(event) && ele?.onClick(node, event)
								: () => {}
						}>
						<Tooltip title={_.capitalize(ele?.key)} placement='right' textStyle={{ fontSize: '1.2rem' }} arrow>
							<div>
								<Icon key={ele?.key} className={classes.iconStyle} iconName={ele?.icon} size='large' />
							</div>
						</Tooltip>
					</Link>
				);
			case TABLE_CONSTANTS.ACTION_MENU:
				return (
					// <Tooltip title={_.capitalize(ele?.key)} placement='right' textStyle={{ fontSize: '1.2rem' }} arrow>
					<div>
						<Menu
							LabelComponent={<Icon iconName={ele?.icon} className={classes.menuStyle} />}
							menu={ele?.vals}
							onClickMenuItem={(item: any, event: React.MouseEvent) => {
								const params = {
									valueFormatted,
									type,
									node,
									item,
									...rest,
								};
								ele?.onClick(params, ele?.key, event);
							}}
						/>
					</div>
					// </Tooltip>
				);
			case TABLE_CONSTANTS.ACTION_EDIT:
				// TODO: need to improve this logic in future

				const handle_icon_click = (event: MouseEvent) => {
					if (handle_check_disable(ele)) return;
					if (event && !should_handle_click(event)) return;
					ele?.onClick({ valueFormatted, type, ...rest }, ele?.action);
				};
				return (
					<>
						{ele?.hide && data?.status !== 'active' ? (
							<Tooltip title={`${_.capitalize(ele?.key)} not available!`} placement='right' textStyle={{ fontSize: '1.2rem' }} arrow>
								<i>NA</i>
							</Tooltip>
						) : (
							<Tooltip title={_.capitalize(ele?.key)} placement='right' textStyle={{ fontSize: '1.2rem' }} arrow>
								<div>
									<Icon
										className={classes.iconStyle}
										key={ele?.key}
										onClick={handle_icon_click}
										iconName={ele?.icon}
										size='large'
										sx={{
											color: handle_check_disable(ele) ? 'rgba(79, 85, 94, 0.4) !important' : 'black',
										}}
									/>
								</div>
							</Tooltip>
						)}
					</>
				);

			default:
				return (
					<Tooltip title={_.capitalize(ele?.key)} placement='right' textStyle={{ fontSize: '1.2rem' }} arrow>
						<div>
							<Icon
								className={classes.iconStyle}
								key={ele?.key}
								onClick={handle_check_disable(ele) ? () => '' : () => ele?.onClick({ valueFormatted, type, ...rest }, ele?.action)}
								iconName={ele?.icon}
								size='large'
								sx={{
									color: handle_check_disable(ele) ? 'rgba(79, 85, 94, 0.4) !important' : 'black',
								}}
							/>
						</div>
					</Tooltip>
				);
		}
	};

	const handle_render_action_icons = (action_data: any) => {
		return _.map(action_data, (item) => (
			<React.Fragment key={item}>
				{is_hyper_link ? (
					<Link
						to={hyper_link_url}
						onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => utils.prevent_default_link_click(event)}>
						{handle_render_icon(item?.action, item)}
					</Link>
				) : (
					handle_render_icon(item?.action, item)
				)}
			</React.Fragment>
		));
	};

	return (
		<Grid container mt={1} justifyContent='center' alignItems='center'>
			{actions && handle_render_action_icons(actions)}
		</Grid>
	);
};

export default ActionIconCellRenderer;
