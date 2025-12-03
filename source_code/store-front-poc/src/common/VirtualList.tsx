import List from 'rc-virtual-list';

interface VirtualListProps {
	data: any[];
	height?: number;
	item_key: (item: any) => any;
	render_item: (item: any, index: number) => JSX.Element | null;
	list_style?: any;
	item_height?: number;
}

const VirtualList = ({ data, height, list_style, item_key, item_height, render_item }: VirtualListProps) => {
	return (
		<List data={data} style={list_style} height={height} itemHeight={item_height} itemKey={item_key}>
			{(item, index) => render_item(item, index)}
		</List>
	);
};

export default VirtualList;
