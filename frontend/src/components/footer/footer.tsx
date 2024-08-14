export default function Footer() {
  return (
    <div className="px-8 py-2 w-full text-sm text-center bg-white text-dark-blue">
      <p>
        Todos os direitos reservados &copy; CTR TV {new Date().getFullYear()}
      </p>
      <p>
        Leia nossos
        <a target="_blank" href="/termos-de-uso">
          <span className="w-full ml-2 underline underline-offset-2 hover:text-dark-blue-60">
            Termos de uso{" "}
            <img
              src="/assets/icons/external.svg"
              width="16"
              height="16"
              alt="external"
              className="inline-block"
            />
          </span>
        </a>
      </p>
    </div>
  );
}
