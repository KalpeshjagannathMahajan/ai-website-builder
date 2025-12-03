import { Typography } from 'src/common/@the-source/atoms';

const CustomTooltip = (params: any) => {
	return (
		<div className='custom-tooltip'>
			<Typography variant='body1' color='white'>
				{params?.value}
			</Typography>
		</div>
	);
};

export default CustomTooltip;
