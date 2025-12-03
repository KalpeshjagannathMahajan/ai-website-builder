import { makeStyles } from '@mui/styles';
import CustomText from 'src/common/@the-source/CustomText';
import { Box, Chip } from 'src/common/@the-source/atoms';
import dayjs from 'dayjs';
import _ from 'lodash';
import React from 'react';
import constants from 'src/utils/constants';

const useStyles = makeStyles(() => ({
	leads_card: {
		width: '240px',
		cursor: 'pointer',
		background: '#fff',
		borderRadius: '20px',
		display: 'flex',
		flexDirection: 'column',
	},
	leads_info_card: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		padding: '12px 12px 4px 12px',
	},
	status: {
		width: '100%',
	},
	status_container: {
		padding: '6px 6px 6px 16px',
		border: '2px solid #fff',
		borderBottomLeftRadius: '20px',
		borderBottomRightRadius: '20px',
		textTransform: 'capitalize',
	},
	truncate: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		width: '100%',
	},
}));

interface StorefrontLeadCardProps {
	data: any;
	onClick: () => void;
}

const StorefrontLeadCard = ({ data, onClick }: StorefrontLeadCardProps) => {
	const classes = useStyles();
	const formattedDate = dayjs(data?.created_at)?.format(constants.ATTRIBUTE_DATE_FORMAT) || 'Invalid Date';
	const leads = [
		{
			customer_type: data?.customer_type,
			key: 'customer_type',
		},
		{
			company_name: data?.lead_basic_details?.company_name,
			style: {
				marginTop: '10px',
				color: '#25282D',
			},
			type: 'H2',
			key: 'company_name',
		},
		{
			full_name: `${data?.lead_basic_details?.first_name} ${data?.lead_basic_details?.last_name}`,
			style: {
				marginTop: '10px',
				color: '#676D77',
			},
			type: 'Subtitle',
			key: 'full_name',
		},
		{
			email: data?.lead_basic_details?.email,
			style: {
				marginTop: '8px',
				fontWeight: '400',
				fontSize: '14px',
				color: '#676D77',
			},
			key: 'email',
		},
		{
			date: (
				<>
					Created at <span style={{ fontWeight: 700, fontSize: '14px' }}>{formattedDate}</span>
				</>
			),
			style: {
				color: '#676D77',
				marginTop: '8px',
				fontWeight: '400',
				fontSize: '14px',
			},
			type: 'Subtitle',
			key: 'date',
		},
	];
	const style_status = (status: string) => {
		switch (status) {
			case 'open':
				return {
					color: 'rgba(69, 120, 196, 1)',
					backgroundColor: 'rgba(240, 246, 255, 1)',
				};
			case 'approved':
				return { color: 'rgba(125, 165, 14, 1)', backgroundColor: 'rgba(242, 246, 231, 1)' };
			case 'rejected':
				return { color: 'rgba(215, 76, 16, 1)', backgroundColor: 'rgba(251, 237, 231, 1)' };
			default:
				return {};
		}
	};
	const handle_render_content = (item: any, key: string) => {
		switch (key) {
			case 'customer_type':
				return (
					<Chip
						size='small'
						label={
							<CustomText type='CaptionBold' color='white'>
								{item[key] === 'new_customer' ? 'New customer' : 'Existing customer'}
							</CustomText>
						}
						bgColor={item[key] === 'new_customer' ? '#F0AF30' : 'rgba(107, 166, 254, 1)'}
					/>
				);
			default:
				return (
					<CustomText style={item?.style} className={classes?.truncate} type={item?.type}>
						{item[key]}
					</CustomText>
				);
		}
	};

	return (
		<Box className={classes?.leads_card} onClick={onClick}>
			<Box className={classes?.leads_info_card}>
				{_.map(leads, (item) => (
					<React.Fragment key={item?.key}>{handle_render_content(item, item?.key)}</React.Fragment>
				))}
			</Box>
			<Box className={classes?.status}>
				<CustomText className={classes.status_container} style={style_status(data?.lead_status)}>
					{data?.lead_status}
				</CustomText>
			</Box>
		</Box>
	);
};

export default StorefrontLeadCard;
