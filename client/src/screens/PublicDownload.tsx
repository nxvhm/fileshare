import '../assets/public-download.css'
import { getFileInfo } from '../api/Files';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import {
	Box,
	Card,
	CardMedia,
	CardActions,
	CardContent,
	Button,
	Typography,
	Grid
} from '@mui/material'
import { useEffect, useState } from 'react';
import { FileModel } from '../definitions';


const DownloadIconBox = styled(Box)({
	background: 'linear-gradient(45deg, rgba(200,27,44,1) 0%, rgba(232,79,44,1) 100%)',
	flex: '1 1 33.33%',
	padding: '1em'
})

const DownloadIcon = styled(CloudDownloadIcon)({
	width: 'auto',
	height: 'auto',
	color: 'white'
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
				<Grid item xs="auto" sx={{mx: 'auto', flexBasis: {xs: 1, sm: '50%', md: '33.33%'}, marginLeft: {xs: 0, sm: '25%', md: '33.333%'}, marginTop: '15%'}} >
					<Card sx={{borderRadius: 3, display: 'flex'}}>
						<Box sx={{flex: '2 1 66%'}}>
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
						</Box>
						<DownloadIconBox>
								<DownloadIcon />
								<Typography variant="body2">
									DOWNLOAD
								</Typography>
							</DownloadIconBox>
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
