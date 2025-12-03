import { Tooltip } from 'src/common/@the-source/atoms';
import { makeStyles } from '@mui/styles';

import CircularProgressBar from 'src/common/@the-source/atoms/ProgressBar/CircularProgressBar';

const useStyles = makeStyles(() => ({
	container: (isScrollable) => ({
		background: 'white',
		borderRadius: '8px',
		padding: '8px 0px',
		maxHeight: isScrollable ? '35vh' : 'auto',
		overflowY: isScrollable ? 'scroll' : 'hidden',
	}),
	loader_box: {
		height: '100px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
}));

const MenuHover = ({
	styles = {},
	loading = false,
	LabelComponent,
	menu,
	direction = 'bottom',
	commonMenuComponent,
	onOpen = () => {},
	isScrollable = false,
	child_style,
}: any) => {
	const classes = useStyles(isScrollable);

	return (
		<Tooltip
			onClose={function noRefCheck() {}}
			onOpen={onOpen}
			placement={direction}
			componentsProps={{
				tooltip: {
					sx: {
						bgcolor: 'white',
						boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.1)',
						...styles,
					},
				},
			}}
			title={
				<div className={classes.container}>
					{loading ? (
						<div className={classes.loader_box}>
							<CircularProgressBar size={20} />
						</div>
					) : (
						menu.map(
							(item: any): JSX.Element => (
								<div style={{ padding: '6px 16px', ...child_style }} key={item.id}>
									{item.component ? item.component : commonMenuComponent(item)}
								</div>
							),
						)
					)}
				</div>
			}>
			{LabelComponent}
		</Tooltip>
	);
};

export default MenuHover;
