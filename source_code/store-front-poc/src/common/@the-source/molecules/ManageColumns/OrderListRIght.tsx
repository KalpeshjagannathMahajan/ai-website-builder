/* eslint-disable */
import { CSSProperties, useContext, useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './ManageColumn.module.css';
import { Icon, Grid } from 'src/common/@the-source/atoms';
import { MyDataContext, Attribute } from './context';
import { Typography } from '@mui/material';

const get_filtered_data = (data: Attribute[]) => {
	return data.filter((attr) => attr.visibility);
};

const OrderListRight = () => {
	const context_value = useContext(MyDataContext);
	if (!context_value) {
		throw new Error('OrderListRight must be used within a MyDataContext');
	}
	const { data, new_array, set_new_array, set_reordered, pinned_values } = context_value;
	const [reordered_array, set_reordered_array] = useState<Attribute[]>([]);
	const grid = 4;

	useEffect(() => {
		if (data?.attributes) {
			const get_toggleable_attributes = get_filtered_data(data.attributes);
			set_new_array(get_toggleable_attributes);
		}
	}, [data?.attributes, pinned_values]);

	const get_item_style = (isDragging: boolean, draggableStyle: CSSProperties): CSSProperties => ({
		userSelect: 'none',
		padding: grid * 2,
		margin: `0 0 ${grid}px 0`,
		background: isDragging ? '#e9eaed54' : 'none',
		...draggableStyle,
	});

	const get_list_style = (isDraggingOver: boolean) => ({
		background: isDraggingOver ? '#e9eaed54' : 'none',
		padding: grid,
		borderRadius: '8px',
		width: 250,
	});

	const get_items = (displayArray: Attribute[]): Attribute[] => {
		const pinnedLeft = displayArray.filter((item) => item.pinned === 'left');
		const unpinned = displayArray.filter((item) => item.pinned !== 'left' && item.pinned !== 'right');
		const pinnedRight = displayArray.filter((item) => item.pinned === 'right');

		const orderedArray = [...pinnedLeft, ...unpinned, ...pinnedRight];
		return orderedArray.map((item: any, index: number) => {
			return { ...item, colId: index };
		});
	};

	const onDragEnd = (result: any) => {
		const { destination, source } = result;
		if (!destination) {
			return;
		}

		const items = Array.from(new_array);
		const [movedItem] = items.splice(source.index, 1);
		items.splice(destination.index, 0, movedItem);

		const updatedDataArray = items.map((item: any, index: number) => {
			return { ...item, colId: index };
		});

		set_new_array(updatedDataArray);
	};

	useEffect(() => {
		const updatedAttributes = reordered_array.map((item: any, index: number) => {
			return { ...item, colId: index.toString() };
		});

		const updatedData = {
			...data,
			attributes: updatedAttributes,
		};

		set_reordered([updatedData]);
	}, [reordered_array]);

	return (
		<Grid container className={styles.attrDrCont}>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId='droppable'>
					{(provided: any, snapshot: any) => (
						<div {...provided.droppableProps} ref={provided.innerRef} style={get_list_style(snapshot.isDraggingOver)}>
							{new_array.map((item, index) => (
								<Draggable key={item.colId} draggableId={`draggable-${item.colId}`} index={index} isDragDisabled={item.is_pinned}>
									{(providedInner: any, snapshotInner: any) => (
										<div
											ref={providedInner.innerRef}
											{...providedInner.draggableProps}
											{...providedInner.dragHandleProps}
											style={get_item_style(snapshotInner.isDragging, providedInner.draggableProps.style || {})}>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}>
												<span
													style={{
														display: 'flex',
														alignItems: 'center',
													}}>
													<Icon
														iconName='IconGripVertical'
														color={item.pinned ? 'rgba(154, 160, 170, 1)' : 'black'}
														sx={{ marginRight: '8px' }}
													/>
													<Typography variant='body2'>{item.headerName === '' ? ' ID' : item.headerName}</Typography>
												</span>
												{item.is_pinned && <Icon iconName='IconPin' color='black' />}
											</div>
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</Grid>
	);
};

export default OrderListRight;
