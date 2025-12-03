import React from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Chip, Icon } from 'src/common/@the-source/atoms';
import styles from 'src/common/@the-source/molecules/Table/TableComponent/Cell.module.css';
import utils from 'src/utils/utils';

interface Props {
	value: any;
}

const IconChip: React.FC<Props> = ({ value }) => {
	const { textColor, bgColor } = utils.get_chip_color_by_tag(value);
	const icon_style = { width: '16px !important', height: '16px !important', color: textColor };

	const get_icon = () => {
		switch (value) {
			case 'emailed':
				return <Icon iconName='IconMail' sx={icon_style} />;
			case 'called':
				return <Icon iconName='IconPhone' sx={icon_style} />;
			case 'requirement':
				return <Icon iconName='IconChecklist' sx={icon_style} />;
			case 'follow_up':
				return <Icon iconName='IconCalendarEvent' sx={icon_style} />;
			case 'in_person_visit':
				return <Icon iconName='IconUsers' sx={icon_style} />;
		}
	};

	const get_value = () => {
		const value_mapping: any = {
			emailed: 'Email',
			called: 'Called',
			requirement: 'Requirement',
			follow_up: 'Follow Up',
			in_person_visit: 'In Person',
		};

		const display_text = value_mapping[value];
		return display_text ? (
			<CustomText color={textColor} type='Caption'>
				{display_text}
			</CustomText>
		) : null;
	};

	return (
		<div className={styles.agGridCustomCell}>
			{value ? (
				<Chip icon={get_icon()} label={get_value()} sx={{ padding: '4px 10px 5px 10px', height: '28px' }} bgColor={bgColor} />
			) : (
				<CustomText> -- </CustomText>
			)}
		</div>
	);
};

export default IconChip;
