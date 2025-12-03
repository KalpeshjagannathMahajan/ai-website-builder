import { Chip, Grid, Icon, Image } from '..';
import CustomText from '../../CustomText';
import { useTheme } from '@mui/material/styles';
import { get_short_name } from 'src/screens/Wishlist/utils';

interface CardProps {
	data: any;
	sx?: any;
}

const Card = ({ data, sx }: CardProps) => {
	const { title = '', sub_title = '', logo = '' } = data;
	const theme: any = useTheme();
	const is_source_ach = data?.payment_method_type === 'ach';

	return (
		<Grid sx={sx}>
			<Grid display='flex' alignItems='center' gap={1}>
				<CustomText type='Body'>{is_source_ach ? get_short_name(title, 11) : title}</CustomText>
				{is_source_ach ? (
					<Chip
						size={'small'}
						bgColor={theme?.palette?.info[100]}
						sx={{ padding: '0px 2px' }}
						icon={<Icon sx={{ scale: '0.75' }} iconName='IconBuildingBank' color={theme?.palette?.info.main} />}
						label={
							<CustomText type='Caption' style={{ marginLeft: '-2px' }}>
								{data?.bank_account_type}
							</CustomText>
						}
					/>
				) : (
					<Image src={logo} width={40} height={24} />
				)}
			</Grid>
			<CustomText type='Body' color={theme?.payments?.card_text}>
				{sub_title}
			</CustomText>
		</Grid>
	);
};

export default Card;
