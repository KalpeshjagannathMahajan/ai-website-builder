import React, { useState, useEffect } from 'react';
import { check_truncation } from 'src/utils/common';
import { Tooltip } from '../@the-source/atoms';
import CustomText from '../@the-source/CustomText';

interface TootlTipProps {
	title: string;
}

const TooltipTitle = ({ title }: TootlTipProps) => {
	const [isTruncated, setIsTruncated] = useState(false);
	const [hovered, setHovered] = useState(false);

	useEffect(() => {
		const truncated = check_truncation(title, '200px', '14px', '16px', 2);
		setIsTruncated(truncated);
	}, [title]);

	const handleMouseEnter = () => setHovered(true);
	const handleMouseLeave = () => setHovered(false);

	return (
		<Tooltip title={title} placement='top' arrow open={hovered && isTruncated}>
			<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
				<CustomText
					type='H6'
					style={{
						display: '-webkit-box',
						WebkitBoxOrient: 'vertical',
						WebkitLineClamp: '2',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}>
					{title}
				</CustomText>
			</div>
		</Tooltip>
	);
};

export default TooltipTitle;
