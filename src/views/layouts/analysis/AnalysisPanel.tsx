import React, { useRef, useEffect, useState, useMemo } from 'react';
import { css } from '@emotion/react';
import { HomeOutlined, CrownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserData, getAffiliationData } from 'api/requests/requestCoin';
import { useUserInfoStore, useCoinInfoStore } from 'stores/userInfoStore';
import { requestSignout } from 'api/requests/requestAuth';
import { Skeleton, Input, Select } from 'antd';
import { getUserAnalysis } from 'api/requests/requestUserData';
import { MyResponsivePie } from 'views/components/BasicPieChart';
import { MyResponsiveBar } from 'views/components/BasicBarChart';
const homeIconCss = css`
  position: absolute;
  top: 15px;
  left: 15px;
  font-size: 24px;
  z-index: 1000;
`;

const containerCss = css`
  width: 100%;
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

const chartContainerCss = css`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20px;
  row-gap: 30px;
  flex-wrap: wrap;
  width: 92%;
`;

const pieChartCss = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  width: 25%;
  height: 400px;
`;

const barChartCss = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  width: 50%;
  height: 400px;
`;

const chartTitleCss = css`
  font-size: 24px;
  font-family: 'GmarketSans-Medium';
`;

function AnalysisPanel() {
  const userAnalysis = useQuery({
    queryKey: ['userAnalysis'],
    queryFn: () => getUserAnalysis(),
  });

  // 레버리지 순으로 오름차순 정렬
  function sortByLeverage(data: { leverage: number; count: number; ratio: number }[]) {
    return data.sort((a, b) => a.leverage - b.leverage);
  }

  // 코인 선택 비율
  const coinRatioData = userAnalysis.data?.coin_ratio.map((item) => ({
    id: item.coin,
    label: item.coin,
    value: item.count,
  }));

  // 레버리지 선택 비율
  const leverageRatioData = userAnalysis.data?.leverage_ratio.map((item) => ({
    id: `${item.leverage}배`,
    label: `${item.leverage}배`,
    value: item.count,
  }));

  // 코인 선택 AI 추천 사용 비율
  const aiRecommendRatioData_1 = [
    {
      id: '사용',
      label: '사용',
      value: userAnalysis.data?.ai_recommend_1_ratio[0].count,
    },
    {
      id: '미사용',
      label: '미사용',
      value: userAnalysis.data?.ai_recommend_1_ratio[1].count,
    },
  ];

  // 금액 선택 AI 추천 사용 비율
  const aiRecommendRatioData_2 = [
    {
      id: '사용',
      label: '사용',
      value: userAnalysis.data?.ai_recommend_2_ratio[0].count,
    },
    {
      id: '미사용',
      label: '미사용',
      value: userAnalysis.data?.ai_recommend_2_ratio[1].count,
    },
  ];

  // 코인 평균 매도 시간
  const coinAverageSellTimeData = useMemo(() => {
    if (!userAnalysis.data?.coin_avg_sell_time) return [];

    // 코인 이름을 정규화하는 함수
    const normalizeCoinName = (coin: string) => {
      // "BTC/KRW" -> "BTC", "KRW-BTC" -> "BTC" 형태로 변환
      return coin.replace('KRW-', '').replace('/KRW', '');
    };

    // 데이터를 정규화된 코인 이름으로 그룹화
    const groupedData = userAnalysis.data.coin_avg_sell_time.reduce(
      (acc: { [key: string]: any[] }, item) => {
        const normalizedName = normalizeCoinName(item.coin);
        if (!acc[normalizedName]) {
          acc[normalizedName] = [];
        }
        acc[normalizedName].push(item);
        return acc;
      },
      {},
    );

    // 각 그룹의 평균 시간 계산
    return Object.entries(groupedData).map(([coin, items]) => {
      const totalTime = items.reduce((sum, item) => sum + item.avg_sell_time, 0);
      const avgTime = items.length > 0 ? totalTime / items.length : 0;

      return {
        coin: items[0].coin, // 원래 형식 중 하나를 사용
        time: Math.round(avgTime),
      };
    });
  }, [userAnalysis.data?.coin_avg_sell_time]);

  // 레버리지 별 평균 잔액 (레버리지 순 정렬)
  const leverageAverageBalanceData = userAnalysis.data?.leverage_avg_balance
    .map((item) => ({
      leverage: item.leverage,
      balance: Math.round(item.avg_balance),
    }))
    .sort((a, b) => a.leverage - b.leverage);

  // AI 추천 기능 사용 별 평균 잔액 - 코인 선택
  const aiRecommendAverageBalanceData_1 = userAnalysis.data?.ai_recommend_1_avg_balance.map(
    (item) => ({
      ai_recommend: item.aiRecommend_1 ? '사용' : '미사용',
      balance: Math.round(item.avg_balance),
    }),
  );

  // AI 추천 기능 사용 별 평균 잔액 - 금액 선택
  const aiRecommendAverageBalanceData_2 = userAnalysis.data?.ai_recommend_2_avg_balance.map(
    (item) => ({
      ai_recommend: item.aiRecommend_2 ? '사용' : '미사용',
      balance: Math.round(item.avg_balance),
    }),
  );

  const navigate = useNavigate();
  const changeUserInfo = useUserInfoStore((state) => state.changeUserInfo);
  const changeCoinInfo = useCoinInfoStore((state) => state.changeCoinInfo);
  const changeBalance = useCoinInfoStore((state) => state.changeBalance);
  const handleHomeClick = () => {
    // 사용자 정보 초기화
    changeUserInfo({
      name: '',
      affiliation: '',
      nickname: '',
      reTryCount: 2,
      highScore: 0,
    });

    // 코인 정보 초기화
    changeCoinInfo({
      coin_1: { value: '', label: '', sellUp: 0, sellDown: 0 },
      coin_2: { value: '', label: '', sellUp: 0, sellDown: 0 },
      coin_3: { value: '', label: '', sellUp: 0, sellDown: 0 },
    });

    // 잔액 초기화
    changeBalance(0);
    requestSignout();
    navigate('/signin');
  };
  return (
    <div css={containerCss}>
      <HomeOutlined css={homeIconCss} onClick={handleHomeClick} />

      <div css={titleCss}>유저 데이터 통계</div>
      {userAnalysis.isLoading || !userAnalysis.data ? (
        <Skeleton active />
      ) : (
        <div css={chartContainerCss}>
          <div css={barChartCss}>
            <div css={chartTitleCss}>코인 평균 매도 시간</div>
            <MyResponsiveBar
              data={coinAverageSellTimeData || []}
              legend="평균매도시간 (초)"
              keys={['time']}
              indexBy="coin"
              colors="#d87253af"
            />
          </div>
          <div css={barChartCss}>
            <div css={chartTitleCss}>레버리지별 평균 잔액</div>
            <MyResponsiveBar
              data={leverageAverageBalanceData || []}
              legend="평균잔액 (원)"
              keys={['balance']}
              indexBy="leverage"
              colors="#d8ae53ae"
            />
          </div>
          <div css={barChartCss}>
            <div css={chartTitleCss}>AI 기능 사용별 평균 잔액 - 코인 선택</div>
            <MyResponsiveBar
              data={aiRecommendAverageBalanceData_1 || []}
              legend="평균잔액 (원)"
              keys={['balance']}
              indexBy="ai_recommend"
              colors="#53d895af"
            />
          </div>
          <div css={barChartCss}>
            <div css={chartTitleCss}>AI 기능 사용별 평균 잔액 - 금액 선택</div>
            <MyResponsiveBar
              data={aiRecommendAverageBalanceData_2 || []}
              legend="평균잔액 (원)"
              keys={['balance']}
              indexBy="ai_recommend"
              colors="#5388d8b0"
            />
          </div>

          <div css={pieChartCss}>
            <div css={chartTitleCss}>코인 선택 비율</div>
            <MyResponsivePie data={coinRatioData || []} />
          </div>
          <div css={pieChartCss}>
            <div css={chartTitleCss}>레버리지 선택 비율</div>
            <MyResponsivePie data={leverageRatioData || []} />
          </div>
          <div css={pieChartCss}>
            <div css={chartTitleCss}> AI 기능 사용 비율 - 코인 선택</div>
            <MyResponsivePie data={aiRecommendRatioData_1 || []} />
          </div>
          <div css={pieChartCss}>
            <div css={chartTitleCss}> AI 기능 사용 비율 - 금액 선택</div>
            <MyResponsivePie data={aiRecommendRatioData_2 || []} />
          </div>
        </div>
      )}
    </div>
  );
}

export { AnalysisPanel };
