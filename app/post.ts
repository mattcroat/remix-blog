import parseFrontMatter from 'front-matter'
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

      return {
        slug: post.name.replace('.md', ''),
        title: attributes.title,
      }
    })
  )

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

  let html = marked(body)

  return { slug, html, body, title: attributes.title }
}

export async function updatePost(post: PostMarkdown) {
  // await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
  // })

  // message: commit message
  // content: new file content base64
  // sha: blob sha of the file being replaced
  // query the file for the sha I guess?
  // look into octokit plugins

  await octokit.rest.repos.createOrUpdateFileContents({
    owner: 'mattcroat',
    repo: 'remix-blog',
    path: `posts/${post.slug}`,
    message: 'message',
    content: 'content',
  })
}

// export async function createPost(post: NewPost) {
//   let md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`
//   await fs.writeFile(path.join(postsPath, `${post.slug}.md`), md)
//   return getPost(post.slug)
// }
