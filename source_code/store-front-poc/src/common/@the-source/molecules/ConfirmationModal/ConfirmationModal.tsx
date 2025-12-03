import { Modal, Typography } from 'src/common/@the-source/atoms';
import { Grid } from 'src/common/@the-source/atoms';

interface IConfirmationModal {
	title: string;
	show: boolean;
	primary_button: any;
	secondary_button: any;
	content: string;
	set_show: (flag: boolean) => any;
}

const ConfirmationModal = ({ title, show, primary_button, secondary_button, content, set_show }: IConfirmationModal) => {
	return (
		<Modal
			open={show}
			onClose={() => set_show(false)}
			title={title}
			footer={
				<Grid container justifyContent={'space-between'}>
					{secondary_button}
					{primary_button}
				</Grid>
			}
			children={
				<Typography sx={{ fontSize: 14 }} variant='body1'>
					{content}
				</Typography>
			}
		/>
	);
};

export default ConfirmationModal;
