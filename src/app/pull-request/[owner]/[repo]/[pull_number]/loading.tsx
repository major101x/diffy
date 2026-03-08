export default function Loading() {
  return (
    <div className="h-screen w-full px-4 flex flex-col justify-center items-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      <h1 className="text-4xl font-bold mb-4">Loading...</h1>
    </div>
  );
}
