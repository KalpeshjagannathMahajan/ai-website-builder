import { makeStyles } from '@mui/styles';
import React from 'react';
import { Chip } from 'src/common/@the-source/atoms';
import MenuHover from 'src/common/MenuHover';
import utils from 'src/utils/utils';
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';

interface Props {
	value: string[];
	valueFormatted?: any;
}

const useStyles = makeStyles(() => ({
	container: {
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		marginTop: '0.2rem',
		cursor: 'pointer',
	},
}));

const TagRenderer: React.FC<Props> = ({ valueFormatted }: any) => {
	const { label, user_list } = valueFormatted;
	const classes = useStyles();
	const theme: any = useTheme();
	const isArray = _.isArray(label);

	const { textColor, bgColor } = !isArray
		? utils.get_chip_color_by_tag(label)
		: { textColor: theme?.user_management?.tag_render?.text, bgColor: theme?.user_management?.tag_render?.background };

	return (
		<div className={classes.container}>
			{isArray ? (
				<MenuHover
					LabelComponent={
						<div style={{ cursor: 'pointer' }}>
							{label.map((curr) => (
								<Chip textColor={textColor} bgColor={bgColor} label={curr} sx={{ marginRight: 1, fontSize: 12 }} />
							))}
						</div>
					}
					commonMenuComponent={(_item: any) => {
						return <CustomText type='Body'>{_item}</CustomText>;
					}}
					menu={user_list}
				/>
			) : (
				<>
					{label ? <Chip textColor={textColor} bgColor={bgColor} label={label} sx={{ marginRight: 1, fontSize: 12 }} /> : <span>--</span>}
				</>
			)}
		</div>
	);
};

export default TagRenderer;
