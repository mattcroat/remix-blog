import { json, LoaderFunction, useLoaderData } from 'remix'

interface Gist {
  [key: string]: any
}

export const loader: LoaderFunction = async () => {
  const res = await fetch('https://api.github.com/gists')
  const gists = await res.json()

  return json(gists, {
    headers: {
      'Cache-Control': 'max-age=300',
    },
  })
}

export function meta({ data }: { data: Gist[] }) {
  return {
    title: 'Public Gists',
    description: `View the latest ${data.length} gists from the public`,
  }
}

export default function Gists() {
  const data = useLoaderData()

  return (
    <div>
      <h2>Public Gists</h2>
      <ul>
        {data.map((gist: any) => (
          <li key={gist.id}>
            <a href={gist.html_url}>{Object.keys(gist.files)[0]}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
