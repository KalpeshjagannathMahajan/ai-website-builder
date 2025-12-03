/* eslint-disable @typescript-eslint/no-unused-vars */
import NotificationFeedback from 'src/common/NotificationFeedback/NotificationFeedback';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from './common/@the-source/atoms';
import { Outlet } from 'react-router-dom';
import Content from './common/@the-source/molecules/Content';
import ErrorBoundary from './ErrorBoundary';
import VersionAlertModal from './common/VersionAlertModal';
import { useCallback, useEffect, useState } from 'react';
import { update_web_to_latest_version } from './actions/version';
import Sidebar from './screens/Home/Sidebar/Sidebar';
import Topbar from './screens/Home/Topbar/Topbar';
import LoaderScreen from './utils/LoaderScreen';
import _ from 'lodash';
import ReviewBottomBar from './screens/Presentation/components/ReviewBottomBar';
import WizInsights from './screens/WizAi';

const { VITE_APP_REPO } = import.meta.env;

const is_ultron = VITE_APP_REPO === 'ultron';

interface MainLayoutProps {}

const MainLayout: React.FC<MainLayoutProps> = () => {
	const [show_customer, set_show_customer] = useState<boolean>(_.includes(window.location.pathname, '/wiz_insights'));
	const dispatch = useDispatch();

	const notification_feedback = useSelector((state: any) => state?.notifications?.notification_feedback);
	const web_updated_to_latest_version = useSelector((state: any) => state.version.web_updated_to_latest_version);
	const layout = useSelector((state: any) => state?.settings?.layout);
	const temp_token = useSelector((state: any) => state?.persistedUserData?.temp_token);
	const handleVisibilityChange = useCallback(() => {
		if (document.visibilityState === 'visible') dispatch<any>(update_web_to_latest_version());
	}, []);

	useEffect(() => {
		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, []);

	useEffect(() => {
		set_show_customer(_.includes(window.location.pathname, '/wiz_insights'));
	}, [layout]);

	return (
		<ErrorBoundary>
			{notification_feedback.visible && <NotificationFeedback notification_feedback={notification_feedback} />}
			{!web_updated_to_latest_version && <VersionAlertModal web_updated_to_latest_version={web_updated_to_latest_version} />}

			<Grid container>
				{is_ultron && (
					<Grid item position='fixed' width={85} zIndex='drawer'>
						<Sidebar />
					</Grid>
				)}

				<Grid item xs position='absolute' right={0} left={is_ultron ? 66 : 0}>
					{is_ultron && (
						<Grid
							sx={{
								background: 'white',
								position: 'sticky',
								top: 0,
								zIndex: 999,
							}}>
							<Topbar />
						</Grid>
					)}

					<Content>
						{temp_token ? (
							<LoaderScreen />
						) : (
							<Grid>
								<Grid display={show_customer ? 'block' : 'none'}>
									<WizInsights />
								</Grid>
								{!show_customer && (
									<>
										<Outlet />
										<ReviewBottomBar />
									</>
								)}
							</Grid>
						)}
					</Content>
				</Grid>
			</Grid>
		</ErrorBoundary>
	);
};

export default MainLayout;
