import { ActionFunction, Form, redirect, useTransition } from 'remix'

export const action: ActionFunction = async ({ request }) => {
  const token = ''
  const body = new URLSearchParams(await request.text())
  const fileName = body.get('fileName') ?? ''
  const content = body.get('content') ?? ''

  await fetch('https://api.github.com/gists', {
    method: 'post',
    body: JSON.stringify({
      description: 'Created from Remix',
      public: true,
      files: { [fileName]: { content } },
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${token}`,
    },
  })

  return redirect('/gists')
}

export default function NewGist() {
  const transition = useTransition()

  return (
    <>
      <h2>New Gist</h2>
      {transition.state === 'submitting' ? (
        <div>
          <p>
            <Loading /> Creating gist:
            {transition.submission.formData.get('fileName')}
          </p>
        </div>
      ) : (
        <Form method="post">
          <p>
            <label>
              Gist file name:
              <br />
              <input type="text" name="fileName" required />
            </label>
          </p>
          <p>
            <label>
              Content:
              <br />
              <textarea rows={10} name="content" required></textarea>
            </label>
          </p>
          <p>
            <button type="submit">Create Gist</button>
          </p>
        </Form>
      )}
    </>
  )
}

function Loading() {
  return (
    <svg
      className="spin"
      style={{ height: '1rem' }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
}
