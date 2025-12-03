import { Image, Grid, Button, Icon } from 'src/common/@the-source/atoms';
import ImageLinks from 'src/assets/images/ImageLinks';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import CustomText from '../../CustomText';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const { VITE_APP_REPO } = import.meta.env;

const is_ultron = VITE_APP_REPO === 'ultron';

interface errorProps {
	is_back?: boolean;
	is_modal?: boolean;
}
const ErrorPage = ({ is_back = false, is_modal = false }: errorProps) => {
	const navigate = useNavigate();
	const theme: any = useTheme();
	const storefront_user = useSelector((state: any) => state?.preLogin);
	const handleClick = () => {
		navigate('/');
		window.location.reload();
	};

	const StorefrontErrorLogo = 'https://frontend-bucket.vercel.app/images/StorefrontErrorLogo.svg';

	return (
		<Grid
			container
			sx={{
				height: `${is_modal ? 'auto' : 'calc(100vh - 80px)'}`,
				minHeight: '520px',
				overflow: 'hidden',
				background: theme?.product?.error_screen?.primary,
			}}
			justifyContent='space-between'
			alignItems='center'
			direction='column'
			p={'5rem'}>
			{!is_modal && (
				<Grid display='flex' alignItems='center' gap='6px'>
					{is_ultron ? (
						<Image src={ImageLinks.LogoNoText} width={27} height={27} />
					) : (
						<Image src={storefront_user?.login_screen_logo} width={40} height={40} />
					)}
					<CustomText style={{ fontSize: '24px', fontWeight: 700 }}>
						{!is_ultron ? storefront_user?.company_name : t('Common.ErrorPage_500.Wizcommerce')}
					</CustomText>
				</Grid>
			)}
			<Grid textAlign={'center'}>
				<Image src={is_ultron ? ImageLinks.ErrorLogo : StorefrontErrorLogo} width={370} height={290} />
				<CustomText type='H1'>{t('Common.ErrorPage_500.NoResult')}</CustomText>
				<CustomText type='Title' style={{ marginTop: '8px' }}>
					{t('Common.ErrorPage_500.Retry')}
				</CustomText>
				{!is_modal && (
					<Button onClick={handleClick} sx={{ marginTop: '20px' }}>
						{is_back ? (
							<>
								<Icon iconName='IconArrowLeft' sx={{ cursor: 'pointer', paddingRight: '1rem', color: 'white' }} />
								<span>{t('Common.ErrorPage_500.GoBack')}</span>
							</>
						) : (
							t('Common.ErrorPage_500.Home')
						)}
					</Button>
				)}
			</Grid>
			<CustomText type='Body'>{t('Common.ErrorPage_500.ContactUs', { email: is_ultron ? 'help@wizcommerce.com' : 'admin' })}</CustomText>
		</Grid>
	);
};

export default ErrorPage;
