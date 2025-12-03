import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Avatar from '../../atoms/Avatar/Avatar';
import Breadcrumb from '../../atoms/Breadcrumb/Breadcrumb';
import { Icon, Menu, Skeleton } from '../../atoms';
import ImageLinks from 'src/assets/images/ImageLinks';
import _ from 'lodash';
import CustomText from '../../CustomText';
import { get_initials } from 'src/utils/common';
import { secondary } from 'src/utils/light.theme';
import { useEffect, useRef } from 'react';
import { set_notification_feedback } from 'src/actions/notifications';
import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles(() => ({
	notification_section: {
		marginRight: '10px',
		width: '40x',
		height: '40x',
		padding: '8px',
		borderRadius: '50%',
		alignItems: 'center',
		display: 'flex',
		'&:hover': {
			background: '#E1EDFF',
		},
	},
	username_container: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		maxWidth: '12rem',
	},
}));

// type TopBarBaseProps = Pick<>;

export interface TopBarProps {
	breadCrumbList?: LinksProps[];
	avatarSrc?: string; // Corrected the type here
	username?: string;
	childNodes?: React.ReactNode;
	leftComponent?: React.ReactNode;
	menu?: any;
	notificationNode?: React.ReactNode;
	setNotificationDrawer?: any;
}

interface LinksProps {
	id: number;
	linkTitle: string;
	link: any;
}

const TopBar = ({
	notificationNode,
	setNotificationDrawer,
	breadCrumbList = [],
	avatarSrc,
	username,
	childNodes,
	leftComponent,
	menu,
}: TopBarProps) => {
	const classes = useStyles();
	const bellRef = useRef<any>(null);
	const dispatch = useDispatch();
	const theme: any = useTheme();

	useEffect(() => {
		setTimeout(() => {
			if (bellRef?.current) {
				const rect: any = bellRef?.current?.getBoundingClientRect();
				dispatch(set_notification_feedback(false, window.innerWidth - (rect.left + rect.right) / 2));
			}
		}, 1000);
	}, [bellRef?.current]);

	return (
		<Box sx={{ flexGrow: 1, background: '#FFF', paddingY: 0.5, paddingX: 1, overflow: 'hidden' }}>
			<Grid container direction='row' justifyContent='space-between' alignItems='center'>
				<Grid item xs={6}>
					<Grid container sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
						{leftComponent && <Grid item>{leftComponent}</Grid>}
						{breadCrumbList?.length > 0 && (
							<Grid item>
								<Breadcrumb links={breadCrumbList} />
							</Grid>
						)}
					</Grid>
				</Grid>
				<Grid item xs={6}>
					<Grid
						container
						direction='row'
						justifyContent='flex-end'
						alignItems='center'
						columnSpacing={{ xs: 2, sm: 2, md: 3 }}
						sx={{ cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
						{notificationNode && (
							<div ref={bellRef} className={classes.notification_section} onClick={() => setNotificationDrawer(true)}>
								{notificationNode}
							</div>
						)}
						<Menu
							btnStyle={{
								height: '4rem',
								display: 'flex',
								flexDirection: 'row',
								padding: '.1rem .2rem',
								border: 'none',
							}}
							className='profiler'
							closeOnItemClick
							anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
							PaperProps={{
								style: {
									width: 320,
									padding: 0,
								},
							}}
							menuItemStyle={{ backgroundColor: 'transparent !important' }}
							LabelComponent={
								<Grid
									container
									direction='row'
									justifyContent='space-between'
									alignItems='center'
									columnSpacing={{ xs: 2, sm: 2, md: 3 }}
									sx={{ cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
									{childNodes && (
										<Grid item alignItems='center' mt={1}>
											{childNodes}
										</Grid>
									)}
									{avatarSrc && !_.isEmpty(username) ? (
										<Grid container direction='row' gap={1} alignSelf='center' justifyContent={'flex-end'} mb={0.5}>
											<Avatar
												variant='rounded'
												size='medium'
												content={
													<CustomText style={{ color: secondary.contrastText, fontWeight: 'bold' }}>
														{' '}
														{get_initials(username, 2)}
													</CustomText>
												}
												style={{
													marginLeft: '2.7rem',
													height: '28px',
													width: '28px',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													backgroundColor: theme?.palette?.info[600],
												}}
											/>

											<Icon sx={{ marginTop: '.4rem' }} iconName='IconChevronDown'></Icon>
										</Grid>
									) : (
										<Skeleton variant='rounded' width={120} height={20} sx={{ marginLeft: '20px' }} />
									)}
								</Grid>
							}
							onClickMenuItem={(item: any) => {
								console.log(item);
							}}
							menu={menu}
						/>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

TopBar.defaultProps = {
	avatarSrc: ImageLinks.avatar,
	username: 'John Doe',
	childNodes: null,
	leftComponent: null,
	breadCrumbList: [],
	menu: [],
};

export default TopBar;
