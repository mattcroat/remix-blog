import { HeadersFunction, LoaderFunction, useLoaderData } from 'remix'
import { getPost, PostMarkdown } from '~/post'

export let headers: HeadersFunction = () => {
  return {
    'X-Gon-Give-It-To-Ya': 'DMX',
    'Cache-Control': 'max-age=300, s-maxage=3600',
  }
}

export let loader: LoaderFunction = async ({ params }) => {
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
