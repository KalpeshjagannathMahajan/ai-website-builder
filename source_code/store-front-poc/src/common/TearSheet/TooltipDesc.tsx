import React, { useState, useEffect } from 'react';
import { check_truncation } from 'src/utils/common';
import { Tooltip } from '../@the-source/atoms';
import CustomText from '../@the-source/CustomText';

interface TootlTipProps {
	desc: string;
}

const TooltipDesc = ({ desc }: TootlTipProps) => {
	const [isTruncated, setIsTruncated] = useState(false);
	const [hovered, setHovered] = useState(false);

	useEffect(() => {
		const truncated = check_truncation(desc, '200px', '14px', '16px', 3);
		setIsTruncated(truncated);
	}, [desc]);

	const handleMouseEnter = () => setHovered(true);
	const handleMouseLeave = () => setHovered(false);

	return (
		<Tooltip title={desc} placement='top' arrow open={hovered && isTruncated}>
			<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
				<CustomText
					style={{
						display: '-webkit-box',
						WebkitBoxOrient: 'vertical',
						WebkitLineClamp: '3',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}>
					{desc}
				</CustomText>
			</div>
		</Tooltip>
	);
};

export default TooltipDesc;
