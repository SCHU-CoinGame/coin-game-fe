import { css } from '@emotion/react';
import { HomeOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUserInfoStore, useCoinInfoStore } from 'stores/userInfoStore';
import { requestSignout } from 'api/requests/requestAuth';

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
  const changeUserInfo = useUserInfoStore((state) => state.changeUserInfo);
  const changeCoinInfo = useCoinInfoStore((state) => state.changeCoinInfo);
  const changeBalance = useCoinInfoStore((state) => state.changeBalance);

  const handleHomeClick = () => {
    // 사용자 정보 초기화
    changeUserInfo({
      name: '',
      department: '',
      student_id: '',
      nickname: '',
    });

    // 코인 정보 초기화
    changeCoinInfo({
      coin_1: { value: '', label: '' },
      coin_2: { value: '', label: '' },
      coin_3: { value: '', label: '' },
    });

    // 잔액 초기화
    changeBalance(0);
    requestSignout();
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
