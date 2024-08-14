import { CgPlayButtonR } from "react-icons/cg";
import { HiOutlineDownload } from "react-icons/hi";
import styled from "styled-components";

const iconStyles = `
    display: inline-block;
    color: #6366f1;
    height: 23px;
    width: 23px;
    margin-right: 4px;
    margin-top: -2px;
`;

export const PlayIcon = styled(CgPlayButtonR)`
  ${iconStyles}
`;

export const DownloadIcon = styled(HiOutlineDownload)`
  ${iconStyles}
`;
