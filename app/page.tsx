import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">Welcome to Our App</h1>
      <div className="space-x-4">
        <Link
          href="/login"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
