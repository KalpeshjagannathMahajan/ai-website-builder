import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useCallback, useEffect, useRef, useState } from 'react';
import ImageLinks from 'src/assets/images/ImageLinks';
import Icon from '../../atoms/Icon/Icon';
import Image from '../../atoms/Image/Image';
import SidebarIcon from '../../atoms/SidebarIcon/SidebarIcon';
import Tooltip from '../../atoms/Tooltip/Tooltip';
import Typography from '../../atoms/Typography/Typography';
import styles from './Sidebar.module.css';
import SidebarMenu from './SidebarMenu';
import Can from 'src/casl/Can';
import { useTheme } from '@mui/material/styles';

export interface SidebarProps {
	sidebarItems: SidebarItemsProps[];
	logo?: any;
	actions?: any;
	bottomActions: SidebarItemsProps[];
	active?: number | string;
}

export interface SidebarItemsProps {
	id: number | string;
	priority?: number;
	icon: string;
	title: string;
	link: string;
	slug?: string;
	type?: string;
	onIconClick: () => any;
}

const Sidebar = ({ logo, actions, sidebarItems, bottomActions, active }: SidebarProps) => {
	const [expand, setExpand] = useState(false);
	const [width, setWidth] = useState<string>('5.6rem');
	const [activePage, setActivePage] = useState(active);
	const [expandChildren, setExpandChildren] = useState<string[]>([]);
	const [showChildren, setShowChildren] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [menuTitle, setMenuTitle] = useState('');
	const [menuChildren, setMenuChildren] = useState([]);
	const [currentPage, setCurrentPage] = useState(active);
	const theme: any = useTheme();

	const ref = useRef<HTMLDivElement>(null);

	let bottom_icon_style = {
		display: 'flex',
		justifyContent: 'center',
	};

	useEffect(() => {
		setActivePage(active);
		setCurrentPage(active);
	}, [active]);

	// Handle to check outside sidebar check
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				// Handle the click outside event here
				setExpand((state) => {
					if (state) {
						return false;
					} else return state;
				});
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (expand) {
			setWidth('24.4rem');
		} else {
			setWidth('7rem');
		}
	}, [expand]);

	const sortedSidebarItems = sidebarItems?.sort((a: any, b: any) => a.priority - b.priority);

	const getParentId = useCallback((arr: any, childId: string | number) => {
		const parentObj = arr?.find((obj: any) => obj?.children && obj?.children?.some((childObj: any) => childObj?.id === childId));
		return parentObj ? parentObj.id : null;
	}, []);

	const handleClick = (id: number | string, set_active: any = true): any => {
		const parent = getParentId(sidebarItems, id) ?? id;
		if (set_active) {
			setCurrentPage(id);
			setActivePage(parent);
		}
		setExpand(false);
	};

	const handleMenu = (event: React.MouseEvent<HTMLButtonElement>, selected: any) => {
		setAnchorEl(event.currentTarget);
		setMenuTitle(selected?.title);
		setMenuChildren(selected?.children);
	};

	const handleSidebarIconClick = (event: any, item: any) => {
		event.stopPropagation();

		if (item?.children?.length > 0) {
			setExpandChildren((prev) => {
				if (prev.includes(item.id)) {
					return prev.filter((ele) => ele !== item.id);
				}
				return [...prev, item.id];
			});
			if (!expand) {
				setShowChildren(true);
				handleMenu(event, item);
			}
		} else {
			handleClick(item?.id, item?.set_active);
			item?.onIconClick();
		}
	};

	return (
		<Box
			ref={ref}
			sx={{
				background: '#fff',
				borderRadius: expand ? '0 8px 8px 0' : 0,
				width,
				zIndex: 100,
				position: 'absolute',
				boxShadow: expand ? '0px 4px 40px rgba(0, 0, 0, 0.3)' : 'none',
			}}>
			<Grid className={styles.container} direction='column' justifyContent='space-between' alignItems='center' rowSpacing={2}>
				<Grid
					sx={{
						height: '4em',
						position: 'sticky',
						top: 0,
						background: '#FFF',
						zIndex: 999,
						marginBottom: '1rem',
						alignItems: 'center',
						display: 'flex',
					}}>
					{expand ? (
						<Grid item>
							<Grid
								container
								direction='row'
								justifyContent='space-between'
								alignItems='center'
								sx={{ flexWrap: 'noWrap', overflow: 'hidden' }}>
								<Grid item ml={-1}>
									<Image width={175} height={25} style={{ marginLeft: '1em', paddingLeft: '14px' }} src={logo} />
								</Grid>
								<Grid item onClick={() => setExpand((state) => !state)} mt={'0.35rem'} ml={'0.35rem'} justifyContent='center'>
									<Icon color='#4F555E' iconName='IconX' size='large' sx={{ cursor: 'pointer', paddingRight: '10px' }} />
								</Grid>
							</Grid>
						</Grid>
					) : (
						<Grid item display='flex' onClick={() => setExpand((state) => !state)} mt={'-0.35rem'} ml={'1.5rem'} justifyContent='center'>
							<Icon color='#4F555E' iconName='IconMenu2' size='large' sx={{ height: 40, cursor: 'pointer', margin: '0 auto' }} />
						</Grid>
					)}
				</Grid>
				<Grid direction='row' rowSpacing={2} mt='-1.8rem' className={styles['custom-scrollbar']}>
					{sortedSidebarItems?.map((item: any) => {
						let style = {};
						if (!expand) {
							style = {
								display: 'flex',
								justifyContent: 'center',
							};
						}

						if (!item.slug)
							return (
								<Grid
									onClick={(event: any) => {
										handleSidebarIconClick(event, item);
									}}
									item
									xs={12}
									key={item?.id}
									style={{ width: '100%', margin: '1rem 0', ...style }}>
									<Tooltip
										id={item?.id.toString()}
										title={item?.title}
										placement='right'
										textStyle={{ fontSize: '1.2rem' }}
										disableFocusListener={expand}
										disableHoverListener={expand}
										disableTouchListener={expand}
										arrow>
										<div>
											<SidebarIcon
												size='large'
												text={expand ? item?.title : ''}
												hasChildren={item?.children?.length > 0}
												expandIcon={expandChildren.includes(item?.id)}
												name={item?.icon}
												active_name={item?.icon_active}
												key={item?.id}
												clicked={item?.id === activePage}
												fullWidth={expand}
												is_icon={item?.is_icon ?? true}
											/>
										</div>
									</Tooltip>
									<Grid sx={{ boxShadow: 'none' }}>
										{item?.children?.length > 0 && expand
											? expandChildren.includes(item.id) &&
											  item.children.map((child: any) => (
													<Grid
														justifyContent='space-between'
														padding='.5em 3.25em'
														onClick={() => {
															handleClick(child?.id, child?.set_active);
															child?.onIconClick();
														}}
														key={child?.id}
														sx={
															currentPage === child.id
																? {
																		background: '#E8F3EF',
																		borderRadius: '8px',
																  }
																: {}
														}>
														<Typography
															sx={{ cursor: 'pointer' }}
															noWrap
															color={currentPage === child?.id ? 'primary' : theme?.palette?.secondary[800]}
															variant={currentPage === child?.id ? 'h6' : 'body1'}>
															{child?.title}
														</Typography>
													</Grid>
											  ))
											: showChildren && (
													<SidebarMenu
														key={item?.id}
														title={menuTitle}
														childItems={menuChildren}
														open={Boolean(anchorEl)}
														anchorEl={anchorEl}
														setAnchorEl={setAnchorEl}
														handleClick={handleClick}
														selected={currentPage}
													/>
											  )}
									</Grid>
								</Grid>
							);
						return (
							<Can I={item.slug} a={item.type}>
								<Grid
									onClick={(event: any) => {
										handleSidebarIconClick(event, item);
									}}
									item
									xs={12}
									key={item?.id}
									style={{ width: '100%', margin: '1rem 0', ...style }}>
									<Tooltip
										id={item?.id.toString()}
										title={item?.title}
										placement='right'
										textStyle={{ fontSize: '1.2rem' }}
										disableFocusListener={expand}
										disableHoverListener={expand}
										disableTouchListener={expand}
										arrow>
										<div>
											<SidebarIcon
												size='large'
												text={expand ? item?.title : ''}
												hasChildren={item?.children?.length > 0}
												expandIcon={expandChildren.includes(item?.id)}
												name={item?.icon}
												active_name={item?.icon_active}
												key={item?.id}
												clicked={item?.id === activePage}
												fullWidth={expand}
												is_icon={item?.is_icon ?? true}
											/>
										</div>
									</Tooltip>
									<Grid sx={{ boxShadow: 'none' }}>
										{item?.children?.length > 0 && expand
											? expandChildren.includes(item.id) &&
											  item.children.map((child: any) => (
													<Grid
														justifyContent='space-between'
														padding='.5em 3.25em'
														onClick={() => {
															handleClick(child?.id, child?.set_active);
															child?.onIconClick();
														}}
														sx={
															currentPage === child.id
																? {
																		background: '#E8F3EF',
																		borderRadius: '8px',
																  }
																: {}
														}>
														<Typography
															sx={{ cursor: 'pointer' }}
															noWrap
															color={currentPage === child?.id ? 'primary' : theme?.palette?.secondary[800]}
															variant={currentPage === child?.id ? 'h6' : 'body1'}>
															{child?.title}
														</Typography>
													</Grid>
											  ))
											: showChildren && (
													<SidebarMenu
														title={menuTitle}
														childItems={menuChildren}
														open={Boolean(anchorEl)}
														anchorEl={anchorEl}
														setAnchorEl={setAnchorEl}
														handleClick={handleClick}
														selected={currentPage}
													/>
											  )}
									</Grid>
								</Grid>
							</Can>
						);
					})}
				</Grid>
				<Grid
					className={styles.footer}
					mt={expand ? '-1rem' : '0rem'}
					direction='column'
					style={!expand ? bottom_icon_style : {}}
					justifyContent='space-between'
					alignItems='center'>
					<Can I={actions.slug} a={actions.type}>
						<Grid xs={expand}>
							<Tooltip
								title={actions?.title}
								textStyle={{ fontSize: '1.2rem' }}
								disableFocusListener={expand}
								disableHoverListener={expand}
								disableTouchListener={expand}
								placement='right'
								arrow>
								<div
									onClick={() => {
										actions?.onClick();
									}}>
									<SidebarIcon
										key={actions?.id}
										name={actions?.icon}
										text={expand ? actions?.title : ''}
										size='large'
										fullWidth={expand}
										is_icon={false}
									/>
								</div>
							</Tooltip>
						</Grid>
					</Can>
					{bottomActions.map((item: any) => {
						if (!item?.slug) {
							return (
								<Grid xs={expand} key={item?.id} direction='column'>
									<Tooltip
										id={item?.id.toString()}
										title={item?.title}
										textStyle={{ fontSize: '1.2rem' }}
										disableFocusListener={expand}
										disableHoverListener={expand}
										disableTouchListener={expand}
										placement='right'
										arrow>
										<div
											onClick={() => {
												item?.onIconClick();
												handleClick(item?.id);
											}}>
											<SidebarIcon
												key={item?.id}
												name={item?.icon}
												text={expand ? item?.title : ''}
												size='large'
												clicked={item?.id === activePage}
												fullWidth={expand}
											/>
										</div>
									</Tooltip>
								</Grid>
							);
						}
						return (
							<Can I={item?.slug} a={item?.type}>
								<Grid xs={expand} key={item?.id} direction='column'>
									<Tooltip
										id={item?.id.toString()}
										title={item?.title}
										textStyle={{ fontSize: '1.2rem' }}
										disableFocusListener={expand}
										disableHoverListener={expand}
										disableTouchListener={expand}
										placement='right'
										arrow>
										<div
											onClick={() => {
												item?.onIconClick();
												handleClick(item?.id);
											}}>
											<SidebarIcon
												key={item?.id}
												name={item?.icon}
												text={expand ? item?.title : ''}
												size='large'
												clicked={item?.id === activePage}
												fullWidth={expand}
											/>
										</div>
									</Tooltip>
								</Grid>
							</Can>
						);
					})}
				</Grid>
			</Grid>
		</Box>
	);
};

Sidebar.defaultProps = {
	logo: ImageLinks.LogoWithText,
	active: 1,
};

export default Sidebar;
