import { useTranslation } from 'react-i18next';
import ImageLinks from './assets/images/ImageLinks';
import { Button, Grid, Icon, Image } from './common/@the-source/atoms';
import CustomText from './common/@the-source/CustomText';
import styles from './PopUpModal.module.css';

interface PopUpModalProps {
	set_show_popup: any;
}

const PopUpModal = ({ set_show_popup }: PopUpModalProps) => {
	const { t } = useTranslation();
	return (
		<Grid>
			<Grid className={styles.modalStyle}>
				<Grid className={styles.container}>
					<Grid className={styles.circle1}></Grid>
					<Grid className={styles.circle2}>
						<Grid direction={'column'} className={styles.contentGrid}>
							<Grid className={styles.closeIconGrid}>
								<Icon
									onClick={() => set_show_popup(false)}
									color='#b5bbc3'
									className={styles.closeIconGrid}
									sx={{ cursor: 'pointer', width: '30px', height: '30px' }}
									iconName='IconX'
								/>
							</Grid>
							<Grid container alignItems={'center'} direction={'column'} justifyContent={'center'}>
								<Image src={ImageLinks.SparkleLogo} width={210} height={210} />
							</Grid>
						</Grid>
					</Grid>
					<Grid direction={'column'} className={styles.bottomGrid}>
						<CustomText type='H1'>{t('PopUpModal.WizCommerce')}</CustomText>
						<CustomText type='Title' style={{ margin: '16px 0 24px 0' }} color='#4F555E'>
							{t('PopUpModal.ParaText')}
						</CustomText>
						<Button onClick={() => set_show_popup(false)} sx={{ padding: '0.5rem 2.5rem' }} variant='contained'>
							{t('PopUpModal.ButtonText')}
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default PopUpModal;
