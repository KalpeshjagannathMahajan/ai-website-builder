import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { FC } from 'react';
import { Icon, Grid } from 'src/common/@the-source/atoms';
import Stats from './Stats';
import CustomText from '../@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(() => ({
	analytics_card_container: {
		flex: 1,
		borderRadius: '20px',
		paddingTop: '14px',
		display: 'flex',
		gap: '14px',
		flexDirection: 'column',
		cursor: 'pointer',
	},
	analytics_card_footer: {
		padding: '8px 20px 8px 18px',
		borderBottomLeftRadius: '20px',
		borderBottomRightRadius: '20px',
		height: '100%',
	},

	icon_box: {
		width: '28px',
		height: '28px',
		borderRadius: '50%',
		display: 'flex',
		padding: '6px',
		alignItems: 'center',
		justifyContent: 'center',
	},
	icon_chev: {
		height: '24px',
		width: '24px',
	},
	title_icon_section: {
		display: 'flex',
		gap: '8px',
	},
	subtitle: {
		lineHeight: '2.8rem',
	},
	analytics_card_body: {
		paddingLeft: '14px',
		paddingRight: '14px',
		display: 'flex',
		flexDirection: 'column',
		gap: '14px',
	},
	title_row: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
}));

type AnalyticsCardProps = {
	data: {
		id: string;
		path: string;
		band_color: string;
		icon_name: string;
		icon_color: string;
		title: string;
		subtitle: string;
		info?: {
			label: string;
			value: string;
		}[];
	};
	show_details: boolean;
	show_revenue: boolean;
	footer_height: string;
	currency: string;
};

const AnalyticsCard: FC<AnalyticsCardProps> = ({ data, show_details, show_revenue, footer_height, currency }: AnalyticsCardProps) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const theme: any = useTheme();
	const { wizshop_abandoned_cart_enabled = false } = useSelector((state: any) => state?.settings);
	const handle_navigation = () => {
		navigate(data.path);
	};

	const render_footer = () => {
		if (data.id === 'revenue') {
			if (show_revenue && data.info) {
				return <Stats info={data.info} show_details={show_details} currency={currency} />;
			}
		} else if (data.info) {
			return <Stats info={data.info} show_details={show_details} currency={currency} />;
		}
	};

	return (
		<Grid
			item
			xl={wizshop_abandoned_cart_enabled ? 2.4 : 3}
			xs={12}
			md={6}
			lg={wizshop_abandoned_cart_enabled ? 2.4 : 3}
			onClick={handle_navigation}>
			<div
				className={classes.analytics_card_container}
				style={{ ...theme?.dashboard?.analytics_card?.analytics_card_container }}
				onClick={() => navigate(data.path)}>
				<div className={classes.analytics_card_body}>
					<div className={classes.title_row}>
						<div className={classes.title_icon_section}>
							<div className={classes.icon_box} style={{ background: data.band_color }}>
								<Icon style={{ transform: 'scale(0.8)' }} iconName={data.icon_name} color={data.icon_color} />
							</div>
							<p className='card_title'>{data.title}</p>
						</div>
						<Icon iconName='IconChevronRight' className={classes.icon_chev} color={theme?.dashboard?.analytics_card?.icon_chev?.color} />
					</div>
					<CustomText type='H1' color={theme?.dashboard?.analytics_card?.custom_text?.color} className={classes.subtitle}>
						{data.subtitle}
					</CustomText>
				</div>
				<div className={classes.analytics_card_footer} style={{ background: data.band_color, height: footer_height }}>
					{render_footer()}
				</div>
			</div>
		</Grid>
	);
};

export default AnalyticsCard;
