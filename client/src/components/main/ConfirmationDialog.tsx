import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export type ConfirmationDialogProps = {
	isOpen: boolean,
	dialogText: string,
	cancelText?: string,
	confirmText?: string,
	onConfirm: () => void,
	onCancel: () => void,
	secondaryDialogText?: string
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  const [open, setOpen] = useState(props.isOpen);

	useEffect(
		() => setOpen(props.isOpen),
		[props.isOpen]
	)

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.dialogText}</DialogTitle>
				{props?.secondaryDialogText &&
        	<DialogContent>
          	<DialogContentText id="alert-dialog-description">{props?.secondaryDialogText}</DialogContentText>
					</DialogContent>
				}
        <DialogActions>
          <Button onClick={e => props.onCancel()}>{props.cancelText ? props.cancelText : 'Cancel'}</Button>
          <Button onClick={e => props.onConfirm()}>{props.confirmText ? props.confirmText : 'Confirm'}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
