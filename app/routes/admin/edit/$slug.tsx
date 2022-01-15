import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useLoaderData,
} from 'remix'
import { getPost, PostMarkdown } from '~/post'

export let loader: LoaderFunction = async ({ params }) => {
  return getPost(params.slug)
}

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData()

  let title = formData.get('title')
  let markdown = formData.get('markdown')

  console.log({ title, markdown })

  // updatePost(post)

  return redirect('/admin')
}

export default function PostSlug() {
  let post = useLoaderData<PostMarkdown>()

  return (
    <Form method="post">
      <p>
        <input name="title" type="text" defaultValue={post.title} />
      </p>
      <p>
        <textarea name="markdown" rows={20} defaultValue={post.body} />
      </p>
      <p>
        <button type="submit">Save Post</button>
      </p>
    </Form>
  )
}
