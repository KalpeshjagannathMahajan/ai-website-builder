import { Box, Chip, Grid, Typography } from '../../atoms';

interface ContactCardProps {
	id?: string | number;
	priority?: number;
	section?: string;
	heading?: string;
	tag?: any;
	attributes?: any;
	status?: string;
}

export interface Dataprops {
	data?: ContactCardProps;
}

const ContactCard = ({ data }: Dataprops) => {
	const contactAttributes = data?.attributes?.sort((a: any, b: any) => (a?.priority || 0) - (b?.priority || 0));

	return (
		<Box height='100%' maxWidth='23em' borderRadius='12px' border='1px solid #D1D6DD'>
			<Grid p={2}>
				<Grid container alignItems='center'>
					<Grid item>
						<Typography variant='h6'>{data?.heading}</Typography>
					</Grid>
					<Grid item ml='auto'>
						{data?.tag && <Chip label={data?.tag?.name} bgColor={data?.tag?.backgroundColor} textColor={data?.tag?.textColor} />}
					</Grid>
				</Grid>
				<Grid>
					{contactAttributes?.map((attr: any) => (
						<Grid container my={1.5}>
							<Grid item>
								<Typography variant='subtitle2'>{attr?.key}</Typography>
							</Grid>
							<Grid item ml='auto'>
								<Typography variant='subtitle2'>{attr?.value}</Typography>
							</Grid>
						</Grid>
					))}
				</Grid>
			</Grid>
		</Box>
	);
};

ContactCard.defaultProps = {
	data: {},
};

export default ContactCard;
