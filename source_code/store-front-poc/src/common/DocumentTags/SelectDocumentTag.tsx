import React from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, Radio, SingleSelect } from '../@the-source/atoms';
import CustomText from '../@the-source/CustomText';
import constants from 'src/utils/constants';
import { colors } from 'src/utils/theme';
import { TagOption } from 'src/@types/document_tags';
import { check_permission } from 'src/utils/utils';
import { PERMISSIONS } from 'src/casl/permissions';
import { useSelector } from 'react-redux';

interface SelectDocTagProps {
	value: string;
	document_tags_enabled: boolean;
	tag_options: TagOption[];
}

const SelectDocumentTag: React.FC<SelectDocTagProps> = ({ value, document_tags_enabled, tag_options }) => {
	const { t } = useTranslation();
	const { control, setValue, watch } = useFormContext();
	const show_doc_tag_options = watch('assign_tag') === 'yes';
	const permissions = useSelector((state: any) => state?.login?.permissions);
	const tag_permission = check_permission(permissions, [PERMISSIONS.edit_order_tag.slug]);

	return (
		document_tags_enabled &&
		tag_permission && (
			<Grid>
				<Grid>
					<CustomText type='H3'>
						{t('OrderManagement.ExportDrawer.DocumentTagSubtext', {
							tab: value,
						})}
					</CustomText>
					<Grid pt={1.5} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						{_.map(constants.ASSIGN_TAG_OPTIONS, (item) => (
							<Grid container key={item?.value} sx={{ alignItems: 'center', gap: '1.6rem' }}>
								<Controller
									name='assign_tag'
									control={control}
									render={({ field }) => (
										<Radio
											{...field}
											onChange={() => {
												setValue('assign_tag', item?.value);
											}}
											checked={field.value === item?.value}
											sx={{ padding: '0' }}
										/>
									)}
								/>
								<CustomText>{item?.label}</CustomText>
							</Grid>
						))}
					</Grid>
				</Grid>
				{show_doc_tag_options && Boolean(tag_options?.length) && (
					<Grid sx={{ padding: '2rem 1rem', margin: '2rem 0', background: colors.grey_600, borderRadius: '1rem' }}>
						<Controller
							name='document_tag'
							control={control}
							render={({ field }) => (
								<SingleSelect
									label={t('OrderManagement.ExportDrawer.ChooseDocumentStatus')}
									handleChange={(data) => setValue('document_tag', data.value)}
									options={tag_options}
									value={field.value}
								/>
							)}
						/>
					</Grid>
				)}{' '}
			</Grid>
		)
	);
};

export default SelectDocumentTag;
