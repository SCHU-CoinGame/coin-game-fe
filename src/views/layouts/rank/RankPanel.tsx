import { css } from '@emotion/react';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserData } from 'api/requests/requestCoin';
import { useUserInfoStore, useCoinInfoStore } from 'stores/userInfoStore';
import { requestSignout } from 'api/requests/requestAuth';
import { HintTag } from 'views/components/HintTag';

const homeIconCss = css`
  position: absolute;
  top: 15px;
  left: 15px;
  font-size: 24px;
  z-index: 1000;
`;

const containerCss = css`
  width: 900px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

const titleCss = css`
  font-size: 48px;
  font-family: 'GmarketSans-Medium';
  margin-top: 100px;
  margin-bottom: 10px;
`;

const rankContainerCss = css`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  overflow: scroll;
`;

const rankItemCss = css`
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 5fr 3fr 5fr;
  gap: 10px;
  align-items: center;
  gap: 10px;
`;

const balanceCss = (balance: number) => css`
  position: relative;
  text-align: center;
  font-size: 36px;
  color: ${balance >= 1600000000 ? '#C84A31' : '#0062DF'};
  font-family: 'SpoqaHanSansNeo-Bold';
`;

const rankCss = css`
  text-align: center;
  font-size: 32px;
  font-family: 'SpoqaHanSansNeo-Bold';
`;

function RankPanel() {
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
  const formatNumberWithComma = (number: number): string => {
    return new Intl.NumberFormat('en-US').format(number);
  };
  const sampleData = [
    {
      department: '컴퓨터공학과',
      balance: 1900000000,
      nickname: 'Coder123',
      coin_3: 'Bitcoin',
      coin_2: 'Ethereum',
      coin_1: 'Litecoin',
      student_id: '201',
      name: '임시훈',
    },
    {
      department: '의료IT',
      balance: 1800000000,
      nickname: 'MedTech',
      coin_3: 'Ripple',
      coin_2: 'Bitcoin',
      coin_1: 'Ethereum',
      student_id: '20195091',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
    {
      department: '전자공학과',
      balance: 1500000000,
      nickname: 'ElecMaster',
      coin_3: 'Dogecoin',
      coin_2: 'Cardano',
      coin_1: 'Polkadot',
      student_id: '20184567',
      name: '임시훈',
    },
  ];
  const { data: userData } = useQuery({
    queryKey: ['userData'],
    queryFn: getUserData,
  });

  return (
    <div css={containerCss}>
      <HomeOutlined css={homeIconCss} onClick={handleHomeClick} />
      <div css={titleCss}>순천향대 코인왕</div>
      <div css={rankContainerCss}>
        {sampleData.map((user, index) => (
          <div css={rankItemCss} key={index}>
            <div css={rankCss}>{index + 1}등</div>
            <div css={balanceCss(user.balance)}>{formatNumberWithComma(user.balance)}</div>
            <div css={rankCss}>{user.name}</div>
            <div css={rankCss}>{user.department}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { RankPanel };
