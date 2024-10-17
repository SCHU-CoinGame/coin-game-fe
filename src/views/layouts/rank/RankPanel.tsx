import { css } from '@emotion/react';

const containerCss = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

const titleCss = css`
  font-size: 56px;
  font-family: 'GmarketSans-Medium';
  margin-bottom: 10px;
`;
const rankContainerCss = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

function RankPanel() {
  return (
    <div css={containerCss}>
      <div css={titleCss}>순천향대 코인왕</div>
      <div></div>
    </div>
  );
}

export { RankPanel };
