import { Link, useLoaderData } from 'remix'
import { getPosts, Post } from '~/post'

export let loader = async () => {
  return getPosts()
}

export default function AdminPage() {
  let posts = useLoaderData<Post[]>()

  return (
    <div>
      <nav>
        <h1>Posts</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`./edit/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
