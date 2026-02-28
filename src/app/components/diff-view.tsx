export function DiffView({ diff }: { diff: string }) {
  return (
    <div>
      <h1>Diff View</h1>
      <pre>{diff}</pre>
    </div>
  );
}
