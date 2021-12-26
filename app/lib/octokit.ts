require('dotenv').config()
import { Octokit } from 'octokit'

let octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

export default octokit
