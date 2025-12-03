import { Drawer } from '@mui/material';
import { t } from 'i18next';
import _ from 'lodash';
import Lottie from 'react-lottie';
import Animations from 'src/assets/animations/Animations';
import PdfViewer from 'src/screens/UserDrive/components/PdfViewer';
import { Box, Button, Grid, Icon, SingleSelect } from '../../atoms';
import CustomText from '../../CustomText';
import classes from './PdfViewer.module.css';

interface OptionProps {
	[key: string]: any;
}

interface PDFViewProps {
	file_url: string;
	open: boolean;
	onClose: () => void;
	options?: Array<OptionProps>;
	selected_option?: string;
	onChange?: (value: any) => any;
	preview_loader?: boolean;
	handle_download_click?: () => void;
	download_loader?: boolean;
}

const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: Animations?.preview_pdf,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const PDFView = ({
	file_url,
	open,
	onClose,
	options,
	selected_option,
	onChange,
	preview_loader,
	handle_download_click,
	download_loader,
}: PDFViewProps) => {
	const modified_options = _.map(options, (option) => {
		return {
			label: option?.title || '',
			value: option?.id || '',
		};
	});

	return (
		<Drawer open={open} onClose={onClose} anchor='bottom' sx={{ height: '100vh' }}>
			<Box sx={{ background: '#fff' }}>
				<Box borderRadius={2}>
					<Box display='flex' justifyContent='space-between' alignItems='center' mx={3} my={2}>
						<Box width='30vw'>
							<CustomText type='H2'>{t('MultipleTearsheet.PreviewSheetTitle')}</CustomText>
						</Box>
						<Grid container alignItems='center' gap={1}>
							<Grid item ml='auto'>
								<Button
									disabled={download_loader || preview_loader}
									loading={download_loader}
									variant='contained'
									onClick={handle_download_click}>
									{t('MultipleTearsheet.Download')}
								</Button>
							</Grid>
							<Grid item>
								<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={onClose} />
							</Grid>
						</Grid>
					</Box>
					{preview_loader ? (
						<Box className={classes.loader_container}>
							<Box height='300px' width='300px'>
								<Lottie options={defaultOptions} height={300} width={300} />
							</Box>
							<Box>
								<CustomText type='BodyLarge'>{t('MultipleTearsheet.SuspenseText')}</CustomText>
							</Box>
						</Box>
					) : (
						<Box>
							<Box className={classes.preview_selector}>
								<SingleSelect
									className={classes.preview_switcher}
									value={selected_option}
									defaultValue={selected_option}
									label='Select template'
									options={modified_options}
									onChange={(event) => {
										onChange && onChange(event.target.value);
									}}
								/>
							</Box>
							<div id='content-display-cont'>
								<PdfViewer file_url={file_url} />
							</div>
						</Box>
					)}
				</Box>
			</Box>
		</Drawer>
	);
};

export default PDFView;
