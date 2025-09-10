export const RunStatus = async (eventId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_INNGEST_SERVER_URL}/v1/events/${eventId}/runs`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_INNGEST_SIGNIN_KEY}`,
    },
  });
  console.log('Content-Type:', response.headers.get("content-type"));


  if (!response.ok) {
    throw new Error(`Failed to fetch run status: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json.data;
};
