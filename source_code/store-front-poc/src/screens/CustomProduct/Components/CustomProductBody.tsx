import { Alert, useMediaQuery } from '@mui/material';
import { t } from 'i18next';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Box, CustomInput, Grid, Icon, Tooltip, Skeleton } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import styles from '../customproduct.module.css';
import { handle_subtext, should_show_modifier } from '../helper';
import ModifierField from '../ModifierField';
import NoOption from './NoOption';
import { useTheme } from '@mui/material/styles';
import { colors } from 'src/utils/theme';
import { MAX_TEXT_VALIDATION } from '../constants';
import { get_short_name } from 'src/screens/Wishlist/utils';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

interface CustomValType {
	[key: string]: number | string;
}

interface CustomProductBodyProps {
	data: any;
	custom_val: CustomValType;
	errors: any;
	done_click: boolean;
	handle_values: (custom_data: any) => void;
	handle_error: (error: any) => void;
	is_loading: boolean;
	sku_id: string;
	show_more: boolean;
	is_edit?: boolean;
	currency: string;
	set_custom_val?: any;
	set_errors?: any;
}

const dividerStyle: React.CSSProperties = {
	height: '1px',
	background: 'repeating-linear-gradient(90deg,#D1D6DD 0 4px,#0000 0 8px)',
	margin: '28px 0',
	marginBottom: '2.8rem',
};

