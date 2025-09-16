import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { beforeEach, expect, test, vi } from 'vitest'

describe('<Blog />', () => {
  let container

  const blog = {
    title: 'test title',
    author: 'illia boiko',
    likes: 10,
    url: 'google.com',
    user: {
      username: 'test user',
      id: '123455',
    },
  }

  const user = {
    username: 'test user',
  }

  test('renders title and author by default', () => {
    render(<Blog blog={blog} />)
    const blogElement = screen.getByText(`${blog.title} by ${blog.author}`)
    expect(blogElement).toBeDefined()
  })

  test('does not render additional info (likes and url) by default', () => {
    container = render(<Blog blog={blog} user={user} />).container
    const blogElement = container.querySelector('.additionalBlogInfo')
    expect(blogElement).toBeNull()
  })

  test('renders additional info when btn View is clicked', async () => {
    container = render(<Blog blog={blog} user={user} />).container
    const testUser = userEvent.setup()
    const button = screen.getByTestId('toggle-btn')
    await testUser.click(button)

    const element = container.querySelector('.additionalBlogInfo')
    expect(element).toBeDefined()
  })

  test('if Like button is clicked twice, event handler receives two calls', async () => {
    const mockLike = vi.fn()
    container = render(
      <Blog blog={blog} user={user} addLike={mockLike} />
    ).container

    const testUser = userEvent.setup()
    const button = screen.getByTestId('toggle-btn')
    await testUser.click(button)

    const likeBtn = screen.getByTestId('like-btn')
    await testUser.click(likeBtn)
    await testUser.click(likeBtn)

    expect(mockLike.mock.calls).toHaveLength(2)
  })
})
