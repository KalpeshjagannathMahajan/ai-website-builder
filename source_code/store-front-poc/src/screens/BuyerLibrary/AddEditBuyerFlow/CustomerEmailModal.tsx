import { t } from 'i18next';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import EmailModalContent from 'src/screens/OrderManagement/component/Common/EmailModalContent';

function CustomerEmailModal({
	is_modal_open,
	set_is_modal_open,
	is_button_loading,
	handle_final_submit,
	email_data,
	set_email_data,
	email_checkbox,
	set_email_checkbox,
}: any) {
	return (
		<Modal
			width={500}
			open={is_modal_open}
			onClose={() => set_is_modal_open(false)}
			title={t('Common.EmailModal.CustomerTitle')}
			footer={
				<Grid display='flex' justifyContent='flex-end' gap={1.2}>
					<Button onClick={() => set_is_modal_open(false)} variant='outlined'>
						{t('Common.EmailModal.Back')}
					</Button>
					<Button loading={is_button_loading} onClick={() => handle_final_submit()}>
						{t('Common.EmailModal.Confirm')}
					</Button>
				</Grid>
			}
			children={
				<EmailModalContent
					modal_message={{ sub: t('Common.EmailModal.CustomerSubTitle') }}
					payload={{
						entity: 'buyer',
						action: 'create_buyer',
					}}
					email_data={email_data}
					set_email_data={set_email_data}
					email_checkbox={email_checkbox}
					set_email_checkbox={set_email_checkbox}
					add_edit_permission={false}
				/>
			}
		/>
	);
}

export default CustomerEmailModal;
