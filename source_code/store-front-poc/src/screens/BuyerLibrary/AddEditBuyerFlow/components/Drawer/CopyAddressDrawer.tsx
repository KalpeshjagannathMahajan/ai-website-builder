import React from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Box, Drawer, Grid, Icon, Typography } from 'src/common/@the-source/atoms';
import { Divider } from '@mui/material';
import AddressCard from '../AddressCard';
import useStyles from '../../../styles';
import { useTheme } from '@mui/material/styles';
import CustomText from 'src/common/@the-source/CustomText';
import { colors } from 'src/utils/theme';

interface Props {
	close: () => void;
	handle_copied_address: (item: any) => void;
	all_address: [];
	primary_address_id: string;
	address_type: string;
	buyer_fields: any;
}

const CopyAddressComp = ({ close, all_address, primary_address_id, handle_copied_address, address_type, buyer_fields }: Props) => {
	const classes = useStyles();
	const theme: any = useTheme();
	const { t } = useTranslation();
	let all_address_by_type = _.filter(all_address, { type: address_type ? 'billing' : 'shipping' }) || [];
	const address_count_msg =
		all_address_by_type?.length > 1
			? t('Common.CopyAddressDrawer.ShowingResults', { count: all_address_by_type?.length })
			: t('Common.CopyAddressDrawer.ShowingResult', { count: all_address_by_type?.length });
	const handle_render_drawer_content = () => {
		return (
			<Box m={1} mb={7} px={1.5} sx={{ ...theme?.copy_address_drawer?.copy_address_drawer_style_card }}>
				<Grid mt={1.5} mb={1.5}>
					<CustomText type='Body' color={colors.secondary_text}>
						{address_count_msg}
					</CustomText>
				</Grid>
				{_.map(all_address_by_type, (addr_item, addr_index) => {
					if (_.isEmpty(addr_item)) return;
					return (
						<Box
							mb={1.5}
							sx={{
								cursor: 'pointer',
							}}>
							<AddressCard
								style={{ ...theme?.copy_address_drawer?.copy_address_drawer_style, ...theme?.card_ }}
								key={`addr_card_${addr_index}`}
								is_editable={false}
								primary_address_id={primary_address_id}
								item={addr_item}
								on_card_press={() => {
									handle_copied_address(addr_item);
								}}
								buyer_fields={buyer_fields}
							/>
						</Box>
					);
				})}
			</Box>
		);
	};

	const handle_render_header = () => {
		return (
			<Grid
				className='drawer-header'
				sx={{ ...theme?.copy_address_drawer?.copy_address_drawer_style_header }}
				position='sticky'
				top={0}
				justifyContent='flex-start'>
				<Icon iconName='IconArrowLeft' sx={{ cursor: 'pointer', mt: 0.2, mr: 1 }} onClick={close} />
				<Typography variant='h6'>{t('Common.CopyAddressDrawer.CopyAddressFrom')}</Typography>
			</Grid>
		);
	};

	const handle_render_drawer = () => {
		return (
			<React.Fragment>
				<Grid className={classes.buyer_copy_form_drawer_container} paddingTop={0}>
					{handle_render_header()}
					<Divider />
					<Grid className={classes.buyer_copy_form_drawer_content}>{handle_render_drawer_content()}</Grid>
				</Grid>
			</React.Fragment>
		);
	};

	return <Drawer open={true} onClose={() => null} content={handle_render_drawer()} />;
};

const CopyAddressDrawer = (props: any) => {
	const { is_visible } = props;
	if (!is_visible) {
		return null;
	}

	return <CopyAddressComp {...props} />;
};

export default CopyAddressDrawer;
