import '../assets/public-download.css'
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
	return (
		<Grid container>
			<Grid item xs="auto" sx={{mx: 'auto', my: 25, minWidth: {xs: 1, sm: 1/2, md: 1/3}}} >
				<Card>
					<CardContent>
						<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
							File Download
						</Typography>
						<Typography variant="h5" component="div">
							Download File Name
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

export default PublicDownload
