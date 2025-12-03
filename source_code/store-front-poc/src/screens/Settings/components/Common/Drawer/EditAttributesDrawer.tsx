import { Divider } from '@mui/material';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import AttributesComp from './AttributesComp';
import settings from 'src/utils/api_requests/setting';
import { useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import SettingsContext from 'src/screens/Settings/context';
import _ from 'lodash';
import { transform_rails_for_app } from 'src/screens/Settings/utils/utils';

interface Props {
	is_visible: boolean;
	close: () => void;
	type: string;
	prefilled_attributes: string[];
	set_refetch?: (data: any) => void;
	all_attributes: any;
	data?: any;
}

const EditAttributesDrawer = ({ is_visible, close, type, prefilled_attributes, set_refetch, all_attributes, data }: Props) => {
	const [attributes, set_attributes] = useState<string[]>(prefilled_attributes);
	const { configure, update_configuration } = useContext(SettingsContext);
	const methods = useForm({
		defaultValues: {},
	});
	const { control, getValues, setValue, handleSubmit } = methods;

	const handle_save = (props: any) => {
		if (type === 'sections') {
			let updated_sections: any = configure?.pdp_page_config_web?.sections || [];
			if (data) {
				updated_sections = _.map(updated_sections, (section: any) => {
					if (section?.key === data?.key) {
						return {
							...data,
							name: props?.name,
							attributes: _.map(attributes, (attr: string, index: number) => ({ attribute_id: attr, priority: index })),
						};
					} else {
						return section;
					}
				});
			} else {
				updated_sections.push({
					name: props?.name,
					key: _.toLower(props?.name)?.replace(/ /g, '_'),
					attributes: _.map(attributes, (attr: string, index: number) => ({ attribute_id: attr, priority: index })),
					type: 'collapsible',
					priority: updated_sections?.length,
				});
			}
			update_configuration('pdp_page_config_web', { ...configure?.pdp_page_config_web, sections: updated_sections });
			let pdp_page_config = transform_rails_for_app({ ...configure?.pdp_page_config_web, sections: updated_sections });
			update_configuration('pdp_page_config', pdp_page_config);
			close();
		} else {
			settings
				.update_attributes({ type, attrs_to_show: attributes })
				.then((res: any) => {
					console.log(res);
				})
				.catch((err: any) => {
					console.error(err);
				})
				.finally(() => {
					if (set_refetch) {
						set_refetch((prev: any) => ({ state: !prev.state, key: `${type}-attributes`, id: type, type: 'attributes' }));
					}
					close();
				});
		}
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{type === 'sections' ? data?.name || 'Add new section' : 'Attributes'}</CustomText>
				<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer' justifyContent='flex-end'>
				<Button variant='outlined' onClick={close}>
					Cancel
				</Button>
				<Button onClick={handleSubmit(handle_save)}>Save</Button>
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				{type === 'sections' && (
					<FormProvider {...methods}>
						<FormBuilder
							placeholder='Section name'
							label='Section name'
							name='name'
							validations={{ required: true }}
							defaultValue={data?.name}
							type='text'
							control={control}
							register={methods.register}
							getValues={getValues}
							setValue={setValue}
						/>
					</FormProvider>
				)}
				<AttributesComp attributes={attributes} set_attributes={set_attributes} attributes_list={all_attributes} />
			</Grid>
		);
	};

	const handle_render_drawer = () => {
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

	return <Drawer width={480} open={is_visible} onClose={close} content={handle_render_drawer()} />;
};

export default EditAttributesDrawer;
