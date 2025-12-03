import { List, ListItemButton, Typography } from '@mui/material';
import './dropdown.css';
import { makeStyles } from '@mui/styles';

import { Icon, Image, Grid } from '../../atoms';
import { useTheme } from '@mui/material/styles';
import CustomText from '../../CustomText';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import _ from 'lodash';
import ImageLinks from 'src/assets/images/ImageLinks';
interface DropdownProps {
	activeIndex: any;
	suggestions: any[];
	handleSearchClick: (value: { label: string; type_label: string; type: string }) => void;
}

const useStyles = makeStyles((theme: any) => ({
	dropdown_container: {
		position: 'absolute',
		top: '100%',
		width: '100%',
		backgroundColor: '#fff',
		border: '1px solid #ccc',
		overflowY: 'auto',
		zIndex: '1000',
		...theme?.global_search?.dropdown_container,
		...theme?.dropdown_border_radius,
	},
	chip: {
		marginLeft: '0.8rem',
		background: 'rgba(0,0,0,0.1)',
		padding: '0.5rem 1rem',
		borderRadius: '4px',
		color: '#525252',
		...theme?.global_search?.chip,
		minWidth: 'fit-content',
	},
	list_value: {
		maxWidth: is_ultron ? 'calc(100% - 14rem)' : 'calc(100% - 12rem)',
		wordWrap: 'break-word',
		overflowWrap: 'break-word',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		// direction: 'rtl',
		textAlign: 'left',
	},
	default_chip: {
		borderRadius: '24px',
		marginLeft: '0.8rem',
		background: 'linear-gradient(99deg, #9BC91B -2.28%, #009862 96.31%)',
		color: '#FFF',
		textAlign: 'center',
		fontStyle: 'normal',
		padding: '0.5rem 1rem',
		fontWeight: '700',
		...theme?.global_search?.default_chip,
		minWidth: 'fit-content',
	},
	ai_chip: {
		display: 'flex',
		alignItems: 'center',
		padding: '0.5rem 1rem',
		border: '1px solid #92B72B',
		borderRadius: '0.5rem',
		gap: '0.5rem',
		backgroundColor: 'rgba(229, 237, 207, 1)',
		marginLeft: '0.8rem',
		minWidth: 'fit-content',
	},
}));

const Dropdown = ({ suggestions, handleSearchClick, activeIndex }: DropdownProps) => {
	const classes = useStyles();
	const handleClick = (option: any) => {
		handleSearchClick(option);
	};

	const theme: any = useTheme();

	return (
		<div className={classes.dropdown_container}>
			<List component='nav' sx={{ ...theme?.global_search?.list }}>
				{suggestions?.map((option, index) => {
					return (
						<ListItemButton
							key={option?.label + option?.type}
							onClick={() => handleClick(option)}
							className={'dropdown-list-item'}
							sx={{ ...theme?.global_search?.list_item_button }}
							style={index === activeIndex ? { backgroundColor: '#e8e8e8' } : {}}>
							{is_ultron && (
								<Icon
									iconName='IconSearch'
									sx={{ color: 'rgba(209, 214, 221, 1)', marginRight: '1rem' }}
									color={theme?.palette?.secondary?.[800]}
								/>
							)}
							<Typography variant='body1' className={classes.list_value}>
								{option?.label}
							</Typography>
							{_.includes(option?.type, 'AI') ? (
								<Grid className={classes.ai_chip}>
									<Image src={ImageLinks.SmartSearchIcon2} />
									<CustomText type='Caption' color='rgba(82, 82, 82, 1)'>
										AI search
									</CustomText>
								</Grid>
							) : (
								<span className={option?.is_default ? classes.default_chip : classes.chip}>{`${option?.type_label}`}</span>
							)}
						</ListItemButton>
					);
				})}
			</List>
		</div>
	);
};

export default Dropdown;
