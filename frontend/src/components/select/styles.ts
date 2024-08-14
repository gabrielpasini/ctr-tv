import styled from "styled-components";

type SelectTypes = {
  error?: boolean;
};

export const CustomSelect = styled.select<SelectTypes>`
  ${(props: SelectTypes) =>
    props.error &&
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
