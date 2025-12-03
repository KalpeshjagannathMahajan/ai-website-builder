import _ from 'lodash';
import { Grid } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { get_formatted_price_with_currency } from 'src/utils/common';
import useStyles from '../../styles';

interface tableConfig {
	key: string;
	label_table: string;
	label_consolidate: string;
	styles_table: any;
	styles_consolidated: any;
}

interface Props {
	table_config: tableConfig[];
	cart_total_breakdown: any;
	currency: string;
}

function ConsolidatedCard({ table_config, cart_total_breakdown, currency }: Props) {
	const classes = useStyles();
	if (!_.size(table_config)) return;

	return (
		<Grid className={classes.consolidated_container}>
			{_.map(table_config, (curr, ind) => {
				const is_last = _.size(table_config) - 1 === ind;
				const value = cart_total_breakdown?.[curr?.key]?.total;
				return (
					<Grid container justifyContent='space-between' p={'6px'} mb={is_last ? 0 : 1}>
						<Grid item xs={8}>
							<CustomText type='Body' style={curr?.styles_consolidated}>
								{curr?.label_consolidate}
							</CustomText>
						</Grid>
						<Grid item xs={4} sx={{ textAlign: 'right' }}>
							<CustomText type='Body' style={curr?.styles_consolidated}>
								{value > 0 ? get_formatted_price_with_currency(currency, value) : '--'}
							</CustomText>
						</Grid>
					</Grid>
				);
			})}
		</Grid>
	);
}

export default ConsolidatedCard;
