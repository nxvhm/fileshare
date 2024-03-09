import { useEffect, useState } from 'react';
import { Button } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

export default function CreateFolder() {
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	return (
		<>
			<Button component="label" variant="contained" onClick={e => setOpenDialog(true)} startIcon={<CreateNewFolderIcon />}>
				Add Folder
			</Button>
			<Dialog open={openDialog} maxWidth={'xs'} fullWidth={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" textAlign={'center'}>Create New Folder</DialogTitle>
        	<DialogContent>
          	<DialogContentText id="alert-dialog-description">
							<TextField id="folder-name-input" label="Folder Name" variant="standard" fullWidth />

						</DialogContentText>
					</DialogContent>
        <DialogActions>
          <Button onClick={e => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={e => setOpenDialog(false)}>Create</Button>
        </DialogActions>
      </Dialog>
		</>
	)
}
