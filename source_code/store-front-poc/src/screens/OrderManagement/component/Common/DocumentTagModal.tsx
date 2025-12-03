import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Modal, Radio } from 'src/common/@the-source/atoms';
import OrderManagementContext from '../../context';
import { t } from 'i18next';

const DocumentTagModal = () => {
	const { document_data, document_tag_modal, set_document_tag_modal, document_tag_form, handle_update_document } =
		useContext(OrderManagementContext);
	const { attributes = {} } = document_data;
	const [selected_option, set_selected_option] = useState({});
	const { options = [], id = '' } = document_tag_form;

	const handle_submit = () => {
		handle_update_document({
			[id]: selected_option,
		});
		set_document_tag_modal(false);
	};

	useEffect(() => {
		const match = _.find(options, (item) => item?.value?.toLowerCase() === attributes?.[id]?.value?.toLowerCase());
		if (match) set_selected_option(match);
	}, [options, attributes]);

	return (
		<Modal
			open={document_tag_modal}
			onClose={() => set_document_tag_modal(false)}
			title={t('OrderManagement.DocumentTagModal.ChooseTag')}
			footer={
				<Grid display='flex' gap={1.5} justifyContent={'flex-end'}>
					<Button variant='outlined' onClick={() => set_document_tag_modal(false)} color='inherit'>
						Cancel
					</Button>
					<Button onClick={handle_submit}>Confirm</Button>
				</Grid>
			}
			children={
				<Grid container p={0.5}>
					<CustomText type='Body'>{t('OrderManagement.DocumentTagModal.ChooseToDisplay')}</CustomText>
					<Grid container gap={1} pt={1.5}>
						{_.filter(options, (item) => item?.is_active).map((item) => {
							return (
								<Grid container key={item?.value} sx={{ alignItems: 'center', gap: '1.6rem' }}>
									<Radio
										onChange={() => set_selected_option(item)}
										checked={selected_option?.value === item?.value}
										sx={{ padding: '0' }}
									/>
									<CustomText>{item?.label}</CustomText>
								</Grid>
							);
						})}
					</Grid>
				</Grid>
			}
		/>
	);
};

export default DocumentTagModal;
