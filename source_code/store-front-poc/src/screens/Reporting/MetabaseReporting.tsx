import React, { useEffect, useState } from 'react';
import SkeletonUI from './Skeleton';
import RouteNames from 'src/utils/RouteNames';
import { Tab, Tabs } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateBreadcrumbs } from 'src/actions/topbar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Grid, Icon, Typography } from 'src/common/@the-source/atoms';
import _ from 'lodash';
import api_requests from 'src/utils/api_requests';
import Alert from 'src/common/@the-source/atoms/Alert';
import { colors } from 'src/utils/theme';
import { t } from 'i18next';
import { DATE_TIME_FORMAT } from 'src/common/@the-source/molecules/FilterComponents/DateFIlter/helper';
import { convert_date_to_timezone } from 'src/utils/dateUtils';
import TIMEZONES from 'src/utils/timezone';

const MetabaseReporting = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [search_params] = useSearchParams();
	const [iframe_urls_fetched, set_iframe_urls_fetched] = useState<boolean>(false);
	const [iframeUrls, set_iframe_urls] = useState<string[]>([]);
	const [last_updated_at, set_last_updated_at] = useState<string[]>([]);
	const [time_zone_report, set_time_zone_report] = useState<string[]>();
	const [loading, set_loading] = useState<boolean[]>([true, true, true, true]);
	const [tab_index, set_tab_index] = useState(1);
	const [open, set_open] = useState([true, true, true, true]);

	let url_filter_params = search_params.toString();

	const reporting_tabs_titles = ['Sales', 'Buyers', 'Product', 'Team'];

	const handle_navigate = (url: any) => {
		if (url_filter_params) {
			navigate(`${url}?${url_filter_params}`, { replace: true });
		} else {
			navigate(url);
		}
	};

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		switch (newValue) {
			case 0:
				handle_navigate(RouteNames.reports.sales_report.path);
				break;
			case 1:
				handle_navigate(RouteNames.reports.buyers_report.path);
				break;
			case 2:
				handle_navigate(RouteNames.reports.product_report.path);
				break;
			default:
				handle_navigate(RouteNames.reports.teams_report.path);
				break;
		}
	};

	const get_iframe_urls = async () => {
		try {
			const response: any = await api_requests.reports.get_metabse_reports_url();

			if (response?.status === 200) {
				const _temp = _.map(reporting_tabs_titles, (a: string) => {
					let temp_url = response?.[a]?.url || '';
					temp_url = temp_url.replace('https://metabase-g-pp.sourcerer.tech/', 'https://metabase-g-p.sourcerer.tech/');
					return temp_url;
				});
				const last_updated_at_arr = _.map(reporting_tabs_titles, (a: string) => _.get(response, `${a}.banner_message.last_updated_time`));
				const time_zone = _.map(reporting_tabs_titles, (a: string) => _.get(response, `${a}.banner_message.timezone`));
				_temp && set_iframe_urls(_temp);
				last_updated_at && set_last_updated_at(last_updated_at_arr);
				time_zone && set_time_zone_report(time_zone);
				set_iframe_urls_fetched(true);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		get_iframe_urls();
	}, []);

	useEffect(() => {
		const tab = location.pathname.split('/').pop();
		const breadCrumbList = [
			{
				id: 1,
				linkTitle: 'Dashboard',
				link: RouteNames.dashboard.path,
			},
			{
				id: 2,
				linkTitle: 'Report',
				link: `${RouteNames.reports.sales_report.path}`,
			},
			{
				id: 3,
				linkTitle: 'Sales',
				link: `${RouteNames.reports.sales_report.path}`,
			},
		];

		switch (tab) {
			case 'sales':
				set_tab_index(1);
				breadCrumbList[2].linkTitle = 'Sales';
				breadCrumbList[2].link = `${RouteNames.reports.sales_report.path}`;
				break;
			case 'buyers':
				set_tab_index(2);
				breadCrumbList[2].linkTitle = 'Customers';
				breadCrumbList[2].link = `${RouteNames.reports.buyers_report.path}`;
				break;
			case 'product':
				set_tab_index(3);
				breadCrumbList[2].linkTitle = 'Products';
				breadCrumbList[2].link = `${RouteNames.reports.product_report.path}`;
				break;
			case 'teams':
				set_tab_index(4);
				breadCrumbList[2].linkTitle = 'Teams';
				breadCrumbList[2].link = `${RouteNames.reports.teams_report.path}`;
				break;
		}
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, [location.pathname]);

	const update_state = (_index: number) => {
		return (state: any) =>
			_.map(state, (ele, index: number) => {
				if (_index === index) {
					return false;
				} else {
					return ele;
				}
			});
	};

	const update_loading = (_index: number) => {
		set_loading(update_state(_index));
	};

	const update_alert = (_index: number) => {
		set_open(update_state(_index));
	};

	const renderTab = (tab_title: string) => {
		return (
			<Tab
				key={tab_title}
				sx={{ textTransform: 'unset' }}
				label={<Typography sx={{ fontSize: '1.8rem', fontWeight: 700 }}>{tab_title === 'Buyers' ? 'Customers' : tab_title} </Typography>}
			/>
		);
	};

	const get_time_zone_label = (value: string) => {
		return (_.find(TIMEZONES, { value }) || _.find(TIMEZONES, { is_default: true }))?.label;
	};

	return (
		<React.Fragment>
			<Grid container pt={2}>
				<Grid item>
					<Tabs aria-label='basic tabs example' value={tab_index - 1} onChange={handleChange}>
						{_.map(reporting_tabs_titles, (tab_title: string) => renderTab(tab_title))}
					</Tabs>
				</Grid>
			</Grid>
			{/* {getTabpanel(value)} */}
			{_.map(last_updated_at, (last_updated: string, index: number) => {
				const date_time = convert_date_to_timezone(last_updated, DATE_TIME_FORMAT, time_zone_report?.[index]);
				const check_visibility = loading[index] || index + 1 !== tab_index;
				return (
					<Alert
						icon={<Icon color={colors.warning} iconName='IconInfoCircle' />}
						severity={'warning'}
						style={{
							padding: '4px 16px',
							margin: '12px 0px',
							display: `${check_visibility ? 'none' : 'flex'}`,
						}}
						open={open[index]}
						handle_close={() => update_alert(index)}
						message={t('Reporting.MetabaseReporting', {
							last_updated_at: date_time,
							time_zone: get_time_zone_label(time_zone_report?.[index] || ''),
						})}
					/>
				);
			})}
			{iframeUrls?.length > 0 ? (
				<Grid mt={2} sx={{ position: 'relative', height: 'calc(100vh - 140px)' }}>
					<React.Fragment>
						{_.map(iframeUrls, (iframeUrl: string, index: number) => (
							<>
								{loading[index] && iframeUrl && index + 1 === tab_index && <SkeletonUI />}
								{iframeUrl ? (
									<iframe
										id='metabase'
										style={{ width: '100%', height: '100%', display: `${loading[index] || index + 1 !== tab_index ? 'none' : 'block'}` }}
										src={iframeUrl}
										frameBorder='0'
										width={800}
										allowTransparency
										onLoad={() => update_loading(index)}
									/>
								) : (
									<>
										<Grid
											container
											justifyContent='center'
											alignItems='center'
											onLoad={() => setTimeout(() => update_loading(index), 1000)}
											style={{
												height: 'calc(100vh - 235px)',
												display: `${index + 1 !== tab_index ? 'none' : 'flex'}`,
											}}>
											<Typography variant='h4'>No report to show yet</Typography>
										</Grid>
									</>
								)}
							</>
						))}
					</React.Fragment>
				</Grid>
			) : (
				<Grid container justifyContent='center' alignItems='center' style={{ height: 'calc(100vh - 135px)' }}>
					{iframe_urls_fetched && <Typography variant='h4'>No report to show yet</Typography>}
				</Grid>
			)}
		</React.Fragment>
	);
};

export const MetabaseOutsideReporting = () => {
	const METABASE_SITE_URL = 'https://sourcewiz.metabaseapp.com';

	const token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6eyJkYXNoYm9hcmQiOjR9LCJwYXJhbXMiOnt9LCJleHAiOjE3MjU1ODU1Mzh9.pIW1DX4MK5hGlHO4-9_znHWZTmKKe5ajVhrYaosUBXs';

	const iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=false&titled=false`;
	return (
		<iframe
			id='metabaseOutside'
			style={{ width: '100%', height: '' }}
			src={iframeUrl}
			frameBorder='0'
			width={800}
			allowTransparency></iframe>
	);
};

export default MetabaseReporting;
