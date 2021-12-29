import { HeadersFunction, Link, useLoaderData } from 'remix'
import { getPosts, Post } from '~/post'

export let headers: HeadersFunction = () => {
  return {
    'Cache-Control': 'max-age=3600, s-maxage=3600',
  }
}

export let loader = async () => {
  return getPosts()
}

export default function Posts() {
  let posts = useLoaderData<Post[]>()

  return (
    <div>
      <nav>
        <h1>Posts</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={post.slug}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
