import {
  act,
  render as stlRender
} from '..'
import Comp from './fixtures/Comp'
import CompDefault from './fixtures/Comp.html'

describe('render', () => {
  let props

  const render = () => {
    return stlRender(Comp, {
      target: document.body,
      props
    })
  }

  beforeEach(() => {
    props = {
      name: 'World'
    }
  })

  test('renders component into the document', () => {
    const { getByText } = render()

    expect(getByText('Hello World!')).toBeInTheDocument()
  })

  // Dear reader, this is not something you generally want to do in your tests.
  test('programmatically change props', async () => {
    const { component, getByText } = render()

    expect(getByText('Hello World!')).toBeInTheDocument()

    await act(() => {
      component.$set({ name: 'Worlds' })
    })

    expect(getByText('Hello Worlds!')).toBeInTheDocument()
  })

  test('should accept props directly', () => {
    const { getByText } = stlRender(Comp, { name: 'World' })
    expect(getByText('Hello World!')).toBeInTheDocument()
  })

  test('should accept svelte component options', () => {
    const target = document.createElement('div')
    const div = document.createElement('div')
    document.body.appendChild(target)
    target.appendChild(div)
    const { container } = stlRender(Comp, {
      target,
      anchor: div,
      props: { name: 'World' }
    })
    expect(container).toMatchSnapshot()
  })

  test('should return a container object, which contains the DOM of the rendered component', () => {
    const { container } = render()

    expect(container.innerHTML).toBe(document.body.innerHTML)
  })

  test('correctly find component constructor on the default property', () => {
    const { getByText } = render(CompDefault, { props: { name: 'World' } })

    expect(getByText('Hello World!')).toBeInTheDocument()
  })
})
