import React, { useRef, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserData, getDepartmentData } from 'api/requests/requestCoin';
import { useUserInfoStore, useCoinInfoStore } from 'stores/userInfoStore';
import { requestSignout } from 'api/requests/requestAuth';
import { Skeleton, Input, Select } from 'antd';

const homeIconCss = css`
  position: absolute;
  top: 15px;
  left: 15px;
  font-size: 24px;
  z-index: 1000;
`;

const containerCss = css`
  width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

const titleCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  word-break: keep-all;
  font-size: 52px;
  font-family: 'GmarketSans-Medium';
  margin-top: 30px;
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
  grid-template-columns: 2fr 4fr 3fr 3fr 5fr;
  gap: 10px;
  align-items: center;
`;

const rankTitleCss = css`
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 4fr 3fr 3fr 5fr;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
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

const rankBigCss = css`
  text-align: center;
  font-size: 36px;
  font-family: 'SpoqaHanSansNeo-Bold';
`;

const inputCss = css`
  margin-left: 10px;
  width: 200px;
  height: 30px;
`;

const selectCss = css`
  width: 200px;
  height: 30px;
  font-family: 'SpoqaHanSansNeo-Regular';
`;

const emptyBoxCss = css`
  width: 200px;
  height: 30px;
`;

function RankPanel() {
  const navigate = useNavigate();
  const changeUserInfo = useUserInfoStore((state) => state.changeUserInfo);
  const changeCoinInfo = useCoinInfoStore((state) => state.changeCoinInfo);
  const changeBalance = useCoinInfoStore((state) => state.changeBalance);
  const { userInfo } = useUserInfoStore();
  const rankContainerRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('all');

  // useEffect를 사용하여 userInfo가 있을 때 초기 검색어 설정
  useEffect(() => {
    if (userInfo.name || userInfo.student_id) {
      setSearchTerm(userInfo.student_id);
    }
  }, [userInfo]);

  function createLabelValueArray(arr: string[]) {
    return arr.map((item) => ({ label: item, value: item }));
  }

  const userData = useQuery({
    queryKey: ['userData', department],
    queryFn: () => getUserData({ department: department }),
  });

  const departmentData = useQuery({
    queryKey: ['departmentData'],
    queryFn: () => getDepartmentData(),
  });

  let departmentOptions: { label: string; value: string }[] = [];

  if (departmentData.data) {
    departmentOptions = [
      { label: '전체 - 검색가능', value: 'all' },
      ...createLabelValueArray(departmentData.data.departments),
    ];
  }

  useEffect(() => {
    if (userData.data && rankContainerRef.current) {
      const userRankItem = rankContainerRef.current.querySelector(
        `[data-user-name="${searchTerm}"], [data-user-id="${searchTerm}"]`,
      );
      if (userRankItem) {
        userRankItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [userData.data, searchTerm]);

  const handleHomeClick = () => {
    // 사용자 정보 초기화
    changeUserInfo({
      name: '',
      department: '',
      student_id: '',
      nickname: '',
      reTryCount: 2,
      highScore: 0,
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

  return (
    <div css={containerCss}>
      <HomeOutlined css={homeIconCss} onClick={handleHomeClick} />

      <div css={titleCss}>
        <div css={emptyBoxCss}></div>
        <div css={emptyBoxCss}></div>
        순천향대 코인왕
        <Input
          placeholder="이름 또는 학번"
          css={inputCss}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          showSearch
          optionFilterProp="label"
          placeholder="학과"
          css={selectCss}
          options={departmentOptions}
          value={department}
          onChange={(value) => setDepartment(value)}
        />
      </div>
      {userData.isLoading || !userData.data ? (
        <Skeleton active />
      ) : (
        <div css={rankContainerCss} ref={rankContainerRef}>
          <div css={rankTitleCss}>
            <div css={rankBigCss}>순위</div>
            <div css={rankBigCss}>잔액</div>
            <div css={rankBigCss}>이름</div>
            <div css={rankBigCss}>학번</div>
            <div css={rankBigCss}>학과</div>
          </div>
          {userData.data.data.map((user, index) => (
            <div
              css={rankItemCss}
              key={index}
              data-user-name={user.name}
              data-user-id={user.student_id}
              style={
                searchTerm.trim() !== '' &&
                (user.name.includes(searchTerm) || user.student_id.includes(searchTerm))
                  ? { backgroundColor: '#fcff9e' }
                  : {}
              }
            >
              <div css={rankCss}>{index + 1}등</div>
              <div css={balanceCss(user.balance)}>{formatNumberWithComma(user.balance)}</div>
              <div css={rankCss}>{user.name}</div>
              <div css={rankCss}>{user.student_id}</div>
              <div css={rankCss}>{user.department}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { RankPanel };
