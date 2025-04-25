import { css } from "hono/css";

export const main = css`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 48rem;
  padding: 1rem;
  margin-left: auto;
  margin-right: auto;
`;
export const baseCard = css`
  background-color: #ff6900;
  color: black;
  padding: 1rem;
  border-radius: 5px;
  width: 100%;
  box-shadow: 4px 4px 0px 0px black;
`;
export const card = css`
  ${baseCard}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const button = css`
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 4px 0px 0px black;
  background-color: white;
  color: black;
  padding-inline: 16px;
  padding-block: 8px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 #0000;
    translate: 4px 4px;
  }
`;
