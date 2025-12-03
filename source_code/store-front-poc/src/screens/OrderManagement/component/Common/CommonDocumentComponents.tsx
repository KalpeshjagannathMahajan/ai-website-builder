import { memo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { colors } from 'src/utils/theme';
import { Divider } from '@mui/material';
import Alert from 'src/common/@the-source/atoms/Alert';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

interface AttributeHeaderProps {
	header: string;
	sub_header: string;
}

interface DocumentLevelAttributeRendererProps extends AttributeHeaderProps {
	handle_click: () => void;
	render_body: () => ReactNode;
	render_divider: boolean;
}

interface DocumentLevelAttributeChangeInfoProps {
	doc_type: string;
}

interface ClearEntityButtonProps {
	disabled: boolean;
	handle_on_click: () => void;
}

const AttributeHeader: React.FC<AttributeHeaderProps> = ({ header, sub_header }) => {
	return (
		<Box mt={1}>
			<CustomText type='Subtitle'>{header}</CustomText>
			<CustomText type='Body' color={colors.secondary_text}>
				{sub_header}
			</CustomText>
		</Box>
	);
};
const DocumentLevelAttributeRenderer: React.FC<DocumentLevelAttributeRendererProps> = ({
	header,
	sub_header,
	handle_click,
	render_body,
	render_divider,
}) => {
	return (
		<Grid container p={is_ultron ? 1 : 0}>
			<AttributeHeader header={header} sub_header={sub_header} />
			<Grid item onClick={handle_click} width={'100%'}>
				{render_body()}
			</Grid>
			{render_divider && <Divider sx={{ margin: '1rem 0 0rem 0' }} />}
		</Grid>
	);
};

const DocumentLevelAttributeChangeInfo: React.FC<DocumentLevelAttributeChangeInfoProps> = memo(({ doc_type }) => {
	const { t } = useTranslation();
	const theme: any = useTheme();

	return (
		<Box
			borderRadius={'20px 20px 0px 0px'}
			sx={{
				margin: '-17px -20px', // to override drawer body padding
			}}
			bgcolor={theme?.palette?.info[50]}
			border={`1px solid ${colors.grey_300}`}
			borderBottom={'none'}>
			<Alert
				open
				severity='info'
				message={
					<CustomText
						type='Body'
						style={{
							lineHeight: '150%',
						}}
						color={colors.text_900}>
						{t('OrderManagement.OrderManagementContainer.DocumentLevelAttributeChangeInfo', {
							doc_type,
						})}
					</CustomText>
				}
				style={{
					display: 'flex',
					alignItems: 'center',
					width: '100%',
					background: 'inherit',
					border: 'none',
				}}
				icon={<Icon iconName='IconInfoCircle' color={colors.secondary_text} />}
			/>
		</Box>
	);
});

const ClearEntityButton: React.FC<ClearEntityButtonProps> = ({ disabled, handle_on_click }) => {
	const { t } = useTranslation();
	const classes = useStyles();
	return (
		<Button disabled={disabled ?? false} variant='outlined' onClick={handle_on_click} className={classes.clear_button}>
			{t('OrderManagement.OrderManagementContainer.Clear')}
		</Button>
	);
};
export { DocumentLevelAttributeRenderer, AttributeHeader, DocumentLevelAttributeChangeInfo, ClearEntityButton };
