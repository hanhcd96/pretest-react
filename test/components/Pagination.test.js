import React, { useState } from 'react'
import renderer from 'react-test-renderer'
import Pagination from '../../src/components/Pagination'

test('Pagination render logic', () => {
  const Mork = () => {
    const [activePage, setActivePage] = useState(1)
    return (
      <Pagination
        onSelect={setActivePage}
        maxButtons={5}
        boundaryLinks
        ellipsis
        first
        last
        activePage={activePage}
        items={10}
      />
    )
  }
  const component = renderer.create(<Mork />)
  let tree = component.toJSON()
  expect(tree.children).toHaveLength(9)
  expect(tree).toMatchSnapshot()
})
