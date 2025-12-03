import { Divider } from '@mui/material';
// import _ from 'lodash';
import { useEffect, useState, useContext } from 'react';
import { Button, Drawer, Grid, Icon, MultiSelect } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import MovableList from '../Common/Drawer/MovableList';
import SettingsContext from '../../context';

interface Props {
	open: boolean;
	set_open: (state: boolean) => void;
	on_expand: any;
	before_expand: any;
}

const container_style = { background: '#F7F8FA', borderRadius: '12px' };

const ExpandableConfigDrawer = ({ open, set_open, on_expand, before_expand }: Props) => {
	const { configure, update_configuration } = useContext(SettingsContext);
	const [selected_values, set_selected_values] = useState<any>({ on_expand: [], before_expand: [] });

	const all_attributes = configure?.document_ssrm_settings || [];
	const on_expand_selected = configure?.document_ssrm_expandable_config?.on_expand || [];
	const before_expand_selected = configure?.document_ssrm_expandable_config?.before_expand || [];

	const transform_options = (all_attributes || []).map((item: any) => ({
		label: item?.name || '',
		value: item?.key || '',
		fullItem: item,
	}));

	useEffect(() => {
		set_selected_values({
			on_expand: on_expand_selected,
			before_expand: before_expand_selected,
		});
	}, [on_expand_selected, before_expand_selected]);

	const handle_change = (entity: string, value: string[]) => {
		if (entity === 'before_expand' && value?.length > 2) {
			return;
		}

		const selected_items = transform_options
			.filter((opt) => value.includes(opt.value))
			.map((opt) => {
				return { ...opt.fullItem, visible: true };
			});
		set_selected_values({ ...selected_values, [entity]: selected_items });
	};

	const handle_drop = (entity: string, list?: any) => {
		const transformed_list = list?.map((item: any) => item?.option_key);
		const selected_items = transformed_list.map((key: string) => {
			const item = transform_options.find((opt: any) => opt.value === key);
			return { ...item.fullItem, visible: true };
		});
		set_selected_values({ ...selected_values, [entity]: selected_items });
	};

	const save_configuration = () => {
		const updated_data = {
			on_expand: selected_values.on_expand,
			before_expand: selected_values.before_expand,
		};
		update_configuration('document_ssrm_expandable_config', updated_data);
		set_open(false);
	};

	const content = (
		<Grid height='100vh' sx={{ background: 'white' }} p={2}>
			{/* Header */}
			<Grid container>
				<Grid>
					<CustomText type='H6'>Customize info on sales cards</CustomText>
				</Grid>
				<Grid ml='auto'>
					<Icon iconName='IconX' onClick={() => set_open(false)} />
				</Grid>
			</Grid>
			<Divider className='drawer-divider' sx={{ my: 2 }} />

			<Grid height='80vh' sx={{ overflowY: 'auto' }}>
				{/* Expandable State */}
				<Grid>
					<CustomText type='Subtitle'>Attributes included in expandable state</CustomText>
					<CustomText type='Body'>
						Select attributes to keep in expandable state of the order and quote listing cards in mobile & tablet view
					</CustomText>
					<Grid mt={2} p={2} sx={container_style}>
						<Grid>
							<MultiSelect
								label='Select Attributes'
								options={transform_options.map((opt: any) => ({
									label: opt.label,
									value: opt.value,
								}))}
								handleChange={(value: any) => handle_change('on_expand', value)}
								value={selected_values.on_expand.map((item: any) => item?.key)}
								defaultValue={on_expand}
								complex
								checkmarks
							/>

							<Grid mt={2}>
								<MovableList
									list={selected_values?.on_expand.map((selectedItem: any) => {
										const option = transform_options.find((opt: any) => opt?.value === selectedItem?.key);

										return {
											is_visible: option?.fullItem?.visible,
											is_default: false,
											option_key: option?.value,
											node: (
												<Grid my={1}>
													<CustomText type='Body' color='rgba(103, 109, 119, 1)'>
														{option?.label || option?.key}
													</CustomText>
												</Grid>
											),
											label: option?.label,
											deleteable: false,
											dragable: true,
											key: option?.value,
										};
									})}
									onDrop={(value: any) => handle_drop('on_expand', value)}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>

				{/* Before Expand */}
				<Grid mt={3}>
					<CustomText type='Subtitle'>Attributes displayed upfront on card</CustomText>
					<CustomText type='Body'>
						Select upto 2 attributes to show upfront on the order and quote listing cards in mobile & tablet view
					</CustomText>
					<Grid mt={2} p={2} sx={container_style}>
						<MultiSelect
							label='Select Attributes'
							options={transform_options.map((opt: any) => ({
								label: opt.label,
								value: opt.value,
								disabled:
									selected_values.before_expand.length >= 2 && !selected_values.before_expand.some((item: any) => item.key === opt.value),
							}))}
							handleChange={(value: any) => handle_change('before_expand', value)}
							value={selected_values.before_expand.map((item: any) => item.key)}
							defaultValue={before_expand}
							max_selection={2}
							complex
							checkmarks
						/>
						<Grid pt={2}>
							<MovableList
								list={selected_values?.before_expand.map((selectedItem: any) => {
									const option = transform_options.find((opt: any) => opt?.value === selectedItem?.key);

									return {
										is_visible: option?.fullItem?.visible,
										is_default: false,
										option_key: option?.value,
										node: (
											<Grid my={1}>
												<CustomText type='Body' color='rgba(103, 109, 119, 1)'>
													{option?.label || option?.key}
												</CustomText>
											</Grid>
										),
										label: option?.label,
										deleteable: false,
										dragable: true,
										key: option?.value,
									};
								})}
								onDrop={(value: any) => handle_drop('before_expand', value)}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid position='fixed' bottom={10} left={0} right={10}>
				<Divider className='drawer-divider' sx={{ my: 2 }} />
				<Grid container justifyContent='flex-end'>
					<Button onClick={save_configuration}>Save</Button>
				</Grid>
			</Grid>
		</Grid>
	);

	return <Drawer width={450} open={open} onClose={() => set_open(false)} content={content} />;
};

export default ExpandableConfigDrawer;
