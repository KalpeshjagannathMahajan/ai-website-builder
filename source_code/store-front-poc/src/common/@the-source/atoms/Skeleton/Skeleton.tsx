import { Skeleton as MuiSkeleton, SkeletonProps as MuiSkeletonProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
type SkeletonBaseProps = Pick<MuiSkeletonProps, 'variant' | 'width' | 'height' | 'animation' | 'sx'>;

export interface SkeletonProps extends SkeletonBaseProps {}

const Skeleton = ({ variant, height, width, animation, sx }: SkeletonProps) => {
	const theme: any = useTheme();
	return (
		<MuiSkeleton
			variant={variant}
			height={height}
			width={width}
			animation={animation}
			sx={{ ...sx, background: theme?.skeleton?.background, ...theme?.skeleton_ }}
		/>
	);
};

Skeleton.defaultProps = {
	color: 'A9A9A9',
};
export default Skeleton;
