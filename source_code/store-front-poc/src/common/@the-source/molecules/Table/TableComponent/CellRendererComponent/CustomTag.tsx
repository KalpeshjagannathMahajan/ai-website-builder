import React from 'react';
import { Grid, Icon } from 'src/common/@the-source/atoms';
import styles from '../Cell.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { colors } from 'src/utils/theme';
import _ from 'lodash';

interface Props {
	value?: any;
	valueFormatted?: any;
	dtype?: string;
	field?: string;
	node?: any;
}

const container_style = {
	padding: '0.2rem 1.5rem',
	borderRadius: '40px',
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	border: `1px solid ${colors.dark_midnight_blue}`,
	background: 'white',
	lineHeight: 'normal',
};
const default_icon_style = {
	width: '1rem',
	height: '1rem',
	borderRadius: '50%',
	margin: '0.1rem 0.6rem 0rem 0rem',
};
const icon_style = {
	width: '1.4rem',
	height: '1.4rem',
	marginRight: '0.2rem',
};
const text_style = {
	textTransform: 'capitalize',
	fontSize: '1.4rem',
};

const CustomTagCellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	const { valueFormatted, dtype, field, node } = rest;
	const bg_color_field = `${field}-color`;
	const bg_color = _.get(node, ['data', bg_color_field], colors.white);

	const render_icon_by_dtype = () => {
		if (!dtype) return null;
		switch (dtype) {
			case 'tag':
				return <Icon iconName='IconBookmark' sx={icon_style} />;
			default:
				return <div style={{ ...default_icon_style }}></div>;
		}
	};

	return (
		<div className={styles.agGridCustomCell}>
			{valueFormatted ? (
				<Grid style={{ ...container_style, backgroundColor: bg_color }}>
					{render_icon_by_dtype()}
					<CustomText color='black' type='Body' style={text_style}>
						{valueFormatted}
					</CustomText>
				</Grid>
			) : (
				<CustomText>--</CustomText>
			)}
		</div>
	);
};

export default CustomTagCellRenderer;
