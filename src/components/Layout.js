import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { Link } from 'react-router-dom'

class Layout extends Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col>
            <Breadcrumb>
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <Breadcrumb.Item active>Data</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row>
          <Col>{this.props.children}</Col>
        </Row>
      </Container>
    )
  }
}

export default Layout
