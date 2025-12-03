import React, { useContext } from 'react';
import { Box, Chip, Grid, Image } from 'src/common/@the-source/atoms';
import { HINGE_TYPE, PLACE_HOLDER_IMAGE } from '../constants';
import ProductDetailsContext from '../context';
import _ from 'lodash';
import { transform_image_url } from 'src/utils/ImageConstants';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../styles';
import { useTheme } from '@mui/material/styles';

interface Props {
	data: any[];
	type: string;
	hinge_id: any;
	info: any;
	index: number;
	selected_variant: any;
}

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const VariantHinge: React.FC<Props> = ({ data, type, hinge_id, info, index, selected_variant }) => {
	const { handle_nagivate_to_variants, handle_render_variant } = useContext(ProductDetailsContext);
	// const [show_view_all_button, set_show_view_all_button] = useState(false);
	const theme: any = useTheme();

	const name = _.get(info, 'name', '');
	const classes = useStyles();

	const handle_click = (variant: any) => {
		handle_nagivate_to_variants(index, hinge_id, variant);
	};

	const image_style = {
		width: '7.5rem',
		height: '7.5rem',
		marginBottom: 4,
		...theme?.product_details?.product_info_container?.image_style,
	};

	const base_image_style = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	};

	const active_image_style = {
		...theme?.product_details?.product_info_container?.active_image_style,
		...base_image_style,
	};

	const common_chip_style = {
		fontSize: '14px',
		marginRight: '1rem',
		maxWidth: '40rem',
		margin: '0.5rem 0rem',
		fontWeight: 400,
	};

	const active_chip_style = {
		...common_chip_style,
		...theme?.product_details?.product_info_container?.active_chip_style,
	};

	const in_active_chip_style = {
		...common_chip_style,
		...theme?.product_details?.product_info_container?.in_active_chip_style,
	};

	const disabled_style = {
		display: 'none',
		pointerEvents: 'none',
		width: '10rem',
		margin: '0.5rem 0rem',
		...theme?.product_details?.product_info_container?.disabled_style,
	};

	// useLayoutEffect(() => {
	// 	const container = document.getElementById(`varaint-container${type}`);
	// 	if (container) {
	// 		const is_over_flowing = container.scrollWidth > container.clientWidth;
	// 		// set_show_view_all_button(is_over_flowing);
	// 	}
	// }, [data]);

	if (_.isEmpty(data)) {
		return null;
	}

	const get_image_style = (variant: any, value: any) => {
		if (variant === value) {
			return { ...image_style, boxShadow: '0px 4px 22px 0px rgba(0, 0, 0, 0.12)' };
		}
		return image_style;
	};

	const handle_image_style = (variant: any, value: any, variant_data: any) => {
		if (variant === value) {
			return active_image_style;
		} else if (!handle_render_variant(index, hinge_id, variant_data)) {
			return disabled_style;
		} else {
			return base_image_style;
		}
	};

	const handle_chip_style = (variant: any, value: any, variant_data: any) => {
		if (variant === value) {
			return active_chip_style;
		} else if (!handle_render_variant(index, hinge_id, variant_data)) {
			return disabled_style;
		} else {
			return in_active_chip_style;
		}
	};

	const handle_variant = (props_data: any, props_type: string, props_label: string, props_src: any) => {
		switch (props_type) {
			case HINGE_TYPE.image_label:
				return (
					<Box
						textAlign={'center'}
						className={classes.variant_color_item}
						onClick={() => handle_click(props_data)}
						style={handle_image_style(selected_variant, props_label, props_data)}>
						<Image
							fallbackSrc={PLACE_HOLDER_IMAGE}
							src={transform_image_url(props_src, 'VARIANT_HINGE')}
							alt='image'
							style={get_image_style(selected_variant, props_label)}
						/>
						<CustomText className={classes.variant_color_item_text} style={{ textOverflow: 'ellipsis', alignItems: 'center' }}>
							{props_label}
						</CustomText>
					</Box>
				);
			case HINGE_TYPE.chip:
				return (
					<Chip
						variant='outline'
						textColor={null}
						bgColor={null}
						onClick={() => handle_click(props_data)}
						label={props_label}
						sx={handle_chip_style(selected_variant, props_label, props_data)}
					/>
				);
		}
	};

	// const handle_drawer = (props_hinge_id: any, props_type: any) => {
	// 	set_variant_drawer({
	// 		state: true,
	// 		attribute_type: props_hinge_id,
	// 		hinge_id: props_hinge_id,
	// 		type: props_type,
	// 		key: index,
	// 		active_hinge: selected_variant,
	// 	});
	// };
	return (
		<React.Fragment>
			{selected_variant && (
				<Grid className={classes.variant_hinge_container}>
					<Grid item md={12} sm={12} className={classes.header_container}>
						<CustomText type='H6' style={{ margin: '1rem 0' }}>
							{is_ultron ? (
								<React.Fragment>
									<span className={classes.secondary_color} style={{ textTransform: 'capitalize' }}>
										{name} : {''}
									</span>
									{selected_variant}
								</React.Fragment>
							) : (
								<span className={classes.secondary_color} style={{ textTransform: 'capitalize', margin: '20px 0px' }}>
									{name} : {selected_variant}
								</span>
							)}
						</CustomText>
						{/* {show_view_all_button && (
					<Button variant='text' onClick={() => handle_drawer(hinge_id, type)}>
						View all ({data?.length})
					</Button>
				)} */}
					</Grid>
					{data.length > 0 && (
						<Grid className={classes.variant_container} id={`varaint-container${type}`}>
							{_.map(data, (ele) => {
								let value = _.get(ele, 'value');
								// if (show_view_all_button && key >= data.length - 1) {
								// 	return null;
								// } else {
								return <React.Fragment key={value}>{handle_variant(ele, ele?.type, ele?.value, ele.type_value)}</React.Fragment>;
								// }
							})}
						</Grid>
					)}
				</Grid>
			)}
		</React.Fragment>
	);
};

export default VariantHinge;
