import { Meta, StoryObj } from '@storybook/react';

import DashedAccordion from './DashedAccordion';

export default {
	title: 'Components/DashedAccordion',
	component: DashedAccordion,
} as Meta<typeof DashedAccordion>;

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
			<DashedAccordion
				content={sampleContent}
				titleBackgroundColor='#ffffff'
				titleColor='#000000'
				contentBackground='#ffffff'
				contentColor='#000000'
				{...args}
			/>
		</div>
	),
};
