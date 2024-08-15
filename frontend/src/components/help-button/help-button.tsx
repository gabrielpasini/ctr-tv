import { Container, DiscordIcon } from "./styles";

export default function HelpButton({ isMobile }: { isMobile: boolean }) {
  return (
    <a target="_blank" href="https://discord.gg/HB3mVw8">
      <Container isMobile={isMobile}>
        <p>Ajuda?</p>
        <DiscordIcon />
      </Container>
    </a>
  );
}
