import React from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Drawer, Grid, Icon, Button, Checkbox } from 'src/common/@the-source/atoms';
import { Divider } from '@mui/material';
import _ from 'lodash';
import { buyer_attributes } from './template';
import { useTranslation } from 'react-i18next';

const AddBuyerAtt = ({ drawer, set_drawer }: any) => {
	const { t } = useTranslation();
	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{t('Settings.AddEditBuyer')}</CustomText>
				<Icon iconName='IconX' onClick={() => set_drawer(false)} />
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				{_.map(buyer_attributes, (item) => (
					<Grid display='flex' alignItems='center'>
						<Checkbox checked={item?.is_included} />
						<CustomText>{item?.name}</CustomText>
					</Grid>
				))}
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Button variant='outlined'>{t('Settings.CTA.cancel')}</Button>
				<Button>{t('Settings.CTA.save')}</Button>
			</Grid>
		);
	};

	const handle_render_content = () => {
		return (
			<Grid className='drawer-container'>
				{handle_render_header()}
				<Divider className='drawer-divider' />
				{handle_render_drawer_content()}
				<Divider className='drawer-divider' />
				{handle_render_footer()}
			</Grid>
		);
	};

	return (
		<>
			<Drawer
				anchor='right'
				width={480}
				open={drawer}
				onClose={() => set_drawer(false)}
				content={<React.Fragment>{handle_render_content()}</React.Fragment>}
			/>
		</>
	);
};
export default AddBuyerAtt;
