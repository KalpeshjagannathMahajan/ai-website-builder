import { Button, Grid, Icon, Menu, Tooltip } from 'src/common/@the-source/atoms';

export const OrdersActionComp: React.FC<any> = ({ node }) => {
	const row_data = node?.data;
	const menu_items = [];
	if (row_data?.download_url) {
		menu_items.push({ label: 'Download receipt', icon: 'IconDownload', onClick: () => window.open(row_data?.download_url, 'blank') });
	}

	return (
		<Grid display='flex' justifyContent='center' alignItems='flex-end' gap={1}>
			{row_data?.table_type === 'invoices' && <Button sx={{ marginTop: '5px' }}>Pay now</Button>}
			{menu_items?.length > 0 && (
				<Menu
					LabelComponent={
						<Tooltip title={'Actions'} placement='right' arrow>
							<div>
								<Icon sx={{ cursor: 'pointer' }} iconName='IconDotsVertical' />
							</div>
						</Tooltip>
					}
					menu={menu_items}
					onClickMenuItem={() => console.log('menu clicked')}
				/>
			)}
		</Grid>
	);
};
