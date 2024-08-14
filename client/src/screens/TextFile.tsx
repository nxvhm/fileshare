import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {TextField, Box, Button} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Editor from 'react-simple-wysiwyg';
import { createText } from '../api/Files';

const TextFile = () => {
	const [validationError, setValidationError] = useState<{filename: string | undefined}>({filename: undefined});
  const [html, setHtml] = useState<string>('');
	const [fileName, setFileName] = useState<string>('');
	const { parentId } = useParams();

	const handleTextUpdate = (e: React.FormEvent<HTMLTextAreaElement>) => {
		setHtml((e.target as HTMLTextAreaElement).value);
	}

	const handleFileNameUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFileName(e.currentTarget.value);
	}

	const saveFile = (_e: React.MouseEvent) => {
		if(!fileName || fileName.length < 3)
			return setValidationError({filename: 'Filename should be at least 3 characters'})

		setValidationError({filename: undefined});
		createText(fileName, parentId ? Number(parentId) : undefined, html).then(res => console.log(res)).catch(e => console.log(e));
	}

  return (
		<Box>
		<TextField
			label="File Name"
			variant="outlined"
			size="small"
			sx={{marginBottom: 1}} value={fileName}
			onChange={handleFileNameUpdate}
			error={Boolean(validationError.filename)}
			helperText={validationError.filename}
		/>

    <Editor
			containerProps={{ style: { resize: 'vertical' } }}
			value={html}
			onChange={handleTextUpdate}
		/>
		<Button variant="outlined" sx={{marginTop: 1, paddingLeft: 3, paddingRight: 3}} startIcon={<SaveIcon />} onClick={saveFile}>Save</Button>
		</Box>
  );
}

export default TextFile
