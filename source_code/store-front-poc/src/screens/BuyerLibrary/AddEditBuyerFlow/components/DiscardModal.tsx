import { Button, Grid, Modal, Typography } from 'src/common/@the-source/atoms';

interface Props {
	on_close: any;
	is_open_alert: boolean;
	go_back: any;
}

const DiscardModal = ({ on_close, is_open_alert = false, go_back }: Props) => {
	return (
		<Modal
			open={is_open_alert}
			onClose={on_close}
			title={'Discard changes?'}
			footer={
				<Grid display='flex' gap={2.5}>
					<Button variant='outlined' onClick={on_close} fullWidth color='inherit'>
						Go back
					</Button>
					<Button fullWidth color='error' onClick={go_back}>
						Discard
					</Button>
				</Grid>
			}
			children={
				<Typography sx={{ fontSize: 14 }} variant='body1'>
					There are some unsaved data fields, you could go back and save these changes or discard these changes. What do you want to do?
				</Typography>
			}
		/>
	);
};

export default DiscardModal;
