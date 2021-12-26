import parseFrontMatter from 'front-matter'
import invariant from 'tiny-invariant'
import { marked } from 'marked'

import octokit from '~/lib/octokit'

export interface Post {
  slug: string
  title: string
}

export interface PostMarkdown extends Post {
  html: string
  body: string
}

export interface PostMarkdownAttributes {
  title: string
}

interface NewPost {
  title: string
  slug: string
  markdown: string
}

interface RateLimit {
  limit: number
  remaining: number
  reset: number
  used: number
}

function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return attributes?.title
}

async function getRateLimit(): Promise<RateLimit> {
  return (await octokit.rest.rateLimit.get()).data.rate
}

export async function getPosts(): Promise<Post[]> {
  let { data: posts } = await octokit.rest.repos.getContent({
    owner: 'mattcroat',
    repo: 'remix-blog',
    path: 'posts',
  })

  if (!Array.isArray(posts)) {
    return []
  }

  let allPosts = Promise.all(
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

      invariant(isValidPostAttributes(attributes), `${post} has bad meta data!`)

      return {
        slug: post.name.replace('.md', ''),
        title: attributes.title,
      }
    })
  )

  console.log(await getRateLimit())

  return allPosts
}

export async function getPost(slug: string): Promise<PostMarkdown> {
  let path = `posts/${slug}.md`

  let { data: post } = await octokit.rest.repos.getContent({
    mediaType: {
      format: 'raw',
    },
    owner: 'mattcroat',
    repo: 'remix-blog',
    path,
  })

  let { attributes, body } = parseFrontMatter(post.toString())

  invariant(
    isValidPostAttributes(attributes),
    `Post ${path} is missing attributes`
  )

  let html = marked(body)

  console.log(await getRateLimit())

  return { slug, html, body, title: attributes.title }
}

// export async function createPost(post: NewPost) {
//   let md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`
//   await fs.writeFile(path.join(postsPath, `${post.slug}.md`), md)
//   return getPost(post.slug)
// }
