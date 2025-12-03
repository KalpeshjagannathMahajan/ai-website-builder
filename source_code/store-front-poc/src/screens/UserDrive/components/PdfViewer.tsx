/* eslint-disable */
import { useState } from 'react';
// import { Document, Thumbnail, pdfjs } from 'react-pdf';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from './../css/PdfViewerStyle';
import { useTheme } from '@mui/material/styles';

export default function PdfViewer({ max_pages = 1, ...props }: any) {
	const classes = useStyles();
	// const theme: any = useTheme();
	// // pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
	// const [num_pages, set_num_pages] = useState(null);
	// const [page_number, set_page_number] = useState(1);
	// const [page_thumbnails, set_page_thumbnails] = useState<any>([]);
	// function onDocumentLoadSuccess({ numPages }: any) {
	// 	set_num_pages(num_pages);
	// 	let temp = [];
	// 	for (let i = 0; i < numPages; i++) {
	// 		temp.push(i + 1);
	// 		if (i === numPages - 1) set_page_thumbnails(temp);
	// 	}
	// 	set_page_number(1);
	// }
	return (
		<>
			<div className={classes.main_cont}>
				{/*<Document file={props?.file_url} onLoadSuccess={onDocumentLoadSuccess}>
					<div style={{ display: 'flex', flexDirection: 'row', width: props?.width ?? '96vw' }}>
						{!props?.is_left_hidden && (
							<div className={classes.lft_cont}>
								{page_thumbnails?.map((data: any, indx: number) => (
									<div
										key={`item-${indx}`}
										className={classes.thumbnail_cont}
										style={{ border: data === page_number ? '1px solid #9aa0aa' : 'none', minHeight: '15vh' }}
										onClick={() => set_page_number(data)}>
										<Thumbnail pageNumber={data} width={130} key={indx} />
										<CustomText className={classes.page_number}>{data}</CustomText>
									</div>
								))}
							</div>
						)}
						<div className={props?.right_cont ?? classes.right_cont}>
							<div style={{ width: 'fit-content' }}>
								{max_pages > 1 || max_pages === -1 ? (
									page_thumbnails.map((data: any, index: number) => {
										return (index <= max_pages || max_pages === -1) && <Thumbnail pageNumber={data} key={data} />;
									})
								) : (
									<Thumbnail className={classes.cursor_style} pageNumber={page_number} />
								)}
							</div>
						</div>
					</div>
				</Document> */}
			</div>
		</>
	);
}
