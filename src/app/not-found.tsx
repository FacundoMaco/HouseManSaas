import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-xl">Página no encontrada</p>
      <p className="mt-2 text-gray-500">Lo sentimos, no pudimos encontrar lo que buscabas.</p>
    </div>
  );
}
