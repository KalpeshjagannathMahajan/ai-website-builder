import React, { useContext, useState } from 'react';
import { Divider, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import { Drawer, Icon, Button } from 'src/common/@the-source/atoms';
import { Group, ManageCustomGroupsProps, Product } from 'src/@types/manage_custom_groups';
import { DRAWER_WIDTH, useStyles } from './styles';
import { colors } from 'src/utils/theme';
import GroupedItems from './DraggableGroups';
import CartSummaryContext from '../../context';
import constants from 'src/utils/constants';
import { get_items } from '../../helper';
import _ from 'lodash';
import ActionModal from './ActionModal';

const { ACTION_MODAL_MODES, UNGROUPED_KEY } = constants.CART_GROUPING_KEYS;

const ManageCustomGroups: React.FC<ManageCustomGroupsProps> = ({ show_custom_group_drawer, set_show_custom_group_drawer }) => {
	const [groups, set_groups] = useState<Group[]>([]);
	const [is_action_modal, set_is_action_modal] = useState<boolean>(false);
	const [current_group, set_current_group] = useState<Group | null>(null);
	const [modal_mode, set_modal_mode] = useState<string>(ACTION_MODAL_MODES.EDIT);
	const classes = useStyles();
	const { t } = useTranslation();
	const { selected_container, container_is_display, toggle_button_value, cart, calculate_data, set_cart_loading } =
		useContext(CartSummaryContext);
	const { CUSTOM_GROUPING } = constants.CART_GROUPING_KEYS;

	const handle_close_drawer = () => {
		set_show_custom_group_drawer(false);
	};

	const handle_grouping_done = (): void => {
		set_cart_loading(true);
		const mapped_groups = _.map(groups, (group: Group) => {
			if (group && group.id) {
				const { id, products, ...rest } = group;
				const mapped_products: string[] = _.map(products, (product: Product) => product?.id);
				const mapped_cart_items: string[] = _.map(products, (product: Product) => product?.cart_item_id);
				return { ...rest, products: mapped_products, cart_items: mapped_cart_items };
			}
			return group;
		});
		calculate_data(
			selected_container,
			container_is_display,
			toggle_button_value,
			CUSTOM_GROUPING,
			set_cart_loading,
			get_items(cart),
			mapped_groups,
		);
		handle_close_drawer();
	};

	const handle_add_group = () => {
		set_current_group(null);
		set_modal_mode(ACTION_MODAL_MODES.ADD);
		set_is_action_modal(true);
	};

	const handle_delete_group = (group_id: string) => {
		const new_groups: Group[] = _.map(groups, (group: Group) => {
			if (group && group?.id === group_id) return null;
			if (group && group?.base_name === UNGROUPED_KEY) {
				const items_to_move = _.get(
					_.find(groups, (group_item: Group) => group_item?.id === group_id),
					'products',
					[],
				);
				return { ...group, products: [...group?.products, ...items_to_move] };
			}
			return group;
		}).filter((group: Group | null): group is Group => group !== null);
		set_groups(new_groups);
	};

	const render_header = (
		<Grid container className={classes.header}>
			<CustomText type='H2'>{t('CartSummary.ManageCustomGroups.ManageCustomGroupsHeader')}</CustomText>
			<Icon iconName='IconX' color={colors.secondary_text} sx={{ cursor: 'pointer' }} onClick={handle_close_drawer} />
		</Grid>
	);
	const render_footer = (
		<Grid className={classes.footer} container gap={3} justifyContent={'flex-end'}>
			<Button onClick={handle_add_group} variant='outlined'>
				<Icon iconName='IconPlus' color={colors.primary_500} className={classes.plus_icon} />
				{t('CartSummary.ManageCustomGroups.AddGroup')}
			</Button>
			<Button onClick={handle_grouping_done} variant='contained'>
				{t('CartSummary.ManageCustomGroups.Done')}
			</Button>
		</Grid>
	);
	const render_content = (
		<Grid container className='drawer-container'>
			{render_header}
			<Divider className='drawer-divider' />
			<Grid id='manage-custom-cart-groups' item className={classes.groupped_items}>
				<GroupedItems
					handle_add_group={handle_add_group}
					groups={groups}
					set_groups={set_groups}
					show_custom_group_drawer={show_custom_group_drawer}
					set_current_group={set_current_group}
					set_is_action_modal={set_is_action_modal}
					set_modal_mode={set_modal_mode}
				/>
			</Grid>
			<Divider className='drawer-divider' />
			{render_footer}
		</Grid>
	);
	return (
		<div id='manage-custom-groups_drawer'>
			<Drawer width={DRAWER_WIDTH} open={show_custom_group_drawer} onClose={handle_close_drawer} content={render_content} />
			{is_action_modal && (
				<ActionModal
					is_action_modal={is_action_modal}
					set_is_action_modal={set_is_action_modal}
					current_group={current_group}
					mode={modal_mode}
					set_groups={set_groups}
					groups={groups}
					handle_delete_group={handle_delete_group}
				/>
			)}
		</div>
	);
};

export default ManageCustomGroups;
