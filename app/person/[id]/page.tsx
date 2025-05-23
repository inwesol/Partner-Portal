import PersonDetailsPage from "@/app/PersonDetailsPage/page";

// This is a dynamic route page component that receives params from the URL
export default function PersonPage({ params }) {
  return <PersonDetailsPage params={params} />;
}