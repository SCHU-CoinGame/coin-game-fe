import { css } from '@emotion/react';
import { useState, useEffect, useRef } from 'react';
import { Button, Tag, Modal, Tooltip } from 'antd';
import { BtcWidget } from 'views/layouts/coin-chart/BtcWidget';
import { colorLight } from 'styles/colors';
import { useCoinInfoStore, useUserAnalysisStore } from 'stores/userInfoStore';
import { useNavigate } from 'react-router-dom';
import { Overlay } from 'views/layouts/Overlay';
import {
  useCoinListStore,
  useDeeplearningRankStore,
  useUserClickStreamStore,
} from 'stores/userInfoStore';
import { getDeeplearningData } from 'api/requests/requestCoin';
import { useQuery } from '@tanstack/react-query';
import { HintTag } from 'views/components/HintTag';
import { ConvertSlashToDash, ConvertDashToSlash } from 'views/CoinConverter';
import { usePreventNavigation } from 'hooks/UsePreventNavigation';

const containerCss = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
`;

const titleTextCss = css`
  align-content: center;
  height: 40px;
  font-size: 32px;
  text-align: center;
  font-family: 'SpoqaHanSansNeo-Bold';
`;

const chartContainerCss = css`
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5px;
  width: 95%;
  height: 80%;
`;

const coinTitleCss = (isSelected: boolean) => css`
  display: flex;
  flex-direction: row;
  width: fit-content;
  align-items: center;
  font-family: 'SpoqaHanSansNeo-Bold';
  cursor: pointer;
  font-size: 18px;
  height: 30px;
  background-color: ${isSelected ? '#e7efff' : '#ffffff'};
  border-radius: 5px 5px 0 0;
  transition: background-color 0.3s ease;
  padding-left: 5px;
`;

const coinItemCss = css`
  width: 100%;
  height: calc(100% - 50px);
`;

const progressBoxCss = css`
  width: 100%;
  height: 16px;
  display: flex;
  border-radius: 5px;
  justify-content: flex-start;
  background-color: #e2e2e2;
  position: relative;
`;

const progressCss = (countdown: number) => css`
  width: ${countdown === 0 ? '0' : '100%'};
  height: 16px;
  border-radius: 5px 0 0 5px;
  background-color: ${colorLight.mainBtnColor};
  transition: width 90s linear;
`;

const analysisTimeCss = (time: number) => css`
  position: absolute;
  top: 0;
  left: ${time}%;
  display: flex;
  flex-direction: column;
  gap: 2px;
  word-break: keep-all;
`;

const buttonContainerCss = css`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const seleteInfoBoxCss = css`
  display: flex;
  align-items: center;
  flex-direction: row;

  height: 32px;
  gap: 10px;
  font-size: 20px;
`;

const selectButtonCss = (isSelected: boolean, isDisabled: boolean) => css`
  margin-left: 10px;
  margin-right: 15px;
  height: 26px;

  background-color: ${isSelected ? colorLight.mainBtnColor : 'white'};
  color: ${isSelected ? 'white' : isDisabled ? '#999' : 'black'};
  cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
  opacity: ${isDisabled ? 0.5 : 1};

  outline: none;
  &:focus {
    outline: none;
  }
`;

// 체크박스CSS
// const checkboxCss = css`
//   margin: 5px;
//   .ant-radio-inner {
//     width: 20px;
//     height: 20px;

//     &::after {
//       width: 12px;
//       height: 12px;
//     }
//   }

//   .ant-checkbox-inner {
//     width: 20px;
//     height: 20px;

//     &::after {
//       width: 8px;
//       height: 12px;
//     }
//   }
//   .ant-radio,
//   .ant-checkbox {
//     font-size: 20px;
//   }

//   .ant-checkbox-wrapper {
//     color: ${colorLight.mainBtnColor};
//   }
//   .ant-checkbox .ant-checkbox-inner {
//     border-color: ${colorLight.mainBtnColor};
//   }
//   .ant-checkbox-checked .ant-checkbox-inner {
//     background-color: ${colorLight.mainBtnColor};
//     border-color: ${colorLight.mainBtnColor};
//   }
//   .ant-checkbox-disabled .ant-checkbox-inner {
//     background-color: #f5f5f5;
//   }
//   .ant-checkbox-disabled + span {
//     color: rgba(0, 0, 0, 0.25);
//   }

