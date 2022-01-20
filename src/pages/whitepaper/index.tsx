// @ts-nocheck
import dynamic from 'next/dynamic'

const FileViewer = dynamic(() => import('react-file-viewer'), {
  ssr: false,
})

export default function Index() {
  return <FileViewer fileType="pdf" filePath="/whitepaper.pdf" />
}
