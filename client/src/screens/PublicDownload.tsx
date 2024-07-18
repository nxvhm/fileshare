import '../assets/public-download.css'
import { getFileInfo } from '../api/Files';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
	Box,
	Card,
	CardActions,
	CardContent,
	Button,
	Typography,
	Grid
} from '@mui/material'
import { useEffect, useState } from 'react';
import { FileModel } from '../definitions';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const DownloadBox = styled(Box)({
	width: 300,
	mx: 'auto'
})

function PublicDownload() {

	const [file, setFile] = useState<FileModel|false>(false);
	const { hash } = useParams();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		getFileInfo(String(hash))
			.then(file => {
				setLoading(false);
				setFile(file);
			}).catch(e => {
				setLoading(false);
				console.log(e)
			});
	}, [hash])

	const renderLoadingScreen = () => {
		return(
			<p>Loading</p>
		)
	}

	const DownloadBox = () => {
		if(loading)
			return renderLoadingScreen();

		return(
			<Grid container>
				<Grid item xs="auto" sx={{mx: 'auto', my: 25, minWidth: {xs: 1, sm: 1/2, md: 1/3}}} >
					<Card>
						<CardContent>
							<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
								File Download
							</Typography>
							<Typography variant="h5" component="div">
								{file ? file.name : 'Example file name'}
							</Typography>
							<Typography sx={{ mb: 1.5 }} color="text.secondary">
								hello world
							</Typography>
							<Typography variant="body2">
								Uploaded by
								<br />
							</Typography>
						</CardContent>
						<CardActions>
							<Button size="small">Download</Button>
						</CardActions>
					</Card>
				</Grid>
			</Grid>
		)
	}

	return (
		<DownloadBox />
	)
}

export default PublicDownload
