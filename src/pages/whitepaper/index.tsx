import FileViewer from 'react-file-viewer';

export default function Index() {
    return (
        <FileViewer fileType="pdf" filePath="/whitepaper.pdf" />
    );
};