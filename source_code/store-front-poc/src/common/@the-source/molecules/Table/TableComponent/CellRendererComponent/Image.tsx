import React, { useState } from 'react';
import { Grid, Icon, Image } from 'src/common/@the-source/atoms';
import { Dialog, DialogContent } from '@mui/material';
import styles from '../Cell.module.css';

interface Props {
	value: any;
	valueFormatted?: any;
}

const ImageCellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	const [open, setOpen] = useState(false);
	const { valueFormatted } = rest;

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const style = {
		backgroundColor: '#F7F8FA',
		padding: 10,
		borderRadius: 8,
		display: 'flex',
		alignItems: 'center',
		width: 40,
	};

	const image_style = {
		width: '40px',
		height: '40px',
		objectFit: 'contain',
		borderRadius: '8px',
		cursor: 'pointer',
		position: 'relative',
	};

	const renderImagePlaceholder = () => {
		return (
			<Grid style={style}>
				<Icon iconName='IconPhoto' color='grey' />
			</Grid>
		);
	};

	return (
		<div className={styles.agGridCustomImageCell}>
			{valueFormatted || value ? (
				<>
					<Image src={valueFormatted || value} alt='Product Image' style={image_style} onClick={handleClickOpen} />
					<Grid className={styles.imageIcon} onClick={handleClickOpen}>
						<Icon iconName='IconArrowsDiagonal' size='small' color='grey' className={styles.iconStyle} />
					</Grid>
					<Dialog open={open} onClose={handleClose}>
						<Icon iconName='IconX' onClick={handleClose} color='grey' className={styles.iconStyle} />
						<DialogContent>
							<Image src={valueFormatted || value} alt={''} style={{ width: '50rem', height: '50rem', image_style }} />
						</DialogContent>
					</Dialog>
				</>
			) : (
				renderImagePlaceholder()
			)}
		</div>
	);
};

export default ImageCellRenderer;
