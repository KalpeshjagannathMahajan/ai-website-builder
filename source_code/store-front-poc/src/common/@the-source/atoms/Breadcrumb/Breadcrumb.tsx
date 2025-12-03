import Breadcrumbs, { BreadcrumbsProps as MuiBreadcrumbsProps } from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';

import Icon from '../Icon/Icon';
import Typography from '../Typography/Typography';
import Grid from '../Grid';
import { useTheme } from '@mui/material/styles';

type BreadcrumbsBaseProps = Pick<MuiBreadcrumbsProps, 'maxItems'>;

export interface BreadcrumbsProps extends BreadcrumbsBaseProps {
	links: LinksProps[];
	maxItems?: number;
	separatorIcon?: 'chevron' | 'slash';
	className?: any;
}

interface LinksProps {
	id: number;
	linkTitle: string;
	link: any;
}

const Breadcrumb = ({ links, separatorIcon, className, ...rest }: BreadcrumbsProps) => {
	const navigate = useNavigate();
	const theme: any = useTheme();
	const handle_link_click = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, link: string) => {
		if (link === '/') return;
		e.preventDefault();
		navigate(link);
	};

	return (
		<Breadcrumbs
			separator={separatorIcon === 'chevron' ? <Icon iconName='IconChevronRight' /> : '/'}
			aria-label='breadcrumb'
			{...rest}
			sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: theme?.product?.bread_crumb_styles?.marginTop }}>
			{links.map((item: LinksProps, index: number) => {
				if (index + 1 !== links.length) {
					return (
						<Grid key={item.id}>
							<Link
								className={className}
								color='rgba(0, 0, 0, 0.6)'
								fontSize={'1.2rem'}
								underline='none'
								href={item.link}
								onClick={(e) => handle_link_click(e, item.link)}>
								{item.linkTitle !== 'undefined' ? item.linkTitle ?? '' : ''}
							</Link>
						</Grid>
					);
				}
				return (
					<Grid key={item.id} sx={{ maxWidth: '25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
						<Typography className={className} color='rgba(0, 0, 0, 0.87)' sx={{ fontSize: '1.2rem' }}>
							{item.linkTitle !== 'undefined' ? item.linkTitle ?? '' : ''}
						</Typography>
					</Grid>
				);
			})}
		</Breadcrumbs>
	);
};

Breadcrumb.defaultProps = {
	maxItems: 3,
	separatorIcon: 'slash',
};

export default Breadcrumb;
