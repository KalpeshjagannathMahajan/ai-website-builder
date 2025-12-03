import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@mui/styles';
import _ from 'lodash';
import { Checkbox, Grid, Image } from '../../atoms';
import get_product_image from 'src/utils/ImageConstants';
import { colors } from 'src/utils/theme';
import CustomText from '../../CustomText';
import { secondary, text_colors } from 'src/utils/light.theme';
import utils from 'src/utils/utils';
// import { get_formatted_price_with_currency } from 'src/utils/common';
import PriceView from '../../PriceView';

interface Props {
	key: any;
	product: any;
	attribute_template: any;
	selected_skus: any;
	set_selected_skus: any;
	discount_campaigns: any;
}

const useStyle = makeStyles(() => ({
	container: {
		display: 'flex',
		alignItems: 'center',
		padding: '0.5rem 0rem',
		borderRadius: '8px',
		marginBottom: '1rem',
	},
	attr_container: {
		display: 'flex',
		flexDirection: 'row',
	},

	attr_value: {
		maxWidth: '13.5rem',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	ellipsis: {
		marginTop: '-.4rem',
		marginLeft: '.3rem',
		color: text_colors.primary,
	},
	attribute: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: colors.grey_600,
		marginRight: '0.4rem',
		marginTop: '0.4rem',
		borderRadius: '0.4rem',
		padding: '0.5rem 0.6rem',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
	},
	text_container: {
		display: 'flex',
		flexDirection: 'column',
		gap: '0.2rem',
		marginLeft: '1rem',
	},
}));

const DetailCard = ({ key, product, attribute_template, selected_skus, set_selected_skus, discount_campaigns }: Props) => {
	const styles = useStyle();
	const [show_ellipsis, set_show_ellipsis] = useState(false);
	const price = _.get(product?.pricing, 'price', 0);
	const variant_template = _.cloneDeep(attribute_template);
	const variant_refs: any = useRef({})?.current;
	const is_selected = selected_skus.includes(product?.id);
	const assignRef = (node: any, product_id: any) => {
		if (node) {
			variant_refs[product_id] = node;
		}
	};
	const check_overflow = (product_id: string) => {
		const ref = variant_refs?.[product_id];
		if (ref) {
			const is_overflowing = ref?.offsetWidth > 537;
			set_show_ellipsis(is_overflowing);
		}
	};

	const handle_change_checkbox = () => {
		if (_.includes(selected_skus, product?.id)) {
			set_selected_skus((prev: any) => _.filter(prev, (item: any) => item !== product?.id));
		} else {
			set_selected_skus((prev: any) => [...prev, product?.id]);
		}
	};

	useEffect(() => {
		check_overflow(product?.id);
	}, [product?.id, key]);

	return (
		<Grid
			key={product?.id}
			className={styles.container}
			sx={{
				border: is_selected ? `1px solid ${text_colors?.black}` : `1px solid ${text_colors?.tertiary}`,
			}}>
			<Checkbox checked={is_selected} onChange={handle_change_checkbox} />
			<Image
				src={get_product_image(product, 'VARIANT_DRAWER')}
				width={75}
				height={75}
				style={{ border: `1px solid ${text_colors?.tertiary}`, borderRadius: '8px' }}
			/>
			<Grid className={styles.text_container}>
				<CustomText type='Subtitle'>{product?.name}</CustomText>
				<PriceView
					product={product}
					discount_campaigns={discount_campaigns}
					currency_symbol={product?.pricing?.currency}
					styles={{ fontWeight: 700, fontSize: '14px' }}
					column={{ variant_key: 'pricing::price', type: 'price' }}
					data_values={{ is_variant: true }}
				/>
				{/* <CustomText type='CaptionBold'>{get_formatted_price_with_currency(product?.pricing?.currency, price)}</CustomText> */}
				<CustomText type='Caption' color={text_colors?.primary}>
					{product?.sku_id}
				</CustomText>
				<Grid sx={{ display: 'flex', flexDirection: 'row' }}>
					{_.map(variant_template, (row: any, _index: number) => (
						<React.Fragment key={`attribute_row_${_index}`}>
							<div className={styles.attr_container} ref={(el) => assignRef(el, product?.id)}>
								{row?.attributes?.keys?.map((attr_key: any) => {
									const value = utils.get_column_display_value(attr_key, product, price, { is_variant: true });
									if (!value) {
										return <></>;
									}
									return (
										<div key={attr_key} className={styles.attribute}>
											<CustomText type='Caption' color={secondary[700]} className={styles.attr_value}>
												{value}
											</CustomText>
										</div>
									);
								})}
							</div>

							{show_ellipsis && (
								<div>
									<p className={styles.ellipsis}>{'...'}</p>
								</div>
							)}
						</React.Fragment>
					))}
				</Grid>
			</Grid>
		</Grid>
	);
};

export default DetailCard;
