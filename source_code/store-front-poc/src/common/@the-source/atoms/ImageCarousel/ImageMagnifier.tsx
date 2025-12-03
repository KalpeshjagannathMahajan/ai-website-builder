/* eslint-disable @typescript-eslint/no-shadow */
import { Box, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import Image from '../Image/Image';
import { transform_image_url } from 'src/utils/ImageConstants';
import { useTheme } from '@mui/material/styles';

interface ImageMagnifierProps {
	src?: string | undefined;
	ImageWidth?: number | string;
	ImageHeight?: number | string;
	magnifierHeight?: number;
	magnifierWidth?: number;
	zoomLevel?: number;
	fallback?: string;
	style?: any;
	onClick?: any;
}

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

function ImageMagnifier({
	src = '',
	ImageWidth,
	ImageHeight,
	onClick,
	magnifierHeight = 100,
	magnifierWidth = 100,
	zoomLevel = 1.5,
	fallback,
	style,
}: ImageMagnifierProps) {
	const [[x, y], setXY] = useState([0, 0]);
	const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
	const [showMagnifier, setShowMagnifier] = useState(false);
	const image_src = transform_image_url(src, 'PDP');
	const magnified_image_src = transform_image_url(src, 'PDP_ZOOM');
	const styles = is_ultron ? {} : { height: '55rem' };
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const wizshop_image_preview: any = JSON.parse(localStorage.getItem('wizshop_settings') || '{}')?.image_preview;
	return (
		<Box
			display='flex'
			justifyContent='center'
			alignItems='center'
			margin='auto'
			sx={style}
			height={ImageHeight}
			width={ImageWidth}
			onClick={onClick}
			onMouseEnter={(e) => {
				if (wizshop_image_preview) return;
				// update image size and turn-on magnifier
				const elem = e.currentTarget;
				const { width, height } = elem.getBoundingClientRect();
				setSize([width, height]);
				setShowMagnifier(true);
			}}
			onMouseMove={(e) => {
				if (wizshop_image_preview) return;
				// update cursor position
				const elem = e.currentTarget;
				const { top, left } = elem.getBoundingClientRect();
				// calculate cursor position on the image
				// eslint-disable-next-line @typescript-eslint/no-shadow
				const x = e.pageX - left - window.pageXOffset;
				const y = e.pageY - top - window.pageYOffset;
				setXY([x, y]);
			}}
			onMouseLeave={() => {
				if (wizshop_image_preview) return;
				// close magnifier
				setShowMagnifier(false);
			}}>
			<Image
				style={{
					borderRadius: '8px',
					minHeight: '55rem',
					maxHeight: '100%',
					objectFit: 'contain',
					...styles,
					...theme?.product_details?.product_image_container?.carosuel?.images,
				}}
				src={image_src}
				imgClass='product-image'
				fallbackSrc={fallback}
				width={ImageWidth}
				alt='img'
			/>
			{!is_small_screen && showMagnifier && (
				<Box
					style={{
						display: showMagnifier ? 'block' : 'none',
						position: 'absolute',
						// prevent magnifier blocks the mousemove event of img
						pointerEvents: 'none',
						// set size of magnifier
						height: `${magnifierHeight}px`,
						width: `${magnifierWidth}px`,
						// move element center to cursor pos
						top: `${y - magnifierHeight / 2}px`,
						left: `${x - magnifierWidth / 2}px`,
						opacity: '1', // reduce opacity so you can verify position
						backgroundImage: `url('${magnified_image_src || fallback}')`,
						backgroundRepeat: 'no-repeat',
						// calculate zoomed image size
						backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
						// calculate position of zoomed image.
						backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
						backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
					}}
				/>
			)}
		</Box>
	);
}

ImageMagnifier.defaultProps = {
	src: '',
	fallback: '',
	ImageWidth: '100%',
	ImageHeight: '100%',
	magnifierHeight: 40,
	magnifierWidth: 40,
	zoomLevel: 1.5,
};

export default ImageMagnifier;
