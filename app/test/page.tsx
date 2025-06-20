export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p>If you can see this, the Next.js app is deployed correctly.</p>
      <p>Build time: {new Date().toISOString()}</p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Environment Check:</h2>
        <ul className="list-disc pl-5 mt-2">
          <li>NODE_ENV: {process.env.NODE_ENV}</li>
          <li>VERCEL: {process.env.VERCEL || 'not set'}</li>
        </ul>
      </div>
    </div>
  );
}