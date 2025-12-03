import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
// import _ from 'lodash';
import OutsideSkeletonUI from './OutsideSkeleton';
import api_requests from 'src/utils/api_requests';

// interface MetabaseResponse {
// 	tab_name: string;
// 	url: string;
// 	dashboard_id: string;
// 	filters: Record<string, any>;
// }

interface OutsideReportingProps {
	tab_name: string;
}

export const OutsideMetabaseReporting: React.FC<OutsideReportingProps> = ({ tab_name }) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [iframeUrl, setIframeUrl] = useState<string>('');
	const [searchParams] = useSearchParams();
	// const tenant_id = searchParams.get('tenant_id');
	// const user_id = searchParams.get('user_id');
	const access_token = searchParams.get('access_token');

	const fetchIframeUrls = async () => {
		try {
			const response: any = await api_requests.reports.get_metabse_reports_url(access_token ?? undefined);
			if (response?.status === 200) {
				let currentIframeUrl = response?.[tab_name]?.url;
				// const currentIframeUrl = (_.find(response, { tab_name, tenant_id, user_id }) as MetabaseResponse)?.url;
				if (currentIframeUrl) {
					currentIframeUrl = currentIframeUrl.replace('https://metabase-g-pp.sourcerer.tech/', 'https://metabase-g-p.sourcerer.tech/');
					setIframeUrl(currentIframeUrl);
				}
			}
		} catch (error) {
			console.error('Error fetching iframe URLs:', error);
		}
	};

	useEffect(() => {
		if (!tab_name) return;
		fetchIframeUrls();
	}, [tab_name]);

	if (!loading && !iframeUrl) {
		return (
			<Grid container justifyContent='center' alignItems='center' style={{ height: 'calc(100vh - 135px)' }}>
				<Typography variant='h4'>No report to show yet</Typography>
			</Grid>
		);
	}

	return (
		<Grid mt={2} sx={{ position: 'relative', height: '100vh' }}>
			{loading && <OutsideSkeletonUI />}
			<iframe
				id='metabaseOutside'
				style={{ width: '100%', height: '100%', display: loading ? 'none' : 'block' }}
				src={iframeUrl}
				frameBorder='0'
				width={800}
				allowTransparency
				onLoad={() => setLoading(false)}></iframe>
		</Grid>
	);
};
