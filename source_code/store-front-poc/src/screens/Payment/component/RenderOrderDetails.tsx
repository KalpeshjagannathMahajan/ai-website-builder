import { useTheme } from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { Box, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../styles';
import { useLocation, useNavigate } from 'react-router-dom';
import constants from '../constants';
import { get_formatted_price_with_currency } from 'src/utils/common';
import RouteNames from 'src/utils/RouteNames';
import { document } from 'src/screens/OrderManagement/mock/document';
import utils from 'src/utils/utils';

interface Props {
	data: any;
	currency: string;
	divider_style?: any;
}

const RenderOrderDetails = ({ data, currency, divider_style }: Props) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const location = useLocation();
	const path = location.state;
	const theme: any = useTheme();
	const { document_id = '', document_status = '' } = data;
	const document_type = document?.DocumentTypeEnum?.ORDER;
	const doc_status = utils.handle_get_status(document_status);

	const doc_routing_path =
		path?.document_route ??
		(document_id && document_type && doc_status
			? `${RouteNames.product.review.routing_path}${document_type}/${document_id}/${doc_status}`
			: null);

	const payment_order_keys = _.chain(constants.payment_order_details)
		.filter((detail) => _.has(data, detail.key))
		.map((detail) => ({
			key: detail?.key,
			value: data[detail?.key],
			label: detail?.label,
		}))
		.value();

	return (
		<React.Fragment>
			{!_.isEmpty(payment_order_keys) && (
				<React.Fragment>
					<Grid className={classes.payment_order_details} container flexDirection='column' gap={1.5}>
						<Box display='flex' gap={1} alignItems='center' style={{ cursor: 'pointer' }} onClick={() => navigate(doc_routing_path)}>
							<CustomText type='Subtitle' color={theme?.payments.green}>
								{data?.display_id}
							</CustomText>
							<Icon iconName='IconExternalLink' color={theme?.payments.green} size={'18px'} />
						</Box>

						{_.map(payment_order_keys, (item) => {
							if (item?.value) {
								return (
									<Grid key={item?.key} display='flex' justifyContent='space-between'>
										<CustomText type='Body'>{item?.label}</CustomText>
										<CustomText type='Subtitle'>{get_formatted_price_with_currency(currency, item?.value)}</CustomText>
									</Grid>
								);
							}
						})}
					</Grid>
					<hr style={{ margin: '16px 0px', ...divider_style }}></hr>
				</React.Fragment>
			)}
		</React.Fragment>
	);
};

export default RenderOrderDetails;
