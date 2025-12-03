import { Typography } from '@mui/material';
import React from 'react';
import { Box, Grid, Image, Modal } from 'src/common/@the-source/atoms';
import label_2 from 'src/assets/images/label_2_1.svg';
import { Trans, useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import CustomText from 'src/common/@the-source/CustomText';

const TemplateModal = ({ show_modal, set_show_modal, data }: any) => {
	const handleClose = () => {
		set_show_modal(false);
	};
	const theme: any = useTheme();
	const { t } = useTranslation();
	const attributes_length = data?.attributes?.length;

	return (
		<Modal width={600} title={data?.name} open={show_modal} onClose={handleClose}>
			<Box>
				<Grid container>
					<Grid item xs={4}>
						<Box>
							<CustomText type='Subtitle'>{t('LabelManagement.TemplateModal.Size')}</CustomText>
						</Box>
						<Box>
							<Typography variant='body2'>{data?.size}</Typography>
						</Box>
					</Grid>
					<Grid item xs={8}>
						<Box>
							<CustomText type='Subtitle'>
								{attributes_length > 0 ? (
									<Trans i18nKey='LabelManagement.TemplateModal.ShowingAttributes' count={attributes_length}>
										Showing {{ attributes_length }} attribute
									</Trans>
								) : (
									t('LabelManagement.TemplateModal.NoAttributesSelected')
								)}
							</CustomText>
						</Box>
						<Box>
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
						</Box>
					</Grid>
				</Grid>
				<Grid container justifyContent='center' alignItems='center' mt={2}>
					<Image src={data?.preview_img || label_2} width={550} height={350} />
				</Grid>
			</Box>
		</Modal>
	);
};

export default TemplateModal;
