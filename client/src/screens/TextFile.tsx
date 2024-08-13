import { useState } from 'react';
import Editor from 'react-simple-wysiwyg';

const TextFile = () => {
  const [html, setHtml] = useState('my <b>HTML</b>');

  function onChange(e) {
    setHtml(e.target.value);
  }

  return (
    <Editor
			containerProps={{ style: { resize: 'vertical' } }}
			value={html}
			onChange={onChange}
		/>
  );
}

export default TextFile
