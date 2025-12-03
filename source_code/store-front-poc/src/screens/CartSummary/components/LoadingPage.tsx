import { makeStyles } from '@mui/styles';

import { Grid, Skeleton } from 'src/common/@the-source/atoms';
import useStylesMain from '../styles';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';

const useStylesCartSummaryCardLoader = makeStyles((theme: any) => ({
	card_summary_card_container: {
		padding: '24px',
		display: 'flex',
		flexDirection: 'column',
		gap: '24px',
		borderRadius: '12px',
		backgroundColor: theme?.cart_summary?.background,
		width: '100%',
	},
	section_1: {
		display: 'flex',
		gap: '15px',
	},
	section_1_info: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		paddingTop: '7px',
		paddingBottom: '7px',
	},
	common_section: {
		display: 'flex',

		justifyContent: 'space-between',
	},
	seperator: {
		height: '1px',
		width: '100%',
		borderBottom: `1px dashed ${theme?.cart_summary?.summary_card?.seperator}`,
	},
}));

const useStyles = makeStyles(() => ({
	card_container: {
		marginBottom: '40px',
	},
	card_left_section: {
		display: 'flex',
		gap: '15px',
	},
	card_right_section: {},
	card_info_section: {
		display: 'flex',
		flexDirection: 'column',
		gap: '17px',
	},
}));

const ProductCardLoader = () => {
	const classes = useStyles();
	return (
		<div className={classes.card_container}>
			<div className={classes.card_left_section}>
				<div>
					<Skeleton
						height={100}
						variant='rounded'
						width={100}
						sx={{ background: 'linear-gradient(120deg, #D1D6DD 0%, #F2F4F6 36.98%, #EBEDF1 59.38%, #D1D6DD 100%)' }}
					/>
				</div>
				<div className={classes.card_info_section}>
					<Skeleton height={12} variant='rounded' width={141} sx={{ background: '#D1D6DD' }} />
					<Skeleton height={8} variant='rounded' width={181} sx={{ background: '#EEF1F7' }} />
					<Skeleton height={8} variant='rounded' width={105} sx={{ background: '#EEF1F7' }} />
					<Skeleton height={8} variant='rounded' width={129} sx={{ background: '#EEF1F7' }} />
				</div>
			</div>
			<div className={classes.card_right_section}></div>
		</div>
	);
};

const CartSummaryCardLoader = () => {
	const classes = useStylesCartSummaryCardLoader();
	const theme: any = useTheme();
	return (
		<div className={classes.card_summary_card_container} style={{ ...theme?.card_ }}>
			<div className={classes.section_1}>
				<div>
					<Skeleton
						animation='wave'
						height={48}
						variant='circular'
						width={48}
						sx={{ background: 'linear-gradient(120deg, #D1D6DD 0%, #F2F4F6 50.08%, #D1D6DD 100%)' }}
					/>
				</div>
				<div className={classes.section_1_info}>
					<Skeleton height={12} variant='rounded' width={141} sx={{ background: '#D1D6DD' }} />
					<Skeleton height={8} variant='rounded' width={181} sx={{ background: '#EEF1F7' }} />
				</div>
			</div>
			<div className={classes.seperator} />
			<div className={classes.common_section}>
				<Skeleton height={10} variant='rounded' width={131} sx={{ background: '#EEF1F7' }} />

				<Skeleton height={10} variant='rounded' width={82} sx={{ background: '#D1D6DD' }} />
			</div>
			<div className={classes.seperator} />
			<div className={classes.common_section}>
				<Skeleton height={10} variant='rounded' width={131} sx={{ background: '#EEF1F7' }} />

				<Skeleton height={10} variant='rounded' width={82} sx={{ background: '#D1D6DD' }} />
			</div>
		</div>
	);
};

const ProductListLodaer = () => {
	const classes_main = useStylesMain();
	const theme: any = useTheme();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className={classes_main.body_container}>
			<Grid item md={8} sm={12} xs={12} className={classes_main.left_container} style={{ padding: '32px 28px', ...theme?.card_ }}>
				{[1, 2, 3].map((value) => {
					return <ProductCardLoader key={value} />;
				})}
			</Grid>
			<Grid item md={4} sm={12} xs={12} mb={2} style={{ width: '100%' }}>
				<CartSummaryCardLoader />
			</Grid>
		</div>
	);
};

export default ProductListLodaer;
