import React from 'react';
import { Avatar, Box, Grid, Icon, Image } from 'src/common/@the-source/atoms';
import sample from 'src/assets/images/label_tempelate_card.png';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import CustomText from 'src/common/@the-source/CustomText';

const useStyles = makeStyles((theme: any) => ({
	imageContainer: {
		position: 'relative',
	},
	defaultChip: {
		position: 'absolute',
		top: theme.spacing(1),
		left: theme.spacing(1),
		backgroundColor: theme?.label?.qr_template?.default_chip?.backgroundColor,
		color: theme?.palette?.common?.white,
		padding: theme?.spacing(0.5, 1.25),
		borderRadius: '40px',
		fontWeight: 700,
	},
	avatar: {
		position: 'absolute',
		bottom: 12,
		right: 7,
		marginLeft: 'auto',
	},
}));

const QRTemplate = ({ data, onClickPreview }: any) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const theme: any = useTheme();
	const handlePreview = (event: React.MouseEvent, _data: any) => {
		event.stopPropagation();
		onClickPreview(_data);
	};

	return (
		<Grid container mt={1} ml={2}>
			<Grid item xs={5.5}>
				<Grid container direction='column' style={{ height: '100%' }}>
					<Grid item>
						<CustomText type='H6'>{data?.name}</CustomText>
					</Grid>
					<Grid item>
						<CustomText type='Body'>{t('LabelManagement.QRTemplate.Size', { size: data?.size })}</CustomText>
					</Grid>
					<Grid item style={{ marginTop: 'auto' }}>
						{data?.attributes?.length > 0 ? (
							<CustomText type='Subtitle'>
								{t('LabelManagement.QRTemplate.ShowingAttributes', { length: data?.attributes?.length })}
							</CustomText>
						) : (
							<CustomText type='Body'>{t('LabelManagement.QRTemplate.NoAttributesSelected')}</CustomText>
						)}
					</Grid>
					<Grid item mb={1}>
						{data?.attributes?.map((item: any, index: number) => (
							<React.Fragment key={item}>
								<CustomText type='Body' style={{ display: 'inline-block' }}>
									{item}
								</CustomText>
								{index !== data.attributes.length - 1 && (
									<span style={{ margin: '0 5px', color: theme?.label?.qr_template?.index?.color }}>&#x2022;</span>
								)}
							</React.Fragment>
						))}
					</Grid>
				</Grid>
			</Grid>
			<Grid item mb={1}>
				<Box className={classes.imageContainer}>
					<Image src={data?.thumbnail_img_url || sample} width={200} height={175} />
					{data?.is_default && (
						<Box className={classes.defaultChip}>
							<CustomText type='Body'>{t('LabelManagement.QRTemplate.Default')}</CustomText>
						</Box>
					)}
					<Box className={classes.avatar} onClick={(event) => handlePreview(event, data)}>
						<Avatar
							variant='circular'
							isImageAvatar={false}
							content={<Icon color={theme?.label?.qr_template?.icon?.color} iconName='IconEye' />}
						/>
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
};

export default QRTemplate;
