import { FaDiscord } from "react-icons/fa";
import styled from "styled-components";

type ContainerTypes = {
  isMobile: boolean;
};

export const Container = styled.div<ContainerTypes>`
  ${({ isMobile }: ContainerTypes) =>
    isMobile
      ? `
    width: 80px;
    height: 32px;
    `
      : `
    width: 100px;
    height: 40px;
    `};

  bottom: 10px;
  border-radius: 8px;
  background-color: #5865f2;
  position: fixed;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  opacity: 0.8;
  cursor: pointer;
  & p {
    margin-left: 4px;
    color: #fff;
    font-size: ${({ isMobile }: ContainerTypes) =>
      isMobile ? "10px" : "16px"};
  }
  :hover {
    opacity: 1;
  }
`;

export const DiscordIcon = styled(FaDiscord)`
  display: flex;
  align-items: flex-end;
  color: #fff;
  height: 32px;
  width: 32px;
  margin: 0 4px;
`;
