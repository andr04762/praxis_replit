import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { data } = useQuery<{ email: string }>({ queryKey: ["/api/me"] });

  if (!data) return <p>Loading...</p>;

  return <div className="p-4">{data.email}</div>;
}
