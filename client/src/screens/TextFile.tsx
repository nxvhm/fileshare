import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {TextField, Box, Button} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Editor from 'react-simple-wysiwyg';
import toast, { Toaster } from 'react-hot-toast';
import { createText, getTextFile, updateText } from '../api/Files';
import { TextFileModel } from '../definitions';

const TextFile = (props: {edit?: boolean}) => {

	const [validationError, setValidationError] = useState<{filename: string | undefined}>({filename: undefined});
  const [html, setHtml] = useState<string>('');
	const [fileName, setFileName] = useState<string>('');
	const { parentId, id } = useParams();
	const [file, setFile] = useState<null|TextFileModel>(null);
	const navigate = useNavigate();

	useEffect(() => {
		if(!props.edit)
			return;

		if(props.edit && !id)
			return navigate('/');

		getTextFile(String(id))
			.then(file => {
				if(!file || file && !file.id)
					navigate('/');

				setFile(file);
			})
			.catch(e => {
				toast.error(e.response?.data.message ? e.response?.data.message : e.message)
				navigate('/');
			});
	}, [])

	useEffect(() => {
			setFileName(file ? file.name : '');
			setHtml(file ? file.contents : '');
	}, [file])

	const handleTextUpdate = (e: React.FormEvent<HTMLTextAreaElement>) => {
		setHtml((e.target as HTMLTextAreaElement).value);
	}

	const handleFileNameUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFileName(e.currentTarget.value);
	}

	const handleSave = (_e: React.MouseEvent) => {
		if(!fileName || fileName.length < 3)
			return setValidationError({filename: 'Filename should be at least 3 characters'})

		setValidationError({filename: undefined});
		props.edit ? updateTextFile() : createNewTextFile()
	}

	const createNewTextFile = () => {
		createText(fileName, parentId ? Number(parentId) : undefined, html)
		.then(_res => {
			toast.success('File created successfully')
			parentId ? navigate(`/folder/${parentId}`) : navigate('/');
		})
		.catch(e => toast.error(e.response?.data.message ? e.response.data.message : e.message));
	}

	const updateTextFile = () => {
		if(!id)
			return;

		updateText(Number(id), fileName, html)
			.then(_res => toast.success('File Successfully updated'))
			.catch(e => toast.error(e.response?.data.message ? e.response.data.message : e.message));
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
		<Button variant="outlined" sx={{marginTop: 1, paddingLeft: 3, paddingRight: 3}} startIcon={<SaveIcon />} onClick={handleSave}>Save</Button>
		<Toaster />

		</Box>
  );
}

export default TextFile
