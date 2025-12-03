import { Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Box, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import SendMailDrawer from 'src/screens/OrderManagement/component/Drawer/SendMailDrawer';
import { DRAWER_CONSTANTS } from 'src/screens/OrderManagement/constants';

interface AddEditEmailDrawerProps {
	drawer_state: boolean;
	handle_drawer_state: any;
	email_data: any;
	set_email_data: any;
	buyer_id: string;
}

const AddEditEmailDrawer: React.FC<AddEditEmailDrawerProps> = ({
	drawer_state,
	handle_drawer_state,
	email_data,
	set_email_data,
	buyer_id = '',
}) => {
	const { id } = useParams();

	const render_header = (
		<Grid className='drawer-header' sx={{ alignItems: 'center' }}>
			<CustomText type='H2'>{DRAWER_CONSTANTS.SECTIONS.notification_email_ids}</CustomText>
			<Icon iconName='IconX' onClick={close} />
		</Grid>
	);
	const render_content = (
		<Grid className='drawer-container'>
			{render_header}
			<Divider className='drawer-divider' />
			<Box>
				<SendMailDrawer
					email_drawer={drawer_state}
					set_email_drawer={handle_drawer_state}
					document_id={id}
					email_data={email_data}
					set_email_data={set_email_data}
					set_send_email={() => {}} // IMP - Don't remove
					buyer_id={buyer_id}
				/>
			</Box>
		</Grid>
	);

	return <Drawer open={drawer_state} content={render_content} onClose={() => null} />;
};

export default AddEditEmailDrawer;
