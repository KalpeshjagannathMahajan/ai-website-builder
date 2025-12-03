import { useState } from 'react';
import { makeStyles } from '@mui/styles';
import MenuHover from 'src/common/MenuHover';
import Apis from 'src/utils/api_requests';
import CustomText from 'src/common/@the-source/CustomText';

const useStyles = makeStyles(() => ({
	container: {
		display: 'flex',
		justifyContent: 'space-between',
	},
}));

const AccessComp = (props: any) => {
	const classes = useStyles();
	const role_id = props?.data?.reference_id;
	const [meta, set_meta] = useState([]);
	const [loading, set_loading] = useState(true);

	const fetch_meta = async () => {
		try {
			const response: any = await Apis.user_management.get_user_roles_meta_data(role_id);
			const meta_response = response?.message?.access_meta;
			const transformed_meta = meta_response?.map((item: any) => {
				return {
					id: item.name,
					data: item,
				};
			});
			if (transformed_meta && transformed_meta.length) set_meta(transformed_meta);
		} catch (error) {
		} finally {
			set_loading(false);
		}
	};

	return (
		<MenuHover
			loading={loading}
			styles={{ width: '285px' }}
			LabelComponent={
				<div style={{ cursor: 'pointer', fontWeight: 400, fontSize: '14px' }}>
					<u>{props.value}</u>
				</div>
			}
			commonMenuComponent={(_item: any) => {
				return (
					<div className={classes.container}>
						<CustomText type='Subtitle'>{_item.data.name}</CustomText>
						<CustomText type='Body'>{_item.data.access}</CustomText>
					</div>
				);
			}}
			onOpen={fetch_meta}
			menu={meta}
		/>
	);
};

export default AccessComp;