//   outline: none;
//   &:focus {
//     outline: none;
//   }
// `;

const recommendCss = css`
  width: 80px;
  height: 40px;
  font-size: 20px;
  color: white;
  background-color: ${colorLight.subBtnColor};
  font-family: 'GmarketSans-Bold';
  outline: none;
  &:focus {
    outline: none;
  }
`;

const nextBtnCss = (isEnabled: boolean) => css`
  width: 120px;
  height: 40px;
  font-size: 20px;
  color: white;
  background-color: ${isEnabled ? colorLight.mainBtnColor : '#cccccc'};
  font-family: 'GmarketSans-Bold';
  outline: none;
  cursor: ${isEnabled ? 'pointer' : 'not-allowed'};
  opacity: ${isEnabled ? 1 : 0.7};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: ${isEnabled ? colorLight.mainBtnColor : '#cccccc'};
  }
`;

const selectedCoinTagCss = css`
  width: fit-content;
  text-align: center;
  align-content: center;
  height: 30px;
  background-color: #ebebeb;
  font-family: 'SpoqaHanSansNeo-Bold';
  color: #515151;
  border: none;
  border-radius: 5px;
  font-size: 18px;

  .ant-tag-close-icon {
    font-size: 16px;
    margin-left: 5px;
  }
`;

const modalCss = css`
  .ant-modal-header {
    margin-bottom: 20px;
  }
  .ant-modal-footer {
    margin-top: 10px;
  }
`;

const modalContentCss = css`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 10px;
`;

const modalOkBtnCss = css`
  background-color: ${colorLight.mainBtnColor};
`;

