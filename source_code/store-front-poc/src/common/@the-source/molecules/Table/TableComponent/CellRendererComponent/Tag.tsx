import React from 'react';
import styles from '../Cell.module.css';
import { Chip, Grid } from 'src/common/@the-source/atoms';
import utils from 'src/utils/utils';
import Lottie from 'react-lottie';
import Animations from 'src/assets/animations/Animations';

interface Props {
	value: string[];
	valueFormatted?: any;
}

const TagsCellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	const { valueFormatted } = rest;
	const { textColor, bgColor } = utils.get_chip_color_by_tag(String(valueFormatted?.toLowerCase()));

	const chip_style = {
		marginRight: 1,
		fontSize: 12,
		border: '2px solid white',
		textTransform: 'capitalize',
	};

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: Animations?.loader_animation,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	};

	return (
		<div className={styles.agGridCustomCell}>
			<Chip
				textColor={textColor}
				bgColor={bgColor}
				label={
					<Grid container alignItems='center'>
						{valueFormatted === 'In Progress' && <Lottie options={defaultOptions} height={30} width={30} />}
						{valueFormatted}
					</Grid>
				}
				sx={{ ...chip_style }}
			/>
		</div>
	);
};

export default TagsCellRenderer;
