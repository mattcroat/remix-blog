import parseFrontMatter from 'front-matter'
import { marked } from 'marked'

import octokit from '~/lib/octokit'

interface Frontmatter {
  title: string
  description: string
  slug: string
  published: string
  category: string
  image: string
  draft: boolean
}

interface RateLimit {
  limit: number
  remaining: number
  reset: number
  used: number
}

let repo = {
  owner: 'mattcroat',
  repo: 'remix-blog',
}

async function getRateLimit(): Promise<RateLimit> {
  return (await octokit.rest.rateLimit.get()).data.rate
}

export async function getPosts(): Promise<any[]> {
  let { data: posts } = await octokit.rest.repos.getContent({
    ...repo,
    path: 'posts',
  })

  if (!Array.isArray(posts)) {
    return []
  }

  let allPosts = Promise.all(
    posts.map(async (post) => {
      let { data: posts } = await octokit.rest.repos.getContent({
        ...repo,
        mediaType: { format: 'raw' },
        path: post.path,
      })

      let { attributes } = parseFrontMatter(posts.toString())

      console.log(parseFrontMatter(posts.toString()))

      return {
        slug: post.name.replace('.md', ''),
        title: attributes.title,
      }
    })
  )

  return allPosts
}

export async function getPost(slug: string): Promise<any> {
  let { data: post } = await octokit.rest.repos.getContent({
    ...repo,
    mediaType: { format: 'raw' },
    path: `posts/${slug}.md`,
  })

  let { attributes, body } = parseFrontMatter(post.toString())
  let html = marked(body)

  return {
    slug,
    html,
    title: attributes.title,
    markdown: post,
  }
}

export async function getPostId(slug: string): Promise<string> {
  let { data: post } = await octokit.rest.repos.getContent({
    ...repo,
    path: `posts/${slug}.md`,
  })

  if (Array.isArray(post)) {
    throw new Error('Oops!')
  }

  return post.sha
}

export async function updatePost(content: string, slug: string) {
  await octokit.rest.repos.createOrUpdateFileContents({
    ...repo,
    path: `posts/${slug}.md`,
    message: 'chore: :robot: Updated using the GitHub API',
    content: Buffer.from(content, 'utf-8').toString('base64'),
    sha: await getPostId(slug),
  })
}

// export async function createPost(post: NewPost) {
//   let md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`
//   await fs.writeFile(path.join(postsPath, `${post.slug}.md`), md)
//   return getPost(post.slug)
// }
