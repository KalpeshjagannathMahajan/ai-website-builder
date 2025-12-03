import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import SettingsContext from 'src/screens/Settings/context';

const QuickAddModal = ({ open, on_close, data, section_key }: any) => {
	const { t } = useTranslation();
	const { handle_quick_add_section } = useContext(SettingsContext);
	return (
		<Modal
			open={open}
			title={'Save Changes'}
			onClose={on_close}
			children={
				<Grid>
					<CustomText type='Title'>{t('Settings.QuickAdd.message')}</CustomText>
				</Grid>
			}
			footer={
				<Grid display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' onClick={on_close}>
						{t('Settings.CTA.cancel')}
					</Button>
					<Button
						onClick={() => {
							handle_quick_add_section(data, section_key);
							on_close();
						}}>
						{t('Settings.CTA.save')}
					</Button>
				</Grid>
			}
		/>
	);
};

export default QuickAddModal;
