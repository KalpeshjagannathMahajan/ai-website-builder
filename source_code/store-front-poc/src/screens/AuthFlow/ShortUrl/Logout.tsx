import { useMediaQuery } from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';
import { useEffect, useState } from 'react';
import ImageLinks from 'src/assets/images/ImageLinks';
import { Button, Grid, Image } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { get_short_url } from 'src/utils/api_requests/login';
import LoaderScreen from 'src/utils/LoaderScreen';

const useStyles = makeStyles(() => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		height: '100%',
		width: '100%',
		textAlign: 'center',
	},
	image_style: {
		height: '300px !important',
	},
}));

const LogoutToProceed = () => {
	const theme: any = useTheme();
	const classes = useStyles();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('md'));
	const [token, setToken] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const get_redirection = async () => {
		setLoading(true);
		try {
			localStorage.clear();
			const res: any = await get_short_url(token);
			if (res?.status === 200) {
				window.location.href = res?.data?.data?.url;
			}
		} catch (err) {
			setLoading(false);
			console.error(err);
		}
	};

	useEffect(() => {
		const url = new URL(window.location.href);
		const pathSegments = url.pathname.split('/');
		const item = `${pathSegments[pathSegments.length - 1]}`;
		if (item) {
			setToken(item);
		}
	}, []);

	if (loading) {
		return <LoaderScreen />;
	}

	return (
		<Grid
			container
			className={classes.container}
			gap={4}
			sx={{
				justifyContent: is_small_screen ? 'flex-start' : 'center',
				padding: is_small_screen ? '7rem 0' : '',
				minHeight: is_small_screen ? '100%' : '90vh',
			}}>
			<div>
				<Image src={ImageLinks.logged_out} alt='logout-image' width={is_small_screen ? '100%' : '400px'} imgClass={classes.image_style} />
				<CustomText type={is_small_screen ? 'Body' : 'Title'} style={{ margin: '11px 0px' }}>
					You're currently logged into an account
				</CustomText>
				<CustomText type={is_small_screen ? 'Subtitle' : 'H3'}>Please log out to reset your password</CustomText>
			</div>
			<Button variant='contained' onClick={() => get_redirection()}>
				Logout to proceed
			</Button>
		</Grid>
	);
};

export default LogoutToProceed;
