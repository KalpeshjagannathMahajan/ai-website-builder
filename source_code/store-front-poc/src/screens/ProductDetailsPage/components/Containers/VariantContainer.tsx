import React, { useContext } from 'react';
import ProductDetailsContext from '../../context';
import VariantHinge from '../VariantHinge';
import VariantDrawerDetails from '../VariantDrawerDetails';
import { PRODUCT_DETAILS_TYPE } from '../../constants';
import _ from 'lodash';

const VariantContainer = () => {
	const { product_details } = useContext(ProductDetailsContext);
	const { type = '', variants_meta, id } = product_details;
	const { variant_data_map = [], hinge_attributes = [] } = variants_meta;
	const sorted_hinge_attributes = _.sortBy(hinge_attributes, (attribute) => attribute?.priority);

	return (
		<React.Fragment>
			{_.isArray(sorted_hinge_attributes) &&
				_?.map(sorted_hinge_attributes, (attribute, key) => {
					const variant_data = _.get(variants_meta, `hinges_value_map[${attribute?.id}]`);
					const to_show =
						type === PRODUCT_DETAILS_TYPE.product
							? variant_data?.[0]?.value
							: _.find(variant_data_map, { product_id: id })?.[attribute?.id];
					return (
						<VariantHinge
							hinge_id={attribute?.id}
							key={key}
							selected_variant={to_show}
							data={variant_data}
							type={attribute?.name}
							info={attribute}
							index={key}
						/>
					);
				})}
			<VariantDrawerDetails data={variants_meta?.hinges_value_map} />
		</React.Fragment>
	);
};

export default VariantContainer;
