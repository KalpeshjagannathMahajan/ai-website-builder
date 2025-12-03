import { Divider, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Chip, Grid, Icon } from 'src/common/@the-source/atoms';
import utils from 'src/utils/utils';
import useStyles from '../styles';
import { activities, icons } from 'src/screens/WizAi/constant';
import constants from 'src/utils/constants';

const Insights = ({ insights, set_drawer }: any) => {
	const classes = useStyles();
	const theme: any = useTheme();

	const { sales = [], buyer_activity_details = [], priority = '' }: any = insights || {};
	const getIcon = (activityType: any, custom: boolean = false) => {
		return (
			<Icon
				iconName={icons[activityType] || 'IconCalendarEvent'}
				className={custom ? classes.insight_icon_chip : classes.insight_icon_chip_2}
			/>
		);
	};

	const getActivityValue = (activityType: any) => {
		return <CustomText type='Caption'>{activities[activityType]}</CustomText>;
	};

	const safelyParseJson = (jsonString: any) => {
		return _.attempt(() => JSON.parse(jsonString.replace(/'/g, '"')));
	};

	const insights_result = insights?.insights?.length > 0 ? safelyParseJson(insights?.insights) : new Array(3).fill('');
	const { textColor, bgColor } = utils.get_chip_color_by_tag(String(priority?.toLowerCase()));

	const order_date = _.head(buyer_activity_details)?.formatted_value
		? dayjs(_.head(buyer_activity_details)?.formatted_value)?.format(constants.ATTRIBUTE_DATE_FORMAT)
		: '--/--/--';

	const SalesSection = ({ sub_sales }: any) => (
		<Grid className={classes.insights_sales_section}>
			{_.map(sub_sales, (sale: any, index: any) => (
				<Grid key={index} className={classes.insights_sales_section_item}>
					{index === 0 && <Icon iconName='IconCoins' className={classes.insight_icon_chip} />}
					<Grid width={'90px'}>
						<CustomText type='Body' color={theme?.insights?.dashboard?.text_color}>
							{sale?.label}
						</CustomText>
						<CustomText type='Subtitle'>{sale?.formatted_value}</CustomText>
					</Grid>
					{index < sub_sales?.length - 1 && <div className={classes.buyer_insight_dividers}> </div>}
				</Grid>
			))}
		</Grid>
	);

	const buyer_activity: any = _.get(buyer_activity_details, '[1]');

	return (
		<Grid display={'flex'} direction={'column'} py={2} gap={1}>
			<Grid className={classes.insight_container}>
				<Grid className={classes.insight_header}>
					<CustomText type='H3'>Purchase probability</CustomText>
					<Chip textColor={textColor} bgColor={bgColor} label={priority} className={classes.insight_buyer_activity_chip} />
					{buyer_activity_details?.[1] && (
						<Chip
							avatar={getIcon(buyer_activity_details?.[1]?.type)}
							label={getActivityValue(buyer_activity_details?.[1]?.type)}
							className={classes.insight_activity_chip}
							bgColor={theme.insights?.dashboard?.chip_bg_color}
						/>
					)}
				</Grid>
				<Button variant='outlined' sx={{ background: theme.insights?.dashboard?.background }} onClick={() => set_drawer(true)}>
					Update Activity
				</Button>
			</Grid>
			<Grid className={classes.insight_info_container}>
				{/* Sections for insights result and sales data */}

				<Grid className={classes.insight_text_box}>
					{_.map(insights_result, (_item) => {
						const index = _.findIndex(insights_result, (item: any) => item === _item);
						return (
							<div style={{ background: utils.get_color(index % 3), borderRadius: '4px' }}>
								<CustomText type='Body' className={classes.insight_text}>
									<Icon iconName='IconBulb' />
									{_item}
								</CustomText>
							</div>
						);
					})}
				</Grid>
				{/* )} */}
				<Divider orientation='vertical' className={classes.insight_divider} />

				<Grid display={'flex'} direction={'column'} gap={3}>
					<SalesSection sub_sales={sales.slice(0, 3)} />
					<SalesSection sub_sales={sales.slice(3, 6)} />
				</Grid>

				<Divider orientation='vertical' className={classes.insight_divider} />

				{/* Other sections omitted for brevity */}
				<Grid className={classes.insights_activity_cont}>
					<Grid className={classes.insights_activity}>
						<Icon iconName='IconBoxSeam' className={classes.insights_icon_style} />

						<Grid>
							<CustomText type='Body' color={theme?.insights?.dashboard?.text_color}>{`Last ordered on ${order_date}`}</CustomText>
						</Grid>
					</Grid>
					{buyer_activity && (
						<Grid className={classes.insights_activity}>
							{getIcon(buyer_activity?.type, true)}
							<Grid>
								<CustomText type='Body' color={theme?.insights?.dashboard?.text_color}>
									{buyer_activity?.label}
								</CustomText>
								<CustomText type='Body' color={theme?.insights?.dashboard?.text_color}>
									{buyer_activity?.formatted_value}
								</CustomText>
							</Grid>
						</Grid>
					)}
				</Grid>
			</Grid>
		</Grid>
	);
};

export default Insights;
