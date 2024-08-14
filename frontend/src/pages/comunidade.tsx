export default function Comunidade() {
  return (
    <div className="bg-light w-full h-full">
      <div className="pt-8 pb-16 max-w-7xl mx-auto px-4 flex xs-flex-col justify-between">
        <div className="md:max-w-lg md:pr-8">
          <h1 className="text-4xl font font-extrabold tracking-tight text-gray-900 md:text-6xl">
            Comunidade
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Não perca mais tempo e venha fazer parte da nossa comunidade...
          </p>
          <a
            className="mt-10 mb-10 md:mb-0 pointer inline-block text-center rounded-md py-3 px-8 font-medium text-white bg-highlight hover:bg-highlight-60"
            target="_blank"
            href="https://discord.gg/H32A8jw"
          >
            Participar!
          </a>
        </div>
        <div className="w-full shadow-lg">
          <iframe
            src="https://discord.com/widget?id=280820416602439690&theme=dark"
            style={{ minHeight: 360 }}
            width="100%"
            height="100%"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}
