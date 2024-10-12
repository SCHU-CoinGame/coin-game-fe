import { css } from '@emotion/react';
import { HomeOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';

const containerCss = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
`;

const homeIconCss = css`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 24px;
  z-index: 1000;
`;

const contentCss = css`
  width: 100%;
  height: 100%;
  padding: 10px;
`;

function MainPanel() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/signin');
  };

  return (
    <div css={containerCss}>
      <HomeOutlined css={homeIconCss} onClick={handleHomeClick} />
      <div css={contentCss}>
        <Outlet />
      </div>
    </div>
  );
}

export { MainPanel };
