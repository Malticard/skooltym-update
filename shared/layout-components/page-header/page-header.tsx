import React from 'react'
interface PageHeaderProps {
  title: string
  children?: React.ReactNode
  link?: boolean
  item?: string
  active_item?: string
  buttonText?: string
  left?: boolean
  onTap?: () => void

}
const PageHeader = (props: PageHeaderProps) => {
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
          {props.buttonText && (<button type="button"
            onClick={() => props.onTap && props.onTap()}
            className="btn btn-primary my-2 btn-icon-text d-inline-flex align-items-center">
            <i className={`${props.buttonText === undefined ? 'fe fe-download-cloud' : 'ti-plus'} me-2`}></i>{props.buttonText ?? "Download Report"}
          </button>)}
        </div>
      </div>
    </div>
  )
}

export default PageHeader