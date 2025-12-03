import { t } from 'i18next';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';

const ReviewCartModal = ({ open, on_close, onSubmit, data, loading }: any) => {
	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer' justifyContent='flex-end'>
				<Button variant='outlined' onClick={on_close}>
					Go back
				</Button>
				<Button loading={loading} onClick={() => onSubmit(data)}>
					Proceed
				</Button>
			</Grid>
		);
	};

	return (
		<Modal
			title={'Replace exisiting cart items?'}
			onClose={on_close}
			open={open}
			children={<CustomText>{t('Common.ReOrderFlow.ReplaceCartItems')}</CustomText>}
			footer={handle_render_footer()}
		/>
	);
};

export default ReviewCartModal;
