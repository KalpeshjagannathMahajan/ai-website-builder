import { Grid as MuiGrid, GridProps as MuiGridProps } from '@mui/material';

// type GridBaseProps = Pick<
// MuiGridProps
// >;

export interface GridProps extends MuiGridProps {}

const Grid = ({ children, ...rest }: GridProps) => <MuiGrid {...rest}>{children}</MuiGrid>;

Grid.defaultProps = {};
export default Grid;
