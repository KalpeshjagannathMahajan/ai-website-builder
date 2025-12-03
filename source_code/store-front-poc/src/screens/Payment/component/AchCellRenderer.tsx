import { Chip, Grid } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { info } from 'src/utils/common.theme';

const AchCellRenderer = ({ value }: any) => {
	return (
		<Grid container flexDirection={'row'} alignItems={'center'} gap={1}>
			<Chip
				bgColor={info[50]}
				label={
					<CustomText type='MicroBold' color={info.main}>
						ACH
					</CustomText>
				}
				size={'small'}
			/>
			<CustomText style={{ opacity: 0.6 }} type='Caption'>
				{value}
			</CustomText>
		</Grid>
	);
};

export default AchCellRenderer;
