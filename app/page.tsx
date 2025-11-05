export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Bienvenue sur Lieux d&apos;Exception
        </h1>
        <p className="text-center text-lg mb-8">
          Découvrez des lieux uniques et exceptionnels
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Restaurants</h2>
            <p className="text-gray-600">Des établissements gastronomiques d&apos;exception</p>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Hôtels</h2>
            <p className="text-gray-600">Des hébergements de luxe uniques</p>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Événements</h2>
            <p className="text-gray-600">Des espaces pour vos événements spéciaux</p>
          </div>
        </div>
      </div>
    </main>
  );
}