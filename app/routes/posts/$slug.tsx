import { HeadersFunction, LoaderFunction, useLoaderData } from 'remix'
import invariant from 'tiny-invariant'
import { getPost, PostMarkdown } from '~/post'

export let headers: HeadersFunction = () => {
  return {
    'Cache-Control': 'max-age=3600, s-maxage=3600',
  }
}

export let loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'Expected params.slug')
  return getPost(params.slug)
}

export default function PostSlug() {
  let post = useLoaderData<PostMarkdown>()

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
    </div>
  )
}
