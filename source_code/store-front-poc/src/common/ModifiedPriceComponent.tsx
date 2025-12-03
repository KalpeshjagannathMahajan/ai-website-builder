import { useTranslation } from 'react-i18next';
import { get_formatted_price_with_currency } from 'src/utils/common';
import { Box } from './@the-source/atoms';
import CustomText from './@the-source/CustomText';
import { colors } from 'src/utils/theme';

interface ModifiedPriceComponentProps {
	modified_price: number;
	currency_symbol: string;
	unit_price: number;
	justify_content?: string;
	base_price?: number;
	single_item_price?: boolean;
	alignItems?: string;
}

const ModifiedPriceComponent: React.FC<ModifiedPriceComponentProps> = ({
	base_price,
	modified_price,
	currency_symbol,
	unit_price,
	justify_content = 'flex-start',
	single_item_price = false,
	alignItems = 'flex-start',
}) => {
	const { t } = useTranslation();

	return (
		<Box display='flex' flexDirection='column' alignItems={alignItems}>
			<Box display='flex' gap={1} justifyContent={justify_content} alignItems='center'>
				<CustomText type='Subtitle'>
					{t('CartSummary.ProductCard.Price', {
						price: get_formatted_price_with_currency(currency_symbol, modified_price),
					})}
				</CustomText>
				{single_item_price && modified_price !== unit_price && (
					<CustomText type='CaptionBold' style={{ textDecoration: 'line-through' }} color={colors.black_40}>
						{t('CartSummary.ProductCard.Price', {
							price: get_formatted_price_with_currency(currency_symbol, base_price || unit_price),
						})}
					</CustomText>
				)}
			</Box>
			{/* {single_item_price && (
				<Box display='flex' gap={0.5} marginTop={0.5}>
					<CustomText type='Body2' color='rgba(0, 0, 0, 0.64)'>
						{t('CartSummary.ProductCard.OfferedPrice')}
					</CustomText>
					<CustomText type='Subtitle'>{get_formatted_price_with_currency(currency_symbol, modified_price)}</CustomText>
				</Box>
			)} */}
		</Box>
	);
};

export default ModifiedPriceComponent;
