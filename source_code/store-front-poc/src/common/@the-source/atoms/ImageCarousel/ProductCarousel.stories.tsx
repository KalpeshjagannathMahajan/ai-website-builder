import { Meta, StoryObj } from '@storybook/react';

import ImageCarousel from './ImageCarousel';

export default {
	title: 'Components/Carousel',
	component: ImageCarousel,
} as Meta<typeof ImageCarousel>;

const sampleImages = [
	{
		id: '1',
		src: 'https://sourcerer.tech/assets/a046d61c-0622-4d4d-a0bb-9cd8e567cffa',
		fallback: 'https://res.cloudinary.com/sourcewiz/image/upload/b_white,c_pad,h_500,w_500/1ed8acc5-898f-4bfc-b8f4-131f5c53e17c',
	},
	{
		id: '2',
		src: 'https://sourcerer.tech/assets/e7d9beaa-d4ab-46cb-b653-594101008146',
		fallback: 'https://sourcerer.tech/assets/a046d61c-0622-4d4d-a0bb-9cd8e567cffa',
	},
	{
		id: '3',
		src: 'https://sourcerer.tech/assets/a046d61c-0622-4d4d-a0bb-9cd8e567cffa',
		fallback: 'https://sourcerer.tech/assets/a046d61c-0622-4d4d-a0bb-9cd8e567cffa',
	},
	{
		id: '4',
		src: 'https://sourcerer.tech/assets/a046d61c-0622-4d4d-a0bb-9cd8e567cffa',
		fallback: 'https://sourcerer.tech/assets/a046d61c-0622-4d4d-a0bb-9cd8e567cffa',
	},
	{
		id: '5',
		src: 'https://sourcerer.tech/assets/e7d9beaa-d4ab-46cb-b653-594101008146',
	},
	{
		id: '6',
		src: 'https://sourcerer.tech/assets/a046d61c-0622-4d4d-a0bb-9cd8e567cffa',
	},
	{
		id: '7',
		src: 'https://sourcerer.tech/assets/a046d61c-0622-4d4d-a0bb-9cd8e567cffa',
	},
	{
		id: '8',
		src: 'https://sourcerer.tech/assets/e7d9beaa-d4ab-46cb-b653-594101008146',
	},
	{
		id: '9',
		src: 'https://sourcerer.tech/assets/a046d61c-0622-4d4d-a0bb-9cd8e567cffa',
	},
	{
		id: '10',
		src: 'https://res.cloudinary.com/sourcewiz/image/upload/b_white,c_pad,h_500,w_500/1ed8acc5-898f-4bfc-b8f4-131f5c53e17c',
	},
];

export const variant: StoryObj = {
	render: (args) => (
		<div style={{ width: '50%' }}>
			<ImageCarousel images={sampleImages} width='100%' {...args} />
		</div>
	),
};
