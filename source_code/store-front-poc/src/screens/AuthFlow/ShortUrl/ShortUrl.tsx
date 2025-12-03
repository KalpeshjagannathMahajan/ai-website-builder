import { useEffect } from 'react';
import { get_short_url } from 'src/utils/api_requests/login';
import LoaderScreen from 'src/utils/LoaderScreen';

const ShortUrl = () => {
	// const navigate = useNavigate();
	const get_redirection = async (token: any) => {
		try {
			const res: any = await get_short_url(token);
			if (res?.status === 200) {
				window.location.href = res?.data?.data?.url;
			}
		} catch (err) {
			console.error(err);
		}
	};
	useEffect(() => {
		const url = new URL(window.location.href);
		const pathSegments = url.pathname.split('/');
		const token = `${pathSegments[pathSegments.length - 1]}`;
		if (token) {
			get_redirection(token);
		}
	}, []);

	return <LoaderScreen />;
};

export default ShortUrl;
