import React from 'react';
import { Box, Grid, Skeleton, Typography } from 'src/common/@the-source/atoms';
import useStyles from '../../styles';

const empty_card_style = {
	display: 'flex',
	flexDirection: 'column',
	gap: 2,
	justifyContent: 'center',
	height: 'auto',
	padding: 2,
	marginTop: 2,
};

const BuyerSkeleton = () => {
	const classes = useStyles();
	const data = [
		{
			title: 'Contacts',
			value: [1, 2, 3, 4, 5],
			style: {
				minHeight: '15rem',
			},
		},
		{
			title: 'Billing address',
			value: [1, 2, 3],
			style: {
				minHeight: '18rem',
			},
		},
		{
			title: 'Shipping address',
			value: [1, 2],
			style: {
				minHeight: '15rem',
			},
		},
	];

	const handle_render_card = (style: any) => {
		return (
			<Grid className={classes.view_details_card} sx={{ ...empty_card_style, style }}>
				<Skeleton variant='text' width={'50%'} height={35} />
				<Skeleton variant='text' width={'80%'} height={20} />
				<Skeleton variant='text' width={'80%'} height={25} />
			</Grid>
		);
	};

	return (
		<Grid container mt={6}>
			<Grid item xs={12} sm={12} md={5} lg={3} className={classes.buyer_user_details_container} p={2.5}>
				<Box display='flex' gap={2} mb={2}>
					<Skeleton variant='circular' width={75} height={60} />
					<Skeleton variant='text' width={'100%'} height={35} />
				</Box>
				<hr></hr>
				<Skeleton variant='text' width={'50%'} height={25} sx={{ mt: 2, mb: 1 }} />
				<Skeleton variant='text' width={'50%'} height={25} sx={{ my: 2 }} />
				<hr></hr>
				<Skeleton variant='text' width={'50%'} height={25} sx={{ my: 2, mb: 1 }} />
				<Skeleton variant='text' width={'50%'} height={25} sx={{ my: 2 }} />
				<hr></hr>
			</Grid>
			<Grid item xs={12} md={0.2}></Grid>
			<Grid
				item
				xs={12}
				sm={12}
				md={6.8}
				lg={8.8}
				borderRadius={'12px'}
				p={2.5}
				height={'110vh'}
				className={classes.buyer_details_container}>
				{data?.map((ele: any) => {
					return (
						<React.Fragment>
							<Typography variant='h6'>{ele?.title}</Typography>
							<Grid className={classes.view_details_card_container} mb={3}>
								{ele?.value?.map((item: any, key: number) => (
									<React.Fragment key={key}>{handle_render_card(item?.style)}</React.Fragment>
								))}
							</Grid>
						</React.Fragment>
					);
				})}
			</Grid>
		</Grid>
	);
};

export default BuyerSkeleton;
