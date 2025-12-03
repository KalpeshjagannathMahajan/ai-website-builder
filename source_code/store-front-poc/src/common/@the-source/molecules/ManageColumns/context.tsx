import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';
// import { importColumnValues } from './converter';

export interface Attribute {
	headerName: string;
	visibility: boolean | undefined;
	colId: number;
	enabled?: boolean;
	pinned: string | undefined;
	is_pinned?: boolean;
	pinnedIndex?: number;
}

export interface MyData {
	attributes: Attribute[];
}

interface DataContextValue {
	data: MyData;
	set_data: Dispatch<SetStateAction<MyData>>;
	reordered: MyData[]; // Change the type to an array
	set_reordered: Dispatch<SetStateAction<MyData[]>>;
	open_manage_column: boolean;
	set_open_manage_column: Dispatch<SetStateAction<boolean>>;

	pinned_values: string[];

	set_pinned_values: Dispatch<SetStateAction<string[]>>;
	new_array: any[];
	set_new_array: Dispatch<SetStateAction<any[]>>;
}

export const MyDataContext = createContext<DataContextValue | undefined>(undefined);

type MyDataProviderProps = {
	children: ReactNode;
};

export default function ManageColumnsProvider({ children }: MyDataProviderProps) {
	const [data, set_data] = useState<MyData>({ attributes: [] });
	const [reordered, set_reordered] = useState<MyData[]>([]);
	const [open_manage_column, set_open_manage_column] = useState(false);
	const [pinned_values, set_pinned_values] = useState<string[]>([]);
	const [new_array, set_new_array] = useState<any[]>([]);

	const context_value: DataContextValue = {
		data,
		set_data,
		reordered,
		set_reordered,
		open_manage_column,
		set_open_manage_column,
		pinned_values,
		set_pinned_values,
		new_array,
		set_new_array,
	};

	return <MyDataContext.Provider value={context_value}>{children}</MyDataContext.Provider>;
}
