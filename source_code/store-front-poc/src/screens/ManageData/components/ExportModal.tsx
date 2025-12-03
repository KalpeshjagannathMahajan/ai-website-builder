import { makeStyles } from '@mui/styles';

import CircularProgressBar from 'src/common/@the-source/atoms/ProgressBar/CircularProgressBar';
import { Typography, Icon, Grid, Button } from 'src/common/@the-source/atoms';
import CustomDialog from 'src/common/CustomDialog';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles((theme: any) => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: '12px',
		background: theme?.import_export?.export_modal?.background,
		padding: '20px',
	},
	progress_bar_section: {
		display: 'flex',
		alignItems: 'center',
		gap: '7.5px',
	},
	check_box_section: {
		alignItems: 'center',
		display: 'flex',
	},
	body: {
		display: 'flex',
		flexDirection: 'column',
		gap: '24px',
		alignItems: 'center',
	},
}));

interface Props {
	show_modal: boolean;
	handle_close: () => void;
	selected_value: string;
}

const ExportModal = ({ show_modal, handle_close, selected_value }: Props) => {
	const classes = useStyles();
	const theme: any = useTheme();
	const { t } = useTranslation();

	return (
		<CustomDialog show_modal={show_modal} handle_close={handle_close} style={{ width: '471px' }}>
			<div className={classes.container}>
				<Grid container>
					<Grid item xs={3} />
					<Grid item xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
						{/*						<div style={{ width: '225px', height: '170px', background: 'lightgrey' }}></div>
						 */}{' '}
					</Grid>
					<Grid item xs={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<Icon
							iconName='IconX'
							color={theme?.import_export?.export_modal?.icon_color}
							sx={{ cursor: 'pointer' }}
							onClick={handle_close}
						/>
					</Grid>
				</Grid>

				<div className={classes.body}>
					<div className={classes.progress_bar_section}>
						<CircularProgressBar style={{ width: '16px', height: '16px' }} />
						<Typography
							sx={{ textAlign: 'center', fontWeight: 700, fontSize: '14px' }}
							variant='subtitle2'>{`${selected_value} export is in the process`}</Typography>
					</div>
					<Typography sx={{ textAlign: 'center', fontWeight: 400, fontSize: '14px' }} variant='body2'>
						{t('ManageData.ExportModal.GettingReady')}
					</Typography>

					<Button onClick={handle_close} color='primary'>
						{t('ManageData.ExportModal.GotIt')}
					</Button>
				</div>

				{/*<div className={classes.check_box_section}>
					<Checkbox checked={checked} onChange={handle_checked} />
					<Typography sx={{ fontWeight: 400, fontSize: '12px' }}>Don’t remind me again</Typography>
				</div>*/}
			</div>
		</CustomDialog>
	);
};

export default ExportModal;
