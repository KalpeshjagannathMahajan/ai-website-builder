import _ from 'lodash';
import React from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Chip, Icon } from 'src/common/@the-source/atoms';

import styles from 'src/common/@the-source/molecules/Table/TableComponent/Cell.module.css';
import MenuHover from 'src/common/MenuHover';
import utils from 'src/utils/utils';

interface Props {
	value: any;
}

const MenuTags: React.FC<Props> = ({ value, ...rest }) => {
	const { node, valueFormatted }: any = rest;

	const safelyParseJson = (jsonString: any) => {
		return _.attempt(() => JSON.parse(jsonString.replace(/'/g, '"')));
	};

	const result = node?.data?.insights ? safelyParseJson(node?.data?.insights) : [];
	const { textColor, bgColor } = utils.get_chip_color_by_tag(String(valueFormatted?.toLowerCase()));

	const chip_style = {
		marginRight: 1,
		fontSize: 12,
		border: '2px solid white',
		textTransform: 'capitalize',
	};

	return (
		<div className={styles.agGridCustomCell} style={{ minWidth: '80px' }}>
			<MenuHover
				styles={{ minWidth: '80px' }}
				direction={'right'}
				LabelComponent={
					<div style={{ cursor: 'pointer', fontWeight: 400, fontSize: '14px' }}>
						{valueFormatted ? <Chip textColor={textColor} bgColor={bgColor} label={valueFormatted} sx={{ ...chip_style }} /> : '--'}
					</div>
				}
				commonMenuComponent={(_item: any) => {
					const index = _.findIndex(result, (item: any) => item === _item);
					return (
						<div style={{ background: utils.get_color(index % 3), borderRadius: '4px' }}>
							<CustomText
								type='Body'
								style={{ padding: '4px 8px', display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
								<Icon iconName='IconBulb' />
								{_item}
							</CustomText>
						</div>
					);
				}}
				child_style={{ padding: 0, marginBottom: '4px' }}
				menu={result ?? []}
			/>
		</div>
	);
};

export default MenuTags;
