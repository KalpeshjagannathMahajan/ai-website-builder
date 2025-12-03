import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Accordion, Grid, Switch } from 'src/common/@the-source/atoms';

import { useContext, useEffect } from 'react';
import SettingsContext from '../../context';
import _ from 'lodash';
import { USER_MENU_ITEMS } from '../../utils/constants';

const SettingConfig = () => {
	const { configure, get_keys_configuration, update_configuration } = useContext(SettingsContext);

	useEffect(() => {
		get_keys_configuration('settings_configuration');
	}, []);

	const handle_section_display = (item: any) => {
		const configuration = configure?.settings_configuration?.config || USER_MENU_ITEMS;
		const updated_config = _.map(configuration, (section: any) => {
			const new_display_val = !section?.is_display;
			if (section?.id === item?.id) {
				if (!new_display_val) {
					const updated_children = _.map(section?.children, (child: any) => {
						return { ...child, is_display: new_display_val };
					});
					return { ...section, is_display: new_display_val, children: updated_children };
				} else return { ...section, is_display: !section?.is_display };
			}
			return section;
		});

		update_configuration('settings_configuration', { config: updated_config });
	};
	const handle_children_display = (id: string, item: any) => {
		const configuration = configure?.settings_configuration?.config || USER_MENU_ITEMS;
		let updated_config = _.map(configuration, (section: any) => {
			if (section?.id === id) {
				return {
					...section,
					children: _.map(section?.children, (child: any) => {
						if (child?.id === item?.id) {
							return { ...child, is_display: !child?.is_display };
						}
						return child;
					}),
				};
			}
			return section;
		});
		updated_config = _.map(updated_config, (section: any) => {
			const is_sub_menu = _.some(section?.children, (child: any) => child?.is_display);
			return { ...section, is_display: section?.is_display && is_sub_menu };
		});

		update_configuration('settings_configuration', { config: updated_config });
	};

	const handle_render_title = (section: any) => {
		return (
			<Grid display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
				<CustomText>{section?.title}</CustomText>
				<Switch checked={section?.is_display} onChange={() => handle_section_display(section)} onClick={(e) => e.stopPropagation()} />
			</Grid>
		);
	};

	const handle_render_content = (section: any) => {
		return (
			<Grid sx={{ maxWidth: '80%' }}>
				{_.map(section?.children, (child: any) => (
					<Grid display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
						<CustomText>{child?.title}</CustomText>
						<Switch
							checked={child?.is_display}
							onChange={() => handle_children_display(section?.id, child)}
							onClick={(e) => e.stopPropagation()}
						/>
					</Grid>
				))}
			</Grid>
		);
	};

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>User Display Settings</CustomText>
			</Grid>
			<Grid my={2}>
				{_.map(configure?.settings_configuration?.config || USER_MENU_ITEMS, (setting: any) => {
					if (!setting?.is_internal) {
						return (
							<Grid>
								<Accordion
									content={[
										{
											title: handle_render_title(setting),
											expandedContent: handle_render_content(setting),
										},
									]}
									style={{ borderBottom: '1px solid #D1D6DD' }}
									contentBackground='#FFF'
									id={`setting_configuration_${setting?.id}`}
								/>
							</Grid>
						);
					}
				})}
			</Grid>
		</Grid>
	);
};

export default SettingConfig;
