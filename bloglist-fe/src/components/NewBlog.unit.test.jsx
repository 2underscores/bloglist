import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test } from 'vitest'
import blogService from '../services/blogs'
import NewBlog from './NewBlog'

vi.mock('../services/blogs', () => ({
  default: {
    create: vi.fn(),
  }
}))

const testNewBlogContents = {
  title: 'Test Title',
  author: 'Test Author',
  url: 'Test URL'
}

describe('<NewBlog/>', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    render(<NewBlog
      auth={{ tokenEncoded: 'fake-token' }}
      setBlogs={vi.fn()}
      pushNotif={vi.fn()}
      parentToggle={{ current: { toggleSelf: vi.fn() } }}
    />)
  })

  test('Form clears after submission', async () => {
    const user = userEvent.setup()

    // Get all inputs
    const titleInput = screen.getByRole('textbox', { name: 'Title:' })
    const authorInput = screen.getByRole('textbox', { name: 'Author:' })
    const urlInput = screen.getByRole('textbox', { name: 'URL:' })

    // Check inputs start empty
    expect(titleInput).toHaveValue('')
    expect(authorInput).toHaveValue('')
    expect(urlInput).toHaveValue('')

    // Fill the inputs
    await user.type(titleInput, testNewBlogContents.title)
    await user.type(authorInput, testNewBlogContents.author)
    await user.type(urlInput, testNewBlogContents.url)

    // Verify inputs were filled
    expect(titleInput).toHaveValue(testNewBlogContents.title)
    expect(authorInput).toHaveValue(testNewBlogContents.author)
    expect(urlInput).toHaveValue(testNewBlogContents.url)

    // Mock successful blog creation
    blogService.create.mockResolvedValueOnce({
      id: 'test-id',
      title: testNewBlogContents.title,
      author: testNewBlogContents.author,
      url: testNewBlogContents.url
    })

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create/i })
    await user.click(submitButton)

    // Verify API was called with correct data
    expect(blogService.create).toHaveBeenCalledWith(
      'fake-token',
      {
        title: testNewBlogContents.title,
        author: testNewBlogContents.author,
        url: testNewBlogContents.url
      }
    )

    // Verify inputs were cleared
    expect(titleInput).toHaveValue('')
    expect(authorInput).toHaveValue('')
    expect(urlInput).toHaveValue('')
  })
})