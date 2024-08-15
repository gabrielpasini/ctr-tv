export const team = [
  {
    name: "Vovô Bala Tensa",
    description: `• Streamer;\n• Host do CBRT;\n• Jogador de CTR;`,
    href: "https://www.youtube.com/c/Vov%C3%B4BalaTensa",
    imageUrl: "https://i.imgur.com/lzC4Ru6.jpg",
  },
  {
    name: 'Gabriel "FAISKA" Pasini',
    description: `• Desenvolvedor de Software;\n• Engenheiro de computação;\n• Fã de Crash Bandicoot;\n• Streamer nas horas vagas;`,
    href: "https://www.youtube.com/c/FAISKAO",
    imageUrl: "https://avatars.githubusercontent.com/u/34244299?v=4",
  },
];

export default function Team() {
  return (
    <div className="bg-dark w-full h-full">
      <div className="w-full pt-8 px-4 relative max-w-7xl mx-auto md:static">
        <h1 className="text-4xl font font-extrabold tracking-tight text-white md:text-6xl mb-4">
          Quem somos
        </h1>
        {team.map((member, index) => (
          <a key={index} target="_blank" href={member.href}>
            <div className="bg-light md:flex hover:opacity-75 pointer group relative mb-10 min-w-lg lg:mx-auto rounded-md shadow-lg overflow-hidden xs:w-full">
              <img
                className="sm:w-full md:w-80"
                src={member.imageUrl}
                alt={member.name}
              />
              <pre className="pb-8 md:pb-2 pt-8 px-8">
                <span className="text-gray-900 block text-2xl font-bold">
                  {member.name}
                </span>
                <p className="text-gray-500 text-sm mt-2">
                  {member.description}
                </p>
              </pre>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
