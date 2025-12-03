import _ from 'lodash';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Avatar, Grid, Icon } from 'src/common/@the-source/atoms';
import StorefrontLeadCard from './components/StorefrontLeadCard';
import styled from '@emotion/styled';
import useStyles from './styles';
import { t } from 'i18next';

const StyledDiv = styled.div`
	-ms-overflow-style: none; /* For IE and Edge */
	&::-webkit-scrollbar {
		display: none; /* For Chrome, Safari, and Opera */
	}
	width: 100%;
	overflow-x: auto; /* Enable horizontal scrolling */
	white-space: nowrap; /* Prevent content from wrapping to the next line */
	display: flex;
	flex-direction: row;
	gap: 0.75em;
	margin: 1rem 0;
`;

const LeadRails = ({ storefront_leads, handle_lead_view_all, handleLeadClick }: any) => {
	const classes = useStyles();

	const [isLeadFirst, setIsLeadFirst] = useState(true);
	const [isLeadLast, setIsLeadLast] = useState(false);

	const scrollLeadRef = useRef() as MutableRefObject<HTMLDivElement>;

	const scroll = (scrollOffset: number) => {
		scrollLeadRef.current.scroll({
			left: scrollLeadRef.current.scrollLeft + scrollOffset,
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		const node = scrollLeadRef.current;

		if (node) {
			setIsLeadFirst(node.scrollLeft === 0);
			setIsLeadLast(node.scrollLeft + node.clientWidth >= node.scrollWidth);

			const handleScroll = () => {
				setIsLeadFirst(node.scrollLeft === 0);
				setIsLeadLast(node.scrollLeft + node.clientWidth >= node.scrollWidth);
			};

			node.addEventListener('scroll', handleScroll);

			return () => {
				node.removeEventListener('scroll', handleScroll);
			};
		}
	}, []);

	return (
		<>
			{_.size(storefront_leads) > 0 && (
				<>
					{!_.isEmpty(storefront_leads) && (
						<div className={classes.storefront_leads_header}>
							<p className={classes.title}>{t('Dashboard.Main.StorefrontLeads')}</p>
							{(!isLeadFirst || !isLeadLast) && (
								<p className={classes.view_all} onClick={handle_lead_view_all}>
									{t('Dashboard.Main.ViewAll')}
								</p>
							)}
						</div>
					)}

					<Grid container direction='row' alignItems='center' flexWrap='nowrap'>
						{!isLeadFirst && (
							<Grid item sx={{ marginRight: '-5rem', zIndex: 5, boxShadow: '2px solid black' }} onClick={() => scroll(-250)}>
								<Avatar
									isImageAvatar={false}
									style={{ background: 'white', width: '40px', height: '40px', cursor: 'pointer' }}
									content={<Icon color='black' iconName='IconChevronLeft' sx={{ width: '20px', height: '20px', background: 'white' }} />}
									size='large'
									variant='circular'
								/>
							</Grid>
						)}

						<StyledDiv ref={scrollLeadRef}>
							<div style={{ display: 'flex', gap: '1rem' }}>
								{_.map(storefront_leads, (lead: any) => (
									<Grid key={lead?.id} sx={{ justifyContent: 'space-around' }}>
										<StorefrontLeadCard data={lead} onClick={() => handleLeadClick(lead)} />
									</Grid>
								))}
							</div>
						</StyledDiv>

						{!isLeadLast && (
							<Grid item sx={{ marginLeft: '-5rem', zIndex: 5, boxShadow: '2px solid black' }} onClick={() => scroll(250)}>
								<Avatar
									isImageAvatar={false}
									style={{ background: 'white', width: '40px', height: '40px', cursor: 'pointer' }}
									content={<Icon color='black' iconName='IconChevronRight' sx={{ width: '24px', height: '24px', background: 'white' }} />}
									size='large'
									variant='circular'
								/>
							</Grid>
						)}
					</Grid>
				</>
			)}
		</>
	);
};
export default LeadRails;
