import { Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Paper } from 'src/common/@the-source/atoms';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const useStyles = makeStyles(() => ({
	root: {
		height: is_ultron ? 'calc(100dvh - 60px)' : 'calc(100dvh)',
		overflowY: 'auto',
		borderRadius: is_ultron ? '20px 0 0 0 !important' : '0px',
	},
	contentContainer: {
		height: '100%',
		paddingBottom: '2.4rem',
		padding: ({ useFullWidth }: { useFullWidth: boolean }) => (useFullWidth ? '0' : ''),
		'@media (max-width: 600px)': {
			padding: '0px 8px',
		},
	},
}));

const Content = ({ children }: any) => {
	const [useFullWidth, setUseFullWidth] = useState(false);
	const classes = useStyles({ useFullWidth });
	const location_url = useLocation();
	const params = useParams();
	const login = useSelector((state: any) => state.login);
	const is_logged_in = login?.status?.loggedIn;
	const is_store_front = VITE_APP_REPO === 'store_front';

	const { doc_status } = params;

	useEffect(() => {
		const location = window.location.href;

		if ((location.includes('/review/order') || location.includes('/review/quote')) && doc_status) {
			setUseFullWidth(true);
		} else {
			setUseFullWidth(false);
		}

		if (!is_logged_in && is_store_front) {
			localStorage.setItem('prev_url', `${location_url?.pathname}${location_url?.search}`);
		}
	}, [location_url?.pathname]);

	console.log(window.location.pathname);

	return (
		<Paper classes={{ root: classes.root }} id='rootContainer'>
			<Container maxWidth='xl' className={classes.contentContainer}>
				<Box>{children}</Box>
			</Container>
		</Paper>
	);
};

Content.propTypes = {
	children: PropTypes.any.isRequired,
};

export default Content;
