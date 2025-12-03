import { Grid, ImageCarousel, Box } from 'src/common/@the-source/atoms';
import ProductDetailsContext from '../../context';
import { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import { default_image_data } from '../../constants';
import useStyles from '../../styles';
import { useMediaQuery } from '@mui/material';
import theme from 'src/utils/theme';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import { useSelector } from 'react-redux';
import useTenantSettings from 'src/hooks/useTenantSettings';
import constants from 'src/utils/constants';
import WishlistSelectionModal from 'src/screens/Wishlist/Modals/WishlistSelectionModal';

const ProductImageContainer = () => {
	const { product_details } = useContext(ProductDetailsContext);
	const { id, sku_id } = product_details;
	const [image_data, set_image_data] = useState([]);
	const classes = useStyles();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const catalog_mode = useSelector((state: any) => state?.catalog_mode?.catalog_mode);
	const wizshop_image_preview: any = JSON.parse(localStorage.getItem('wizshop_settings') || '{}')?.image_preview;
	const { enable_wishlist } = useTenantSettings({
		[constants.TENANT_SETTINGS_KEYS.WISHLIST_ENABLED]: false,
	});

	const handle_transform_image_data = (_data: any) => {
		if (_.isEmpty(_data) || _data.length === 0) {
			set_image_data(default_image_data);
			return;
		}

		let transformed_data = _data.map((item: any) => {
			return {
				id: item?.id,
				src: item?.url,
				image_name: `${sku_id}-${item?.id}`,
				width: is_small_screen ? 300 : 600,
				height: is_small_screen ? 350 : window.innerHeight * 0.8,
			};
		});
		set_image_data(transformed_data);
	};

	useEffect(() => {
		if (product_details?.media) {
			handle_transform_image_data(product_details?.media);
		}
	}, [id]);

	return (
		<Grid item xl={6} lg={6} md={6} sm={12} className={classes.image_container}>
			<div id={is_ultron ? 'ultron' : 'store_front'} style={{ position: 'sticky', top: is_ultron ? '80px' : '0' }}>
				{!catalog_mode && enable_wishlist && !product_details?.is_customizable && (
					<Box
						sx={{
							position: 'absolute',
							right: '8px',
							top: is_ultron ? '8px' : wizshop_image_preview ? '40px' : '8px',
							zIndex: 9999,
						}}>
						<WishlistSelectionModal product={product_details} />
					</Box>
				)}
				<ImageCarousel imageWidth={'100%'} magnifierBoxDimension={400} images={image_data} width={'100%'} />
			</div>
		</Grid>
	);
};

export default ProductImageContainer;
