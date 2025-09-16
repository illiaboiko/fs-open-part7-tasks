import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('form calls event handler with correct data', async () => {
    const mockNewBlogHandler = vi.fn()
    const user = userEvent.setup()

    const inputData = {
      title: 'test title',
      author: 'test author',
      url: 'test url',
    }

    const container = render(
      <BlogForm createBlog={mockNewBlogHandler} />
    ).container

    const inputTitle = container.querySelector('#title')
    const inputAuthor = container.querySelector('#author')
    const inputUrl = container.querySelector('#url')

    const createButton = container.querySelector('#createBlog')

    await user.type(inputTitle, inputData.title)
    await user.type(inputAuthor, inputData.author)
    await user.type(inputUrl, inputData.url)

    await user.click(createButton)

    expect(mockNewBlogHandler.mock.calls).toHaveLength(1)
    expect(mockNewBlogHandler.mock.calls[0][0].title).toBe(
      inputData.title
    )

    expect(mockNewBlogHandler.mock.calls[0][0].author).toBe(
      inputData.author
    )

    expect(mockNewBlogHandler.mock.calls[0][0].url).toBe(
      inputData.url
    )
  })
})
