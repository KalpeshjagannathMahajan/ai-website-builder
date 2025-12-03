import { FieldInterface } from '../../FieldInterface';
import ReactQuill from 'react-quill';
import '../../style.css';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';

const HtmlEditField: React.FC<FieldInterface> = ({ handleChange, value, refInput }) => {
	const [isError, setIsError] = useState(false);

	const handleValidate = (val: any) => {
		const strippedText = val.replace(/<[^>]+>/g, '');
		const isContentEmpty = strippedText.trim() === '';
		setIsError(isContentEmpty);
		if (isContentEmpty) {
			handleChange && handleChange('');
		}
	};

	useEffect(() => {
		handleValidate(value);
	}, [value]);

	const handleOnChange = (val: any) => {
		if (handleChange) {
			handleChange(val);
		}
	};

	return (
		<ReactQuill
			style={{ borderRadius: 8 }}
			className={isError ? 'editor-error' : 'editor-success'}
			ref={refInput}
			theme='snow'
			value={value}
			onChange={handleOnChange}
		/>
	);
};

export default HtmlEditField;
