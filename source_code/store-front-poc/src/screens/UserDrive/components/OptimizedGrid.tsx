import React, { useEffect, useMemo, useState } from 'react';
import { filter } from 'lodash';
import { Box, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Virtuoso } from 'react-virtuoso';
import { FileComponent } from './FileComponent';

const VirtuosoContainer = styled(Box)({
	width: '100%',
	height: '70vh',
	overflow: 'auto',
});

const OptimizedGrid = ({
	content_loading,
	search,
	search_data,
	files_data,
	folder_menu_options,
	content_menu_options,
	set_files_data,
	set_selected_files_count,
	selected_files,
	set_selected_files,
	selected_files_count,
	handle_clear_file_selections_func,
}: any) => {
	const [itemsPerRow, setItemsPerRow] = useState(5);
	const filteredData = useMemo(() => {
		if (content_loading) return Array(4).fill('');
		return search?.length > 0 ? filter(search_data, (alt) => !alt?.is_folder) : files_data;
	}, [content_loading, search, search_data, files_data]);

	useEffect(() => {
		const calculateItemsPerRow = () => {
			const screenWidth = window.innerWidth;
			if (screenWidth < 600) {
				setItemsPerRow(1);
			} else if (screenWidth < 900) {
				setItemsPerRow(2);
			} else if (screenWidth < 1200) {
				setItemsPerRow(3);
			} else {
				setItemsPerRow(5);
			}
		};

		calculateItemsPerRow();
		window.addEventListener('resize', calculateItemsPerRow);
		return () => window.removeEventListener('resize', calculateItemsPerRow);
	}, []);

	const GridRow = React.memo(({ index, rowItems }: any) => {
		if (content_loading) {
			return (
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: '1.5rem',
						pt: '1.4rem',
						justifyContent: 'flex-start',
					}}>
					{Array(itemsPerRow)
						.fill(null)
						.map((_, i) => (
							<Box
								key={i}
								sx={{
									flex: `0 1 calc(${100 / itemsPerRow}% - 1.5rem)`,
									maxWidth: `calc(${100 / itemsPerRow}% - 1.5rem)`,
									display: 'flex',
									flexDirection: 'column',
								}}>
								<Skeleton variant='rectangular' height={200} sx={{ borderRadius: 2 }} />
								<Skeleton variant='text' width='60%' height={20} sx={{ mt: 1.5, borderRadius: 1 }} />
							</Box>
						))}
				</Box>
			);
		}

		return (
			<Box
				sx={{
					display: 'flex',
					flexWrap: 'wrap',
					gap: '1.5rem',
					pt: '1.4rem',
					justifyContent: 'flex-start',
				}}>
				{rowItems.map((item: any, i: number) => (
					<Box
						key={`${index}-${i}`}
						sx={{
							flex: `0 1 calc(${100 / itemsPerRow}% - 1.5rem)`,
							maxWidth: `calc(${100 / itemsPerRow}% - 1.5rem)`,
						}}>
						<FileComponent
							data={item}
							indx={index * itemsPerRow + i}
							content_menu_options={{ ...folder_menu_options, ...content_menu_options }}
							files_data={files_data}
							set_files_data={set_files_data}
							set_selected_files_count={set_selected_files_count}
							selected_files={selected_files}
							set_selected_files={set_selected_files}
							selected_files_count={selected_files_count}
							handle_clear_file_selections_func={handle_clear_file_selections_func}
							search_data={search_data}
							search={search}
						/>
					</Box>
				))}
			</Box>
		);
	});

	return (
		<VirtuosoContainer>
			<Virtuoso
				data={Array.from({ length: Math.ceil(filteredData.length / itemsPerRow) })}
				overscan={200}
				itemContent={(index: number) => (
					<GridRow key={`grid-row-${index}`} index={index} rowItems={filteredData.slice(index * itemsPerRow, (index + 1) * itemsPerRow)} />
				)}
			/>
		</VirtuosoContainer>
	);
};

export default OptimizedGrid;
