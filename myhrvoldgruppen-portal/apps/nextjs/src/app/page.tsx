export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-teal-600 to-teal-800">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Myhrvold<span className="text-orange-400">gruppen</span>
        </h1>
        <p className="text-xl text-teal-100">
          Service Portal - Under utvikling
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-6 text-white hover:bg-white/20">
            <h3 className="text-2xl font-bold">Web Portal →</h3>
            <p className="text-lg">Dashboard, reklamasjoner, service</p>
          </div>
          <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-6 text-white hover:bg-white/20">
            <h3 className="text-2xl font-bold">Mobil App →</h3>
            <p className="text-lg">iOS og Android via Expo</p>
          </div>
        </div>
      </div>
    </main>
  );
}
