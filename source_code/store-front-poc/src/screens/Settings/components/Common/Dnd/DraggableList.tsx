/* eslint-disable @typescript-eslint/no-shadow */
import { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import DraggableListItem from './DraggableListItem';

interface Props {
	onDrop: (items: any) => any;
	list: any;
	style?: any;
	droppable_id: any;
	fixed_top_rows?: number;
}

function DraggableList({ onDrop, list, style, droppable_id, fixed_top_rows = 0 }: Props) {
	const [items, setItems] = useState<any>(list);
	const is_item_moved = useRef(false);

	useEffect(() => {
		setItems(list);
	}, [list]);

	const move_item = (result: any) => {
		if (!result?.destination) return;
		if (result?.destination?.index <= fixed_top_rows) return;
		const updatedItems = [...items];
		const [movedItem] = updatedItems.splice(result?.source?.index, 1);
		updatedItems.splice(result?.destination?.index, 0, movedItem);
		setItems(updatedItems);
		is_item_moved.current = true;
	};

	const handleDelete = (list_index: number) => {
		setItems((prev: any) => prev.filter((index: number) => index !== list_index));
		is_item_moved.current = true;
	};

	useEffect(() => {
		if (is_item_moved.current) {
			onDrop(items);
			is_item_moved.current = false;
		}
	}, [items, is_item_moved.current]);

	return (
		<DragDropContext onDragEnd={move_item}>
			<Droppable droppableId={droppable_id}>
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{items?.map(({ node, show_icon, dragable, delete_able, key, onDelete }: any, index: number) => {
							return (
								<Draggable key={key} draggableId={key} index={index} isDragDisabled={!dragable}>
									{(provided) => (
										<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
											<DraggableListItem
												onDelete={() => onDelete(key)}
												delete_able={delete_able}
												handleDelete={() => handleDelete(index)}
												node={node}
												key={key || index}
												index={index}
												style={style}
												show_icon={show_icon}
											/>
										</div>
									)}
								</Draggable>
							);
						})}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}

export default DraggableList;
