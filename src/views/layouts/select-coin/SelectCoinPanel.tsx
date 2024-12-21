import { css } from '@emotion/react';
import { useState, useEffect, useRef } from 'react';
import { Button, Tag, Modal } from 'antd';
import { BtcWidget } from 'views/layouts/coin-chart/BtcWidget';
import { colorLight } from 'styles/colors';
import { useCoinInfoStore } from 'stores/userInfoStore';
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
import { ConvertSlashToDash } from 'views/CoinConverter';
import { usePreventNavigation } from 'hooks/UsePreventNavigation';
const containerCss = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
`;

const titleTextCss = css`
  align-content: center;
  height: 40px;
  font-size: 32px;
  text-align: center;
  font-family: 'SpoqaHanSansNeo-Bold';
`;

const chartContainerCss = css`
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
`;

const progressCss = (countdown: number) => css`
  width: ${countdown === 0 ? '0' : '100%'};
  height: 16px;
  border-radius: 5px 0 0 5px;
  background-color: ${colorLight.mainBtnColor};
  transition: width 20s linear;
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
  //     largest_rise: false,
  //     code: 'KRW-BTC',
  //     largest_spike: false,
  //     fastest_growth: true,
  //     most_volatile: true,
  //     percentage: 1.3158182310168738,
  //     largest_drop: false,
  //     fastest_decline: false,
  //     least_volatile: false,
  //     rank: 1,
  //   },
  //   {
  //     largest_rise: true,
  //     code: 'KRW-ETH',
  //     largest_spike: true,
  //     fastest_growth: false,
  //     most_volatile: false,
  //     percentage: 0.5329839511852842,
  //     largest_drop: false,
  //     fastest_decline: false,
  //     least_volatile: false,
  //     rank: 2,
  //   },
  //   {
  //     largest_rise: false,
  //     code: 'KRW-DOGE',
  //     largest_spike: false,
  //     fastest_growth: false,
  //     most_volatile: false,
  //     percentage: 0.3970638917366956,
  //     largest_drop: false,
  //     fastest_decline: false,
  //     least_volatile: false,
  //     rank: 3,
  //   },
  //   {
  //     largest_rise: false,
  //     code: 'KRW-BIGTIME',
  //     largest_spike: false,
  //     fastest_growth: false,
  //     most_volatile: false,
  //     percentage: 0.228743978066023,
  //     largest_drop: true,
  //     fastest_decline: false,
  //     least_volatile: false,
  //     rank: 4,
  //   },
  //   {
  //     largest_rise: false,
  //     code: 'KRW-SUI',
  //     largest_spike: false,
  //     fastest_growth: false,
  //     most_volatile: false,
  //     percentage: 0.21710651676829268,
  //     largest_drop: false,
  //     fastest_decline: true,
  //     least_volatile: true,
  //     rank: 5,
  //   },
  //   {
  //     largest_rise: false,
  //     code: 'KRW-UXLINK',
  //     largest_spike: false,
  //     fastest_growth: false,
  //     most_volatile: false,
  //     percentage: -0.23176080935838586,
  //     largest_drop: false,
  //     fastest_decline: false,
  //     least_volatile: false,
  //     rank: 8,
  //   },
  //   {
  //     largest_rise: false,
  //     code: 'KRW-SOL',
  //     largest_spike: false,
  //     fastest_growth: false,
  //     most_volatile: false,
  //     percentage: -1.1058837431903856,
  //     largest_drop: false,
  //     fastest_decline: false,
  //     least_volatile: false,
  //     rank: 9,
  //   },
  //   {
  //     largest_rise: false,
  //     code: 'KRW-XRP',
  //     largest_spike: false,
  //     fastest_growth: false,
  //     most_volatile: false,
  //     percentage: -0.06528614939452285,
  //     largest_drop: false,
  //     fastest_decline: false,
  //     least_volatile: false,
  //     rank: 7,
  //   },
  //   {
  //     largest_rise: false,
  //     code: 'KRW-SXP',
  //     largest_spike: false,
  //     fastest_growth: false,
  //     most_volatile: false,
  //     percentage: -0.043716566921964184,
  //     largest_drop: false,
  //     fastest_decline: false,
  //     least_volatile: false,
  //     rank: 6,
  //   },
  // ];

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
  const [timeLeft, setTimeLeft] = useState(25);
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

  //modal 상태관리
  const handleOk = () => {
    console.log('남은시간: ', timeLeft);
    updateRemainingTime(1, timeLeft);

    const selectedLabels = [
      ConvertSlashToDash(coins[selectedCoins[0]].value),
      ConvertSlashToDash(coins[selectedCoins[1]].value),
      ConvertSlashToDash(coins[selectedCoins[2]].value),
    ];
    console.log('선택한 종목: ', selectedLabels);
    updateCoins(selectedLabels);

    const selectedCoinData = getSelectedCoinData(deeplearningData || [], selectedLabels);
    console.log('선택한 종목의 딥러닝 데이터: ', selectedCoinData);
    updateDeeplearningData(selectedCoinData);

    console.log('AI 추천 클릭 여부: ', isClickAiRecommend);
    updateAiRecommend(1, isClickAiRecommend);

    if (deeplearningData) {
      changeDeeplearningRank(getRanksByIndices(deeplearningData, selectedCoins));
    }
    changeCoinInfo({
      coin_1: { value: coins[selectedCoins[0]].value, label: coins[selectedCoins[0]].label },
      coin_2: { value: coins[selectedCoins[1]].value, label: coins[selectedCoins[1]].label },
      coin_3: { value: coins[selectedCoins[2]].value, label: coins[selectedCoins[2]].label },
    });
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
        </div>
        <div css={chartContainerCss}>
          {coins.map((coin, index) => {
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
                  {coin.label} {coin.value}
                  <Button css={selectButtonCss(isSelected, isDisabled)} disabled={isDisabled}>
                    {isSelected ? '해제' : '선택'}
                  </Button>
                  {isLargestRise && <HintTag hint={'상승세'} />}
                  {isLargestDrop && <HintTag hint={'하락세'} />}
                  {isMostVolatile && <HintTag hint={'변동적'} />}
                  {isLeastVolatile && <HintTag hint={'안정적'} />}
                  {isSpike && <HintTag hint={'거래량'} />}
                  {aiPick === 1 && <HintTag hint={'AI픽'} />}
                </div>
                <BtcWidget coin={coin.value} toolbarAllowed={false} />
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
          <Button css={recommendCss} onClick={handleRecommendClick}>
            AI 추천
          </Button>
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
