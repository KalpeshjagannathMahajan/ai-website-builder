import {
	Pagination as MuiPagination,
	PaginationProps as MuiPaginationProps,
	useMediaQuery,
	PaginationRenderItemParams,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

type PaginationBaseProps = Pick<
	MuiPaginationProps,
	| 'shape'
	| 'count'
	| 'variant'
	| 'color'
	| 'showFirstButton'
	| 'showLastButton'
	| 'onChange'
	| 'page'
	| 'sx'
	| 'size'
	| 'siblingCount'
	| 'boundaryCount'
> & {
	renderItem?: (item: PaginationRenderItemParams) => React.ReactNode;
};

export interface PaginationProps extends PaginationBaseProps {}

const Pagination = ({ color, shape, count, variant, page, onChange, siblingCount, boundaryCount, sx, size, ...rest }: PaginationProps) => {
	const theme: any = useTheme();
	const is_small_screen_for_pagination = useMediaQuery(theme.breakpoints.down('sm'));
	const adjusted_sibling_ount = is_small_screen_for_pagination ? 1 : siblingCount;
	const adjusted_boundary_count = is_small_screen_for_pagination ? 0 : boundaryCount;
	const handle_change = (event: React.ChangeEvent<unknown>, value: number) => {
		if (onChange) {
			onChange(event, value);
		}
	};

	return (
		<MuiPagination
			color={color}
			count={count}
			variant={variant}
			shape={shape}
			siblingCount={adjusted_sibling_ount}
			page={page}
			onChange={handle_change}
			boundaryCount={adjusted_boundary_count}
			size={is_small_screen_for_pagination ? 'small' : size}
			{...rest}
			sx={{
				'& .MuiPaginationItem-root': {
					...theme?.pagination_,
					mb: 1,
					...sx,
				},
			}}
		/>
	);
};

Pagination.defaultProps = {
	color: 'primary',
	variant: 'outlined',
	shape: 'standard',
	count: 1,
	siblingCount: 1,
	boundaryCount: 1,
	showLastButton: true,
	showFirstButton: true,
	size: 'medium',
	sx: {},
};

export default Pagination;
