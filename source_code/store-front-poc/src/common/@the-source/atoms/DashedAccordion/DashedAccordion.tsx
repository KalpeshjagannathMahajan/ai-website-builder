import './DashedAccordion.css';

import { Accordion as MuiAccordion, AccordionDetails, AccordionProps as MuiAccordionProps, AccordionSummary, Box } from '@mui/material';

import Icon from '../Icon/Icon';

type AccordionContent = {
	title?: string | React.ReactNode;
	subTitle?: string | React.ReactNode;
	expandedContent?: string | React.ReactNode;
};

type AccordionBaseprops = Pick<MuiAccordionProps, 'expanded'>;

export interface AccordionProps extends AccordionBaseprops {
	content: Array<AccordionContent>;
	titleBackgroundColor?: string;
	titleColor?: string;
	contentBackground?: string;
	contentColor?: string;
}

const DashedAccordion = ({ content, titleBackgroundColor, titleColor, contentBackground, contentColor }: AccordionProps): JSX.Element => (
	<div className='dashed-accordion' style={{ width: '100%' }}>
		{content &&
			content?.length > 0 &&
			content?.map((item) => (
				<MuiAccordion
					className='dashed-accordion-box-shadow'
					sx={{
						background: titleBackgroundColor,
						boxShadow: 'none',
					}}>
					<AccordionSummary
						className='dashed-accordion-dashed-border'
						sx={{ color: titleColor }}
						expandIcon={<Icon iconName='IconChevronDown' />}>
						<Box
							sx={{
								width: item?.subTitle ? '33%' : '100%',
							}}>
							{item?.title}
						</Box>
						{item?.subTitle}
					</AccordionSummary>
					<AccordionDetails className='dashed-accordion-dashed-border' sx={{ background: contentBackground, color: contentColor }}>
						{item?.expandedContent}
					</AccordionDetails>
				</MuiAccordion>
			))}
	</div>
);

DashedAccordion.defaultProps = {
	titleBackgroundColor: '#ffffff',
	titleColor: '#000000',
	contentBackground: '#ffffff',
	contentColor: '#000000',
};

export default DashedAccordion;
