import { Typography } from '@mui/material';
import { Avatar, Box, Grid } from '../../atoms';
import _ from 'lodash';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material';

const useStyles = makeStyles((theme: any) => ({
	container_style: {
		background: theme?.order_management?.order_end_status_info_container?.account_list_background_color,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
}));

interface AccountCardProp {
	imageUrl?: string;
	card_background?: string;
	background?: string;
	color?: string;
	heading?: string;
	sub_heading?: string;
	tags?: any;
	avatarStyle?: any;
	avatarTextStyle?: any;
}

export interface AccountListProps {
	data: AccountCardProp;
	variant?: any;
	handle_click?: () => void;
}

const AccountList = ({ data, variant, handle_click }: AccountListProps) => {
	const initials = data?.heading
		?.split(' ')
		?.map((word: string) => word.charAt(0))
		?.join('');

	const first_two_letters: any = _.take(initials, 2);
	const tags = data?.tags?.map((tag: any) => tag?.name);
	const formatedtags = tags?.join(' . ');
	const classes = useStyles();
	const theme: any = useTheme();

	const handle_buyer_click = () => {
		if (handle_click) {
			handle_click();
		}
	};

	return (
		<Box padding={1.5} borderRadius='8px' className={classes?.container_style}>
			<Box display={'flex'}>
				<Grid
					item
					onClick={handle_buyer_click}
					sx={{
						cursor: 'pointer',
					}}>
					<Avatar
						id={'text-avatar'}
						variant={variant}
						isImageAvatar={data?.imageUrl}
						backgroundColor={data?.background}
						color={theme?.order_management?.account_list?.color}
						content={
							<Typography style={{ ...data?.avatarTextStyle, textTransform: 'uppercase', textWrap: 'nowrap' }} variant='subtitle2'>
								{first_two_letters}
							</Typography>
						}
						src={data?.imageUrl}
						style={data?.avatarStyle}
					/>
				</Grid>
				<Grid item ml={2} display='flex' alignItems={'center'}>
					<Grid>
						<Grid onClick={handle_buyer_click}>
							<Typography
								variant='h6'
								sx={{
									cursor: 'pointer',
								}}>
								{data?.heading}
							</Typography>
						</Grid>
						{/* <Grid my={1}>
							<Typography variant='body2' sx={{}}>
								{_.capitalize(data?.sub_heading)}
							</Typography>
						</Grid> */}
						<Grid container>
							<Typography variant='caption'>{_.capitalize(formatedtags)}</Typography>
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
};

AccountList.defaultProps = {
	variant: 'circular',
};

export default AccountList;
