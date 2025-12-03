import { Alert } from '@mui/material';
import { t } from 'i18next';
import React, { useState } from 'react';
import { Button, Grid, Modal, Typography } from 'src/common/@the-source/atoms';
import '../styles.css';

interface BuyerModalProps {
	is_modal_open: boolean;
	handle_close_modal: () => void;
	has_cart: boolean;
	handle_cancel_transfer: () => void;
	confirm_loading: boolean;
	handle_confirm_transfer: () => void;
	selected_buyer_name: any;
}

const BuyerModal = ({
	is_modal_open,
	handle_close_modal,
	has_cart,
	handle_cancel_transfer,
	confirm_loading,
	handle_confirm_transfer,
	selected_buyer_name,
}: BuyerModalProps) => {
	const [cta_clicked, set_cta_clicked] = useState('');

	const handle_confirm = () => {
		set_cta_clicked('outline');
		handle_confirm_transfer();
	};

	const handle_transfer = () => {
		set_cta_clicked('primary');
		handle_cancel_transfer();
	};

	return (
		<Modal
			width={500}
			open={is_modal_open}
			onClose={handle_close_modal}
			title={
				has_cart
					? t('BuyerDashboard.SelectBuyerPanel.ActiveCart', { BuyerName: selected_buyer_name })
					: t('BuyerDashboard.SelectBuyerPanel.AssignCartToBuyer', { BuyerName: selected_buyer_name })
			}
			footer={
				<Grid container justifyContent='end'>
					<Button
						variant='outlined'
						loading={confirm_loading && cta_clicked === 'outline'}
						onClick={handle_confirm}
						disabled={confirm_loading && cta_clicked !== 'outline'}
						sx={{ marginRight: '1rem' }}>
						{has_cart ? t('BuyerDashboard.SelectBuyerPanel.Replace') : t('BuyerDashboard.SelectBuyerPanel.AssignCart')}
					</Button>
					<Button
						loading={confirm_loading && cta_clicked === 'primary'}
						onClick={handle_transfer}
						disabled={confirm_loading && cta_clicked !== 'primary'}>
						{has_cart ? t('BuyerDashboard.SelectBuyerPanel.ShowExisting') : t('BuyerDashboard.SelectBuyerPanel.NewCart')}
					</Button>
				</Grid>
			}
			children={
				<React.Fragment>
					<Typography sx={{ fontSize: 14, marginLeft: '10px' }} variant='body1'>
						{has_cart
							? t('BuyerDashboard.SelectBuyerPanel.DiscardPrevAndAssign?')
							: t('BuyerDashboard.SelectBuyerPanel.AssignCartToBuyer?')}
					</Typography>

					<Alert id='assign_cart_alert' sx={{ my: 1 }} severity='warning'>
						{t('BuyerDashboard.SelectBuyerPanel.AlertMessage')}
					</Alert>
				</React.Fragment>
			}
		/>
	);
};

export default BuyerModal;
