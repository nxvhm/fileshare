import { CloudUpload } from '@mui/icons-material';
import {	Backdrop, Box } from '@mui/material';

const DragAndDropOverlay = (props: {
	open: boolean,
	handleDragOut: () => void
}) => {

	return (
		<Backdrop
			sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute', flexDirection: 'column', borderRadius: 1}}
			open={props.open}
			onClick={props.handleDragOut}
		>
		<Box sx={{width: '100%', textAlign: 'center', marginBottom: 1, fontSize: 21, textShadow: '1px 2px 6px #000'}}>
			DROP HERE TO UPLOAD FILE...
		</Box>
		<CloudUpload sx={{fontSize: 64}}/>
	</Backdrop>
	)
}

export default DragAndDropOverlay;
