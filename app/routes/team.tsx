import { Link, Outlet } from 'react-router-dom'
import { LinksFunction, LoaderFunction, useLoaderData } from 'remix'
import styles from '../styles/team.css'

interface Member {
  id: string
  login: string
}

export const loader: LoaderFunction = () => {
  return fetch('https://api.github.com/orgs/reacttraining/members')
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export function meta() {
  return {
    title: 'Team',
  }
}

export default function Team() {
  const data = useLoaderData<Member[]>()

  return (
    <div>
      <h2>Team</h2>
      <ul>
        {data.map((member) => (
          <li key={member.id}>
            <Link to={member.login}>{member.login}</Link>
          </li>
        ))}
        <hr />
        <Outlet />
      </ul>
    </div>
  )
}
