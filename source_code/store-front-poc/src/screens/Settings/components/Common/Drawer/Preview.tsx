import dayjs from 'dayjs';
import _ from 'lodash';
import React from 'react';
import { Box, Grid, Icon, Image, LinearProgressBar } from 'src/common/@the-source/atoms';
import uploaded_file from 'src/assets/images/uploaded_img.svg';
import CustomText from 'src/common/@the-source/CustomText';

interface PreviewImageProps {
	data: any;
	current_value: any;
	type: string;
	set_uploaded_files: any;
	setValue: any;
	deletable?: boolean;
	file_name?: string;
	excel_file_link?: any;
}

const Preview = ({
	data,
	current_value,
	type,
	set_uploaded_files,
	setValue,
	deletable = true,
	file_name,
	excel_file_link,
}: PreviewImageProps) => {
	const current_data = _.head(data)?.image_url || _.head(excel_file_link)?.image_url;

	const handle_delete = (index: any) => {
		data?.splice(index, 1);
		const updated_data = _.cloneDeep(data);

		setValue(type, updated_data);

		set_uploaded_files((current: any) => {
			const copy = _.cloneDeep(current);
			copy[type] = '';
			return copy;
		});
	};

	const handle_render_date = (date: any) => {
		const parsed_date = dayjs(date);
		const formatted_date = parsed_date.format('D MMM YYYY');
		return formatted_date || '';
	};

	const handle_view_image = (url: any) => {
		window.open(url, '_blank');
	};

	const handle_render_progress_bar = (file_data: any, attachment_index: any) => {
		if (file_data?.loading !== 100 && file_data?.loading > 0) {
			return (
				<Box mt={2}>
					<LinearProgressBar label variant='indeterminate' value={file_data?.loading} />
				</Box>
			);
		} else {
			const image_url = current_data;
			const handle_src = () => {
				return image_url ? file_data?.image_url || image_url : uploaded_file;
			};
			return (
				<React.Fragment>
					<Box display='flex'>
						<Image
							width={50}
							height={50}
							onClick={() => (image_url ? handle_view_image(image_url) : {})}
							style={{ cursor: 'pointer', borderRadius: 8 }}
							src={handle_src()}
							fallbackSrc={uploaded_file}
						/>
						<Box ml={2} display='flex' flexDirection='column' flexWrap='wrap'>
							<CustomText style={{ mb: 1 }} color='#16885F'>
								{file_data?.file_name ?? file_name ?? 'Uploaded file'}
							</CustomText>
							<CustomText type='Caption' style={{ fontSize: 12 }} color=' #9AA0AA'>
								{file_data?.date && handle_render_date(file_data?.date)}
							</CustomText>
						</Box>
					</Box>

					{deletable && (
						<Box padding={1}>
							<Icon onClick={() => handle_delete(attachment_index)} color='#9AA0AA' className='upload-delete-icon' iconName='IconTrash' />
						</Box>
					)}
				</React.Fragment>
			);
		}
	};

	return (
		<Grid>
			{!_.isEmpty(current_value) &&
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
							{handle_render_progress_bar(file_data, attachment_index)}
						</Grid>
					);
				})}
		</Grid>
	);
};

export default Preview;
