import React from 'react'
import ReactDOM from 'react-dom'

const Loading = ({ fullScreen, absolute }) => {
  if (fullScreen)
    return ReactDOM.createPortal(
      <div className="modal fade show" style={{ display: 'block' }}>
        <div className="modal-dialog">
          <div className="lds-css ng-scope">
            <div style={{ width: '100%', height: '100%' }} className="lds-cube">
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>
      </div>,
      document.getElementsByTagName('body')[0]
    )
  return (
    <div className={`lds-wrap ${absolute ? 'absolute' : ''}`}>
      <div className="lds-ripple">
        <div />
        <div />
      </div>
    </div>
  )
}
export default Loading
