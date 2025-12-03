import ImageLinks from 'src/assets/images/ImageLinks';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid, Image } from 'src/common/@the-source/atoms';
import { useTheme } from '@mui/material/styles';

function NoOption({ image = false }) {
	const theme: any = useTheme();

	return (
		<Grid
			container
			height={'170px'}
			width={'100%'}
			mt={1}
			sx={{ background: image ? theme?.product?.custom_product_drawer?.no_option?.background : '', borderRadius: '8px' }}
			justifyContent={'center'}
			flexDirection={'column'}
			alignItems={'center'}>
			{image && <Image src={ImageLinks.no_preview_options} width={'110px'} height={'110px'} />}
			<CustomText type='H3' style={{ marginTop: '-1.8rem' }}>
				No options were found
			</CustomText>
			<CustomText color='#2D323A'>Try using a different keyword</CustomText>
		</Grid>
	);
}

export default NoOption;
