import Document from "./Document";

export default function Loading({ title }: { title: string }) {
  return (
    <>
      <Document title={title} />
      <div className="flex flex-col h-screen justify-center items-center">
        <img src="/loading.svg" alt="Loading animation" className="w-48" />
      </div>
    </>
  );
}
