import { trpc } from "@/utils/trpc";

export default function Home() {
  const { data } = trpc.useQuery(["hello"]);

  if (!data) return <h1 className="text-4xl font-bold">Loading...</h1>;

  return <h1 className="text-4xl font-bold">{data.greeting}</h1>;
}
