import { Menu } from "@headlessui/react";
import { FiUser } from "react-icons/fi";
import styled from "styled-components";

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 1;
`;

export const UserIcon = styled(FiUser)`
  color: #fff;
  height: 24px;
  width: 24px;
  margin: 4px;
`;

export const MenuItems = styled<any>(Menu.Items)`
  z-index: 100;
`;
