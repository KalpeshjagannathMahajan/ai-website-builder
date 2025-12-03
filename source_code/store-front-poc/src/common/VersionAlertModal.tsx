import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import CustomText from './@the-source/CustomText';
import { useTranslation } from 'react-i18next';

interface ICartItemProps {
	web_updated_to_latest_version: boolean;
}

const VersionAlertModal = ({ web_updated_to_latest_version }: ICartItemProps) => {
	const { t } = useTranslation();
	return (
		<Modal
			hideCloseIcon={true}
			open={!web_updated_to_latest_version}
			onClose={() => {}}
			title={t('VersionUpdate.Title')}
			children={
				<CustomText type='Body'>
					<div dangerouslySetInnerHTML={{ __html: t('VersionUpdate.Para') }} />
				</CustomText>
			}
			footer={
				<Grid container justifyContent='flex-end' spacing={2}>
					<Grid item>
						<Button
							onClick={() => {
								location.reload();
							}}
							variant='contained'>
							Refresh
						</Button>
					</Grid>
				</Grid>
			}
		/>
	);
};

export default VersionAlertModal;
