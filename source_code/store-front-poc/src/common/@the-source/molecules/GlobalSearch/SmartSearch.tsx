/* eslint-disable */
import { Grid, Icon, Image, Button } from '../../atoms';
import CustomText from '../../CustomText';
import ImageLinks from 'src/assets/images/ImageLinks';
import DropZone from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/DropZone';
import { useState } from 'react';
import axios from 'src/utils/axios';
import constants from 'src/utils/constants';
import { InputAdornment, TextField } from '@mui/material';
import Animations from 'src/assets/animations/Animations';
import Lottie from 'react-lottie';

const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: Animations?.smart_search_loading,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const SmartSearch = ({ set_show_smart_search, handleSearchClick }: any) => {
	const { VITE_APP_DIRECTUS_API_URL } = import.meta.env;
	const [upload_loader, set_upload_loader] = useState(false);
	const [search_loader, set_search_loader] = useState(false);
	const [type, set_type] = useState<string>('AI-text');
	const [value, set_value] = useState<string>('');
	const [error, set_error] = useState<string>('');

	const handle_search = async () => {
		set_search_loader(true);
		handleSearchClick({ label: value, type_label: 'AI search', type: type, short_label: 'AI search' }, set_search_loader, set_error);
	};

	const handle_upload = async (files: any) => {
		if (!files) {
			return;
		}

		try {
			for (const file of files) {
				if (!file) {
					continue;
				}
				set_upload_loader(true);
				const form_data: any = new FormData();
				form_data.append('image', file);

				const config = {
					headers: { 'content-type': 'multipart/form-data' },
				};
				const response: any = await axios.post(constants.SMART_SEARCH_UPLOAD_IMAGE, form_data, config);

				if (response?.status === 200) {
					set_type('AI-image');
					const image_url = `${VITE_APP_DIRECTUS_API_URL}/assets/${response?.data?.data?.id}`;
					set_value(image_url);
					handleSearchClick(
						{ label: image_url, type_label: 'AI search', type: 'AI-image', short_label: 'AI search' },
						set_upload_loader,
						set_error,
					);
				} else {
					set_error('Error, please try again');
					set_upload_loader(false);
				}
			}
		} catch (error) {
			console.error(error);
			set_error('Error, please try again');
			set_upload_loader(false);
		}
	};

	return (
		<>
			{!upload_loader ? (
				<Grid
					position={'absolute'}
					top={'-3px'}
					left={0}
					width={'100%'}
					minWidth={358}
					zIndex={1000}
					height={290}
					p={2}
					borderRadius={1.5}
					display='flex'
					direction='column'
					gap={1.5}
					bgcolor={'white'}
					boxShadow={'0 0 24px 0 rgba(0, 0, 0, 0.25)'}>
					<Grid display='flex' justifyContent='space-between' alignItems='center'>
						<CustomText type='Subtitle'>AI Search</CustomText>
						<Icon iconName='IconX' onClick={() => set_show_smart_search(false)} />
					</Grid>
					<Grid flex={1} p={2} borderRadius={1.5} display='flex' direction='column' gap={1.5} bgcolor={'rgba(229, 237, 207, 1)'}>
						<DropZone
							accepted_files='.jpeg, .png, .jpg'
							handle_upload={handle_upload}
							size={10000}
							set_size_error={set_error}
							custom_component={
								<Grid
									sx={{ cursor: 'pointer' }}
									display='flex'
									flex={1}
									borderRadius={1.5}
									direction='column'
									alignItems='center'
									bgcolor={'white'}>
									{error && (
										<Grid
											bgcolor={'rgba(247, 219, 207, 1)'}
											height={'18px'}
											width={'100%'}
											textAlign={'center'}
											pt={'2px'}
											borderRadius={'12px 12px 0 0'}>
											<CustomText type='Micro'>{error}</CustomText>
										</Grid>
									)}
									<Grid
										mt='auto'
										mb={1}
										display='flex'
										gap={0.5}
										p={0.5}
										bgcolor='rgba(247, 248, 250, 1)'
										borderRadius={1}
										alignItems='center'>
										<Image src={ImageLinks.PhotoScanImage} />
										<CustomText color='rgba(0, 0, 0, 0.6)' type='Caption'>
											Visual search
										</CustomText>
									</Grid>
									<Grid mb='auto' display='flex' gap={0.5}>
										<CustomText>Drag or upload an image</CustomText>
									</Grid>
								</Grid>
							}
						/>

						<Grid display='flex' justifyContent='center' alignItems='center' gap={3}>
							<div style={{ borderTop: '1px dashed #0000001F', height: 0, width: '100px' }}></div>
							<CustomText>OR</CustomText>
							<div style={{ borderTop: '1px dashed #0000001F', height: 0, width: '100px' }}></div>
						</Grid>
						<Grid display='flex' justifyContent='center' alignItems='stretch' gap={1}>
							<TextField
								placeholder='Search with AI'
								fullWidth
								value={type === 'AI-text' ? value : ''}
								onChange={(e) => {
									set_value(e.target.value);
									set_type('AI-text');
								}}
								variant='outlined'
								sx={{
									background: 'white',
									borderRadius: '57px',
									'& .MuiOutlinedInput-root': {
										borderRadius: '57px',
										height: '40px',
										border: '1px solid rgba(203, 219, 159, 1)',
									},
									'& .MuiOutlinedInput-notchedOutline': {
										border: 'none',
									},
									'& .MuiOutlinedInput-input': {
										padding: '8px 16px 8px 0px',
									},
								}}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<Image src={ImageLinks.SmartSearchIcon} />
										</InputAdornment>
									),
								}}
							/>
							<Button
								loading={search_loader}
								disabled={type === 'AI-image' || !value}
								sx={{ background: 'rgba(125, 165, 14, 1)', borderRadius: '57px', minWidth: 'fit-content' }}
								onClick={handle_search}>
								Search
							</Button>
						</Grid>
					</Grid>
				</Grid>
			) : (
				<Grid
					position={'absolute'}
					top={'-3px'}
					left={0}
					width={'100%'}
					minWidth={358}
					zIndex={1000}
					height={290}
					borderRadius={1.5}
					bgcolor={'rgba(229, 237, 207, 1)'}
					display='flex'
					direction='column'
					justifyContent='center'
					alignItems='center'
					boxShadow={'0 0 24px 0 rgba(0, 0, 0, 0.25)'}>
					<Lottie options={defaultOptions} height={100} width={100} />
					<CustomText color='rgba(0, 0, 0, 0.6)'>Loading, Please wait</CustomText>
				</Grid>
			)}
		</>
	);
};

export default SmartSearch;
