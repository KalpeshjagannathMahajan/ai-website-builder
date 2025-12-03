import { t } from 'i18next';
import { Avatar, Box, Button, Drawer, Grid, Icon, Typography } from '../../atoms';

const ImportDrawer = ({ open, setOpen, handleUploadBtn, handleDownloadBtn, handleClose }: any) => {
	const importDrawerContent = (
		<Box>
			<Grid container mx={2} my={2}>
				<Grid item xs={10}>
					<Typography variant='h5'>{t('Common.ImportDrawer.Import/Export')}</Typography>
				</Grid>
				<Grid onClick={handleClose} mt={1} item style={{ cursor: 'pointer' }}>
					<Icon iconName='IconX' />
				</Grid>
			</Grid>
			<Grid
				width='32vw'
				mt={5}
				mx={2}
				style={{
					border: '1px solid rgba(0, 0, 0, 0.12)',
					borderRadius: '8px',
				}}>
				<Grid container mx={2} my={3}>
					<Grid item>
						<Box>
							<Typography variant='h6'>{t('Common.ImportDrawer.Import')}</Typography>
						</Box>
						<Box>
							<Typography variant='body1'>{t('Common.ImportDrawer.UploadSheet')}</Typography>
						</Box>
					</Grid>
					<Grid item ml={2}>
						<Avatar isImageAvatar={false} content={<Icon iconName='IconUpload' />} size='large' backgroundColor='#C4DBFF' />
					</Grid>
				</Grid>
				<Grid mx={2} mb={2}>
					<Button onClick={handleUploadBtn} tonal>
						{t('Common.ImportDrawer.Upload')}
					</Button>
				</Grid>
			</Grid>
			<Grid
				width='32vw'
				mt={5}
				mx={2}
				style={{
					border: '1px solid rgba(0, 0, 0, 0.12)',
					borderRadius: '8px',
				}}>
				<Grid container mx={2} my={3}>
					<Grid item>
						<Box>
							<Typography variant='h6'>{t('Common.ImportDrawer.Export')}</Typography>
						</Box>
						<Box>
							<Typography variant='body1'>{t('Common.ImportDrawer.GetSheet')}</Typography>
						</Box>
					</Grid>
					<Grid item ml={4}>
						<Avatar isImageAvatar={false} content={<Icon iconName='IconDownload' />} size='large' backgroundColor='#F9DFAC' />
					</Grid>
				</Grid>
				<Grid mx={2} mb={2}>
					<Button onClick={handleDownloadBtn} tonal>
						{t('Common.ImportDrawer.Download')}
					</Button>
				</Grid>
			</Grid>
		</Box>
	);

	return <Drawer anchor='right' open={open} content={importDrawerContent} onClose={() => setOpen(false)} />;
};

export default ImportDrawer;
