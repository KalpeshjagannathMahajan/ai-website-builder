import constants from 'src/utils/constants';
import { useTheme } from '@mui/material/styles';

type ImageProps = {
	src: string;
	alt?: string;
	width?: any;
	height?: any;
	style?: object;
	imageFit?: string;
	imgClass?: any;
	loadingType?: any;
	fallbackSrc?: string;
	onClick?: any;
	id?: any;
};

const Image = ({ src, alt, style, imageFit, width, height, imgClass, loadingType, onClick, fallbackSrc, id, ...rest }: ImageProps) => {
	const theme: any = useTheme();
	const handleFallback = (e: React.SyntheticEvent<HTMLImageElement>) => {
		if (fallbackSrc) {
			e.currentTarget.src = fallbackSrc;
			e.currentTarget.style.objectFit = 'cover';
		}
	};

	return (
		<img
			src={src}
			alt={alt}
			id={id}
			onClick={onClick}
			style={{ objectFit: 'contain', ...style, ...theme?.image_ }}
			className={imgClass}
			loading={loadingType}
			width={width}
			onError={handleFallback}
			height={height}
			{...rest}
		/>
	);
};

Image.defaultProps = {
	src: '',
	alt: '',
	width: 20,
	height: 20,
	style: {},
	imageFit: 'contain',
	imgClass: '',
	loadingType: 'lazy',
	fallbackSrc: constants.FALLBACK_IMAGE,
};

export default Image;
