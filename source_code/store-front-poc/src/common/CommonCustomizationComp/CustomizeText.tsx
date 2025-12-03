import { primary } from 'src/utils/light.theme';
import CustomText from '../@the-source/CustomText';
import { Grid } from '../@the-source/atoms';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const CustomizeText = () => {
	return (
		<Grid>
			<CustomText
				type='Micro'
				color={is_ultron ? primary[400] : ''}
				style={{
					marginTop: '-0.5rem',
				}}>
				Customize
			</CustomText>
		</Grid>
	);
};

export default CustomizeText;
