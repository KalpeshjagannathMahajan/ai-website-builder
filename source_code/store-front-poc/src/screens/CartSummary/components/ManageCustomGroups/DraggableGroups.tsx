/* eslint-disable */
import { useContext, useEffect } from 'react';
import { Box, Button, Grid, Icon, Image } from 'src/common/@the-source/atoms';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';
import { colors } from 'src/utils/theme';
import { useStyles } from './styles';
import CartSummaryContext from '../../context';
import get_product_image from 'src/utils/ImageConstants';
import constants from 'src/utils/constants';
import { DraggableGroupProps, Group, GroupedItemsProps, MappedCustomGroup, Product } from 'src/@types/manage_custom_groups';

const { CART_SUMMARY_PAGE, UNGROUPED_KEY, ACTION_MODAL_MODES } = constants.CART_GROUPING_KEYS;

const { EDIT, DELETE } = ACTION_MODAL_MODES;

const DraggableItem = ({ item, provided }: { item: Product; provided: any }) => {
	const classes = useStyles();
	return (
		<div
			ref={provided.innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			className={classes.product_list}
			style={{
				...provided.draggableProps.style,
			}}>
			<Icon iconName='IconGripVertical' />
			<Image src={item?.product_image} alt={item?.product_name} imgClass={classes.product_list_img} />
			<Box>
				<CustomText type='Body2'>{item?.name}</CustomText>
				<CustomText type='Body'>{item?.sku_id}</CustomText>
			</Box>
		</div>
	);
};

const DraggableGroup: React.FC<DraggableGroupProps> = ({ group, index, on_delete, on_edit }) => {
	const classes = useStyles();
	const is_ungrouped = group?.base_name === UNGROUPED_KEY;

	const draggable_group_content = (provided: any) => (
		<Grid container alignItems='center' className={classes.draggable_group_header}>
			<Grid item {...(is_ungrouped && provided ? {} : provided?.dragHandleProps)}>
				<Icon iconName='IconGripVertical' color={is_ungrouped ? colors.secondary_text : ''} />
			</Grid>
			<Grid item xs>
				<CustomText type='H3' color={is_ungrouped ? colors.secondary_text : colors.black_8}>
					{group?.base_name}
				</CustomText>
			</Grid>
			{!is_ungrouped && (
				<Grid item gap={1} display='flex'>
					<Icon iconName='IconEdit' color={colors.secondary_text} sx={{ cursor: 'pointer' }} onClick={() => on_edit(group)} />
					<Icon iconName='IconTrash' color={colors.secondary_text} sx={{ cursor: 'pointer' }} onClick={() => on_delete(group.id)} />
				</Grid>
			)}
		</Grid>
	);
	const droppable_content = (
		<Droppable droppableId={group.id} type='item'>
			{(provided) => (
				<div ref={provided.innerRef} {...provided.droppableProps}>
					{!_.isEmpty(group?.products) ? (
						_.map(group?.products, (item, item_index) => (
							<Draggable key={item.id} draggableId={item.id} index={item_index}>
								{(draggableProvided) => <DraggableItem item={item} provided={draggableProvided} />}
							</Draggable>
						))
					) : (
						<Box p={1} textAlign='center'></Box> // [IMP] : This empty box is added to drop items in empty group
					)}
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	);
	return is_ungrouped ? (
		<>
			{draggable_group_content(null)}
			{droppable_content}
		</>
	) : (
		<Draggable draggableId={group.id} index={index} isDragDisabled={group?.base_name === UNGROUPED_KEY}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					className={classes.draggable_group}
					style={{
						...provided.draggableProps.style,
					}}>
					{draggable_group_content(provided)}
					{droppable_content}
				</div>
			)}
		</Draggable>
	);
};

const GroupedItems: React.FC<GroupedItemsProps> = ({
	groups,
	set_groups,
	set_modal_mode,
	set_current_group,
	set_is_action_modal,
	show_custom_group_drawer,
	handle_add_group,
}) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const { custom_groups, cart } = useContext(CartSummaryContext);
	const products_data = _.get(cart, 'data.products', []);

	const get_mapped_custom_group_products = (group: any) => {
		const new_data: any[] = [];
		_.map(cart?.data?.items, (product: any, id: string) => {
			const product_data = products_data?.[id];
			if (_.includes(group?.products, id)) {
				const cart_keys = _.keys(product);
				_.map(cart_keys, (cart_key) => {
					if (_.includes(group?.cart_items, cart_key)) {
						new_data.push({
							cart_item_id: cart_key,
							id: id,
							name: product_data?.name,
							sku_id: product_data?.sku_id,
							product_image: get_product_image(product_data, CART_SUMMARY_PAGE),
						});
					}
				});
			}
		});
		return new_data;
	};

	const get_mapped_custom_groups = () => {
		const mapped_groups = _.map(custom_groups, (group: MappedCustomGroup) => {
			const mapped_group_products: Product[] = get_mapped_custom_group_products(group) || [];
			const id = `${group?.base_name}_${Date.now()}`; // Added unique id to handle deletion & reordering of groups
			return { ...group, id, products: mapped_group_products };
		});
		return mapped_groups;
	};

	useEffect(() => {
		if (!custom_groups || !show_custom_group_drawer) return;
		const mapped_groups = get_mapped_custom_groups();
		set_groups(mapped_groups);
	}, [custom_groups, show_custom_group_drawer]);

	const on_drag_end = (result: DropResult) => {
		const { source, destination, type } = result;
		// Nothing happens if there's no destination or the item is dropped outside the droppable area
		if (!destination) return;

		if (type === 'group') {
			// Prevent moving the "Ungrouped" group
			if (source?.index === 0 || destination?.index === 0) return;

			const new_groups = Array.from(groups);
			const [removed] = new_groups.splice(source.index, 1);
			new_groups.splice(destination.index, 0, removed);
			set_groups(new_groups);
		} else if (type === 'item') {
			if (source.droppableId === destination.droppableId) {
				const group = _.find(groups, (g) => g.id === source.droppableId);
				if (!group) return;

				const new_items = Array.from(group.products);
				const [relocated_item] = new_items.splice(source.index, 1);
				new_items.splice(destination.index, 0, relocated_item);

				const new_groups = _.map(groups, (g) => (g.id === group.id ? { ...g, products: new_items } : g));

				set_groups(new_groups);
			} else {
				const source_group = _.find(groups, (g) => g.id === source.droppableId);
				const destination_group = _.find(groups, (g) => g.id === destination.droppableId);
				if (!source_group || !destination_group) return;

				const source_items = Array.from(source_group.products);
				const destination_items = Array.from(destination_group.products);

				const [moved_item] = source_items.splice(source.index, 1);
				destination_items.splice(destination.index, 0, moved_item);

				const new_groups = _.map(groups, (group_item) => {
					if (group_item?.id === source_group?.id) {
						return { ...group_item, products: source_items };
					} else if (group_item.id === destination_group.id) {
						return { ...group_item, products: destination_items };
					} else {
						return group_item;
					}
				});
				set_groups(new_groups);
			}
		}
	};

	const handle_edit_or_delete_group = (group: Group, is_delete?: boolean) => {
		set_current_group(group);
		set_modal_mode(is_delete ? DELETE : EDIT);
		set_is_action_modal(true);
	};

	return (
		<Grid container display={'block'}>
			<DragDropContext onDragEnd={on_drag_end}>
				<Droppable droppableId='all-groups' type='group' direction='vertical'>
					{(provided) => (
						<div {...provided.droppableProps} ref={provided.innerRef}>
							{_.map(groups, (group: Group, index: number) => (
								<div key={group.id}>
									<DraggableGroup
										group={group}
										index={index}
										on_delete={() => handle_edit_or_delete_group(group, true)}
										on_edit={() => handle_edit_or_delete_group(group)}
									/>
								</div>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
			<Button tonal onClick={handle_add_group} fullWidth>
				<Icon iconName='IconPlus' color={colors.primary_500} className={classes.plus_icon} />
				{t('CartSummary.ManageCustomGroups.AddGroup')}
			</Button>
		</Grid>
	);
};

export default GroupedItems;
