import { useContext } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Modal, Radio } from 'src/common/@the-source/atoms';
import OrderManagementContext from '../../context';
import { LOADING_CONSTANT } from '../../constants';
import _ from 'lodash';
import IconExcel from 'src/assets/images/IconExcel.png';
import IconPdf from 'src/assets/images/icons/iconPdf.svg';

interface FileDownloadModalInterface {
	open_modal: boolean;
	set_open_modal: (value: boolean) => void;
}

const download_options = [
	{ label: 'PDF', value: 'pdf' },
	{ label: 'Excel', value: 'excel' },
];

const FileDownloadModal = ({ open_modal, set_open_modal }: FileDownloadModalInterface) => {
	const { buyer_id, set_download_file_type, download_file_type, document_data, loader, handle_loading_state, get_order_summary } =
		useContext(OrderManagementContext);
	const { type } = document_data;
	const { download_loader } = loader;

	const handle_download = () => {
		handle_loading_state(LOADING_CONSTANT.download_loader, true);
		get_order_summary(buyer_id);
		set_open_modal(false);
	};

	return (
		<Modal
			open={open_modal}
			onClose={() => {
				set_open_modal(false);
			}}
			title={`Download ${type} form`}
			children={
				<Grid>
					<CustomText type='Body'>Select the file type for download</CustomText>
					<Grid container gap={2} pt={1.5} alignItems={'center'}>
						{_.map(download_options, (item) => {
							return (
								<Grid key={item?.value} sx={{ display: 'flex', gap: '0.75rem', flexDirection: 'row' }}>
									<Radio
										onChange={() => set_download_file_type(item?.value)}
										checked={download_file_type === item?.value}
										sx={{ padding: '0' }}
									/>
									<img src={item?.value === 'pdf' ? IconPdf : IconExcel} alt='img' />
									<CustomText type='Body'>{item?.label}</CustomText>
								</Grid>
							);
						})}
					</Grid>
				</Grid>
			}
			footer={
				<Grid container justifyContent='flex-end' spacing={2}>
					<Grid item>
						<Button onClick={() => set_open_modal(false)} variant='outlined' color='secondary'>
							Cancel
						</Button>
					</Grid>
					<Grid item>
						<Button onClick={handle_download} variant='contained' loading={download_loader}>
							Download
						</Button>
					</Grid>
				</Grid>
			}
		/>
	);
};

export default FileDownloadModal;
