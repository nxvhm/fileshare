import { useEffect, useState, Fragment } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { TextFileModel } from '../../definitions';
import { getTextFile } from '../../api/Files';
import toast, { Toaster } from 'react-hot-toast';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

type ViewTextFileDialogProps = {
	open: boolean,
	fileId: number,
	editable: boolean,
	handleClose: () => void
}

export default function ViewTextFileDialog(props: ViewTextFileDialogProps) {
  const {handleClose, open} = props;
	const [textFile, setTextFile] = useState<TextFileModel>();

	useEffect(() => {
		if(!props.fileId)
			return handleClose();

		getTextFile(String(props.fileId))
			.then(file => setTextFile(file))
			.catch(e => {
				toast.error(e.response?.data.message ? e.response?.data.message : e.message)
				handleClose();
			})
	}, [props.fileId])

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
				fullWidth={true}
				maxWidth={'lg'}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {textFile?.name}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography dangerouslySetInnerHTML={{ __html: String(textFile?.contents) }} />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
