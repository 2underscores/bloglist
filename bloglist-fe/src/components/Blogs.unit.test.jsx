import { render, screen } from "@testing-library/react";
import { useState } from "react";
import { beforeEach, describe, test } from "vitest"; // TODO: Sort globals
import Blogs from "./Blogs";

const TestWrapper = () => {
  const blogContents = [{
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
  const [blogs, setBlogs] = useState(blogContents)
  // const mockAuth = vi.fn()
  // const mockPushNotif = vi.fn()
  return <Blogs blogs={blogs} setBlogs={setBlogs} />
}

describe('<Blogs/>', () => {
  let container

  beforeEach(() => {
    container = render(<TestWrapper />).container
  })

  test('Renders', () => {
    screen.getByText('TestTitle1')
  })

})