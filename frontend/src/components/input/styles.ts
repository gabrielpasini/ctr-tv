import styled from "styled-components";

type InputTypes = {
  error?: boolean;
};

export const CustomInput = styled.input<InputTypes>`
  ${({ error }: InputTypes) =>
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
