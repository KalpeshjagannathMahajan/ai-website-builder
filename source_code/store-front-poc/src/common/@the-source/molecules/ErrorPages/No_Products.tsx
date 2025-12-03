import { Image, Grid, Button } from 'src/common/@the-source/atoms';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import CustomText from '../../CustomText';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const useStyles = makeStyles((theme: any) => ({
	container: {
		height: 'calc(100vh - 300px)',
		minHeight: '420px',
		overflow: 'hidden',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		gap: '8px',
		textAlign: 'center',
		width: '100%',
	},
	image_box: {
		width: '250px !important',
		height: '250px !important',
		[!is_ultron && theme.breakpoints.down('sm')]: {
			height: '200px',
			width: '75%',
		},
	},
}));

interface INoProducts {
	is_filter_applied?: boolean;
	reset_filter_click?: () => any;
}

const NoProducts = ({ is_filter_applied = false, reset_filter_click }: INoProducts) => {
	const [loading, set_loading] = useState(false);
	const theme: any = useTheme();
	const classes = useStyles(theme);
	const reset_click = () => {
		set_loading(true);
		reset_filter_click && reset_filter_click();
	};

	useEffect(() => {
		if (is_filter_applied) {
			set_loading(false);
		}
	}, [is_filter_applied]);
	const image_src = is_ultron
		? 'https://frontend-bucket.vercel.app/images/no_products.svg'
		: 'https://frontend-bucket.vercel.app/images/storefront/no_products.svg';

	return (
		<Grid className={classes.container}>
			<Grid>
				<Image src={image_src} imgClass={classes.image_box} />
			</Grid>
			<div>
				<CustomText type='H2'>{t('Common.ErrorPages.NoResult')}</CustomText>
				<CustomText type='Title'>{t('Common.ErrorPages.Retry')}</CustomText>
				{is_filter_applied && (
					<Button sx={{ margin: '15px' }} onClick={reset_click} loading={loading}>
						{t('Common.FilterComponents.ClearAll')}
					</Button>
				)}
			</div>
		</Grid>
	);
};

export default NoProducts;
