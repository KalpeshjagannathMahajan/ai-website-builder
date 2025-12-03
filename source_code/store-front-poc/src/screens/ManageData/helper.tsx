import _ from 'lodash';
import StatusChip from 'src/common/@the-source/atoms/Chips/StatusChip';
import utils from 'src/utils/utils';

const actions = [
	{
		name: 'download',
		action: 'download-file',
		icon: 'IconDownload',
		key: 'download',
	},
];

const CustomCell = (params: any) => {
	const value = params?.data?.task_status;
	const get_color = () => {
		if (value === 'Completed') return '#7DA50E';
		if (value === 'Failed') return '#D74C10';
		if (value === 'Cancelled') return '#F0AF30';
		return 'grey';
	};
	return (
		<StatusChip
			statusColor={get_color()}
			textStyle={{ fontSize: '1.4rem' }}
			sx={{ padding: '2px 10px', lineHeight: 'normal' }}
			label={value}
		/>
	);
};

const handle_download = (node: any) => {
	const download_url = _.get(node, 'data.href', '');
	if (!download_url) return;
	window.open(download_url, '_blank');
};

export const format_data = ({ rows, columns }: any) => {
	const new_col =
		columns?.map((col: any) => {
			if (col.dtype === 'status') {
				return {
					...col,
					flex: 1,
					cellRenderer: CustomCell,
				};
			}
			return {
				...col,
				flex: 1,
			};
		}) || [];
	return { rows: rows ? rows : [], columns: [...new_col, utils.create_action_config(actions, handle_download)] };
};
