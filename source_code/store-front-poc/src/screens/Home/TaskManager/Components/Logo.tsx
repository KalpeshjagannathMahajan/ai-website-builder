import { makeStyles } from '@mui/styles';

import { Icon, Grid } from 'src/common/@the-source/atoms';
import { TaskStatus, Entity } from 'src/@types/manage_data';

const useStyles = makeStyles(() => ({
	logo_container: {
		display: 'grid',
		placeItems: 'center',
		borderRadius: '50%',
		width: '36px',
		height: '36px',
		marginRight: '8px',
	},
	icon: {
		width: '20px',
		height: '20px',
	},
}));

const statusColors = {
	[TaskStatus.Review]: { color: '#F0AF30', background: '#FEF7EA' },
	[TaskStatus.Completed]: { color: '#16885F', background: '#E8F3EF' },
	[TaskStatus.InProgress]: { color: '#16885F', background: '#E8F3EF' },
	[TaskStatus.Cancelled]: { color: '#D74C10', background: '#FBEDE7' },
	[TaskStatus.Failed]: { color: 'white', background: '#D74C10' },
	[TaskStatus.Started]: { color: '#F0AF30', background: '#FEF7EA' },
};

const labelIcons = (entity: Entity, task_status: TaskStatus) => {
	if (task_status === TaskStatus.Failed) return 'IconAlertTriangle';
	if (entity === Entity.Documents) return 'IconReceipt';
	if (entity === Entity.Buyers) return 'IconReceipt';
	if (entity === Entity.Inventory) return 'IconBox';
	if (entity === Entity.Products) return 'IconCards';
	if (entity === Entity.Pricing) return 'IconCurrencyDollar';
	if (entity === Entity.Collections) return 'IconTriangleSquareCircle';
	if (entity === Entity.Categories) return 'IconSofa';
	if (entity === Entity.IntegrationSync) return 'IconRefresh';
	return 'IconReceipt';
};

interface Props {
	task_status: TaskStatus;
	entity: Entity;
}
export default function Logo({ task_status, entity }: Props) {
	const classes = useStyles();

	const { color: logoColor, background: logo_background } = statusColors[task_status] || {};
	const logo: any = labelIcons(entity, task_status);

	return (
		<Grid className={classes.logo_container} sx={{ background: logo_background }}>
			<Icon iconName={logo} className={classes.icon} sx={{ color: logoColor }}></Icon>
		</Grid>
	);
}
