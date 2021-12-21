import { LoaderFunction, useLoaderData } from 'remix'
import invariant from 'tiny-invariant'
import { getPost, Post } from '~/post'

export let loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'Expected params.slug')
  return getPost(params.slug)
}

export default function PostSlug() {
  let post = useLoaderData<Post>()

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
    </div>
  )
}
