import { Meta, StoryObj } from '@storybook/react';

import Image from './Image';

export default {
	title: 'Components/Image',
	component: Image,
} as Meta<typeof Image>;

export const Basic: StoryObj = {
	render: (args) => (
		<Image
			src='https://kgo.googleusercontent.com/profile_vrt_raw_bytes_1587515358_10512.png'
			fallbackSrc='https://kgo.googleusercontent.com/profile_vrt_raw_bytes_1587515358_10512.png'
			alt='image'
			width={20}
			imageFit='contain'
			style={{
				width: 'fit-content',
				height: 'fit-content',
				objectfit: 'contain',
			}}
			height={20}
			{...args}
		/>
	),
};
