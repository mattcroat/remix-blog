import { useEffect, useRef, useState } from 'react'
import { HeadersFunction, LoaderFunction, useLoaderData } from 'remix'
import { getPost, PostMarkdown } from '~/post'

let seconds = 60

export let headers: HeadersFunction = () => {
  return {
    'X-Gon-Give-It-To-Ya': 'DMX',
    'Cache-Control': `max-age=0, s-maxage=${seconds}`,
  }
}

export let loader: LoaderFunction = async ({ params }) => {
  return getPost(params.slug)
}

export default function PostSlug() {
  let [duration, setDuration] = useState(seconds)
  let post = useLoaderData<PostMarkdown>()

  useEffect(() => {
    if (duration === 0) return
    let interval = setInterval(() => setDuration(duration - 1), 1000)
    return () => clearInterval(interval)
  }, [duration])

  return (
    <div>
      <p style={{ color: 'tomato' }}>
        This page is valid for {duration} seconds
      </p>
      <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
    </div>
  )
}
