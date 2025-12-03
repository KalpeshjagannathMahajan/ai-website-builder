import { useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';

export const WarningModal = ({
	open_warn_modal = false,
	set_open_warn_modal = (val: boolean) => {
		val;
	},
	header_txt = '',
	modal_text = '',
	butt_lft_txt = '',
	butt_rght_txt = '',
	butt_lft_func = (set_butt_lft_loading: any) => {
		set_butt_lft_loading;
	},
	butt_rght_func = (set_butt_rght_loading: any) => {
		set_butt_rght_loading;
	},
}) => {
	const [butt_lft_loading, set_butt_lft_loading] = useState(false);
	const [butt_rght_loading, set_butt_rght_loading] = useState(false);
	return (
		<Modal
			open={open_warn_modal}
			onClose={() => set_open_warn_modal(false)}
			title={header_txt}
			children={
				<Grid py={0.5}>
					<CustomText type='Body'>{modal_text}</CustomText>
				</Grid>
			}
			footer={
				<Grid display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' color='inherit' loading={butt_lft_loading} onClick={() => butt_lft_func(set_butt_lft_loading)}>
						{butt_lft_txt}
					</Button>
					<Button variant='contained' color='error' loading={butt_rght_loading} onClick={() => butt_rght_func(set_butt_rght_loading)}>
						{butt_rght_txt}
					</Button>
				</Grid>
			}
		/>
	);
};
