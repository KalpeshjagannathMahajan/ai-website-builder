import React, { useState } from 'react';
import { Grid, Icon } from 'src/common/@the-source/atoms';
import { Dialog, DialogContent } from '@mui/material';
import styles from 'src/common/@the-source/molecules/Table/TableComponent/Cell.module.css';
import { transform_image_url } from 'src/utils/ImageConstants';
import constants from 'src/utils/constants';
import { useTheme } from '@mui/material/styles';
interface Props {
	value: any;
	valueFormatted?: any;
	node?: any;
}

const ImageComp: React.FC<Props> = ({ value, ...rest }) => {
	const [open, setOpen] = useState(false);
	const { valueFormatted } = rest;
	const theme: any = useTheme();
	const src_small = transform_image_url(valueFormatted, 'LABEL');
	const src_large = transform_image_url(valueFormatted, 'LABEL_EXPANDED');

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const style = {
		backgroundColor: theme?.label?.image_comp?.background_color,
		padding: 10,
		borderRadius: 8,
		display: 'flex',
		alignItems: 'center',
		width: 40,
	};

	const renderImagePlaceholder = () => {
		return (
			<Grid style={style}>
				<Icon iconName='IconPhoto' color={theme?.label?.image_comp?.color} />
			</Grid>
		);
	};

	const handleFallback = (e: React.SyntheticEvent<HTMLImageElement>) => {
		e.currentTarget.src = constants.FALLBACK_IMAGE;
	};

	return (
		<div className={styles.agGridCustomImageCell}>
			{src_small ? (
				<>
					<img
						src={src_small}
						onError={handleFallback}
						alt='Product Image'
						className={styles.imageStyle}
						onClick={handleClickOpen}
						loading='lazy'
					/>
					<Grid className={styles.imageIcon} onClick={handleClickOpen}>
						<Icon iconName='IconArrowsDiagonal' size='small' color={theme?.label?.image_comp?.color} className={styles.iconStyle} />
					</Grid>
					<Dialog open={open} onClose={handleClose}>
						<Icon iconName='IconX' onClick={handleClose} color={theme?.label?.image_comp?.color} className={styles.iconStyle} />
						<DialogContent>
							<img src={src_large} onError={handleFallback} alt={''} style={{ width: '50rem', height: '50rem' }} />
						</DialogContent>
					</Dialog>
				</>
			) : (
				renderImagePlaceholder()
			)}
		</div>
	);
};

export default ImageComp;
