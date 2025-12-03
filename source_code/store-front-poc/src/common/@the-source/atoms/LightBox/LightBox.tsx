import React from 'react';
import { Lightbox } from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Zoom, Fullscreen, Download, Thumbnails } from 'yet-another-react-lightbox/plugins';
import { saveAs } from 'file-saver';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

interface ImageLightboxProps {
	open: boolean;
	onClose: () => void;
	images:
		| Array<{
				src: string;
				name?: string;
				download?: { url: string; filename: string };
				width?: number;
				height?: number;
		  }>
		| undefined;
	selectedIndex: number;
	overrideWidth?: number;
	overrideHeight?: number;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ open, onClose, images, selectedIndex, overrideWidth, overrideHeight }) => {
	return (
		<Lightbox
			open={open}
			close={onClose}
			slides={
				images?.map((img: any) => ({
					src: img?.src || '',
					width: overrideWidth ?? img?.width,
					height: overrideHeight ?? img?.height,
					download: {
						url: img?.src ? `${img.src}?download` : '',
						filename: img?.download?.filename || img?.image_name,
					},
				})) || []
			}
			index={selectedIndex}
			plugins={[Zoom, Fullscreen, Download, Thumbnails]}
			carousel={{
				finite: true,
				preload: 5,
			}}
			// download={{
			// 	download: ({ slide }: any) => {
			// 		if (!slide?.download?.url) return;
			// 		const link = document.createElement('a');
			// 		link.href = slide?.download?.url;
			// 		debugger;
			// 		link.download = slide?.download?.filename || 'downloaded_image.jpg';
			// 		document.body.appendChild(link);
			// 		link.click();
			// 		document.body.removeChild(link);
			// 	},
			// }}
			download={{
				download: async ({ slide }: any) => {
					//TODO: need to find other to handle this
					if (!slide?.download?.url) return;
					const imageUrl = `https://dry-morning-ca84.satwikkanhere2003.workers.dev/?url=${encodeURIComponent(slide.download.url)}`;
					const imageName = slide?.download?.filename;
					saveAs(imageUrl, imageName);
				},
			}}
			zoom={{
				maxZoomPixelRatio: 8,
				scrollToZoom: true,
				zoomInMultiplier: 1.2,
				doubleTapDelay: 300,
				doubleClickZoomOut: true,
				panLimit: true,
				wheelZoomDistanceFactor: 100,
			}}
		/>
	);
};

export default ImageLightbox;
