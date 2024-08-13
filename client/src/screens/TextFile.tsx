import { useState } from 'react';
import Editor from 'react-simple-wysiwyg';
import {TextField, Box, Button} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const TextFile = () => {
  const [html, setHtml] = useState<string>('');
	const [fileName, setFileName] = useState<string>('');

  const handleTextUpdate = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setHtml((e.target as HTMLTextAreaElement).value);
  }

	const handleFileNameUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFileName(e.currentTarget.value);
	}

	const saveFile = (_e: React.MouseEvent) => {
		console.log(html, fileName);
	}

  return (
		<Box>
		<TextField label="File Name" variant="outlined" size="small" sx={{marginBottom: 1}} value={fileName} onChange={handleFileNameUpdate}/>
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
