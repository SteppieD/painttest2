export default function TestPage() {
  return (
    <div>
      <h1>Test Page</h1>
      <p>If you can see this, the Next.js app is deployed correctly.</p>
      <p>Build time: {new Date().toISOString()}</p>
      <div>
        <h2>Environment Check:</h2>
        <ul>
          <li>NODE_ENV: {process.env.NODE_ENV}</li>
          <li>VERCEL: {process.env.VERCEL || 'not set'}</li>
        </ul>
      </div>
    </div>
  );
}