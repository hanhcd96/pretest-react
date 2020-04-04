import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

class ConfirmModal extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      show: false
    }
  }
  close = () => {
    this.setState({ show: false })
  }
  show = () => {
    this.setState({ show: true })
  }
  confirm = () => {
    if (typeof this.props.onConfirm === 'function') {
      const handle = this.props.onConfirm()
      if (typeof handle.then === 'function') {
        return handle.then(this.close)
      }
    }
    this.close()
  }
  render() {
    const { title, onConfirm } = this.props
    return (
      <>
        <Modal show={this.state.show} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{title || 'Confirm dialog'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.props.children || 'Are you sure?'}</Modal.Body>
          {typeof onConfirm === 'function' && (
            <Modal.Footer>
              <Button variant="secondary" onClick={this.close}>
                Close
              </Button>
              <Button variant="primary" onClick={this.confirm}>
                Confirm change
              </Button>
            </Modal.Footer>
          )}
        </Modal>
      </>
    )
  }
}

export default ConfirmModal
