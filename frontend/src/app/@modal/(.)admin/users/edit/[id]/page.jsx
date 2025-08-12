import EditUserModal from "@/app/components/modal/users/EditUserModal";

// For soft navigation to the edit page
export default async function InterceptedPage({ params }) {
  const { id } = await params;
  return <EditUserModal userId={id} />;
}
