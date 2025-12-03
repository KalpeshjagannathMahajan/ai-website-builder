import { Container, Drawer } from '@mui/material';
import { Box, Button, Grid, Icon, Typography } from 'src/common/@the-source/atoms';
import BuyerListGrid from 'src/screens/BuyerLibrary/BuyerList/BuyerList';
import { useTheme } from '@mui/material/styles';

const CreateBuyerDrawer = ({
	open,
	setIsOpen,
	exists_buyers,
	onSelectionChanged,
	setSelectedBuyers,
	checkedRows,
	setCheckedRows,
	preSelectedRows,
}: any) => {
	const theme: any = useTheme();
	const handle_closing = () => {
		setSelectedBuyers(exists_buyers);
		setIsOpen(false);
	};
	return (
		<Drawer
			open={open}
			onClose={handle_closing}
			anchor='bottom'
			ModalProps={{
				keepMounted: false,
			}}>
			<Box sx={{ background: theme?.palette?.colors?.grey_600, height: 'calc(100vh - 50px)' }}>
				<Box sx={{ background: 'white' }}>
					<Grid container alignItems='stretch' pt={2.5} pl={6}>
						<Grid item>
							<Typography sx={{ fontSize: '18px', fontWeight: 700 }}>Select customer</Typography>
						</Grid>
						<Grid item ml='auto' mr={3} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
							<Icon sx={{ cursor: 'pointer' }} onClick={handle_closing} iconName='IconX' color={theme?.crete_buyer_drawer?.icon?.color} />
						</Grid>
					</Grid>
					<Box sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)', py: 1 }} />
				</Box>
				<Box mt={2} mr={3} display='flex' justifyContent='flex-end'>
					<Button onClick={() => setIsOpen(false)} variant='contained'>
						Confirm
					</Button>
				</Box>
				<Box>
					<Container maxWidth='xl'>
						<BuyerListGrid
							showCheckbox
							onSelectionChanged={onSelectionChanged}
							checkedRows={checkedRows}
							setCheckedRows={setCheckedRows}
							exists_buyers={exists_buyers}
							preSelectedRows={preSelectedRows}
						/>
					</Container>
				</Box>
			</Box>
		</Drawer>
	);
};

export default CreateBuyerDrawer;
