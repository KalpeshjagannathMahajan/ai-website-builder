import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Modal, Icon } from 'src/common/@the-source/atoms';
import { t } from 'i18next';

function CartConfirmationModal({
	show_order_quote_modal,
	handle_close_order_quote_modal,
	handle_create_document_by_type,
	type,
	buyer,
	is_primary_loading,
	is_secondary_loading,
}: any) {
	return (
		<Modal
			width={520}
			open={show_order_quote_modal}
			onClose={handle_close_order_quote_modal}
			title={t('CartSummary.CartSummaryCard.ConfirmationTitle', { DocumentType: type })}
			footer={
				<Grid container justifyContent='end'>
					<Button variant='outlined' onClick={handle_close_order_quote_modal} sx={{ marginRight: '1rem' }}>
						Cancel
					</Button>
					<Button
						onClick={() => handle_create_document_by_type(type)}
						loading={type === 'order' ? is_secondary_loading : is_primary_loading}>
						Proceed
					</Button>
				</Grid>
			}
			children={
				<>
					<CustomText type='Body'>
						{t('CartSummary.CartSummaryCard.ConfirmationBodyTitle', { DocumentType: type, AOrAn: type === 'order' ? 'an' : 'a' })}
					</CustomText>
					<Grid
						my={1}
						p={1}
						display={'flex'}
						flexDirection={'row'}
						gap={1}
						sx={{ background: '#F0F6FF', borderRadius: '8px', alignItems: 'center' }}>
						<Icon iconName='IconUser' color='#4578C4' sx={{ padding: '0.5rem', width: '24px', height: '24px' }} />
						<Grid container flexDirection={'column'} gap={0.3}>
							<CustomText type='Subtitle'>{buyer?.buyer_info?.name}</CustomText>
							<CustomText type='Caption' color='#00000099'>
								Current Pricelist : {buyer?.catalog?.label}
							</CustomText>
						</Grid>
					</Grid>
					{/* <Alert sx={{ px: 1, py: 0.3, background: 'white' }} severity='info'>
						{t('CartSummary.CartSummaryCard.ConfirmationSubtitle')}
					</Alert> */}
				</>
			}
		/>
	);
}

export default CartConfirmationModal;
