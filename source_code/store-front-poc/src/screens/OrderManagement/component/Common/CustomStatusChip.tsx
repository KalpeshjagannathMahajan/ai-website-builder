import { Chip } from 'src/common/@the-source/atoms';

interface Props {
	content: React.ReactNode;
	bgColor?: any;
}

const CustomStatusChip: React.FC<Props> = ({ content, bgColor }) => {
	return <Chip bgColor={bgColor} label={content} />;
};

export default CustomStatusChip;
