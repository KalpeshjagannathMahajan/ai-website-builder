import DOMPurify from 'dompurify';
import React, { useEffect, useRef, useState } from 'react';
import { Typography } from 'src/common/@the-source/atoms';
import useStyles from '../styles';

interface Props {
	details: any;
}

const ShowMoreText = ({ details }: Props) => {
	const [show_more_cta, set_show_more_cta] = useState(false);
	const [show_more, set_show_more] = useState(true);
	const classes = useStyles();

	const span_ref = useRef<any>();
	const formatted_string = details?.value?.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>') || '';

	const calculate_number_of_lines = () => {
		if (span_ref?.current) {
			const span_element = span_ref?.current;
			const span_height = span_element.getBoundingClientRect().height;
			const line_height = parseFloat(getComputedStyle(span_element).lineHeight);
			const number_of_lines = Math.floor(span_height / line_height);

			if (number_of_lines > 3) {
				set_show_more_cta(true);
				set_show_more(false);
			} else {
				set_show_more_cta(false);
				set_show_more(true);
			}
		}
	};

	useEffect(() => {
		calculate_number_of_lines();
	}, [span_ref]);

	return (
		<React.Fragment>
			<span ref={span_ref} id='' style={{ marginRight: 5 }} className={classes.show_more_text}>
				{show_more ? (
					<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formatted_string) }} />
				) : (
					<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(`${details?.value?.substring(0, 220)}...`) }} />
				)}
			</span>
			{show_more_cta && (
				<Typography
					className={classes.active_price_style}
					sx={{ cursor: 'pointer', fontWeight: 500 }}
					onClick={() => set_show_more((prev) => !prev)}>
					{show_more ? 'Show Less' : 'Show More'}
				</Typography>
			)}
		</React.Fragment>
	);
};

export default ShowMoreText;
