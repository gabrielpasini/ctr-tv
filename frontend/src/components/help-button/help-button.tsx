import { Container, DiscordIcon } from "./styles";

export default function HelpButton({ isMobile }: { isMobile: boolean }) {
  return (
    <a target="_blank" href="https://discord.gg/H32A8jw">
      <Container isMobile={isMobile}>
        <p>Ajuda?</p>
        <DiscordIcon />
      </Container>
    </a>
  );
}
