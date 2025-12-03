/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import RenderFields from './RenderFields';

interface CustomCellEditorProps {
	value: any;
	type: any;
	colDef: any;
	defaultsMap: any;
	gridRef: any;
	charPress: any;
	restProps: any;
	rowIndex: any;
}

interface CustomCellEditorRef {
	getValue: () => number;
	isCancelBeforeStart: () => boolean;
	isCancelAfterEnd: () => boolean;
	afterGuiAttached: () => void;
}

const CustomCellEditor = memo(
	forwardRef<CustomCellEditorRef, CustomCellEditorProps>((props, ref) => {
		const [newValue, setNewValue] = useState(props.value);
		const [shouldStopEditing, setShouldStopEditing] = useState(false);
		const { type, colDef, gridRef, value, rowIndex } = props;
		const { compositeKey, attribute_id, default_map } = colDef;
		const refInput = useRef<HTMLInputElement>(null);

		useEffect(() => {
			// focus on the input
			if (refInput.current) {
				refInput.current?.focus();
			}
			setNewValue(value);
		}, []);

		useEffect(() => {
			if (shouldStopEditing) {
				setShouldStopEditing(false);
				gridRef.current.api.stopEditing();
				// gridRef.current.api.stopRowOrC	ellEdit();
				gridRef?.current?.api?.tabToNextCell();
				// gridRef?.current?.api?.stopEditing();
			}
		}, [shouldStopEditing]);

		// Hook to expose the cell editor API to the parent component
		useImperativeHandle(ref, () => ({
			getValue() {
				return newValue;
			},
			isCancelBeforeStart() {
				// Implement cancellation logic if needed
				return false;
			},
			isCancelAfterEnd() {
				// Implement cancellation logic if needed
				return false;
			},
			afterGuiAttached() {
				// Focus the input field after the cell editor is rendered
				// (if needed for your custom date component)
			},
		}));

		const shouldStopEditingCell = () => {
			switch (type || colDef?.type) {
				case 'price':
					switch (compositeKey) {
						case 'unit':
						case 'currency':
							return true;
						default:
							return false;
					}
				case 'date':
					return true;
				case 'uom':
					switch (compositeKey) {
						case 'unit':
							return true;
						default:
							return false;
					}
				case 'size':
					switch (compositeKey) {
						case 'unit':
							return true;
						default:
							return false;
					}
				case 'csv':
				case 'sub_category':
					return false;
				case 'select':
					const currentAttributeConfig = default_map[attribute_id];
					const { mode } = currentAttributeConfig?.default;
					return mode === 'multiple' ? false : true;
				default:
					return false;
			}
		};

		const onChangeListener = useCallback((editedValue: any) => {
			//add handling for dtype validations before setting value
			setNewValue(editedValue);

			let shouldStopEdit = shouldStopEditingCell();
			if (shouldStopEdit) {
				setShouldStopEditing(true);
			}
		}, []);

		return (
			<RenderFields
				compositeKey={compositeKey}
				defaultMap={default_map}
				rowId={rowIndex}
				ref={refInput}
				colDef={colDef}
				value={newValue}
				onChange={onChangeListener}
			/>
		);
	}),
);

export default CustomCellEditor;
