import { Grid, Icon } from 'src/common/@the-source/atoms';

function DraggableListItem({ node, index, handleDelete, show_icon = true, delete_able, onDelete, style }: any) {
	const handle_delete_item = () => {
		delete_able && handleDelete();
		onDelete();
	};

	const render_delete_icon = () => {
		if (delete_able) {
			return (
				<Icon
					onClick={handle_delete_item}
					sx={{
						color: 'rgba(103, 109, 119, 1)',
						cursor: 'pointer',
					}}
					iconName='IconX'
				/>
			);
		}
		return <div>&nbsp;</div>;
	};

	return (
		<Grid container display='flex' alignItems='center' sx={style} key={index}>
			<Grid justifyContent='center' alignItems='center' display='flex' item xs={1}>
				{show_icon ? <Icon iconName='IconGripVertical' sx={{ color: 'rgba(103, 109, 119, 1)' }} /> : <div>&nbsp;</div>}
			</Grid>
			<Grid item xs={show_icon ? 11.5 : 12}>
				{node}
			</Grid>
			<Grid item xs={0.5} sm={0.5} md={0.5} lg={0.5} xl={0.5} justifyContent='flex-end' alignItems='center' display='flex'>
				{render_delete_icon()}
			</Grid>
		</Grid>
	);
}

export default DraggableListItem;
