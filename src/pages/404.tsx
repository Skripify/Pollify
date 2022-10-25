import Document from "@/components/Document";

export default function NotFound({ type }: { type?: string }) {
  return (
    <>
      <Document title="Not Found" />
      <main className="flex flex-col h-screen justify-center text-center">
        <h1 className="text-6xl font-bold">Whoops.</h1>
        <div className="p-1" />
        <p>That {type ?? "page"} you tried to visit doesn't exist.</p>
      </main>
    </>
  );
}
