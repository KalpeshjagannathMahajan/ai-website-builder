import _ from 'lodash';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Grid, Icon } from 'src/common/@the-source/atoms';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import CustomText from 'src/common/@the-source/CustomText';

interface Props {
	handle_upload: (file: any) => void;
	set_show_toast?: any;
	title?: string;
	sub_title?: string;
	new_customer?: boolean;
	error?: any;
	custom_component?: React.ReactNode;
	accepted_files?: any;
	size?: number;
	set_size_error?: (value: string) => void;
}

function DropZone({
	handle_upload,
	set_show_toast,
	sub_title = 'Ex: Business Cards, Brochures etc',
	title = 'Add attachments',
	custom_component,
	accepted_files = '',
	size = 1000,
	set_size_error,
	new_customer = false,
	error,
}: Props) {
	const classes = useStyles();
	const theme: any = useTheme();

	const onDrop = useCallback(
		(acceptedFiles: any, rejectedFiles: any) => {
			if (set_size_error && _.some(acceptedFiles, (file: any) => file?.size > size * 1000)) {
				set_size_error(`Max file size - ${size / 1000}MB`);
				return;
			}
			handle_upload(acceptedFiles);

			if (!_.isEmpty(rejectedFiles)) {
				const file_name = _.get(rejectedFiles, '[0].file.name');
				const error_message = _.get(rejectedFiles, '[0].errors[0].message');
				set_show_toast({ state: true, title: `${file_name} Upload failed`, sub_title: error_message });
			}
		},
		[set_size_error],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div {...getRootProps()} style={{ display: 'flex', flex: 1, position: 'relative', flexDirection: 'column' }}>
			<input {...getInputProps()} accept={accepted_files} />
			{isDragActive ? (
				<p>Drop the files here ...</p>
			) : (
				<>
					{custom_component ? (
						custom_component
					) : (
						<Grid
							style={{ border: theme?.quick_add_buyer?.drop_zone?.border, ...theme?.form_elements_ }}
							container
							alignItems={'center'}
							justifyContent={'space-between'}
							className={classes?.uploaded_item}
							flexWrap={'nowrap'}
							sx={{
								cursor: 'pointer',
								position: 'relative',
							}}
							p={2}>
							<Grid>
								<span
									style={{
										fontSize: 14,
										color: new_customer ? theme?.quick_add_buyer?.drop_zone?.new_customer_text : theme?.quick_add_buyer?.drop_zone?.text,
										fontFamily: theme?.quick_add_buyer?.drop_zone?.fontFamily,
									}}>
									{title}
								</span>
								<br></br>
								<span
									style={{
										fontSize: 14,
										color: new_customer ? theme?.quick_add_buyer?.new_customer_upload_text : theme?.quick_add_buyer?.upload_text,
										fontFamily: theme?.quick_add_buyer?.drop_zone?.fontFamily,
									}}>
									{sub_title}
								</span>
							</Grid>
							<Grid textAlign={'right'}>
								<Icon
									color={theme?.quick_add_buyer?.drop_zone?.icon}
									className={classes.upload_file_icon}
									iconName={new_customer ? 'IconCirclePlus' : 'IconPhotoPlus'}
									sx={{ ...theme?.quick_add_buyer?.attachment_logo_style }}
								/>
							</Grid>
						</Grid>
					)}
				</>
			)}
			{!_.isEmpty(error) && (
				<CustomText type='Caption' style={{ padding: '1rem' }} color={theme?.palette?.colors?.red}>
					{error?.message}
				</CustomText>
			)}
		</div>
	);
}

export default DropZone;
