import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { Box, Icon } from 'src/common/@the-source/atoms';
import Lottie from 'react-lottie';

import LoaderLottie from '../../../assets/animations/LoaderGreen.json';
import CustomText from 'src/common/@the-source/CustomText';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles((theme: any) => ({
	container: {
		width: '28vw',
		position: 'fixed',
		bottom: 0,
		right: 10,
		backgroundColor: theme?.user_drive?.upload_modal?.background,
		borderTopLeftRadius: '24px',
		borderTopRightRadius: '24px',
		boxShadow: theme?.user_drive?.upload_modal?.box_shadow,
		zIndex: '101',
	},
	header_container: {
		padding: '20px',
		backgroundColor: theme?.user_drive?.upload_modal?.header_background,
		borderTopLeftRadius: '24px',
		borderTopRightRadius: '24px',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	bottom_container: {
		maxHeight: '50vh',
		overflowY: 'scroll',
	},
	file_styles: {
		display: 'flex',
		flexDirection: 'row',
		padding: '20px',
	},
	loader: {
		marginLeft: 'auto',
		width: 20,
		height: 20,
		position: 'relative',
		bottom: 15,
		right: 10,
	},
}));

export const UploadModal = ({
	show_upload_modal = false,
	set_show_upload_modal = (val: boolean) => {
		val;
	},
	set_open_cancel_upload_modal = (val: boolean) => {
		val;
	},
	upload_data = [],
}) => {
	const [value, set_value] = useState(0);
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		set_value(newValue);
	};
	const classes = useStyles();
	const theme: any = useTheme();

	return (
		<Box className={classes.container}>
			<Box className={classes.header_container}>
				<CustomText type='H6' color={theme?.user_drive?.upload_modal?.primary}>
					Upload
				</CustomText>
				<Icon
					iconName='IconChevronDown'
					color={theme?.user_drive?.upload_modal?.primary}
					sx={{ margin: '0 20px 0 auto', transform: show_upload_modal ? '' : 'rotate(180deg)' }}
					onClick={() => set_show_upload_modal(!show_upload_modal)}
				/>
				<Icon iconName='IconX' color={theme?.user_drive?.upload_modal?.primary} onClick={() => set_open_cancel_upload_modal(true)} />
			</Box>
			<Box display={show_upload_modal ? 'flex' : 'none'} flexDirection={'column'}>
				<Tabs value={value} onChange={handleChange} textColor='secondary' indicatorColor='primary'>
					<Tab value={0} label='All' />
					<Tab value={1} label={`Uploaded (${upload_data.filter((data: any) => data.uploadStatus === 'uploaded').length})`} />
					<Tab value={2} label={`Failed (${upload_data.filter((data: any) => data.uploadStatus === 'failed').length})`} />
				</Tabs>
				<Box className={classes.bottom_container}>
					{upload_data.map((data: any, indx: number) => {
						if (value === 0 || (value === 1 && data?.uploadStatus === 'uploaded') || (value === 2 && data?.uploadStatus === 'failed'))
							return (
								<Box className={classes.file_styles} key={`item-${indx}`}>
									<Icon
										iconName='IconPhoto'
										sx={{ marginRight: 1 }}
										color={
											data?.uploadStatus === 'failed' ? theme?.user_drive?.upload_modal?.failed : theme?.user_drive?.upload_modal?.secondary
										}
									/>
									<CustomText
										type='Body'
										color={
											data?.uploadStatus === 'failed' ? theme?.user_drive?.upload_modal?.failed : theme?.user_drive?.upload_modal?.secondary
										}>
										{data?.filename?.substring(0, 25)}
										{data?.filename?.length > 25 ? '...' : ''} ({data?.uploadPercentage}%)
									</CustomText>
									{data?.uploadStatus !== 'uploading' ? (
										<Icon
											iconName={data?.uploadStatus === 'uploaded' ? 'IconCircleCheck' : 'IconAlertTriangle'}
											color={
												data?.uploadStatus === 'uploaded'
													? theme?.user_drive?.upload_modal?.tertiary
													: theme?.user_drive?.upload_modal?.failed
											}
											sx={{ marginLeft: 'auto' }}
										/>
									) : (
										<Box className={classes.loader}>
											<Lottie
												options={{
													loop: true,
													autoplay: true,
													animationData: LoaderLottie,
													rendererSettings: {
														preserveAspectRatio: 'xMidYMid slice',
													},
												}}
												width={40}
												height={40}
											/>
										</Box>
									)}
								</Box>
							);
					})}
				</Box>
			</Box>
		</Box>
	);
};
