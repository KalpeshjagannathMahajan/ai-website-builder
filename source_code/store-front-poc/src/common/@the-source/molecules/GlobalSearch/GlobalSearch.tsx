import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, Icon, Image } from '../../atoms';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Dropdown from './Dropdown'; // Import the Dropdown component
import { FormControl, InputAdornment, List, ListItemButton, OutlinedInput, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import './dropdown.css';
import { ISearchConfig } from 'src/screens/ProductListing/ProductListing';
import CustomText from '../../CustomText';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import { Mixpanel } from 'src/mixpanel';
import { get_customer_metadata } from 'src/utils/utils';
import Events from 'src/utils/events_constants';
import RouteNames from 'src/utils/RouteNames';
import ImageLinks from 'src/assets/images/ImageLinks';
import SmartSearch from './SmartSearch';
import { product_listing } from 'src/utils/api_requests/productListing';
import ImageLightbox from '../../atoms/LightBox/LightBox';

interface globalSearchProps {
	search_in_config: ISearchConfig[];
	search?: string;
}

const useStyles = makeStyles(() => ({
	search_text: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		maxWidth: '80%',
	},
}));
const get_page_name = (path: string) => {
	switch (true) {
		case _.includes(path, 'collection'):
			return 'collection_product_listing_page';
		case _.includes(path, 'category'):
			return 'category_product_listing_page';
		case _.includes(path, 'recommend'):
			return 'recommend-page';
		case _.includes(path, 'previously_ordered'):
			return 'previously-order-page';
		case _.includes(path, 'all-products/search'):
			return 'product_search_page';
		default:
			return 'all_products_page';
	}
};

