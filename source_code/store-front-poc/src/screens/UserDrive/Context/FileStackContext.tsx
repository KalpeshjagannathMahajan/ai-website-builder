import React, { useState } from 'react';
import * as filestack from 'filestack-js';

const client = filestack.init('AIVSLqrLuSemEdqjekPksz');

export const FileStackContext = React.createContext<any>(null);

export const FileStackContextComponent = (props: any) => {
	const [upload_data, set_upload_data] = useState<any>([]);

	return (
		<FileStackContext.Provider
			value={{
				file_stack_client: client,
				upload_data,
				set_upload_data,
			}}>
			{props?.children}
		</FileStackContext.Provider>
	);
};
