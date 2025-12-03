import { Image } from 'src/common/@the-source/atoms';
import { makeStyles } from '@mui/styles';
import ImageLinks from 'src/assets/images/ImageLinks';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

interface EmptyTableComponentProps {
	top: string;
	height: string;
	children?: any;
	width?: string;
	table_type?: any;
}

const EmptyTableComponent = ({ top, height, width, children, table_type }: EmptyTableComponentProps) => {
	const useStyles = makeStyles(() => ({
		empty_state: {
			position: is_ultron ? 'absolute' : 'inherit',
			backgroundColor: 'white',
			width: width ? width : '100%',
			top,
			display: 'flex',
			gap: '12px',
			flexDirection: 'column',
			minHeight: height,
			justifyContent: 'center',
			alignItems: 'center',
		},
	}));
	const classes = useStyles();

	const data: any = {
		order_table: {
			imageSrc: ImageLinks.NoOrders,
			title: 'You do not have any order',
			description: 'Explore products and create your first order today',
		},
		common_table: {
			imageSrc: is_ultron ? ImageLinks.NoTableResult : ImageLinks.NoTableResultStorefront,
			title: "We haven't found any results for your search",
			description: children ? 'Try clearing some of the filters you have applied' : 'Try searching for something else',
		},
	};

	const empty_data = data[table_type || 'common_table'];

	return (
		<div className={classes.empty_state}>
			<Image src={empty_data?.imageSrc} width={'140'} height={'145'} />
			<p style={{ fontSize: '18px', fontWeight: '700', textAlign: 'center' }}>{empty_data?.title}</p>
			<p style={{ fontSize: '16px', fontWeight: '400' }}>{empty_data?.description}</p>
			{children}
		</div>
	);
};

export default EmptyTableComponent;
