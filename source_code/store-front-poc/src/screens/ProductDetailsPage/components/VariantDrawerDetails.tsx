import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Drawer, Grid, Icon, Image } from 'src/common/@the-source/atoms';
import ProductDetailsContext from '../context';
import { PLACE_HOLDER_IMAGE } from '../constants';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../styles';

interface Props {
	data: any;
}

const image_style = {
	width: '6rem',
	height: '6rem',
	borderRadius: 8,
};

const active_style: any = {
	border: '1px solid black',
	boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.08)',
};

const disable_style: any = {
	border: '1px solid rgba(0, 0, 0, 0.4)',
	opacity: 0.5,
	pointerEvents: 'none',
};

const VariantDrawerDetails: React.FC<Props> = ({ data }) => {
	const [active, set_active] = useState('');
	const [variants, set_variants] = useState([]);
	const { set_variant_drawer, variant_drawer, handle_nagivate_to_variants, handle_render_variant } = useContext(ProductDetailsContext);
	const { t } = useTranslation();
	const classes = useStyles();

	const handle_close = () => {
		set_variant_drawer({ state: false, type: variant_drawer?.type });
	};

	const handleApply = () => {
		const selected_hinges: any = { id: variant_drawer?.attribute_type, value: active };
		handle_nagivate_to_variants(variant_drawer?.key, variant_drawer?.hinge_id, selected_hinges);
		handle_close();
	};

	const handle_render_header = () => {
		return (
			<Box className={classes.drawer_header_container}>
				<CustomText style={{ textTransform: 'capitalize' }} type='H2'>
					{variant_drawer?.type || ''}
				</CustomText>
				<Icon iconName='IconX' onClick={handle_close} className={classes.icon_style} />
			</Box>
		);
	};

	const handle_render_footer = () => {
		return (
			<Box className={classes.drawer_footer_container}>
				<Grid container justifyContent={'flex-end'} gap={1}>
					<Button variant='outlined' onClick={handle_close}>
						{t('PDP.Common.Cancel')}
					</Button>
					<Button variant='contained' onClick={handleApply} type='submit'>
						{t('PDP.Common.Apply')}
					</Button>
				</Grid>
			</Box>
		);
	};

	const handle_transform_data = (props_data: any) => {
		let transform_data_format = props_data[variant_drawer?.attribute_type]?.map((ele: any, index: number) => ({ ...ele, id: index + 1 }));
		set_variants(transform_data_format);
	};

	useEffect(() => {
		if (variant_drawer?.state) {
			handle_transform_data(data);
			set_active(variant_drawer?.active_hinge);
		}
	}, [variant_drawer?.state]);

	const handleRenderStyle = (val: any) => {
		let obj = {
			value: val,
		};
		if (val === active) {
			return active_style;
		} else if (!handle_render_variant(variant_drawer?.key, variant_drawer?.hinge_id, obj)) {
			return disable_style;
		} else {
			return {};
		}
	};

	const handleRendeVariantContent = () => {
		return (
			<Grid className={classes.drawer_variant_container}>
				{variants?.map((ele: any) => (
					<Box
						key={ele?.id}
						onClick={() => set_active(ele.value)}
						sx={handleRenderStyle(ele?.value)}
						className={classes.drawer_variant_container_item}>
						{variant_drawer?.type === 'color' && (
							<Image fallbackSrc={PLACE_HOLDER_IMAGE} src={ele?.type_value} alt='image' style={image_style} />
						)}
						<CustomText style={{ textOverflow: 'ellipsis', alignItems: 'center' }} type='Subtitle'>
							{ele?.value}
						</CustomText>
					</Box>
				))}
			</Grid>
		);
	};

	return (
		<Drawer
			open={variant_drawer?.state}
			content={
				<React.Fragment>
					{handle_render_header()}
					<Box className={classes.drawer_content_container}>{handleRendeVariantContent()}</Box>
					{handle_render_footer()}
				</React.Fragment>
			}
			onClose={() => {}}
		/>
	);
};

export default VariantDrawerDetails;
