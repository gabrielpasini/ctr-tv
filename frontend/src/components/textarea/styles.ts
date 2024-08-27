import styled from "styled-components";

type TextareaTypes = {
  error?: boolean;
};

export const CustomTextarea = styled.textarea<TextareaTypes>`
  ${({ error }: TextareaTypes) =>
    error &&
    `
      border-color: red;
      :focus {
        border-color: red;
        box-shadow: inset 0px 0px 0px 1px red;
        box-sizing: border-box;
        --tw-ring-shadow: none;
      }
    `}
`;
