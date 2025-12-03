import _ from 'lodash';
import React from 'react';
import { Box, Grid, Icon, Image, LinearProgressBar, Typography } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import dayjs from 'dayjs';
import uploaded_file from '../../../../assets/images/uploaded_img.svg';
import DropZone from './DropZone';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';

interface Props {
	item: any;
	is_loading?: boolean;
	all_attachments: any[];
	delete_attachment: any;
	handle_added_files: (val: any) => void;
	set_show_toast: any;
	uploaded_files: any;
	set_value?: any;
}

const OtherDetails = ({
	item,
	all_attachments,
	delete_attachment,
	handle_added_files,
	is_loading,
	set_show_toast,
	uploaded_files,
	set_value = () => {},
}: Props) => {
	const classes = useStyles();
	const theme: any = useTheme();
	const custom_attributes = _.get(item, 'custom_attributes', [])?.filter((section: any) => section?.is_display !== false);
	const { VITE_APP_API_URL } = import.meta.env;

	const handle_render_upload = () => {
		const handle_render_date = (date: any) => {
			const parsed_date = dayjs(date);
			const formatted_date = parsed_date?.format('D MMM YYYY');
			return formatted_date || '';
		};

		const handle_upload = (file: any) => {
			handle_added_files(file);
		};

		const handle_view_image = (_id: any) => {
			let url = `${VITE_APP_API_URL}artifact/v1/file/${_id}`;
			window.open(url, '_blank');
		};

		const handle_render_progress_bar = (file_data: any, attachment_item: any, attachment_index: any) => {
			if (file_data?.loading !== 100 && file_data?.loading > 0) {
				return (
					<Box mt={2}>
						<LinearProgressBar label variant='indeterminate' value={file_data?.loading} />
					</Box>
				);
			} else {
				return (
					<React.Fragment>
						<Box display='flex'>
							{file_data?.image_url ? (
								<Image
									width={50}
									onClick={() => handle_view_image(file_data?.file_id)}
									height={50}
									style={{ cursor: 'pointer', borderRadius: 8 }}
									src={file_data?.image_url}
									fallbackSrc={uploaded_file}
								/>
							) : (
								<Image
									width={50}
									height={50}
									style={{ cursor: 'pointer', borderRadius: 8 }}
									src={uploaded_file}
									fallbackSrc={uploaded_file}
								/>
							)}
							<Box ml={2} display='flex' flexDirection='column' flexWrap='wrap'>
								<Typography variant='body1' sx={{ fontSize: 14, mb: 1 }} color={theme?.quick_add_buyer?.buyer_other_details?.primary}>
									{file_data?.file_name || 'Uploaded file'}
								</Typography>
								<Typography variant='subtitle1' sx={{ fontSize: 12 }} color={theme?.quick_add_buyer?.buyer_other_details?.secondary}>
									{file_data?.date && handle_render_date(file_data?.date)}
								</Typography>
							</Box>
						</Box>

						<Box padding={1}>
							<Icon onClick={() => delete_attachment(attachment_index)} className={classes.upload_delete_icon} iconName='IconTrash' />
						</Box>
					</React.Fragment>
				);
			}
		};

		const handle_view_url = (url: string) => {
			window.open(url, '_blank');
		};

		const handle_click = (attachment_items: any) => {
			if (attachment_items?.image_url) {
				handle_view_url(attachment_items?.image_url);
			} else {
				handle_view_image(attachment_items?.file_id);
			}
		};

		return (
			<React.Fragment>
				<Grid p={2} className={classes.add_details_card_container}>
					{!_.isEmpty(uploaded_files) &&
						is_loading &&
						_.map(uploaded_files, (attachment_item, attachment_index) => {
							if (attachment_item?.status === 'archived') return;
							let file_data = _.get(attachment_item, 'raw_data');
							return (
								<Grid
									display={file_data?.loading !== 100 && file_data?.loading > 0 ? 'block' : 'flex'}
									alignItems='center'
									height='auto'
									justifyContent='space-between'
									key={attachment_index}
									className={classes?.uploaded_item}
									overflow='auto'>
									{handle_render_progress_bar(file_data, attachment_item, attachment_index)}
								</Grid>
							);
						})}
					{!_.isEmpty(all_attachments) &&
						!is_loading &&
						_.map(all_attachments, (attachment_item, attachment_index) => {
							if (attachment_item?.status === 'archived') return;
							let file_data = _.get(attachment_item, 'raw_data');
							return (
								<Grid
									display='flex'
									alignItems='center'
									height='auto'
									justifyContent='space-between'
									key={attachment_index}
									className={classes?.uploaded_item}
									overflow={'auto'}>
									<Box display='flex' onClick={() => handle_click(attachment_item?.raw_data)} sx={{ flex: 1, cursor: 'pointer' }}>
										{file_data?.image_url ? (
											<Image
												width={50}
												height={50}
												style={{ cursor: 'pointer', borderRadius: 8 }}
												src={file_data?.image_url}
												fallbackSrc={uploaded_file}
											/>
										) : (
											<Image
												width={50}
												height={50}
												style={{ cursor: 'pointer', borderRadius: 8 }}
												src={uploaded_file}
												fallbackSrc={uploaded_file}
											/>
										)}
										<Box ml={2} display='flex' flexDirection='column' flexWrap='wrap'>
											<Typography variant='body1' sx={{ fontSize: 14, mb: 1 }} color={theme?.quick_add_buyer?.buyer_other_details?.primary}>
												{file_data?.file_name || 'Uploaded file'}
											</Typography>
											<Typography variant='subtitle1' sx={{ fontSize: 12 }} color={theme?.quick_add_buyer?.buyer_other_details?.secondary}>
												{file_data?.date && handle_render_date(file_data?.date)}
											</Typography>
										</Box>
									</Box>

									{/* {permission?.is_edit && ( */}
									<Box padding={1} sx={{ width: '4rem' }}>
										<Icon onClick={() => delete_attachment(attachment_index)} className={classes.upload_delete_icon} iconName='IconTrash' />
									</Box>
									{/* )} */}
								</Grid>
							);
						})}
					{/* {permission?.is_edit &&  */}
					<DropZone handle_upload={handle_upload} set_show_toast={set_show_toast} />
					{/* } */}
				</Grid>
			</React.Fragment>
		);
	};

	const on_value_change = (e: any, attribute: any) => {
		set_value && set_value(`other_details.custom_attributes.${attribute?.id}`, e?.target?.value);
	};

	return (
		<React.Fragment>
			{item?.is_attachment_display !== false && handle_render_upload()}
			{!_.isEmpty(custom_attributes) && (
				<Grid p={2} pt={0} className={classes.add_details_card_container}>
					{_.map(custom_attributes, (attribute: any, i: number) => (
						<Grid key={`${attribute.name}-${i}`}>
							<FormBuilder
								placeholder={attribute.name}
								label={attribute.name}
								name={`${item?.key}.custom_attributes.${attribute?.id}`}
								validations={{
									required: Boolean(attribute.required),
									number: attribute.type === 'number',
									email: attribute.type === 'email',
									...attribute?.validations,
								}}
								disabled={attribute.disabled}
								defaultValue={attribute.value}
								type={attribute.type}
								options={attribute.options || []}
								on_change={(e: any) => on_value_change(e, attribute)}
								setValue={set_value && set_value}
							/>
						</Grid>
					))}
				</Grid>
			)}
		</React.Fragment>
	);
};

export default OtherDetails;
