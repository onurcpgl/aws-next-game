import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6
                    bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
                    text-white">
      <h1 className="text-4xl font-extrabold mb-10 drop-shadow-lg">Oyun Seç</h1>

      <Link href="/block-game">
        <button className="px-8 py-4 bg-white text-purple-600 font-bold rounded-2xl shadow-lg 
                           hover:bg-purple-100 transition transform hover:scale-105">
          Blok Oyunu
        </button>
      </Link>

      <Link href="/snake-game">
        <button className="px-8 py-4 bg-white text-green-600 font-bold rounded-2xl shadow-lg 
                           hover:bg-green-100 transition transform hover:scale-105">
          Yılan Oyunu
        </button>
      </Link>
    </div>
  );
}