function SelectCoinPanel() {
  usePreventNavigation({ when: true });
  const { data: deeplearningData } = useQuery({
    queryKey: ['deeplearningData'],
    queryFn: getDeeplearningData,
  });

  // sampleData
  // const deeplearningData = [
  //   {
  //     code: 'KRW-BTC',
  //     fastest_decline: false,
  //     fastest_growth: false,
  //     largest_drop: false,
  //     largest_rise: false,
  //     largest_spike: false,
  //     least_volatile: false,
  //     most_volatile: false,
  //     percentage: 0.4372167578457425,
  //     rank: 1,
  //     sell_down: 141663240.19521475,
  //     sell_up: 142076759.80478525,
  //   },
  //   {
  //     code: 'KRW-ETH',
  //     fastest_decline: false,
  //     fastest_growth: false,
  //     largest_drop: false,
  //     largest_rise: false,
  //     largest_spike: false,
  //     least_volatile: false,
  //     most_volatile: false,
  //     percentage: 0.11945974428750089,
  //     rank: 3,
  //     sell_down: 5114882.466495037,
  //     sell_up: 5127117.533504963,
  //   },
  //   {
  //     code: 'KRW-DOGE',
  //     fastest_decline: false,
  //     fastest_growth: false,
  //     largest_drop: false,
  //     largest_rise: false,
  //     largest_spike: false,
  //     least_volatile: false,
  //     most_volatile: false,
  //     percentage: 0.057648823124605994,
  //     rank: 4,
  //     sell_down: 483.07710659027106,
  //     sell_up: 483.52289340972897,
  //   },
  //   {
  //     code: 'KRW-BIGTIME',
  //     fastest_decline: false,
  //     fastest_growth: false,
  //     largest_drop: false,
  //     largest_rise: false,
  //     largest_spike: true,
  //     least_volatile: false,
  //     most_volatile: false,
  //     percentage: -0.5781067453723421,
  //     rank: 7,
  //     sell_down: 213.02900648713134,
  //     sell_up: 227.40709935128686,
  //   },
  //   {
  //     code: 'KRW-SUI',
  //     fastest_decline: false,
  //     fastest_growth: false,
  //     largest_drop: false,
  //     largest_rise: false,
  //     largest_spike: false,
  //     least_volatile: false,
  //     most_volatile: false,
  //     percentage: -0.06580852320220167,
  //     rank: 5,
  //     sell_down: 6802.416857528687,
  //     sell_up: 6806.044789280892,
  //   },
  //   {
  //     code: 'KRW-SOL',
  //     fastest_decline: true,
  //     fastest_growth: false,
  //     largest_drop: true,
  //     largest_rise: false,
  //     largest_spike: false,
  //     least_volatile: true,
  //     most_volatile: false,
  //     percentage: 0.24452055466699074,
  //     rank: 2,
  //     sell_down: 255597.80724048615,
  //     sell_up: 326802.19275951385,
  //   },
  //   {
  //     code: 'KRW-UXLINK',
  //     fastest_decline: true,
  //     fastest_growth: false,
  //     largest_drop: true,
  //     largest_rise: false,
  //     largest_spike: false,
  //     least_volatile: true,
  //     most_volatile: false,
  //     percentage: 0.24452055466699074,
  //     rank: 8,
  //     sell_down: 2537.80724048615,
  //     sell_up: 2539.19275951385,
  //   },
  //   {
  //     code: 'KRW-XRP',
  //     fastest_decline: false,
  //     fastest_growth: false,
  //     largest_drop: false,
  //     largest_rise: false,
  //     largest_spike: false,
  //     least_volatile: false,
  //     most_volatile: false,
  //     percentage: -0.06738888053926642,
  //     rank: 6,
  //     sell_down: 3369.1826566696172,
  //     sell_up: 3372.8173433303828,
  //   },
  //   {
  //     code: 'KRW-SXP',
  //     fastest_decline: false,
  //     fastest_growth: false,
  //     largest_drop: false,
  //     largest_rise: false,
  //     largest_spike: false,
  //     least_volatile: false,
  //     most_volatile: false,
  //     percentage: -1.833837399097011,
  //     rank: 9,
  //     sell_down: 395.73223963975886,
  //     sell_up: 489.0433880180121,
  //   },
  // ];

  const userAnalysis = useUserAnalysisStore.getState().userAnalysis;

  const getMaxCountCoin = (data: { coin: string; count: number; ratio: number }[]) => {
    if (!data || data.length === 0) {
      return null;
    }

    let maxCoin = data[0];

    for (let i = 1; i < data.length; i++) {
      if (data[i].count > maxCoin.count) {
        maxCoin = data[i];
      }
    }

    return maxCoin.coin;
  };
  const userCoinRatio = getMaxCountCoin(userAnalysis?.coin_ratio || []);

  const { updateRemainingTime, updateCoins, updateAiRecommend, updateDeeplearningData } =
    useUserClickStreamStore();

  const changeDeeplearningRank = useDeeplearningRankStore((state) => state.changeDeeplearningRank);

  const getIndicesByRank = (data: any[], targetRanks: number[] = [1, 2, 3]): number[] => {
    return data
      .map((item, index) => (targetRanks.includes(item.rank) ? index : null))
      .filter((index) => index !== null) as number[]; // null을 제거한 후 number[]로 캐스팅
  };

  const getRanksByIndices = (data: any[], indices: number[]): number[] => {
    return indices.map((index) => data[index]?.rank);
  };

  // 선택한 종목의 딥러닝 데이터를 가져오는 함수
  const getSelectedCoinData = (deeplearningData: any[], selectedCodes: string[]): any[] => {
    return deeplearningData.filter((item) => selectedCodes.includes(item.code));
  };

  const navigate = useNavigate();
  const changeCoinInfo = useCoinInfoStore((state) => state.changeCoinInfo);
  const coins = useCoinListStore((state) => state.coinList);

  // 시작 카운트다운
  const [countdown, setCountdown] = useState(5);
  const [timeLeft, setTimeLeft] = useState(95);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimeOverModalOpen, setIsTimeOverModalOpen] = useState(false);
  const gameTimerRef = useRef<number | null>(null);
  const [isGameTimerRunning, setIsGameTimerRunning] = useState(true);
  const [isClickAiRecommend, setIsClickAiRecommend] = useState(false);

  const handleTimeOver = () => {
    if (selectedCoins.length < 2) {
      setSelectedCoins([0, 1, 2]);
      setIsTimeOverModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  // 게임 타이머를 중지하는 함수
  const stopGameTimer = () => {
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = null;
    }
  };

  useEffect(() => {
    const loadingTimer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(loadingTimer);
    }, 5000);

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          stopGameTimer();
          handleTimeOver();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(loadingTimer);
      stopGameTimer();
    };
  }, []);

  // 토글 select 버튼
  const [selectedCoins, setSelectedCoins] = useState<number[]>([]);

  const toggleCoinSelection = (coinIndex: number) => {
    setSelectedCoins((prevSelected) => {
      if (prevSelected.includes(coinIndex)) {
        return prevSelected.filter((index) => index !== coinIndex);
      } else if (prevSelected.length < 3) {
        return [...prevSelected, coinIndex];
      }
      return prevSelected;
    });
  };

  const isMaxSelected = selectedCoins.length === 3;

  function getLabelByValue(dataArray: any[], value: string) {
    // 배열에서 value와 일치하는 객체를 찾음
    const foundItem = dataArray.find((item) => item.value === value);
    // 일치하는 객체가 있으면 label 반환, 없으면 null 반환
    return foundItem ? foundItem.label : null;
  }

  function createCoinObject(firstArray: string[], secondArray: any[]) {
    interface CoinResult {
      coin_1: {
        value: string;
        label: string;
        sellUp: number;
        sellDown: number;
      };
      coin_2: {
        value: string;
        label: string;
        sellUp: number;
        sellDown: number;
      };
      coin_3: {
        value: string;
        label: string;
        sellUp: number;
        sellDown: number;
      };
    }

    const result = {} as CoinResult;

    firstArray.forEach((code, index) => {
      const coinData = secondArray.find((coin) => coin.code === code);
      if (coinData) {
        const coinInfo = {
          value: code,
          label: getLabelByValue(coins, code),
          sellUp: coinData.sell_up,
          sellDown: coinData.sell_down,
        };

        switch (index) {
          case 0:
            result.coin_1 = coinInfo;
            break;
          case 1:
            result.coin_2 = coinInfo;
            break;
          case 2:
            result.coin_3 = coinInfo;
            break;
        }
      }
    });

    return result;
  }

  //modal 상태관리
  const handleOk = () => {
    console.log('남은시간: ', timeLeft);
    updateRemainingTime(1, timeLeft);

    const selectedLabels = [
      coins[selectedCoins[0]].value,
      coins[selectedCoins[1]].value,
      coins[selectedCoins[2]].value,
    ];

    const clickStreamCoin = [
      ConvertDashToSlash(coins[selectedCoins[0]].value),
      ConvertDashToSlash(coins[selectedCoins[1]].value),
      ConvertDashToSlash(coins[selectedCoins[2]].value),
    ];
    console.log('선택한 종목: ', selectedLabels);
    updateCoins(clickStreamCoin);

    const selectedCoinData = getSelectedCoinData(deeplearningData || [], selectedLabels);
    console.log('선택한 종목의 딥러닝 데이터: ', selectedCoinData);
    updateDeeplearningData(selectedCoinData);

    console.log('AI 추천 클릭 여부: ', isClickAiRecommend);
    updateAiRecommend(1, isClickAiRecommend);

    if (deeplearningData) {
      changeDeeplearningRank(getRanksByIndices(deeplearningData, selectedCoins));
    }

    const coinObject = createCoinObject(selectedLabels, selectedCoinData);

    console.log('coinObject: ', coinObject);

    changeCoinInfo(coinObject);
    navigate('/second-home');

    setIsModalOpen(false);
  };

  // 다음 버튼 클릭 함수
  const handleNextClick = () => {
    if (isMaxSelected) {
      setIsGameTimerRunning(false);
      stopGameTimer();
      setIsModalOpen(true);
    }
  };

  const handleRecommendClick = () => {
    setIsClickAiRecommend(true);
    if (deeplearningData) {
      setSelectedCoins(getIndicesByRank(deeplearningData));
    }
  };

  return (
    <>
      <div css={containerCss}>
        {countdown > 0 && <Overlay countdown={countdown} height={40} />}
        <div css={titleTextCss}>
          아홉 개의 비트코인 종목 중에서, 가장 유망해 보이는 세 개의 그래프를 골라주세요
        </div>
        <div css={progressBoxCss}>
          {isGameTimerRunning && <div css={progressCss(countdown)}></div>}
          {isGameTimerRunning && (
            <div
              css={analysisTimeCss(
                userAnalysis ? Math.round(100 * (userAnalysis.page_time_avg.avg_time_1 / 90)) : 0,
              )}
            >
              <div
                css={css`
                  width: 4px;
                  height: 24px;
                  border-radius: 0 0 4px 4px;
                  background-color: #e25d5d;
                `}
              />
              <div
                css={css`
                  font-size: 12px;
                `}
              >
                플레이어들의 평균 선택 완료 시간
              </div>
            </div>
          )}
        </div>
        <div css={chartContainerCss}>
          {coins.map((coin, index) => {
            console.log(deeplearningData);
            const isSelected = selectedCoins.includes(index);
            const isDisabled = !isSelected && isMaxSelected;
            const isLargestRise = deeplearningData?.[index].largest_rise;
            const isLargestDrop = deeplearningData?.[index].largest_drop;
            const isMostVolatile = deeplearningData?.[index].most_volatile;
            const isLeastVolatile = deeplearningData?.[index].least_volatile;
            const isSpike = deeplearningData?.[index].largest_spike;
            const aiPick = deeplearningData?.[index].rank;
            return (
              <div key={index} css={coinItemCss}>
                <div css={coinTitleCss(isSelected)} onClick={() => toggleCoinSelection(index)}>
                  {coin.label}
                  <Button css={selectButtonCss(isSelected, isDisabled)} disabled={isDisabled}>
                    {isSelected ? '해제' : '선택'}
                  </Button>
                  {isLargestRise && <HintTag hint={'상승세'} />}
                  {isLargestDrop && <HintTag hint={'하락세'} />}
                  {isMostVolatile && <HintTag hint={'변동적'} />}
                  {isLeastVolatile && <HintTag hint={'안정적'} />}
                  {isSpike && <HintTag hint={'거래량'} />}
                  {aiPick === 1 && <HintTag hint={'AI픽'} />}
                  {userAnalysis && userCoinRatio === coin.value && <HintTag hint={'사용자픽'} />}
                </div>
                <BtcWidget coin={ConvertDashToSlash(coin.value)} toolbarAllowed={false} />
              </div>
            );
          })}
        </div>
        <div css={seleteInfoBoxCss}>
          <div>선택한 종목:</div>
          <div>
            {selectedCoins.map((index) => (
              <Tag
                key={index}
                css={selectedCoinTagCss}
                closable
                onClose={() => toggleCoinSelection(index)}
              >
                {coins[index].label}
              </Tag>
            ))}
          </div>
        </div>
        <div css={buttonContainerCss}>
          <Tooltip
            overlayStyle={{ width: '140px' }}
            title={
              userAnalysis
                ? `${Math.round(userAnalysis.ai_recommend_1_ratio[0].ratio)}%의 플레이어들이\n AI추천을 클릭했어요 `
                : ''
            }
          >
            <Button css={recommendCss} onClick={handleRecommendClick}>
              AI 추천
            </Button>
          </Tooltip>
          <Button
            css={nextBtnCss(isMaxSelected)}
            onClick={handleNextClick}
            disabled={!isMaxSelected}
          >
            선택완료
          </Button>
        </div>
      </div>

      <Modal
        css={modalCss}
        title="이 종목들로 다음 단계를 진행할게요"
        centered={true}
        open={isModalOpen}
        onOk={handleOk}
        closeIcon={null}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk} css={modalOkBtnCss}>
            다음 단계로
          </Button>,
        ]}
      >
        <div css={modalContentCss}>
          {selectedCoins.map((index) => (
            <Tag key={index} css={selectedCoinTagCss}>
              {coins[index].label} {coins[index].value}
            </Tag>
          ))}
        </div>
      </Modal>

      <Modal
        css={modalCss}
        title="시간 초과! 랜덤한 세 개의 종목으로 게임을 진행할게요"
        centered={true}
        open={isTimeOverModalOpen}
        onOk={handleOk}
        closeIcon={null}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk} css={modalOkBtnCss}>
            다음 단계로
          </Button>,
        ]}
      >
        <div css={modalContentCss}>
          {selectedCoins.map((index) => (
            <Tag key={index} css={selectedCoinTagCss}>
              {coins[index].label} {coins[index].value}
            </Tag>
          ))}
        </div>
      </Modal>
    </>
  );
}

export { SelectCoinPanel };
