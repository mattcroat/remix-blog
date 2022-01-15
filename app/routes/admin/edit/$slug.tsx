import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useLoaderData,
} from 'remix'
import { getPost, PostMarkdown, updatePost } from '~/post'

export let loader: LoaderFunction = async ({ params }) => {
  return getPost(params.slug)
}

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData()
  let title = formData.get('title')
  let slug = formData.get('slug')
  let markdown = formData.get('markdown')

  if (!title || !slug || !markdown) {
    throw new Error(`Fields can't be empty`)
  }

  updatePost(markdown, slug)
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
        <input name="slug" type="text" defaultValue={post.slug} />
      </p>
      <p>
        <textarea
          name="markdown"
          cols={40}
          rows={10}
          defaultValue={post.markdown}
        />
      </p>
      <p>
        <button type="submit">Save Post</button>
      </p>
    </Form>
  )
}
