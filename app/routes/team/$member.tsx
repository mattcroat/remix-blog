import { LinksFunction, LoaderFunction, useLoaderData } from 'remix'
import styles from '../../styles/team.$member.css'

interface User {
  avatar_url: string
  bio: string
  company: string
  location: string
  name: string
}

export const loader: LoaderFunction = ({ params }) => {
  return fetch(`https://api.github.com/users/${params.member}`)
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export function meta({ data }: { data: User }) {
  return {
    title: data.name,
  }
}

export default function TeamMember() {
  const user = useLoaderData<User>()

  return (
    <div>
      <h3>{user.name}</h3>
      <img alt="User avatar" src={user.avatar_url} height={50} />
      <p>{user.bio}</p>
      <dl>
        <dt>Company</dt>
        <dd>{user.company}</dd>
        <dt>Location</dt>
        <dd>{user.location}</dd>
      </dl>
    </div>
  )
}