const CustomProductBody = ({
	data,
	custom_val,
	errors,
	done_click,
	handle_values,
	handle_error,
	is_edit,
	is_loading,
	sku_id,
	show_more,
	currency,
	set_errors,
	set_custom_val,
}: CustomProductBodyProps) => {
	const sorted_data: any = _.sortBy(data, (item: any) => item?.priority);
	const [search, set_search] = useState<any>({});
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';
	const wizshop_image_preview: any = JSON.parse(localStorage.getItem('wizshop_settings') || '{}')?.image_preview;
	const handle_search = (search_string: string, key: string) => {
		set_search((prev: {}) => ({ ...prev, [key]: search_string?.trim() }));
	};

	useEffect(() => {
		const updatedErrors = { ...errors };
		const updatedValues = { ...custom_val };
		let hasChanges = false;

		sorted_data.forEach((curr: any) => {
			if (!(curr.id in custom_val)) {
				if (should_show_modifier(curr, data, custom_val) && curr?.value && !is_edit) {
					updatedValues[curr.id] = curr?.value;
					hasChanges = true;
				}
				return;
			}

			if (!should_show_modifier(curr, sorted_data, custom_val)) {
				if (updatedErrors[curr.id]) {
					delete updatedErrors[curr.id];
					delete updatedValues[curr.id];
					hasChanges = true;
				}
			} else if (curr?.value) {
				updatedValues[curr.id] = custom_val[curr.id] ?? curr.value;
				hasChanges = true;
			}
		});

		if (hasChanges) {
			if (!_.isEqual(updatedErrors, errors)) {
				set_errors(updatedErrors);
			}
			if (!_.isEqual(updatedValues, custom_val)) {
				set_custom_val(updatedValues);
			}
		}
	}, [custom_val, errors, sorted_data]);

	return (
		<Grid className={styles.custom_product_drawer_body}>
			{is_small_screen && (
				<Box mb={2} mt={-1}>
					{is_loading ? (
						<Skeleton variant='rectangular' width={173} height={24} sx={{ borderRadius: '8px' }} />
					) : (
						<Box
							display='flex'
							className={styles.header_tooltip}
							sx={{
								...theme?.product?.custom_product_drawer?.header_tooltip,
							}}>
							<Tooltip title={sku_id}>
								<span style={{ cursor: 'pointer', wordBreak: 'break-all' }}>
									SKU: {show_more ? `${sku_id}` : `${sku_id?.substring(0, 70)}...`}
								</span>
							</Tooltip>
						</Box>
					)}
				</Box>
			)}
			{sorted_data?.map((curr: any, ind: number) => {
				// eslint-disable-next-line react-hooks/rules-of-hooks

				if (!should_show_modifier(curr, sorted_data, custom_val)) {
					return null;
				}
				const _select_value = (() => {
					const selected_names = custom_val?.[curr?.id];
					const is_multi_select = curr?.type === 'Multi Select';

					if (is_multi_select && !_.isEmpty(selected_names) && typeof selected_names === 'string') {
						const names_list = selected_names?.split(',');

						let truncated_names = [];
						let total_length = 0;
						for (const name of names_list) {
							const new_length = total_length + name?.length + (truncated_names?.length > 0 ? 2 : 0);
							if (new_length > 60) break;
							truncated_names?.push(name);
							total_length = new_length;
						}

						const more_count = names_list?.length - truncated_names?.length;
						return more_count > 0 ? `${truncated_names?.join(', ')}... +${more_count} more` : truncated_names?.join(', ');
					} else if (!is_multi_select && selected_names) {
						return _.get(_.find(curr?.options, { name: selected_names }), 'display_name', selected_names);
					}

					return null;
				})();

				const err = !errors[curr?.id]?.valid && done_click;

				const filter_values =
					search[curr?.name] || ''
						? _.filter(curr?.options, (item) => item.name.toLowerCase().includes(search[curr?.name].toLowerCase() || ''))
						: curr?.options;

				const filter_values_length = filter_values.length;

				const sorted_values = (type: any, value: any) => {
					const values = type === 'Text' ? get_short_name(value, 32) : value || '';
					return String(values)
						.split(',')
						.map((val) => val.trim())
						.filter(Boolean)
						.sort((a, b) => {
							const [numA, numB] = [parseFloat(a), parseFloat(b)];
							return !isNaN(numA) && !isNaN(numB) ? numA - numB : a.localeCompare(b);
						})
						.join(', ');
				};
				return (
					<React.Fragment key={ind}>
						<Box className={styles.drawer_body_container}>
							<Box sx={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
								<CustomText type='H3' style={{ color: theme?.product?.custom_product_drawer?.body?.primary, textWrap: 'nowrap' }}>
									{curr?.name ?? ''} :
								</CustomText>
								{!custom_val[curr?.id] ? (
									<Box
										className={styles.drawer_required_text}
										sx={{
											borderRadius: theme?.product?.custom_product_drawer?.mandatory?.borderRadius,
											background: curr?.mandatory
												? theme?.product?.custom_product_drawer?.body?.secondary
												: theme?.product?.custom_product_drawer?.body?.light,
										}}>
										<CustomText
											type='Body'
											style={{
												color: curr?.mandatory
													? theme?.product?.custom_product_drawer?.body?.orange
													: theme?.product?.custom_product_drawer?.body?.grey,
											}}>
											{curr?.mandatory
												? t('CustomProduct.CustomText.Required')
												: curr?.type === 'Text'
												? t('CustomProduct.CustomText.EnterText')
												: t('CustomProduct.CustomText.SelectOptions')}
										</CustomText>
									</Box>
								) : (
									<CustomText
										type='Title'
										style={{
											color: theme?.product?.custom_product_drawer?.modifier_select_value?.color,
											fontWeight: is_ultron ? 400 : 700,
										}}
										className={styles.modifier_select_value}>
										{sorted_values(curr?.type, _select_value)}
									</CustomText>
								)}
							</Box>
							{curr?.type === 'Multi Select' || curr.type === 'Counter' ? (
								<>
									{' '}
									{handle_subtext(
										curr,
										errors,
										curr?.display_type === 'Swatch',
										done_click,
										custom_val,
										theme?.product?.custom_product_drawer?.body?.primary,
										theme?.product?.custom_product_drawer?.body?.orange,
									)}
								</>
							) : (
								<>
									{curr?.type !== 'Text' && curr?.mandatory && (
										<CustomText
											type='Body'
											style={{
												marginTop: '1rem',
												color: err
													? theme?.product?.custom_product_drawer?.body?.orange
													: theme?.product?.custom_product_drawer?.body?.light_grey,
											}}>
											{t('CustomProduct.CustomText.SelectOption')}
											{curr?.display_type === 'Swatch' &&
												is_small_screen &&
												wizshop_image_preview &&
												t('CustomProduct.CustomText.SelectLongPress')}
										</CustomText>
									)}
								</>
							)}
							{!is_retail_mode && curr.type === 'Counter' && (
								<CustomText type='Body' style={{ marginTop: '1rem', color: theme?.product?.custom_product_drawer?.body?.light_grey }}>
									${curr?.options[0]?.price || 0}/unit
								</CustomText>
							)}

							{curr?.type === 'Text' && (
								<>
									{curr?.max_selection_quantity !== curr?.min_selection_quantity && (
										<CustomText color={err ? colors.red : colors.secondary_text} style={{ marginTop: '8px' }}>
											{t('CustomProduct.Modal.LimitCopy', {
												min: curr?.min_selection_quantity ?? 0,
												max:
													curr?.max_selection_quantity > curr?.min_selection_quantity ? curr?.max_selection_quantity : MAX_TEXT_VALIDATION,
											})}
										</CustomText>
									)}
								</>
							)}

							{['Swatch', 'Radio Button', 'Chip'].includes(curr?.display_type) && curr?.options.length >= 7 && (
								<>
									<CustomInput
										size='small'
										fullWidth
										inputType='search'
										startIcon={<Icon iconName='IconSearch' color={theme?.palette?.secondary[800]} />}
										onChange={(e) => handle_search(e.target.value, curr?.name)}
										placeholder='Search'
										input_style={{ margin: '1rem 0rem' }}
										allowClear>
										{t('Common.FilterComponents.Search')}
									</CustomInput>
									{search[curr?.name] && <CustomText color='#525252'>Showing {filter_values_length} results</CustomText>}
								</>
							)}

							{filter_values_length > 0 ? (
								<ModifierField
									dType={curr?.type}
									modifier={curr?.display_type}
									values={filter_values}
									data={curr}
									options={custom_val[curr?.id]}
									id={curr?.id}
									handleValues={handle_values}
									handleError={handle_error}
									searchString={search[curr?.name] || ''}
									is_retail_mode={is_retail_mode}
									is_edit={is_edit}
									currency={currency}
									is_error={(curr?.mandatory && err) || err}
								/>
							) : (
								<NoOption image={true} />
							)}

							{curr?.disclaimers && (
								<Alert
									severity='info'
									icon={
										<Icon
											sx={{ mr: -1, opacity: 0.8, color: theme?.product?.custom_product_drawer?.body?.light_grey }}
											iconName='IconInfoCircle'
										/>
									}
									sx={{
										marginTop: '15px',
										width: '100%',
										height: 'auto',
										display: 'flex',
										alignItems: 'center',
										borderRadius: '0px ',
										color: theme?.product?.custom_product_drawer?.body?.textPrimary,
									}}>
									<CustomText type='Body' style={{ whiteSpace: 'pre-line' }}>
										{curr?.disclaimers}
									</CustomText>
								</Alert>
							)}
						</Box>
						{ind !== data?.length - 1 && <div style={dividerStyle}></div>}
					</React.Fragment>
				);
			})}
		</Grid>
	);
};
export default CustomProductBody;
