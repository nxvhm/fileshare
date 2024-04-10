import { useEffect, useState } from "react";
import { FileModel } from "../../definitions";

import {Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';

export type ShareProps = {
	open: boolean
	file?: FileModel|null,
	onClose: () => void
}

export default function Share(props: ShareProps) {
  const { open, file, onClose } = props;

	return(
		<Dialog open={open} maxWidth={'xs'} fullWidth={true}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			onClose={() => onClose()}
			>
			<DialogTitle id="alert-dialog-title" textAlign={'center'}>Share {file?.name}</DialogTitle>
			<DialogContent>
				<p>dasdasdasdasdsa</p>
			</DialogContent>
		</Dialog>
	)

}
