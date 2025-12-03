/* eslint-disable */
import { useEffect, useRef, useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Grid, Icon } from 'src/common/@the-source/atoms';
import { text_colors } from 'src/utils/light.theme';

const ItemType = 'LIST_ITEM';

const ListItem = ({ node, index, moveItem, dragable = true, show_icon = true, deleteable, onDelete, style, editable, onEdit }: any) => {
	const [, ref] = useDrag({
		isDragging: dragable,
		type: ItemType,
		item: { index },
	});

	const [, drop] = useDrop({
		accept: ItemType,
		drop: (draggedItem: any) => {
			if (draggedItem?.index !== index) {
				moveItem(draggedItem?.index, index);
				draggedItem.index = index;
			}
		},
	});

	return (
		<div ref={(nod) => ref(dragable && drop(nod))}>
			<Grid container display='flex' alignItems='center' sx={style}>
				<Grid justifyContent='center' alignItems='center' display='flex' item xs={show_icon ? 1 : 0}>
					{show_icon && <Icon iconName='IconGripVertical' sx={{ color: dragable ? text_colors.dark_grey : text_colors.disabled }} />}
				</Grid>

				<Grid item xs={show_icon ? (editable ? 9 : 10) : editable ? 11 : 12}>
					{node}
				</Grid>

				<Grid justifyContent='center' alignItems='center' display='flex' item xs={editable ? 1 : 0}>
					{editable && (
						<Icon
							onClick={() => onEdit()}
							sx={{
								color: text_colors.dark_grey,
								cursor: 'pointer',
							}}
							iconName='IconEdit'
						/>
					)}
				</Grid>

				<Grid justifyContent='center' alignItems='center' display='flex' item xs={deleteable ? 1 : 0}>
					{deleteable && (
						<Icon
							onClick={() => onDelete()}
							sx={{
								color: text_colors.dark_grey,
								cursor: 'pointer',
							}}
							iconName='IconX'
						/>
					)}
				</Grid>
			</Grid>
		</div>
	);
};

const MovableList = ({ list = [], onDrop = () => {}, style = {} }: any) => {
	const [items, setItems] = useState(list);
	const isItemMoved = useRef(false);

	useEffect(() => {
		setItems(list);
	}, [list]);
	const moveItem = (fromIndex: number, toIndex: number) => {
		const updatedItems = [...items];
		const [movedItem] = updatedItems.splice(fromIndex, 1);
		updatedItems.splice(toIndex, 0, movedItem);
		setItems(updatedItems);
		isItemMoved.current = true;
	};

	useEffect(() => {
		if (isItemMoved.current) {
			onDrop(items);
			isItemMoved.current = false;
		}
	}, [items, isItemMoved.current]);

	return (
		<DndProvider backend={HTML5Backend}>
			{items?.map(({ node, key, dragable, show_icon, deleteable, onDelete, editable, onEdit }: any, index: any) => (
				<ListItem
					onDelete={() => onDelete(key)}
					onEdit={() => onEdit(key)}
					deleteable={deleteable}
					dragable={dragable}
					node={node}
					key={key || index}
					index={index}
					style={style}
					moveItem={moveItem}
					show_icon={show_icon}
					editable={editable}
				/>
			))}
		</DndProvider>
	);
};

export default MovableList;
