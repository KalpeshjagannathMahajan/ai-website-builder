import dayjs from 'dayjs';
import _ from 'lodash';
import React from 'react';
import { Box, Grid, Icon, Image, LinearProgressBar, Typography } from 'src/common/@the-source/atoms';
import uploaded_file from 'src/assets/images/uploaded_img.svg';

interface PreviewImageProps {
	data: any;
	current_value: any;
	set_data: any;
	type: string;
	set_uploaded_files: any;
	url_needed?: boolean;
}

const PreviewImage = ({ data, current_value, set_data, type, set_uploaded_files, url_needed = true }: PreviewImageProps) => {
	const { VITE_APP_API_URL } = import.meta.env;
	const current_data = current_value?.[type] ?? data?.[type];

	const handle_delete = () => {
		set_data((current: any) => {
			const copy = _.cloneDeep(current);
			delete copy[type];
			return copy;
		});
		set_uploaded_files((current: any) => {
			const copy = _.cloneDeep(current);
			delete copy[type];
			return copy;
		});
	};

	const handle_render_date = (date: any) => {
		const parsed_date = dayjs(date);
		const formatted_date = parsed_date.format('D MMM YYYY');
		return formatted_date || '';
	};

	const handle_view_image = (_id: any) => {
		let url = url_needed ? `${VITE_APP_API_URL}/artifact/v1/file/${_id}` : _id;
		window.open(url, '_blank');
	};

	const handle_render_progress_bar = (file_data: any) => {
		if (file_data?.loading !== 100 && file_data?.loading > 0) {
			return (
				<Box mt={2}>
					<LinearProgressBar label variant='indeterminate' value={file_data?.loading} />
				</Box>
			);
		} else {
			const image = typeof current_data === 'string' ? current_data : current_data?.[0]?.raw_data?.file_id || {};
			return (
				<React.Fragment>
					<Box display='flex'>
						{image ? (
							<Image
								width={50}
								onClick={() => handle_view_image(image)}
								height={50}
								style={{ cursor: 'pointer', borderRadius: 8 }}
								src={file_data?.image_url || image}
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
							<Typography variant='body1' sx={{ fontSize: 14, mb: 1 }} color='#16885F'>
								{file_data?.file_name || 'Uploaded file'}
							</Typography>
							<Typography variant='subtitle1' sx={{ fontSize: 12 }} color=' #9AA0AA'>
								{file_data?.date && handle_render_date(file_data?.date)}
							</Typography>
						</Box>
					</Box>

					<Box padding={1}>
						<Icon onClick={handle_delete} color='#9AA0AA' className='upload-delete-icon' iconName='IconTrash' />
					</Box>
				</React.Fragment>
			);
		}
	};

	return (
		<Grid>
			{!_.isEmpty(current_value) ? (
				_.map(current_value, (attachment_item, attachment_index) => {
					if (attachment_item?.status === 'archived') return;
					let file_data = _.get(attachment_item, 'raw_data');
					return (
						<Grid
							display={file_data?.loading !== 100 && file_data?.loading > 0 ? 'block' : 'flex'}
							alignItems='center'
							height='auto'
							justifyContent='space-between'
							key={attachment_index}
							className='uploaded-item'
							overflow='auto'>
							{handle_render_progress_bar(file_data)}
						</Grid>
					);
				})
			) : (
				<Grid display='flex' alignItems='center' height='auto' justifyContent='space-between' className='uploaded-item' overflow='auto'>
					<Box display='flex'>
						<Image
							width={50}
							onClick={() => window.open(data?.[type], '_blank')}
							height={50}
							style={{ cursor: 'pointer', borderRadius: 8 }}
							src={data?.[type]}
							fallbackSrc={uploaded_file}
						/>
						<Box ml={2} display='flex' flexDirection='column' flexWrap='wrap'>
							<Typography variant='body1' sx={{ fontSize: 14, mb: 1 }} color='#16885F'>
								{'Uploaded file'}
							</Typography>
						</Box>
					</Box>
					<Box padding={1}>
						<Icon onClick={handle_delete} color='#9AA0AA' className='upload-delete-icon' iconName='IconTrash' />
					</Box>
				</Grid>
			)}
		</Grid>
	);
};

export default PreviewImage;
