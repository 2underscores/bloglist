import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { useState } from "react";
import { beforeEach, describe, expect, test } from "vitest"; // TODO: Sort globals
import Blogs from "./Blogs";

// Mock the entire blog service module
vi.mock('../services/blogs', () => ({
  default: {
    like: vi.fn(),
    delete: vi.fn()
  }
}))

const testBlogsContents = [{
  id: 'blog_id_1',
  author: 'TestAuthor1',
  title: 'TestTitle1',
  url: 'http://testurl1.io',
  likes: 1,
}, {
  id: 'blog_id_2',
  author: 'TestAuthor2',
  title: 'TestTitle2',
  url: 'http://testurl2.io',
  likes: 2,
}]

const TestWrapper = () => {
  const [blogs, setBlogs] = useState(testBlogsContents)
  // const mockAuth = vi.fn()
  // const mockPushNotif = vi.fn()
  return <Blogs auth={{}} blogs={blogs} setBlogs={setBlogs} />
}

describe('<Blogs/>', () => {
  // eslint-disable-next-line no-unused-vars
  let container // For selecting with queryselector (CSS classes, etc.). Try use screen i.e. what the user sees

  beforeEach(() => {
    container = render(<TestWrapper />).container
  })

  test('Blog renders as collapsed', () => {
    // Do i check for "collapsed" classname, or collapsed text?
    // Resilient to refactor of what is shown vs names
    // Text is truer to testing UX. Title will near certainly be in full, and url almost certainly collapsed
    // Works for both CSS display hiding, and unmounting for collapse
    screen.getByText(testBlogsContents[0].author)
    expect(screen.queryByText(testBlogsContents[0].url)).not.toBeInTheDocument()
  })

  // TODO: Expanding blog
  test('Blog can be expanded', async () => {
    // User expands first blog
    const user = userEvent.setup()
    const expandButtons = screen.getAllByText('View')
    await user.click(expandButtons[0])
    // Test first expanded, second not
    screen.getByText(testBlogsContents[0].author, { exact: false })
    screen.getByText(testBlogsContents[0].url, { exact: false })
    expect(screen.queryByText(testBlogsContents[1].url), { exact: false }).not.toBeInTheDocument()
  })
  // TODO: Like button
  test('Blog can be liked', async () => {
    const user = userEvent.setup()
    const expandButtons = screen.getAllByText('View')
    await user.click(expandButtons[0])
    screen.getByText(`Likes: ${testBlogsContents[0].likes}`)
    const likeButton = screen.getByRole('button', { name: /like/i })
    await user.click(likeButton)
    screen.getByText(`Likes: ${testBlogsContents[0].likes + 1}`)
  })
})