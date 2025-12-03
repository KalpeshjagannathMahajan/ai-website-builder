import { useContext, useEffect, useState } from 'react';
import { Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import SettingsContext from '../../context';
import ExpandableConfigDrawer from './ExpandableConfigDrawer';

const DocumentCustom = () => {
	const [expandable_attr, set_expandable_attr] = useState<any>({});
	const [edit_attr_drawer_open, set_edit_attr_drawer_open] = useState(false);
	const {
		configure,
		get_keys_configuration,
		// update_configuration
	} = useContext(SettingsContext);

	useEffect(() => {
		get_keys_configuration('document_ssrm_expandable_config');
	}, []);

	useEffect(() => {
		if (configure?.document_ssrm_expandable_config) {
			set_expandable_attr(configure?.document_ssrm_expandable_config);
		}
	}, [configure?.document_ssrm_expandable_config]);

	const before_expand = expandable_attr?.before_expand?.map((item: any) => item?.name || '') || [];
	const on_expand = expandable_attr?.on_expand?.map((item: any) => item?.name || '') || [];

	const before_expand_values = expandable_attr?.before_expand?.map((item: any) => item?.key || '')?.join(',') || '';
	const on_expand_values = expandable_attr?.on_expand?.map((item: any) => item?.key || '')?.join(',') || '';

	return (
		<Grid mt={3}>
			<CustomText type='H6'>Customize info on sales cards</CustomText>
			<Grid container mt={2} sx={{ borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
				<Grid p={2}>
					<Grid>
						<CustomText color='#676D77' type='Subtitle'>
							Attributes included in expandable state
						</CustomText>
						<CustomText color='#676D77' type='Body'>
							{on_expand?.length > 0 ? on_expand?.join(', ') : '--'}
						</CustomText>
					</Grid>
					<Grid mt={2}>
						<CustomText color='#676D77' type='Subtitle'>
							Attributes displayed upfront on card
						</CustomText>
						<CustomText color='#676D77' type='Body'>
							{before_expand?.length > 0 ? before_expand?.join(', ') : '--'}
						</CustomText>
					</Grid>
				</Grid>
				<Grid ml='auto' p={2}>
					<Icon sx={{ cursor: 'pointer' }} iconName='IconEdit' onClick={() => set_edit_attr_drawer_open(true)} />
				</Grid>
			</Grid>
			{edit_attr_drawer_open && (
				<ExpandableConfigDrawer
					open={edit_attr_drawer_open}
					set_open={set_edit_attr_drawer_open}
					// all_attributes={all_attributes}
					on_expand={on_expand_values}
					before_expand={before_expand_values}
				/>
			)}
		</Grid>
	);
};

export default DocumentCustom;
