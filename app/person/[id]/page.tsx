import PersonDetailsPage from '@/app/PersonDetailsPage/page'

// This is a dynamic route page component that receives params from the URL
export default function PersonPage({ params }: { params: { id: string } }) {
  return <PersonDetailsPage params={params} />
}
