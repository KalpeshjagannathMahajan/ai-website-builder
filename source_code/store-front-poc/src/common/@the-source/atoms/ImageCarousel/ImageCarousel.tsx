import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './ImageCarousel.css';
import { Grid, useMediaQuery } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import Icon from '../Icon';
import Image from '../Image/Image';
import ImageMagnifier from './ImageMagnifier';
import constants from 'src/utils/constants';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { transform_image_url } from 'src/utils/ImageConstants';
import { makeStyles } from '@mui/styles';
import ImageLightbox from '../LightBox/LightBox';

const useStyles = makeStyles(() => ({
	icon_styles: {
		position: 'absolute',
		top: '8px',
		right: '8px',
		display: 'flex',
		flexDirection: 'column',
		gap: '8px',
		zIndex: 1,
	},
}));

export interface ImageProps {
	id?: string;
	src?: string | undefined;
	fallback?: string;
}

export interface CarouselProps {
	images?: any[];
	width?: string | number;
	style?: any;
	imageHeight?: string | number;
	imageWidth?: string | number;
	magnifierBoxDimension?: number;
}

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const customRenderThumb = (children: any) =>
	children.map((item: any) => {
		const imageId = item.props.id;
		const imageSrc = item.props.src;
		const fall_back_image_src = item?.props?.children?.[0]?.props?.src;
		const fallbackImageId = item.props.fallback;

		return (
			<Grid>
				<Image
					key={imageId}
					src={transform_image_url(imageSrc || fall_back_image_src, 'PDP_THUMBNAIL')}
					fallbackSrc={fallbackImageId}
					alt={fallbackImageId}
					id={is_ultron ? 'ultron' : 'store_front_img'}
					imgClass='border_radius thumbs_border object_fit'
					width='60px'
					height='60px'
				/>
			</Grid>
		);
	});

const ImageCarousel = ({ images, width, magnifierBoxDimension, imageWidth, style }: CarouselProps) => {
	const theme: any = useTheme();
	const classes = useStyles();
	const [isOpen, setIsOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const wizshop_image_preview: any = JSON.parse(localStorage.getItem('wizshop_settings') || '{}')?.image_preview;
	return (
		<>
			<Carousel
				showIndicators={is_small_screen}
				showStatus={!is_small_screen}
				centerMode
				centerSlidePercentage={100}
				onClickItem={(index: any) => {
					setSelectedImageIndex(index);
					setIsOpen(true);
				}}
				renderArrowPrev={({ onClickHandler, hasPrev }: any) =>
					hasPrev && (
						<Grid
							container
							justifyContent='center'
							alignItems='center'
							onClick={onClickHandler}
							className='arrow'
							style={{ left: 15, ...theme?.product_details?.product_image_container?.carosuel?.arrow }}>
							<Icon
								iconName='IconChevronLeft'
								sx={{
									color: theme?.product_details?.product_image_container?.carosuel?.arrow?.color,
								}}
							/>
						</Grid>
					)
				}
				renderArrowNext={({ onClickHandler, hasNext }: any) =>
					hasNext && (
						<Grid
							container
							justifyContent='center'
							alignItems='center'
							onClick={onClickHandler}
							className='arrow'
							style={{ right: 15, ...theme?.product_details?.product_image_container?.carosuel?.arrow }}>
							<Icon
								iconName='IconChevronRight'
								sx={{
									color: theme?.product_details?.product_image_container?.carosuel?.arrow?.color,
								}}
							/>
						</Grid>
					)
				}
				showThumbs={!is_small_screen}
				renderThumbs={customRenderThumb}
				width={width}
				className='custom-carousel'>
				{images?.map((image: any, index: number) => (
					<Grid key={image?.id} style={{ position: 'relative', cursor: wizshop_image_preview ? 'pointer' : 'default' }}>
						<ImageMagnifier
							src={image?.src}
							onClick={() => {
								setSelectedImageIndex(index);
								setIsOpen(true);
							}}
							style={style}
							fallback={image?.fallback || constants.FALLBACK_IMAGE}
							ImageWidth={imageWidth}
							ImageHeight={is_small_screen ? '330px' : '550px'}
							magnifierWidth={magnifierBoxDimension}
							magnifierHeight={magnifierBoxDimension}
							zoomLevel={4}
						/>
						{wizshop_image_preview && (
							<div className={classes.icon_styles}>
								<Icon
									iconName='IconArrowsDiagonal'
									onClick={() => {
										if (wizshop_image_preview) {
											setSelectedImageIndex(index);
											setIsOpen(true);
										}
									}}
									sx={{ color: theme?.product_details?.product_image_container?.carosuel?.arrow?.color }}
								/>
							</div>
						)}
					</Grid>
				))}
			</Carousel>
			{wizshop_image_preview && (
				<ImageLightbox
					open={isOpen}
					onClose={() => setIsOpen(false)}
					images={images}
					selectedIndex={selectedImageIndex}
					overrideWidth={is_small_screen ? 250 : 900}
					overrideHeight={700}
				/>
			)}
		</>
	);
};

ImageCarousel.defaultProps = {
	images: [
		{
			id: '1',
			src: '',
			fallback: '',
		},
	],
	width: '75%',
	magnifierBoxDimension: 400,
	imageHeight: '100%',
	imageWidth: '100%',
};

export default ImageCarousel;
