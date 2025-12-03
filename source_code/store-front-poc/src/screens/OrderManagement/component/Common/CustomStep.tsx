/* eslint-disable no-param-reassign */
import { Box, Grid, Icon, Image, Typography } from 'src/common/@the-source/atoms';
import ImageLinks from 'src/assets/images/ImageLinks';
import React from 'react';
import _ from 'lodash';
import { COLLAPSE_SECTION_TYPE } from '../../constants';
import dayjs from 'dayjs';
import CustomText from 'src/common/@the-source/CustomText';
import CustomStatusChip from './CustomStatusChip';
import DOMPurify from 'dompurify';
import { custom_stepper_bg_color, custom_stepper_text_color } from 'src/utils/light.theme';
import useStyles from '../../styles';
import { isoToDateDay } from 'src/utils/common';

interface Props {
	line_items?: any[];
	tracking_info?: any;
	container_style?: any;
	type: string;
	_index?: number;
	data?: any;
	set_success_toast?: any;
}

const active_icon_style = {
	width: 16,
	height: 16,
};

const in_active_icon_style = {
	width: 10,
	height: 10,
};

const shipment_label = ['Created on', 'Carrier', 'Shipment notes'];

const CustomStepper: React.FC<Props> = ({ line_items, tracking_info, container_style, type, _index, data, set_success_toast }) => {
	const ref_id = _.get(tracking_info, 'number');
	const url = _.get(tracking_info, 'url');
	const company = _.get(tracking_info, 'company');
	const createdAt = _.get(data, 'createdAt');
	const shipment_notes = _.get(data, 'shipment_notes');
	const shipment_status = _.get(data, 'status');
	const classes = useStyles();

	const format_message = (str: string) => {
		if (_.endsWith(str, '.')) {
			return _.trimEnd(str, '.');
		}
		return str;
	};

	const handle_render_step = (image_icon: any, style: any, message: string, status: string, date: any, invoice_data: any) => {
		if (message) message = format_message(message);
		switch (type) {
			case COLLAPSE_SECTION_TYPE.SHIPMENT_SECTION:
				return (
					<Grid container alignItems='center' gap={2} ml={-1}>
						<Box display='flex' justifyContent='center' width={20} alignItems='center'>
							<Image src={image_icon} style={style} />
						</Box>

						<React.Fragment>
							<span style={{ fontSize: '14px', color: custom_stepper_text_color?.primary }}>
								<span style={{ fontWeight: 700 }}>{status}</span> {message} on {date}
							</span>
						</React.Fragment>
					</Grid>
				);
			case COLLAPSE_SECTION_TYPE.INVOICE:
				return (
					<Grid container display='flex' alignItems='flex-start' gap={0.9} ml={-1.3} pb={2}>
						<Box display='flex' justifyContent='center' width={20} alignItems='center'>
							<Image src={image_icon} style={style} />
						</Box>
						<React.Fragment>{invoice_data}</React.Fragment>
					</Grid>
				);
			case COLLAPSE_SECTION_TYPE.ACTIVITY_SECTION:
				return (
					<Grid container alignItems='center' gap={2} ml={-1.2}>
						<Box display='flex' justifyContent='center' width={20} alignItems='center'>
							<Image src={image_icon} style={style} />
						</Box>

						<React.Fragment>
							<span style={{ fontSize: '14px', color: custom_stepper_text_color?.primary }}>
								<span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message) }} />
								{''} on {date}
							</span>
						</React.Fragment>
					</Grid>
				);
		}
	};

	const handle_click = () => {
		const is_valid_url =
			/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
				url,
			);
		if (is_valid_url) window.open(url);
		else {
			set_success_toast({ open: true, title: 'Tracking link is not available', subtitle: '', state: 'error' });
		}
	};

	const handle_shipment_section = () => {
		return (
			<Grid container px={2}>
				<Grid item md={2} sm={4} xs={4}>
					{shipment_label?.map((ele: any) => (
						<Typography key={ele} variant='body2' sx={{ mb: 1 }}>
							{ele}
						</Typography>
					))}
				</Grid>
				<Grid item md={1} sm={2} xs={2}></Grid>
				<Grid item md={9} sm={6} xs={6}>
					<Typography variant='body2' sx={{ mb: 1 }}>
						{createdAt || '--'}
					</Typography>
					<Typography variant='body2' sx={{ mb: 1 }}>
						{company || '--'}
					</Typography>
					<Typography variant='body2' sx={{ mb: 1 }}>
						{shipment_notes || '--'}
					</Typography>
				</Grid>
			</Grid>
		);
	};

	return (
		<React.Fragment>
			{type === COLLAPSE_SECTION_TYPE.SHIPMENT_SECTION && (
				<Grid container alignItems={'center'} gap={2} px={2}>
					<Typography
						color={custom_stepper_text_color?.grey}
						sx={{
							fontWeight: 700,
						}}>
						{`${_index}.`}
					</Typography>

					<Typography
						onClick={handle_click}
						color={ref_id ? custom_stepper_text_color?.anchor_link : custom_stepper_text_color?.secondary}
						sx={{
							textDecoration: ref_id && 'underline',
							cursor: ref_id && 'pointer',
							fontWeight: 700,
						}}>
						{ref_id ? `Tracking ID #${ref_id}` : 'Tracking ID not available'}
					</Typography>
					{shipment_status && (
						<CustomStatusChip
							bgColor={custom_stepper_bg_color?.primary}
							content={
								<Grid container gap={1}>
									<Icon color={custom_stepper_text_color?.grey} iconName='IconTruckDelivery' />
									<Typography color={custom_stepper_text_color.secondary} variant='body1'>
										{_.capitalize(shipment_status)}
									</Typography>
								</Grid>
							}
						/>
					)}
				</Grid>
			)}

			{type === COLLAPSE_SECTION_TYPE.SHIPMENT_SECTION && handle_shipment_section()}
			{!_.isEmpty(line_items) && (
				<Grid mt={1} style={container_style} borderRadius='12px' px={type === COLLAPSE_SECTION_TYPE.INVOICE ? 1.1 : 2.4} py={1.4}>
					{line_items?.map((item: any, index: number) => {
						const message = _.get(item, 'message');
						const status = _.get(item, 'status');
						const style = _.get([active_icon_style, in_active_icon_style], index, in_active_icon_style);
						const image_icon = _.get([ImageLinks.active_step, ImageLinks.inactive_step], index, ImageLinks.inactive_step);

						const id = _.get(item, 'id');
						const date = _.get(item, type === COLLAPSE_SECTION_TYPE?.ACTIVITY_SECTION ? 'createdAt' : 'happenedAt');
						const formatted_date = _.attempt(() => {
							return dayjs(date).format('MM/DD/YYYY');
						});

						const invoice_data = (
							<Grid display='flex' direction='column' gap={0.6}>
								<CustomText type='Subtitle'>{item?.title}</CustomText>
								<CustomText type='Caption'>{isoToDateDay(item?.subtitle1, 'MM/DD/YYYY hh:mm A')}</CustomText>
								<CustomText type='Caption'>{item?.subtitle2}</CustomText>
							</Grid>
						);
						return (
							<Grid display='flex' key={id}>
								{index !== line_items?.length - 1 && <div className={classes.step_separator} />}
								{handle_render_step(image_icon, style, message, status, formatted_date, invoice_data)}
							</Grid>
						);
					})}
				</Grid>
			)}
		</React.Fragment>
	);
};

export default CustomStepper;
