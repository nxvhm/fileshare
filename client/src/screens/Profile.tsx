import { useContext, useState, useEffect } from 'react';
import AuthContext from '../lib/context/AuthContext';
import {TextField, Box, Typography, Grid} from '@mui/material';
import { blue } from '@mui/material/colors'


const inputStyles = {
	padding: 1, height: '1rem', paddingLeft: 0
}

export default function Profile () {
	const {user} = useContext(AuthContext)
	const [username, setUsername] = useState<string>("");



	return(
		<>
		<Box>
			<Typography variant={'h4'} sx={{borderBottom: 1, borderColor: blue['100']}}>Profile</Typography>
		</Box>
		<Box sx={{marginTop: 3}}>
			<Grid container spacing={2} rowSpacing={5}>

				<Grid item xs={12} md={6}>
					<TextField id="outlined-basic" defaultValue={user.data.name} sx={inputStyles} label="Username" variant="outlined" fullWidth/>
				</Grid>

				<Grid item md={6}>
					<TextField id="outlined-basic" defaultValue={user.data.email} sx={inputStyles} label="Email" variant="outlined"  type="email" fullWidth/>
				</Grid>

				<Grid item md={6}>
					<TextField id="outlined-basic" sx={inputStyles} label="Email" variant="outlined" type="email" fullWidth/>
				</Grid>

			</Grid>
		</Box>
		</>
	);
}
