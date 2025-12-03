import { Accordion as MuiAccordion, AccordionDetails, AccordionProps as MuiAccordionProps, AccordionSummary, Box } from '@mui/material';
import _ from 'lodash';
import Icon from '../Icon/Icon';
import { useTheme } from '@mui/material/styles';
import { accordion_colors, background_colors } from 'src/utils/light.theme';

type AccordionContent = {
	title?: string | React.ReactNode;
	subTitle?: string | React.ReactNode;
	expandedContent?: string | React.ReactNode;
};

type AccordionBaseprops = Pick<MuiAccordionProps, 'expanded'>;

export interface AccordionProps extends AccordionBaseprops {
	content?: Array<AccordionContent>;
	titleBackgroundColor?: string;
	titleColor?: string;
	contentBackground?: string;
	contentColor?: string;
	className?: string;
	accordionDetailsClassName?: string;
	titleStyle?: any;
	style?: any;
	disabled?: boolean;
	styleSub?: any;
	expanded?: string[];
	on_change?: any;
	containerStyle?: any;
	id: string;
	expandIconColor?: string;
}

const Accordion = ({
	content,
	titleBackgroundColor,
	titleColor,
	contentBackground,
	contentColor,
	className,
	style,
	accordionDetailsClassName,
	titleStyle,
	disabled = false,
	styleSub,
	expanded,
	on_change,
	containerStyle,
	id = '',
	expandIconColor,
}: AccordionProps): JSX.Element => {
	const theme: any = useTheme();

	return (
		<div style={{ width: '100%' }}>
			{content &&
				content?.length > 0 &&
				content?.map((item: any) => {
					let title = _.get(item, 'title');
					return (
						<MuiAccordion
							key={title}
							className={className}
							expanded={expanded && _.includes(expanded, id)}
							onChange={on_change && on_change(id)}
							sx={{
								background: titleBackgroundColor,
								boxShadow: 'none',
								...style,
								...theme?.product?.filter?.accordion_drawer,
							}}
							disabled={disabled}>
							<AccordionSummary
								sx={{ color: titleColor, ...titleStyle, ...styleSub }}
								expandIcon={<Icon iconName='IconChevronDown' color={expandIconColor} />}>
								<Box
									sx={{
										width: item?.subTitle ? '33%' : '100%',
									}}>
									{item?.title}
								</Box>
								{item?.subTitle}
							</AccordionSummary>
							<AccordionDetails
								className={accordionDetailsClassName}
								sx={{
									background: contentBackground,
									color: contentColor,
									...containerStyle,
								}}>
								{item?.expandedContent}
							</AccordionDetails>
						</MuiAccordion>
					);
				})}
		</div>
	);
};

Accordion.defaultProps = {
	content: [
		{
			title: <div />,
			subTitle: <div />,
			expandedContent: <div />,
		},
	],
	titleBackgroundColor: background_colors?.primary,
	titleColor: accordion_colors?.background,
	contentBackground: accordion_colors?.text,
	contentColor: accordion_colors?.background,
	className: '',
	accordionDetailsClassName: '',
	expandIconColor: accordion_colors?.background,
};

export default Accordion;
