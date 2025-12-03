import { useSelector } from 'react-redux';
import { Grid, Modal } from 'src/common/@the-source/atoms';
import utils from 'src/utils/utils';
const EditorModal = ({ open, close, key }: any) => {
	const access_token = useSelector((state: any) => state?.persistedUserData?.auth_access_token);

	const editor_link = utils.get_json_editor_links();

	const url = key
		? `${editor_link}/settings/user-setting/setting-editor/?hide=true&access_token=${access_token}&key=${key}`
		: `${editor_link}/settings/user-setting/setting-editor/?hide=true&access_token=${access_token}`;
	return (
		<Modal
			open={open}
			sx={{ padding: 0 }}
			width={960}
			_height='650px'
			title={'JSON Editor'}
			onClose={close}
			children={
				<Grid>
					<iframe src={url} width={'100%'} height={'550px'} />
				</Grid>
			}
		/>
	);
};

export default EditorModal;
