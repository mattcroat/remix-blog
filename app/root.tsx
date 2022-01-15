import {
  ErrorBoundaryComponent,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix'
import type { MetaFunction } from 'remix'

import styles from '~/styles/global.css'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

export let meta: MetaFunction = () => {
  return { title: 'Remix Blog' }
}

function Layout() {
  return (
    <ul>
      <li>
        <Link to="/posts">Posts</Link>
      </li>
    </ul>
  )
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout />
        <Outlet />
        <ScrollRestoration />
        {/* <Scripts /> */}
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

export let ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Oops!</h1>
        <div>ERROR: {error.message}</div>
        <Scripts />
      </body>
    </html>
  )
}
