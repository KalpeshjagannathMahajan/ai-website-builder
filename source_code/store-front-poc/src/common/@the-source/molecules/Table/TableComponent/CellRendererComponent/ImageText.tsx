import React from 'react';
import styles from '../Cell.module.css';
import { Grid, Icon, Image, Typography } from 'src/common/@the-source/atoms';
// Custom cell renderer for image type

interface Props {
	value: any;
	valueFormatted?: any;
}

const style = {
	backgroundColor: '#F7F8FA',
	padding: 10,
	borderRadius: 8,
	display: 'flex',
	alignItems: 'center',
	marginRight: 10,
};

const ImageTextCellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	const { valueFormatted } = rest;

	const renderImagePlaceholder = () => {
		return (
			<Grid style={style}>
				<Icon iconName='IconPhoto' color='grey' />
			</Grid>
		);
	};

	return (
		<Grid display={'flex'} className={styles.agGridCustomCell} alignItems={'center'}>
			{valueFormatted && (
				<>
					{valueFormatted?.image_src ? (
						<Image width={35} height={35} style={{ borderRadius: 8, marginRight: 10 }} src={valueFormatted?.image_src} alt='test' />
					) : rest?.colDef?.field === 'payment_method_info' ? (
						'--'
					) : (
						renderImagePlaceholder()
					)}
					<Typography variant='subtitle1' sx={{ opacity: 0.6 }}>
						{valueFormatted?.text_value}
					</Typography>
				</>
			)}
		</Grid>
	);
};

export default ImageTextCellRenderer;
