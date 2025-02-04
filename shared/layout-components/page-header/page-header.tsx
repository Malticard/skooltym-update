import { IconUpload } from '@/public/assets/icon-fonts/tabler-icons/icons-react'
import { handleFileUploads } from '@/utils/handleFileUploads'
import React from 'react'
import { Button } from 'react-bootstrap'
interface PageHeaderProps {
  title: string
  children?: React.ReactNode
  link?: boolean
  item?: string
  active_item?: string
  buttonText?: string
  upload?: boolean
  typeOfUpload?: string
  left?: boolean
  onTap?: () => void
  onDownload?: () => void

}
const PageHeader = (props: PageHeaderProps) => {
  //   handle upload states
  const [uploadState, setUploadState] = React.useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadState(true);
    const formData = new FormData();
    formData.append('file', file!);
    // function to handle file upload.
    handleFileUploads(props.typeOfUpload ?? "staff", formData).then((response: any) => {
      setUploadState(false);
      console.log(response);
      // window.location.reload();
    }).catch((error: any) => {
      console.log(error)
      setUploadState(false);
    });
  }
  return (
    <div className="d-md-flex d-block align-items-center justify-content-between page-header-breadcrumb">
      <div>
        <h2 className="main-content-title fs-24 mb-1">{props.title}</h2>
        {
          props.link ? (
            <ol className="breadcrumb mb-0">
              {props.children}
            </ol>
          ) : (
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><a>{props.item}</a></li>
              <li className="breadcrumb-item active" aria-current="page">{props.active_item}</li>
            </ol>
          )
        }

      </div>
      <div className="d-flex">
        <div className="justify-content-center">
          {props.left && (
            <> {props.children}</>
          )}
          <div><input type="file" name="upload" onChange={handleFileUpload} className='hidden' id="uploadFile" /></div>
          {
            props.upload && (
              <button type="button"
                onClick={() => props.onDownload && props.onDownload()}
                className="btn btn-primary my-2 btn-icon-text d-inline-flex align-items-center">
                <i className='fe fe-download-cloud me-2'></i>{"Download Report"}
              </button>
            )
          }
          {
            props.upload && (
              <Button variant="primary" disabled={uploadState} className='btn-icon-text mx-5 p-2 d-inline-flex align-items-center' onClick={() => document.getElementById('uploadFile')?.click()} size="sm">
                <IconUpload className="w-5 h-5" /> <span className='mx-2'>{uploadState ? "Uploading..." : "Upload"}</span>
              </Button>
            )
          }
          {props.buttonText && (<button type="button"
            onClick={() => props.onTap && props.onTap()}
            className="btn btn-primary mx-2 my-2 btn-icon-text d-inline-flex align-items-center">
            <i className={`${props.buttonText === undefined ? 'fe fe-download-cloud' : 'ti-plus'} me-2`}></i>{props.buttonText ?? "Download Report"}
          </button>)}
        </div>
      </div>
    </div>
  )
}

export default PageHeader