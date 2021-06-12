import { withSSRContext } from 'aws-amplify'
import { Post } from '../src/models'
import Markdown from 'react-markdown'
import { useRouter } from 'next/router'

export default function PostComponent({ post }) {
  console.log({post})
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <Markdown children={post.content} />
    </div>
  )
}

export async function getStaticPaths(req) {
  const { DataStore } = withSSRContext(req)
  const posts = await DataStore.query(Post)
  const paths = posts.map(post => ({ params: { id: post.id }}))
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(req) {
  console.log({req})
  const { DataStore } = withSSRContext(req)
  const { params } = req
  const { id } = params
  console.log(id)
  const post = await DataStore.query(Post, id)
  console.log(post)
  return {
    props: {
      post: JSON.parse(JSON.stringify(post))
    },
    revalidate: 1
  }

}