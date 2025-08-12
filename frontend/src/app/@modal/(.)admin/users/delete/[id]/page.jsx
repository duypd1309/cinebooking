import DeleteUserModal from "@/app/components/modal/users/DeleteUserModal";

// For soft navigation to the delete page
export default async function InterceptedPage({ params }) {
  const { id } = await params;
  return <DeleteUserModal userId={id} />;
}
