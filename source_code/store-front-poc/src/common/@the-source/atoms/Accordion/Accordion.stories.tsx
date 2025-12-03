import { Meta, StoryObj } from '@storybook/react';

import Accordion from './Accordion';

export default {
	title: 'Components/Accordion',
	component: Accordion,
} as Meta<typeof Accordion>;

const sampleContent = [
	{
		title: <div>Lorem Ipsum</div>,
		subTitle: <div>Lorem Ipsum</div>,
		expandedContent: <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>,
	},
	{
		title: <div>Lorem Ipsum</div>,
		subTitle: <div>Lorem Ipsum</div>,
		expandedContent: <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>,
	},
	{
		title: 'Lorem Ipsum',
		expandedContent: <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>,
	},
];

export const AccordionList: StoryObj = {
	render: (args) => (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-around',
				width: '100%',
			}}>
			<Accordion
				content={sampleContent}
				titleBackgroundColor='#ffffff'
				titleColor='#000000'
				contentBackground='#e6e6e6'
				contentColor='#000000'
				{...args}
			/>
		</div>
	),
};
