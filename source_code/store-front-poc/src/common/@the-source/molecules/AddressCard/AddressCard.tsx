import { Box, Chip, Grid, Typography } from '../../atoms';

interface AddressCardProps {
	id?: string | number;
	section?: string;
	heading?: string;
	tag?: any;
	attributes?: any;
	status?: string;
}

export interface Dataprops {
	data?: AddressCardProps;
}

const AddressCard = ({ data }: Dataprops) => {
	const addressAttributes = data?.attributes?.sort((a: any, b: any) => (a?.priority || 0) - (b?.priority || 0));

	return (
		<Box height='100%' maxWidth='23em' borderRadius='12px' border='1px solid #D1D6DD'>
			<Grid p={2}>
				<Grid mb={1}>
					{data?.tag && <Chip label={data?.tag?.name} bgColor={data?.tag?.backgroundColor} textColor={data?.tag?.textColor} />}
				</Grid>
				<Grid my={0.5}>
					<Typography variant='h6'>{data?.heading}</Typography>
				</Grid>
				<Grid>
					{addressAttributes?.map((attr: any) => (
						<Grid container my={0.5}>
							<Grid item>
								<Typography variant='subtitle2'>{attr?.value}</Typography>
							</Grid>
						</Grid>
					))}
				</Grid>
			</Grid>
		</Box>
	);
};

AddressCard.defaultProps = {
	data: {},
};

export default AddressCard;
