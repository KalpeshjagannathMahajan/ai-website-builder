import React from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import ContactCard from '../ContactCard';
import { Box, Drawer, Grid, Icon, Typography } from 'src/common/@the-source/atoms';
import { Divider } from '@mui/material';
import useStyles from '../../../styles';
import CustomText from 'src/common/@the-source/CustomText';
import { colors } from 'src/utils/theme';

interface Props {
	close: () => void;
	handle_copied_contact: (item: any) => void;
	all_contacts: [];
	primary_contact_id: string;
	buyer_fields: any;
}

const CopyContactComp = ({ close, all_contacts, primary_contact_id, handle_copied_contact, buyer_fields }: Props) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const contact_count_msg =
		all_contacts?.length > 1
			? t('Common.CopyContactDrawer.ShowingResults', { count: all_contacts?.length })
			: t('Common.CopyContactDrawer.ShowingResult', { count: all_contacts?.length });

	const handle_render_drawer_content = () => {
		return (
			<Box m={1} mb={7} px={1.5}>
				<Grid mt={1.5} mb={1.5}>
					<CustomText type='Body' color={colors.secondary_text}>
						{contact_count_msg}
					</CustomText>
				</Grid>
				{_.map(all_contacts, (contact_item, contact_index) => (
					<Box
						mb={1.5}
						sx={{
							cursor: 'pointer',
						}}>
						<ContactCard
							key={`contact_card_${contact_index}`}
							is_editable={false}
							item={contact_item}
							primary_contact_id={primary_contact_id}
							on_card_press={() => {
								handle_copied_contact(contact_item);
							}}
							buyer_fields={buyer_fields}
						/>
					</Box>
				))}
			</Box>
		);
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header' px={2} py={1.6} position='sticky' top={0} justifyContent='flex-start'>
				<Icon iconName='IconArrowLeft' sx={{ cursor: 'pointer', mt: 0.2, mr: 1 }} onClick={close} />
				<Typography variant='h6'>{t('Common.CopyContactDrawer.CopyContactFrom')}</Typography>
			</Grid>
		);
	};

	const handle_render_drawer = () => {
		return (
			<React.Fragment>
				<Grid className={classes.buyer_copy_form_drawer_container}>
					{handle_render_header()}
					<Divider />
					<Grid className={classes.buyer_copy_form_drawer_content}>{handle_render_drawer_content()}</Grid>
				</Grid>
			</React.Fragment>
		);
	};

	return <Drawer open={true} onClose={() => null} content={handle_render_drawer()} />;
};

const CopyContactDrawer = (props: any) => {
	const { is_visible } = props;
	if (!is_visible) {
		return null;
	}

	return <CopyContactComp {...props} />;
};

export default CopyContactDrawer;
