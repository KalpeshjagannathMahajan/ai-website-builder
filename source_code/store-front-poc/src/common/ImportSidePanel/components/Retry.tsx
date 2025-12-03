import { makeStyles } from '@mui/styles';
import { t } from 'i18next';

import { Typography, Image } from 'src/common/@the-source/atoms';

const useStyles = makeStyles(() => ({
	container: {
		justifyContent: 'space-between',
		padding: '16px',
		borderRadius: '12px',
		background: '#F7F8FA',
		display: 'flex',
		gap: '16px',
	},
	right_section: {
		display: 'flex',
		gap: '12px',
		flexDirection: 'column',
	},
	button_section: {
		display: 'flex',
		gap: '12px',
	},
}));

const DownloadReUpload = () => {
	const classes = useStyles();
	const image_src = 'src/assets/images/custom_file.png';

	return (
		<div className={classes.container}>
			<Image src={image_src} width={'51.08px'} height={'59.64px'} />

			<div className={classes.right_section}>
				<div>
					<Typography sx={{ fontSize: '14px', fontWeight: 700 }} variant='subtitle2' color='rgba(0, 0, 0, 0.87)'>
						{t('ManageData.Retry.Upload')}
					</Typography>
					<Typography sx={{ fontSize: '14px', fontWeight: 400 }} variant='body2' color='rgba(0, 0, 0, 0.60)'>
						{t('ManageData.Retry.UploadExcel')}
					</Typography>
				</div>

				{/*	<div className={classes.button_section}>
					<Button color='primary' onClick={handle_click}>Retry</Button>
				</div>*/}
			</div>
		</div>
	);
};

export default DownloadReUpload;
