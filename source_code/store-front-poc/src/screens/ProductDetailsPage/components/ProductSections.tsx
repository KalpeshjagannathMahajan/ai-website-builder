import _ from 'lodash';
import React, { useState } from 'react';
import { SECTION_TYPE } from '../constants';
import { Accordion, Box, Button, Grid } from 'src/common/@the-source/atoms';
import DOMPurify from 'dompurify';
import ShowMoreText from './ShowMoreText';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../styles';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

interface Props {
	data: any;
	custom_attributes: any[];
	section_type: string;
	category: any;
	collections: any;
}

const ProductSections: React.FC<Props> = ({ category, collections, data, custom_attributes, section_type }) => {
	const [expanded, set_expanded] = useState<string[]>([]);
	const classes = useStyles();

	const handle_render_sections = (props_data: any[], props_custom_attributes: any[]) => {
		const sorted_sections = _.sortBy(_.get(props_data, 'sections', []), (attribute: any) => attribute.priority);
		const filter_sections = sorted_sections?.filter((ele: any) => ele?.type?.replace(' ', '') === section_type);
		const handle_entity = (entity_type: string) => {
			let type = entity_type === 'category' ? category : collections;
			if (!type || type?.length === 0) return null;
			return (
				<React.Fragment key={entity_type}>
					<Box className={classes.header_container} gap={10}>
						<CustomText type='Body' style={{ mb: 1, textTransform: 'capitalize' }} className={classes.terinary_color}>
							{entity_type}
						</CustomText>
						<Grid display={'flex'} flexWrap={'wrap'} gap={1} justifyContent={'flex-end'}>
							{_.map(type, (item, index) => {
								return (
									<CustomText type='Body' className={classes.dark_grey}>
										{item.name}
										{Number(index) !== type?.length - 1 && ','}
									</CustomText>
								);
							})}
						</Grid>
					</Box>
				</React.Fragment>
			);
		};

		const handle_render_content: any = (attributes: any, key: any) => {
			const content = _.map(attributes, (attribute) => {
				if (attribute?.entity_type) return handle_entity(attribute.entity_type);

				const details = _.find(props_custom_attributes, { id: attribute.attribute_id });
				const details_value = details?.value || details?.composite?.url;

				if (!details?.value && !details?.composite?.url) {
					return null;
				}

				let type = details?.type?.trim();

				const handle_attributes = () => {
					switch (type) {
						case 'html':
							return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(details?.value) }} className='html-div' />;
						case 'url':
							return (
								<CustomText onClick={() => window.open(details_value, '_blank')} className={classes.custom_btn}>
									{details?.composite?.label}
								</CustomText>
							);
						default:
							return (
								<CustomText type='Body' className={classes.dark_grey}>
									<span className={classes.secondary_color}>{details?.value}</span>
								</CustomText>
							);
					}
				};

				return (
					<React.Fragment key={details?.name}>
						<Grid container flexWrap={'nowrap'} mb={1} gap={1}>
							<Grid item xs={4} sm={4} md={12} lg={4} xl={4} sx={{ wordBreak: 'break-word' }}>
								<CustomText type='Body' style={{ mb: 2, textTransform: 'capitalize' }} className={classes.terinary_color}>
									<span className={classes.composite_label}>{details?.name}</span>
								</CustomText>
							</Grid>
							<Grid item xs={8} sm={8} md={12} lg={8} xl={8} className={classes.accordion_attributes}>
								{handle_attributes()}
							</Grid>
						</Grid>
					</React.Fragment>
				);
			});

			// If none of the content items are valid (all are null), return null.
			if (_.every(content, _.isNull)) {
				return null;
			}

			return <React.Fragment key={key}>{content}</React.Fragment>;
		};

		const handle_change = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
			set_expanded(newExpanded ? [...expanded, panel] : _.remove(expanded, (_panel) => _panel !== panel));
		};

		const handle_render_attributes = (details: any) => {
			let type = details?.type?.trim();
			switch (type) {
				case 'textarea':
					return <ShowMoreText details={details} />;
				case 'html':
					return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(details?.value) }} className='html-div' />;
				case 'url':
					return (
						<Button variant='text' onClick={() => window.open(details?.value, '_blank')} sx={{ padding: '0' }}>
							{details?.value}
						</Button>
					);
				default:
					return <span className={classes.medium_grey}>{details?.value}</span>;
			}
		};

		return (
			<React.Fragment>
				{_.map(filter_sections, (section: any) => {
					const { type = '', name: section_name = '', key = '', attributes = [] } = section;
					const sorted_attributes = _.sortBy(attributes, (attribute) => attribute.priority);
					switch (type) {
						case SECTION_TYPE.open_section: {
							return (
								<React.Fragment key={key}>
									{_.map(sorted_attributes, (attribute) => {
										if (attribute?.entity_type) return handle_entity(attribute.entity_type);
										const details = _.find(custom_attributes, { id: attribute.attribute_id });
										if (_.isEmpty(details?.value)) {
											return null;
										}
										return (
											<Box my={2} key={details?.name}>
												<CustomText type='Body' className={classes.light_color} style={{ textTransform: 'capitalize', mb: 1.2 }}>
													<span className={classes.medium_grey}>{details?.name}</span>
												</CustomText>
												<div className={classes.light_color} style={{ lineHeight: '20px' }}>
													<span className={classes.medium_grey}>{handle_render_attributes(details)}</span>
												</div>
											</Box>
										);
									})}
								</React.Fragment>
							);
						}
						case SECTION_TYPE.collapsible: {
							const expandedContent = handle_render_content(attributes, key);
							if (expandedContent) {
								return (
									<React.Fragment key={key}>
										<Accordion
											expanded={expanded}
											id={key}
											containerStyle={{
												padding: '0px 10px',
											}}
											on_change={handle_change}
											titleStyle={{ padding: is_ultron ? '0' : '16px 0' }}
											content={[
												{
													expandedContent,
													title: (
														<CustomText type='Body' className={classes.section_title}>
															{section_name?.toUpperCase()}
														</CustomText>
													),
												},
											]}
											contentBackground='white'
										/>
										<hr style={{ margin: '0px' }}></hr>
									</React.Fragment>
								);
							}
						}
					}
				})}
			</React.Fragment>
		);
	};

	return <React.Fragment>{handle_render_sections(data, custom_attributes)}</React.Fragment>;
};

export default ProductSections;
