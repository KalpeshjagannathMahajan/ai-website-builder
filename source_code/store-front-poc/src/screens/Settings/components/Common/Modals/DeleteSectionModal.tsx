import { useContext } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import SettingsContext from '../../../context';
import { useTranslation } from 'react-i18next';

const DeleteSectionModal = ({ open, on_close, section_key }: any) => {
	const { t } = useTranslation();
	const { handle_delete_section } = useContext(SettingsContext);

	return (
		<Modal
			open={open}
			title={'Permanently Hide section?'}
			onClose={() => on_close(false)}
			children={
				<Grid>
					<CustomText type='Title'>{t('Settings.deleteSection.message')}</CustomText>
				</Grid>
			}
			footer={
				<Grid display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' color='secondary' onClick={on_close}>
						{t('Settings.CTA.cancel')}
					</Button>
					<Button
						color='error'
						onClick={() => {
							handle_delete_section(section_key);
							on_close();
						}}>
						{t('Settings.CTA.hide')}
					</Button>
				</Grid>
			}
		/>
	);
};

export default DeleteSectionModal;
