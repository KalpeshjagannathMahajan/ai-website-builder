import { Grid } from 'src/common/@the-source/atoms';
import styles from '../../../common/@the-source/molecules/Login/login.module.css';
import Loading from 'src/screens/Loading/Loading';
import { useEffect } from 'react';

const UserLogin = () => {
	useEffect(() => {
		setTimeout(() => {
			window.location.href = window.location.origin;
		}, 1000);
	}, []);

	return (
		<Grid className={styles.containerStorefront}>
			<Loading />
		</Grid>
	);
};

export default UserLogin;
