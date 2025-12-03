import { Typography } from '@mui/material';
import { Grid, Icon } from 'src/common/@the-source/atoms';

interface Props {
	value: any;
	valueFormatted?: any;
}

const DeleteIconCellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	const handleDelete = () => {};

	const { valueFormatted } = rest;

	return (
		<>
			<Grid className='serial-col-delete' display={'flex'} marginX={2.5} alignItems={'center'}>
				<Icon onClick={handleDelete} iconName='IconTrash' sx={{ cursor: 'pointer', color: '#676D77' }} size='large' />
			</Grid>
			<Typography marginLeft={3} className='serial-col-serial'>
				{valueFormatted}
			</Typography>
		</>
	);
};

export default DeleteIconCellRenderer;
