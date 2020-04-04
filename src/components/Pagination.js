import classNames from 'classnames'
import React from 'react'
import BsPagination from 'react-bootstrap/Pagination'
import PropTypes from 'prop-types'

class PaginationButton extends React.Component {
  static propTypes = {
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    eventKey: PropTypes.number,
    onSelect: PropTypes.func
  }
  _onClick = () => {
    const { eventKey, onSelect, disabled } = this.props
    if (disabled || !onSelect) return
    onSelect(eventKey)
  }
  render() {
    const { active, disabled } = this.props
    return (
      <BsPagination.Item active={active} disabled={disabled} onClick={this._onClick}>
        {this.props.children}
      </BsPagination.Item>
    )
  }
}

const propTypes = {
  activePage: PropTypes.number,
  items: PropTypes.number,
  maxButtons: PropTypes.number,
  boundaryLinks: PropTypes.bool,
  ellipsis: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  first: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  last: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  prev: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  next: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),

  onSelect: PropTypes.func
}

const defaultProps = {
  activePage: 1,
  items: 1,
  maxButtons: 0,
  first: false,
  last: false,
  prev: false,
  next: false,
  ellipsis: true,
  boundaryLinks: false
}

class Pagination extends React.Component {
  renderPageButtons(activePage, items, maxButtons, boundaryLinks, ellipsis, buttonProps) {
    const pageButtons = []

    let startPage
    let endPage

    if (maxButtons && maxButtons < items) {
      startPage = Math.max(Math.min(activePage - Math.floor(maxButtons / 2, 10), items - maxButtons + 1), 1)
      endPage = startPage + maxButtons - 1
    } else {
      startPage = 1
      endPage = items
    }

    for (let page = startPage; page <= endPage; ++page) {
      pageButtons.push(
        <PaginationButton {...buttonProps} key={page} eventKey={page} active={page === activePage}>
          {page}
        </PaginationButton>
      )
    }

    if (ellipsis && boundaryLinks && startPage > 1) {
      if (startPage > 2) {
        pageButtons.unshift(
          <PaginationButton key="ellipsisFirst" disabled componentClass={buttonProps.componentClass}>
            <span aria-label="More">{ellipsis === true ? '\u2026' : ellipsis}</span>
          </PaginationButton>
        )
      }

      pageButtons.unshift(
        <PaginationButton {...buttonProps} key={1} eventKey={1} active={false}>
          1
        </PaginationButton>
      )
    }

    if (ellipsis && endPage < items) {
      if (!boundaryLinks || endPage < items - 1) {
        pageButtons.push(
          <PaginationButton key="ellipsis" disabled componentClass={buttonProps.componentClass}>
            <span aria-label="More">{ellipsis === true ? '\u2026' : ellipsis}</span>
          </PaginationButton>
        )
      }

      if (boundaryLinks) {
        pageButtons.push(
          <PaginationButton {...buttonProps} key={items} eventKey={items} active={false}>
            {items}
          </PaginationButton>
        )
      }
    }

    return pageButtons
  }

  render() {
    const {
      activePage,
      items,
      maxButtons,
      boundaryLinks,
      ellipsis,
      first,
      last,
      prev,
      next,
      onSelect,
      className
    } = this.props
    const buttonProps = {
      onSelect
    }
    return (
      <BsPagination className={classNames(className)}>
        {first && (
          <PaginationButton {...buttonProps} eventKey={1} disabled={activePage === 1}>
            <span aria-label="First">{first === true ? '\u00ab' : first}</span>
          </PaginationButton>
        )}
        {prev && (
          <PaginationButton {...buttonProps} eventKey={activePage - 1} disabled={activePage === 1}>
            <span aria-label="Previous">{prev === true ? '\u2039' : prev}</span>
          </PaginationButton>
        )}

        {this.renderPageButtons(activePage, items, maxButtons, boundaryLinks, ellipsis, buttonProps)}

        {next && (
          <PaginationButton {...buttonProps} eventKey={activePage + 1} disabled={activePage >= items}>
            <span aria-label="Next">{next === true ? '\u203a' : next}</span>
          </PaginationButton>
        )}
        {last && (
          <PaginationButton {...buttonProps} eventKey={items} disabled={activePage >= items}>
            <span aria-label="Last">{last === true ? '\u00bb' : last}</span>
          </PaginationButton>
        )}
      </BsPagination>
    )
  }
}

Pagination.propTypes = propTypes
Pagination.defaultProps = defaultProps

export default Pagination
