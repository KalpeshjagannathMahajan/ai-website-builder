import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'react-i18next';
import { Box, Button, Grid, Icon, Modal, Skeleton } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { secondary } from 'src/utils/light.theme';
import { colors } from 'src/utils/theme';
import { useEffect, useState } from 'react';
import api_requests from 'src/utils/api_requests';
import { get_retrieved_card_data } from '../../AddEditBuyerFlow/components/helper/helper';
import { format_card_number } from '../helper';

const fields = [
	{ key: 'card_number', label: 'Card number', icon: 'IconCreditCard' as const },
	{ key: 'card_holder', label: 'Name', icon: 'IconUser' as const },
	{ key: 'expiry', label: 'Expiry (MM/YY)', icon: 'IconCalendarEvent' as const },
	{ key: 'cvv', label: 'CVV', icon: 'IconShieldLock' as const },
];

const ViewCardDetails = ({
	show_modal,
	set_show_modal,
	on_close,
	payment_method_id = '',
	access_token = '',
	base_url = '',
	width = 432,
	height = 'auto',
	is_from_app = false,
}: any) => {
	const [card_details, set_card_details] = useState<any>(null);
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const { t } = useTranslation();

	const handle_close = () => {
		set_show_modal && set_show_modal(false);
		if (on_close) {
			on_close();
		}
	};

	const get_card_details = async () => {
		try {
			const response: any = await api_requests.buyer.get_retrieval_token(payment_method_id, access_token, base_url);
			if (response?.status === 200) {
				const card_data = await get_retrieved_card_data(response?.data);
				set_card_details(card_data);
			}
		} catch (error) {
			console.error(error);
		} finally {
			set_is_loading(false);
		}
	};

	useEffect(() => {
		if (isEmpty(payment_method_id)) return;
		get_card_details();
	}, [payment_method_id]);

	const render_content = (
		<Grid container display='flex' flexDirection='column' gap={3}>
			{map(fields, (field) => (
				<Grid item key={field.key} display='flex' width='100%' gap={1.5}>
					<Box borderRadius='100px' display='flex' alignItems='center' p={1} bgcolor={secondary[200]} width='36px' height='36px'>
						{<Icon iconName={field.icon} color={colors.grey_800} />}
					</Box>
					<Box>
						<CustomText type='Caption' color={secondary[700]}>
							{field.label}
						</CustomText>
						{is_loading ? (
							<Skeleton width='150px' height='22px' />
						) : (
							<CustomText type='H6'>
								{field.key === 'card_number'
									? format_card_number(card_details?.[field.key])
									: !isEmpty(card_details?.[field?.key])
									? card_details?.[field?.key]
									: '--'}
							</CustomText>
						)}
					</Box>
				</Grid>
			))}
		</Grid>
	);

	const render_footer = (
		<Grid container display='flex' justifyContent='flex-end' mb={is_from_app ? 1 : 0}>
			<Button onClick={handle_close}>{t('Payment.ViewCardModal.Done')}</Button>
		</Grid>
	);

	return (
		<Modal
			open={show_modal}
			onClose={handle_close}
			title={t('Payment.ViewCardModal.CardDetails')}
			children={render_content}
			footer={render_footer}
			width={width}
			_height={height}
		/>
	);
};

export default ViewCardDetails;
