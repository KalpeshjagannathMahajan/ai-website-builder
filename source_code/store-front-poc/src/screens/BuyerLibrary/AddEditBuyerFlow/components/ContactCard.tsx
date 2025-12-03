/* eslint-disable @typescript-eslint/no-unused-vars */
import CustomText from 'src/common/@the-source/CustomText';
import { Box, Grid, Icon, Tooltip } from 'src/common/@the-source/atoms';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import 'src/screens/BuyerLibrary/style.css';
import DisplayPriorityCard from 'src/common/DisplayPriorityCard';
import { secondary } from 'src/utils/light.theme';

interface Props {
	is_editable: boolean;
	item: any;
	primary_contact_id?: string;
	is_primary?: boolean;
	on_edit_press?: () => void;
	on_card_press?: () => void;
	style?: any;
	buyer_fields?: any;
}

const ContactCard = ({ item, is_editable, primary_contact_id, on_edit_press, on_card_press, style, buyer_fields }: Props) => {
	const classes = useStyles();
	const theme: any = useTheme();
	const handle_render_card_action = () => {
		return (
			is_editable && (
				<Tooltip title='Edit' textStyle={{ fontSize: '1.2rem' }} arrow>
					<div>
						<Icon
							onClick={on_edit_press}
							className={classes.edit_icon_style}
							color={secondary[600]}
							iconName='IconEdit'
							sx={{ cursor: 'pointer' }}
						/>
					</div>
				</Tooltip>
			)
		);
	};

	const handle_render_details = () => {
		return (
			<Grid container display='flex' flexDirection='column' height='100%' justifyContent='space-between' onClick={on_card_press}>
				<Box display='flex' justifyContent='space-between' position='relative' alignItems='center' width='100%'>
					<Box m={2}>
						<DisplayPriorityCard item={item} entity='contacts' is_editable={is_editable} buyer_fields={buyer_fields} />
					</Box>

					{is_editable && <Box className={classes.edit_icon}>{handle_render_card_action()}</Box>}
				</Box>

				{/* Push "Default" to bottom after content */}
				<Box display='flex' justifyContent='flex-end' mt='auto' width='100%'>
					{primary_contact_id === item.id && (
						<Box
							className={classes.default}
							sx={{ marginLeft: 'auto', borderRadius: theme?.view_buyer?.other_details?.chip?.borderRadius }}
							bgcolor={theme?.view_buyer?.other_details?.card?.default_background}>
							<CustomText type='Subtitle' color={theme?.view_buyer?.other_details?.card?.text_color}>
								Primary
							</CustomText>
						</Box>
					)}
				</Box>
			</Grid>
		);
	};

	return (
		<Grid display='flex' className={classes.view_details_card} height='auto' style={{ ...style, ...theme?.view_buyer?.custom_card_style }}>
			{handle_render_details()}
		</Grid>
	);
};

export default ContactCard;