const GlobalSearch = ({ search_in_config, search }: globalSearchProps) => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [input, set_input] = useState(searchParams.get('search') || '');
	const [select_type, set_select_type] = useState(searchParams.get('type') || '');
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	// const [select_type_label, set_select_type_label] = useState(searchParams.get('typeLabel') || '');
	const [select_type_short, set_select_type_short] = useState(
		_.find(search_in_config, (config: ISearchConfig) => _.includes(searchParams.get('type'), config?.value))?.short_label,
	);
	const [allowClear, setAllowClear] = useState(input?.length > 0);
	const [previous_search, set_previous_search] = useState<string[]>([]);
	const [suggestions, setSuggestions] = useState<{ label: string; type_label: string; type: string }[]>([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [show_smart_search, set_show_smart_search] = useState<boolean>(false);
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const tenant = useSelector((state: any) => state?.login)?.userDetails?.tenant_id;
	const page_name = get_page_name(window.location.pathname);
	const smart_search_enabled = false;
	// search_in_config?.some((config: ISearchConfig) => config?.value === 'AI' && config?.is_active);

	const customer_metadata = get_customer_metadata({ is_loggedin: true });

	const dropdownRef = useRef(null);
	const contains_user_drive = location.pathname.includes('/user-drive');
	const theme: any = useTheme();
	const classes = useStyles();

	useEffect(() => {
		if (!input) {
			// set_search('');
			set_select_type('');
			// set_select_type_label('');
			const storedSearches = contains_user_drive
				? localStorage.getItem(`searchHistory${tenant}_user_drive`)
				: localStorage.getItem(`searchHistory${tenant}`);
			let searches = storedSearches ? JSON.parse(storedSearches) : [];
			set_previous_search(searches);
		} else {
			const uniqueSuggestions = _.filter(search_in_config, (opt: ISearchConfig) => opt?.is_active !== false)?.map(
				(config: ISearchConfig) => {
					return {
						label: input,
						type_label: config?.large_label,
						short_label: config?.short_label,
						type: config?.value,
						is_default: config?.is_default,
					};
				},
			);
			setSuggestions(uniqueSuggestions);
		}
		setAllowClear(input?.length > 0);
	}, [input]);

	useEffect(() => {
		if (!search && contains_user_drive) {
			set_select_type('');
			set_input('');
			set_select_type_short('');
		}
	}, [search]);

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (dropdownRef?.current && !dropdownRef?.current?.contains(event.target)) {
				if (!event.target.closest('.dropdown-list-item')) {
					setShowDropdown(false);
				}
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (select_type === 'AI-image') {
			return;
		}
		const value = e.target.value.trim();
		set_input(e.target.value);
		setAllowClear(e.target.value !== '');
		if (value === '' && !showDropdown) {
			// Show the previous search dropdown only when input is focused and empty
			setShowDropdown(true);
		} else {
			setShowDropdown(!!value);
		}
	};
	useEffect(() => {
		if (!searchParams.get('search')) {
			sessionStorage.setItem('smart_search_ids', JSON.stringify([]));
		} else if (_.includes(searchParams.get('type'), 'AI')) {
			const smart_search_ids = sessionStorage.getItem('smart_search_ids');
			const parsed_smart_search_ids = JSON.parse(smart_search_ids || '[]');
			if (_.isEmpty(parsed_smart_search_ids)) {
				handleSearchClick(
					{
						label: searchParams.get('search') || '',
						type_label: 'AI search',
						type: searchParams.get('type') || '',
						short_label: 'AI search',
					},
					undefined,
					undefined,
					false,
				);
			}
		}
	}, []);

	const handleSearchClick = (
		value: { label: string; type_label: string; type: string; short_label: string },
		set_upload_loader?: any,
		set_error?: any,
		should_stop_reload: boolean = true,
	) => {
		if (
			value?.label?.trim() === '' ||
			(value?.label?.trim() === searchParams.get('search') && value?.type === searchParams.get('type') && should_stop_reload)
		) {
			setShowDropdown(false);
			return;
		}

		const handle_rest = () => {
			// if (value?.label && value?.label.trim() !== '') {
			const storedSearches = contains_user_drive
				? localStorage.getItem(`searchHistory${tenant}_user_drive`)
				: localStorage.getItem(`searchHistory${tenant}`);
			let searches = storedSearches ? JSON.parse(storedSearches) : [];

			if (_.filter(searches, (sea: any) => sea?.label === value?.label && sea?.type === value?.type)?.length === 0) {
				searches.unshift(value);
			}

			while (searches.length > 5) {
				searches.pop();
			}

			if (contains_user_drive) {
				localStorage.setItem(`searchHistory${tenant}_user_drive`, JSON.stringify(searches));
				navigate(`/user-drive/search?search=${value?.label?.trim()}&type=${value?.type}`);
				set_select_type_short(value?.short_label);
				set_select_type(value?.type);
				set_input(value?.label);
				setShowDropdown(false);
			} else {
				localStorage.setItem(`searchHistory${tenant}`, JSON.stringify(searches));
				navigate(`/all-products/search?search=${value?.label?.trim()}&type=${value?.type}`);
			}

			set_previous_search(searches);
			Mixpanel.track(Events.SEARCH_EXECUTED, {
				tab_name: 'Products',
				page_name,
				section_name: '',
				subtab_name: '',
				customer_metadata,
				product_search_type: value?.type,
			});
		};

		if (_.includes(value?.type, 'AI')) {
			value.type = _.includes(value?.type, 'AI-image') ? 'AI-image' : 'AI-text';
			const payload: any = {
				input_type: _.includes(value?.type, 'AI-image') ? 'image_url' : 'text',
				input_data: value?.label,
			};
			product_listing
				.get_smart_search_products(payload)
				.then((res: any) => {
					if (res?.status_code === 200) {
						sessionStorage.setItem('smart_search_ids', JSON.stringify(res?.data));
						handle_rest();
					} else {
						set_error('Error, please try again');
						set_upload_loader(false);
					}
				})
				.catch(() => {
					set_error('Error, please try again');
					set_upload_loader(false);
				});
		} else {
			sessionStorage.setItem('smart_search_ids', JSON.stringify([]));
			handle_rest();
		}
	};

	const handleClear = (event: React.ChangeEvent<HTMLInputElement>) => {
		set_input('');
		// set_type('product');
		event.target.value = '';
		// handleInputChange(event);
		set_select_type('');
		setAllowClear(false);
		sessionStorage.setItem('smart_search_ids', JSON.stringify([]));
		if (contains_user_drive) navigate('/user-drive');
		else navigate(RouteNames.product.all_products.path);
	};

	const activeSuggestions: any = input !== '' ? suggestions : previous_search;

	const on_key_down = (e: any) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			setActiveIndex((prev) => {
				if (prev === null || prev >= activeSuggestions?.length - 1) return 0;
				return prev + 1;
			});
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			setActiveIndex((prev) => {
				if (prev === null || prev <= 0) return activeSuggestions?.length - 1;
				return prev - 1;
			});
		} else if (e.keyCode === 13) {
			if ((input === '' && activeIndex === null) || select_type === 'AI-image') {
				return;
			}
			const _suggestion: any =
				select_type !== ''
					? _.find(suggestions, (suggestion: { label: string; type_label: string; type: string }) =>
							_.includes(select_type, suggestion?.type),
					  )
					: _.find(suggestions, (suggestion: { label: string; type_label: string; type: string }) => suggestion?.is_default === true);

			if (activeIndex !== null) handleSearchClick(activeSuggestions[activeIndex]);
			else handleSearchClick(_suggestion || suggestions[0]);

			e.preventDefault();
			e.stopPropagation();
		} else {
			e.stopPropagation();
		}
	};

	return (
		<Box component='form' height={42} position={'relative'}>
			{show_smart_search && <SmartSearch set_show_smart_search={set_show_smart_search} handleSearchClick={handleSearchClick} />}
			<ImageLightbox
				open={lightboxOpen}
				onClose={() => setLightboxOpen(false)}
				selectedIndex={0}
				overrideWidth={900}
				overrideHeight={700}
				images={[
					{
						src: input,
						download: {
							url: input,
							filename: 'AI-image',
						},
					},
				]}
			/>
			<FormControl variant='outlined' fullWidth={true} sx={{ width: '100%', fontSize: '1.4rem' }}>
				<OutlinedInput
					onKeyDown={on_key_down}
					size={'small'}
					style={{
						background: showDropdown || input !== '' ? 'var(--primary-50, #E8F3EF)' : '#FFFFFF',
						height: 42,
						fontSize: '1.4rem',
						borderColor: '#73B89F',
					}}
					sx={{ ...theme?.global_search?.outlined_input, ...theme?.dropdown_border_radius }}
					id='outlined-adornment'
					label={''}
					autoComplete={'off'}
					onChange={handleInputChange}
					onFocus={() => {
						select_type !== 'AI-image' && setShowDropdown(true);
						Mixpanel.track(Events.SEARCH_BAR_CLICKED, {
							tab_name: 'Products',
							page_name,
							section_name: '',
							customer_metadata,
						});
					}}
					// onBlur={() => setShowDropdown(true)}
					value={select_type === 'AI-image' ? '' : input}
					placeholder={select_type === 'AI-image' ? 'Add to your search' : 'Search'}
					startAdornment={
						<InputAdornment position='start'>
							{is_ultron && !showDropdown && !smart_search_enabled && (
								<Icon iconName='IconSearch' sx={{ color: '#4F555E' }} color={theme?.palette?.secondary?.[800]} />
							)}
							{select_type === 'AI-image' && (
								<Image
									src={input}
									style={{ border: '1px solid rgba(181, 187, 195, 1)', padding: '2px', borderRadius: '4px', cursor: 'pointer' }}
									onClick={() => setLightboxOpen(true)}
								/>
							)}
						</InputAdornment>
					}
					endAdornment={
						<InputAdornment position='end' sx={allowClear ? { cursor: 'pointer' } : {}}>
							{smart_search_enabled && !showDropdown && select_type_short && (
								<>
									{_.includes(select_type_short, 'AI') ? (
										<Grid className='ai-chip'>
											<Image src={ImageLinks.SmartSearchIcon2} />
											<CustomText type='Caption' color='rgba(82, 82, 82, 1)'>
												AI search
											</CustomText>
										</Grid>
									) : (
										<span className='default-chip'>{select_type_short}</span>
									)}
								</>
							)}

							{is_ultron ? (
								allowClear && <Icon iconName='IconX' onClick={handleClear} color={theme?.palette?.secondary?.[600]} />
							) : allowClear ? (
								<CustomText type='H3' onClick={handleClear}>
									Clear
								</CustomText>
							) : (
								<Icon iconName='IconSearch' sx={{ color: '#4F555E' }} color={theme?.palette?.secondary?.[800]} />
							)}
							{smart_search_enabled ? (
								<Image
									src={ImageLinks.SmartSearchIcon}
									onClick={() => set_show_smart_search(true)}
									style={{ cursor: 'pointer', borderLeft: '1px solid rgba(181, 187, 195, 1)', paddingLeft: '8px', marginLeft: '6px' }}
								/>
							) : (
								select_type && (
									<Typography
										onClick={() => setShowDropdown(true)}
										sx={{
											width: 'auto',
											borderLeft: '2px solid rgba(0,0,0,0.1)',
											padding: '0px 4px',
											paddingLeft: '0.8rem',
											marginLeft: '4px',
											marginRight: '-1rem',
											fontSize: '14px',
											display: 'flex',
											color: '#737373',
											alignItems: 'center',
											justifyContent: 'space-between',
											fontWeight: '700',
											...theme?.global_search?.input_dropdown_text,
										}}>
										{select_type_short} <Icon sx={{ paddingLeft: '0.5rem' }} iconName='IconChevronDown' color='#737373' />
									</Typography>
								)
							)}
						</InputAdornment>
					}
				/>
				{showDropdown && (
					<>
						{input !== '' ? (
							<div ref={dropdownRef}>
								<Dropdown suggestions={suggestions} handleSearchClick={handleSearchClick} activeIndex={activeIndex} />
							</div>
						) : (
							<div
								ref={dropdownRef}
								className={`dropdown-container ${previous_search?.length === 0 ? 'no-data' : ''}`}
								style={{ ...theme?.global_search?.previous_search_container }}>
								{previous_search?.length > 0 && (
									<List component='nav' sx={{ ...theme?.global_search?.list, ...theme?.dropdown_border_radius }}>
										{previous_search?.map((option: any, index: number) => (
											<ListItemButton
												key={option}
												className='dropdown-list-item'
												style={index === activeIndex ? { backgroundColor: '#e8e8e8' } : {}}
												sx={{ ...theme?.global_search?.list_item_button }}
												onClick={() => handleSearchClick(option)}>
												<Icon
													iconName='IconClockHour4'
													sx={{ color: 'rgba(209, 214, 221, 1)', marginRight: '1rem' }}
													color={theme?.palette?.secondary?.[800]}
												/>

												{option?.type === 'AI-image' ? (
													<Image
														src={option?.label}
														style={{ border: '1px solid rgba(181, 187, 195, 1)', padding: '2px', borderRadius: '4px' }}
													/>
												) : (
													<Typography
														variant='body1'
														className={classes.search_text}
														sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
														{option?.label}
													</Typography>
												)}
												{_.includes(option?.type, 'AI') ? (
													<Grid className='ai-chip'>
														<Image src={ImageLinks.SmartSearchIcon2} />
														<CustomText type='Caption' color='rgba(82, 82, 82, 1)'>
															AI search
														</CustomText>
													</Grid>
												) : (
													<span className='default-chip'>{`${option?.type_label}`}</span>
												)}
											</ListItemButton>
										))}
									</List>
								)}
								{previous_search?.length === 0 && (
									<Grid container justifyContent='center' display='flex' alignItems='center' className='no-data'>
										<Grid item display='flex' width='100%' justifyContent='center' flexDirection='column' alignItems='center'>
											<Icon iconName='IconSearch' sx={{ color: '#4F555E' }} color={theme?.palette?.secondary?.[800]} />
											<CustomText>No recent searches</CustomText>
										</Grid>
									</Grid>
								)}
							</div>
						)}
					</>
				)}
			</FormControl>
		</Box>
	);
};

export default GlobalSearch;
