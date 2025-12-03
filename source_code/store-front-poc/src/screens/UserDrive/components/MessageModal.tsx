import { Box, Slide } from '@mui/material';
import { makeStyles } from '@mui/styles';
import CustomText from 'src/common/@the-source/CustomText';
import { Icon } from 'src/common/@the-source/atoms';

const useStyles = makeStyles((theme: any) => ({
	container: {
		position: 'fixed',
		top: '5vh',
		left: '45vw',
		zIndex: 1000000,
		backgroundColor: theme?.user_drive?.message_modal?.background1,
		padding: '10px',
		borderRadius: '10px',
		alignItems: 'center',
		justifyContent: 'center',
	},
	action_icon: {
		backgroundColor: theme?.user_drive?.message_modal?.background2,
		borderRadius: '50%',
		cursor: 'pointer',
		marginRight: '10px',
		height: '36px',
		width: '36px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		color: theme?.user_drive?.message_modal?.text,
	},
}));

interface MessageProps {
	open_message_modal: any;
	message: string;
	show_action_icon?: boolean;
}
const MessageModal = ({ show_action_icon, open_message_modal, message }: MessageProps) => {
	const classes = useStyles();
	return (
		<Slide direction='down' in={open_message_modal} mountOnEnter unmountOnExit>
			<Box className={classes.container} display={open_message_modal ? 'flex' : 'none'}>
				{show_action_icon && (
					<Box className={classes.action_icon}>
						<Icon iconName='IconCheck' className={classes.text} />
					</Box>
				)}
				<CustomText className={classes.text} type='H6'>
					{message}
				</CustomText>
			</Box>
		</Slide>
	);
};

export default MessageModal;
