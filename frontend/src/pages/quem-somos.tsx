export const equipe = [
  {
    name: 'Gabriel "FAISKA" Pasini',
    description: `• Desenvolvedor de Software;\n• Engenheiro de computação;`,
    href: "https://pasini.dev",
    imageUrl: "https://github.com/gabrielpasini.png",
  },
];

export default function QuemSomos() {
  return (
    <div className="bg-dark-blue w-full h-full">
      <div className="w-full pt-8 px-4 relative max-w-7xl mx-auto md:static">
        <h1 className="text-4xl font font-extrabold tracking-tight text-white md:text-6xl mb-4">
          Quem somos
        </h1>
        {equipe.map((membro, index) => (
          <a key={index} target="_blank" href={membro.href}>
            <div className="bg-light-blue md:flex hover:opacity-75 pointer group relative mb-10 min-w-lg lg:mx-auto rounded-md shadow-lg overflow-hidden xs:w-full">
              <img
                className="sm:w-full md:w-80"
                src={membro.imageUrl}
                alt={membro.name}
              />
              <pre className="pb-8 md:pb-2 pt-8 px-8">
                <span className="text-gray-900 block text-2xl font-bold">
                  {membro.name}
                </span>
                <p className="text-gray-500 text-sm mt-2">
                  {membro.description}
                </p>
              </pre>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
