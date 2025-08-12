import DeleteTicketModal from "@/app/components/modal/tickets/DeleteTicketModal";

// For soft navigation to the delete page
export default async function InterceptedPage({ params }) {
  const { id } = await params;
  return <DeleteTicketModal ticketId={id} />;
}
