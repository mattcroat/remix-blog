import { Link, useLoaderData } from 'remix'
import { Octokit } from 'octokit'
import parseFrontMatter from 'front-matter'

import { Post } from '~/post'

export let loader = async () => {
  let octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  })

  let { data: posts } = await octokit.rest.repos.getContent({
    owner: 'mattcroat',
    repo: 'remix-blog',
    path: 'posts',
  })

  posts = await Promise.all(
    posts.map(async (post) => {
      let { data } = await octokit.rest.repos.getContent({
        mediaType: {
          format: 'raw',
        },
        owner: 'mattcroat',
        repo: 'remix-blog',
        path: post.path,
      })

      let { attributes } = parseFrontMatter(data.toString())

      return {
        slug: post.name.replace('.md', ''),
        title: attributes.title,
      }
    })
  )

  return posts
}

export default function Posts() {
  let posts = useLoaderData<Post[]>()
  console.log(posts)

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
