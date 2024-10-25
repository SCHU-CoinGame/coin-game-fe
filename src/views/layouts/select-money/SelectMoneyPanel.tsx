import { Overlay } from 'views/layouts/Overlay';
import { css } from '@emotion/react';
import { Button, Radio, Modal } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { colorLight } from 'styles/colors';
import { useCoinInfoStore, useUserInfoStore, useDeeplearningRankStore } from 'stores/userInfoStore';
import { BtcWidget } from 'views/layouts/coin-chart/BtcWidget';
import { getUpbitData } from 'api/requests/requestCoin';
import { useMutation } from '@tanstack/react-query';
import { ConvertSlashToDash, transformMoneyData } from 'views/CoinConverter';
import { useNavigate } from 'react-router-dom';
import { setUserData } from 'api/requests/requestCoin';
import { requestSignout } from 'api/requests/requestAuth';
import Decimal from 'decimal.js';
import buySound from '/assets/buy.wav';
import sellSound from '/assets/sell.wav';

const buyAudio = new Audio(buySound);
const sellAudio = new Audio(sellSound);

const containerCss = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const titleTextCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  width: 100%;
  height: 130px;
  font-size: 32px;
  font-family: 'SpoqaHanSansNeo-Bold';
`;

const progressBoxCss = (isGameStart: boolean) => css`
  width: 100%;
  height: 16px;
  display: flex;
  border-radius: 5px;
  margin-top: 10px;
  justify-content: flex-start;
  background-color: #e2e2e2;
  top: ${isGameStart ? '-200px' : '0'};
  opacity: ${isGameStart ? 0 : 1};
  transition:
    top 1s ease-in,
    opacity 0.3s ease;
`;

const progressCss = (countdown: number) => css`
  width: ${countdown === 0 ? '0' : '100%'};
  height: 16px;
  border-radius: 5px 0 0 5px;
  background-color: ${colorLight.mainBtnColor};
  transition: width 20s linear;
`;

const titleContainerCss = css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  width: 100%;
`;

const mainBodyCss = css`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 780px;
`;

const nowPriceContainerCss = (isGameStart: boolean) => css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  height: 50px;
  justify-items: center;
  position: relative;
  font-size: 18px;
  top: ${isGameStart ? '460px' : '570px'};
  opacity: ${isGameStart ? 1 : 0};
  transition:
    top 0.2s ease,
    opacity 0.5s ease;
`;

const nowPriceTextCss = css`
  display: inline-block;
  text-align: end;
  width: fit-content;
  font-size: 18px;
  font-family: 'SpoqaHanSansNeo-Bold';
`;

const chartContainerCss = css`
  display: grid;
  z-index: 100;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5px;
  height: 360px;
  width: 100%;
`;

const radioContainerCss = (isGameStart: boolean) => css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  gap: 10px;
  margin-top: 15px;
  position: relative;
  top: ${isGameStart ? '-200px' : '0'};
  opacity: ${isGameStart ? 0 : 1};
  z-index: 0;
  transition:
    top 1s ease-in,
    opacity 0.3s ease;
`;

const coinTitleCss = css`
  display: flex;
  flex-direction: row;
  width: fit-content;
  align-items: center;
  font-family: 'SpoqaHanSansNeo-Bold';
  cursor: pointer;
  font-size: 18px;
  height: 30px;
`;

const buttonContainerCss = (isGameStart: boolean) => css`
  display: flex;
  position: relative;
  flex-direction: row;
  gap: 10px;
  margin-top: 0px;
  top: ${isGameStart ? '-800px' : '0'};
  opacity: ${isGameStart ? 0 : 1};
  z-index: 0;
  transition:
    top 1s ease-in,
    opacity 0.3s ease;
`;

const scoreContainerCss = (isGameStart: boolean) => css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: ${isGameStart ? '20px' : '-120px'};
  opacity: ${isGameStart ? 1 : 0};
  transition:
    top 0.2s ease,
    opacity 0.5s ease;
`;

const scoreTextCss = (money: number, selectedAmount: number) => css`
  text-align: center;
  font-size: 40px;
  font-family: 'SpoqaHanSansNeo-Bold';
  color: ${money >= selectedAmount ? '#C84A31' : '#0062DF'};
`;

const balanceCss = (isGameStart: boolean, balance: number) => css`
  width: 100%;
  position: relative;
  text-align: center;
  font-size: ${isGameStart ? '48px' : '36px'};
  color: ${balance >= 1600000000 ? '#C84A31' : '#0062DF'};
  font-family: 'SpoqaHanSansNeo-Bold';
  top: ${isGameStart ? '30px' : '-100px'};
  opacity: ${isGameStart ? 1 : 0};
  transition:
    top 0.2s ease,
    opacity 0.5s ease;
`;

const leverageRadioContainerCss = (isGameStart: boolean) => css`
  display: flex;
  flex-direction: column;
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
  top: ${isGameStart ? '-200px' : '0'};
  opacity: ${isGameStart ? 0 : 1};
  transition:
    top 1s ease-in,
    opacity 0.3s ease;
`;

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

const cellBtnContainerCss = (isGameStart: boolean) => css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
  position: relative;
  width: 100%;
  gap: 10px;
  top: ${isGameStart ? '-170px' : '-350px'};
  opacity: ${isGameStart ? 1 : 0};
  transition:
    top 0.2s ease,
    opacity 0.5s ease;
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

const radioGroupCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  && .ant-radio-button-wrapper-checked {
    background-color: ${colorLight.mainBtnColor};
    border: none;
    &:hover {
      background-color: ${colorLight.mainBtnColor};
    }
  }
`;

const radioButtonCss = (isSelected: boolean, isDisabled: boolean) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  width: 90px;
  font-family: 'SpoqaHanSansNeo-Bold';
  background-color: ${isDisabled ? '#e0e0e0' : isSelected ? colorLight.mainBtnColor : 'white'};
  color: ${isSelected ? 'white' : 'black'};
  cursor: pointer;
  opacity: ${isDisabled ? 0.7 : 1};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${isDisabled ? '#e0e0e0' : isSelected ? colorLight.mainBtnColor : '#f0f0f0'};
  }
`;

const leverageTextCss = css`
  font-size: 26px;
  font-family: 'SpoqaHanSansNeo-Bold';
  margin-bottom: 10px;
`;

const leverageRadioButtonCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  width: 110px;
`;

const modalContainerCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const finishModalContainerCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 180px;
`;

const modalTitleCss = css`
  font-size: 28px;
  font-family: 'SpoqaHanSansNeo-Bold';
  margin-bottom: 20px;
`;

const modalContentCss = (balance: number) => css`
  font-size: 48px;
  font-family: 'SpoqaHanSansNeo-Bold';
  margin-bottom: 20px;
  color: ${balance >= 1600000000 ? '#C84A31' : '#0062DF'};
`;

const modalContentTextCss = css`
  font-size: 48px;
  font-family: 'SpoqaHanSansNeo-Bold';
`;

const highScoreTextCss = css`
  font-size: 18px;
  font-family: 'SpoqaHanSansNeo-Bold';
  margin-top: 5px;
  color: #474747;
`;

const timeOverModalCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-top: 30px;
`;

const cellBtnCss = (isSelected: boolean) => css`
  width: 90px;
  height: 40px;
  background-color: ${isSelected ? '#969696' : colorLight.mainBtnColor};
  border-color: ${isSelected ? '#7b7b7b' : colorLight.mainBtnColor};
  outline: none;
  &:focus {
    outline: none;
  }
  font-size: 20px;
  color: white;
  font-family: 'GmarketSans-Bold';
`;

const modalOkBtnCss = css`
  background-color: ${colorLight.mainBtnColor};
`;

const finishTitleCss = css`
  text-align: center;
  font-size: 32px;
  margin-bottom: 20px;
`;

function SelectMoneyPanel() {
  const [coinDataList, setCoinDataList] = useState<any[]>([]); // 데이터 리스트 상태 추가
  const [finalCoinInfo, setFinalCoinInfo] = useState<any[]>([0, 0, 0]);
  const [previousTradePrices, setPreviousTradePrices] = useState<any>({});
  const [selectedLeverage, setSelectedLeverage] = useState<number>(1);
  const [isGameStart, setIsGameStart] = useState<boolean>(false);
  const [calcTimer, setCalcTimer] = useState<number>(45);
  const [isTimeOverModalOpen, setIsTimeOverModalOpen] = useState(false);
  const [balance, setBalance] = useState<number>(1600000000);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const { deeplearningRank } = useDeeplearningRankStore((state) => ({
    deeplearningRank: state.deeplearningRank,
  }));

  const [cellStates, setCellStates] = useState<boolean[]>([false, false, false]);
  const [initialTradePrices, setInitialTradePrices] = useState<{ [key: string]: number }>({});
  const [currentTradePrices, setCurrentTradePrices] = useState<{ [key: string]: number }>({});

  const navigate = useNavigate();
  const upbitData = useMutation({
    mutationFn: getUpbitData,
    onSuccess: (data) => {
      setCoinDataList((prevData) => [...prevData, ...data]); // 데이터 리스트에 추가
      processData(data);
      console.log(data);
    },
    onError: () => {
      console.log('error');
    },
    onMutate: () => {},
  });
  const { coinInfo } = useCoinInfoStore((state) => ({
    coinInfo: state.coinInfo,
  }));

  const changeCoinInfo = useCoinInfoStore((state) => state.changeCoinInfo);
  const changeBalance = useCoinInfoStore((state) => state.changeBalance);
  const { userInfo, changeUserInfo } = useUserInfoStore((state) => ({
    userInfo: state.userInfo,
    changeUserInfo: state.changeUserInfo,
  }));

  const userResultData = useMutation({
    mutationFn: setUserData,
    onSuccess: (data) => {
      console.log('성공', data);
    },
    onError: () => {
      console.log('error');
    },
  });

  function assignValuesByOrder(arr: number[]): string[] {
    const valueMap = ['10', '5', '1']; // 낮은 순서에 맞춰 값 할당
    const sortedIndices = [...arr].sort((a, b) => a - b); // 배열을 오름차순으로 정렬

    return arr.map((item) => {
      const index = sortedIndices.indexOf(item); // 원래 배열에서 각 요소의 순서를 찾음
      return valueMap[index]; // 해당 순서에 맞는 값 반환
    });
  }

  const [countdown, setCountdown] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25);
  const gameTimerRef = useRef<number | null>(null); // gameTimer를 저장할 ref
  const [selectedAmounts, setSelectedAmounts] = useState(['', '', '']);

  const handleTimeOver = () => {
    setSelectedAmounts(['10', '5', '1']);
    setIsTimeOverModalOpen(true);
  };

  const stopGameTimer = () => {
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = null; // 타이머 ID 초기화
    }
  };

  useEffect(() => {
    const loadingTimer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(loadingTimer);
    }, 5000);

    // gameTimer를 useRef로 저장
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

  const handleAmountChange = (index: number) => (e: any) => {
    const newValue = e.target.value;
    setSelectedAmounts((prevAmounts) => {
      const newAmounts = [...prevAmounts];
      const existingIndex = newAmounts.indexOf(newValue);

      if (existingIndex !== -1 && existingIndex !== index) {
        newAmounts[existingIndex] = '';
      }

      newAmounts[index] = newValue;
      return newAmounts;
    });
  };

  const handleLeverageChange = (e: any) => {
    setSelectedLeverage(e.target.value);
  };

  const isValueSelected = (value: string) => selectedAmounts.includes(value);
  const isAllSelected = selectedAmounts.every((amount) => amount !== '');

  const handleNextClick = () => {
    buyAudio.play();
    setIsTimeOverModalOpen(false);
    stopGameTimer();
    if (isAllSelected) {
      setPreviousTradePrices({});
      console.log('온클릭', previousTradePrices);
      setFinalCoinInfo([
        {
          value: ConvertSlashToDash(coinInfo.coin_1.value),
          money: transformMoneyData(selectedAmounts[0]),
        },
        {
          value: ConvertSlashToDash(coinInfo.coin_2.value),
          money: transformMoneyData(selectedAmounts[1]),
        },
        {
          value: ConvertSlashToDash(coinInfo.coin_3.value),
          money: transformMoneyData(selectedAmounts[2]),
        },
      ]);
      getCoinInfo();
      setIsGameStart(true);
    }
  };

  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const getCoinInfo = async () => {
    const controller = new AbortController();
    setAbortController(controller);

    const delay = (ms: number) =>
      new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, ms);
        controller.signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new Error('Aborted'));
        });
      });

    try {
      for (let i = 0; i < 45; i++) {
        if (controller.signal.aborted) {
          break;
        }

        await upbitData.mutateAsync();

        setCalcTimer((prevTimer) => prevTimer - 1);
        await delay(1000);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('getCoinInfo가 중단되었습니다.');
      } else {
        console.error('오류 발생:', error);
      }
    } finally {
      setAbortController(null);
    }
  };

  const stopGetCoinInfo = () => {
    if (abortController) {
      abortController.abort();
    }
    setTimeout(() => {
      setCalcTimer(0);
    }, 300);
  };

  const handleGameEndClick = () => {
    userResultData.mutate({
      student_id: userInfo.student_id,
      name: userInfo.name,
      department: userInfo.department,
      nickname: userInfo.nickname,
      coin_1: finalCoinInfo[0].value,
      coin_2: finalCoinInfo[1].value,
      coin_3: finalCoinInfo[2].value,
      balance: userInfo.highScore,
    });
    setIsFinishModalOpen(true);
  };

  const handleRankingClick = () => {
    navigate('/rank');
  };

  const handleHomeClick = () => {
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

  useEffect(() => {
    if (calcTimer === 0) {
      if (balance > userInfo.highScore) {
        changeUserInfo({ ...userInfo, highScore: balance });
      }
    }
  }, [calcTimer]);

  async function processData(newData: any[]) {
    const updatedCoinInfo = finalCoinInfo.map((coin: any, index: number) => {
      if (cellStates[index] || coin.money === 0) {
        return coin;
      }

      const matchingData = newData.find((data) => data.code === coin.value);

      if (matchingData) {
        // 현재 거래 가격 업데이트
        setCurrentTradePrices((prev) => ({
          ...prev,
          [matchingData.code]: matchingData.trade_price,
        }));

        // 초기 거래 가격 설정 (아직 설정되지 않은 경우에만)
        if (!initialTradePrices[matchingData.code]) {
          setInitialTradePrices((prev) => ({
            ...prev,
            [matchingData.code]: matchingData.trade_price,
          }));
        }

        const initialPrice = initialTradePrices[matchingData.code];
        const currentPrice = matchingData.trade_price;

        if (initialPrice) {
          // 가격 변동 비율 계산
          const priceRatio = new Decimal(currentPrice).dividedBy(initialPrice);

          // 초기 투자금
          const initialInvestment = new Decimal(transformMoneyData(selectedAmounts[index]));

          // 새로운 자산 가치 계산
          let newMoney = initialInvestment.times(priceRatio);

          // 레버리지 적용
          if (priceRatio.greaterThan(1)) {
            // 가격이 올랐을 때
            const gain = newMoney.minus(initialInvestment);
            newMoney = initialInvestment.plus(gain.times(selectedLeverage));
          } else if (priceRatio.lessThan(1)) {
            // 가격이 내렸을 때
            const loss = initialInvestment.minus(newMoney);
            newMoney = initialInvestment.minus(loss.times(selectedLeverage));
          }

          // 음수 방지 및 0 유지
          newMoney = Decimal.max(newMoney, 0);
          if (newMoney.toNumber() === 0) {
            setCellStates((prevStates) => {
              const newStates = [...prevStates];
              newStates[index] = true;

              sellAudio.play();
              // 모든 셀이 체결되었는지 확인
              if (newStates.every((state) => state)) {
                stopGameTimer();
                stopGetCoinInfo(); // getCoinInfo 중지
              }

              return newStates;
            });
            return { ...coin, money: 0 };
          }

          console.log(
            `${coin.value} 초기가: ${initialPrice}, 현재가: ${currentPrice}, 변동비율: ${priceRatio}, 새 자산: ${newMoney}`,
          );

          return { ...coin, money: newMoney.toNumber() };
        }
      }

      return coin;
    });

    console.log('값 변경!', updatedCoinInfo);

    setFinalCoinInfo(updatedCoinInfo);
    setBalance(
      updatedCoinInfo.reduce((sum, coin) => new Decimal(sum).plus(coin.money).toNumber(), 0),
    );
  }

  const formatNumberWithComma = (number: number, rounded: boolean): string => {
    if (rounded) {
      const roundedNumber = Math.floor(number); // 소수점 제거
      return new Intl.NumberFormat('en-US').format(roundedNumber);
    }
    return new Intl.NumberFormat('en-US').format(number);
  };

  const handleRecommendClick = () => {
    const indices = assignValuesByOrder(deeplearningRank);
    console.log(deeplearningRank);
    console.log(indices);
    setSelectedAmounts(indices);
  };

  const handleCellClick = (index: number) => {
    setCellStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = true;

      sellAudio.play();
      // 모든 셀이 체결되었는지 확인
      if (newStates.every((state) => state)) {
        stopGameTimer();
        stopGetCoinInfo(); // getCoinInfo 중지
      }

      return newStates;
    });
  };

  const handleReTryClick = () => {
    changeUserInfo({ ...userInfo, reTryCount: userInfo.reTryCount - 1 });
    navigate('/');
  };

  return (
    <>
      <div css={containerCss}>
        {countdown > 0 && <Overlay countdown={countdown} height={80} />}
        <div css={titleTextCss}>
          {isGameStart ? '게임 시작!' : '선택한 종목에 투자하세요!'}
          <br />
          {isGameStart ? calcTimer : '종목 하나당 각각 10억, 5억, 1억을 투자할 수 있습니다.'}
          <div css={progressBoxCss(isGameStart)}>
            <div css={progressCss(countdown)}></div>
          </div>
        </div>
        <div css={mainBodyCss}>
          <div css={nowPriceContainerCss(isGameStart)}>
            {finalCoinInfo.map((coin, index) => (
              <span key={index} css={nowPriceTextCss}>
                나의 체결가:{' '}
                {initialTradePrices[coin.value] < 1
                  ? initialTradePrices[coin.value]
                  : formatNumberWithComma(initialTradePrices[coin.value] || 0, false)}
                <br />
                실시간 현재가:{' '}
                {currentTradePrices[coin.value] < 1
                  ? currentTradePrices[coin.value]
                  : formatNumberWithComma(currentTradePrices[coin.value] || 0, false)}
              </span>
            ))}
          </div>
          <div css={titleContainerCss}>
            <div css={coinTitleCss}>
              {coinInfo.coin_1.label} {coinInfo.coin_1.value}
            </div>
            <div css={coinTitleCss}>
              {coinInfo.coin_2.label} {coinInfo.coin_2.value}
            </div>
            <div css={coinTitleCss}>
              {coinInfo.coin_3.label} {coinInfo.coin_3.value}
            </div>
          </div>
          <div css={chartContainerCss}>
            <BtcWidget coin={coinInfo.coin_1.value} toolbarAllowed={true} />
            <BtcWidget coin={coinInfo.coin_2.value} toolbarAllowed={true} />
            <BtcWidget coin={coinInfo.coin_3.value} toolbarAllowed={true} />
          </div>
          <div css={radioContainerCss(isGameStart)}>
            {[0, 1, 2].map((index) => (
              <Radio.Group
                key={index}
                onChange={handleAmountChange(index)}
                value={selectedAmounts[index]}
                css={radioGroupCss}
                buttonStyle="solid"
              >
                {['10', '5', '1'].map((value) => (
                  <Radio.Button
                    key={value}
                    value={value}
                    css={radioButtonCss(
                      selectedAmounts[index] === value,
                      isValueSelected(value) && selectedAmounts[index] !== value,
                    )}
                  >
                    {value}억
                  </Radio.Button>
                ))}
              </Radio.Group>
            ))}
          </div>

          <div css={scoreContainerCss(isGameStart)}>
            <div css={scoreTextCss(finalCoinInfo[0].money, transformMoneyData(selectedAmounts[0]))}>
              {formatNumberWithComma(finalCoinInfo[0].money, true)}
            </div>
            <div css={scoreTextCss(finalCoinInfo[1].money, transformMoneyData(selectedAmounts[1]))}>
              {formatNumberWithComma(finalCoinInfo[1].money, true)}
            </div>
            <div css={scoreTextCss(finalCoinInfo[2].money, transformMoneyData(selectedAmounts[2]))}>
              {formatNumberWithComma(finalCoinInfo[2].money, true)}
            </div>
          </div>

          <div css={leverageRadioContainerCss(isGameStart)}>
            <div css={leverageTextCss}>레버리지를 설정하세요!</div>

            <Radio.Group
              onChange={handleLeverageChange}
              value={selectedLeverage}
              buttonStyle="solid"
              css={radioGroupCss}
            >
              {[1, 10, 100, 1000].map((value) => (
                <Radio.Button key={value} value={value} css={leverageRadioButtonCss}>
                  {value}배{value === 1000 ? '!!' : ''}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
          <div css={balanceCss(isGameStart, balance)}>
            잔고: {formatNumberWithComma(balance, true)} 원
          </div>

          <div css={buttonContainerCss(isGameStart)}>
            <Button css={recommendCss} onClick={handleRecommendClick}>
              AI 추천
            </Button>
            <Button
              css={nextBtnCss(isAllSelected)}
              onClick={handleNextClick}
              disabled={!isAllSelected}
            >
              게임 시작!
            </Button>
          </div>
          <div css={cellBtnContainerCss(isGameStart)}>
            {[0, 1, 2].map((index) => (
              <Button
                key={index}
                css={cellBtnCss(cellStates[index])}
                onClick={() => handleCellClick(index)}
                disabled={cellStates[index]}
              >
                {cellStates[index] ? '체결' : '매도'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={calcTimer === 0}
        footer={[
          <Button key="reTry" onClick={handleReTryClick} disabled={userInfo.reTryCount === 0}>
            재도전(남은기회 {userInfo.reTryCount}회)
          </Button>,
          <Button key="submit" type="primary" onClick={handleGameEndClick} css={modalOkBtnCss}>
            점수 등록
          </Button>,
        ]}
        closable={false}
        width={800}
        centered
      >
        <div css={modalContainerCss}>
          <div css={modalTitleCss}>게임 종료!</div>
          <div css={modalContentCss(balance)}>
            <div css={modalContentTextCss}>총 잔고: {formatNumberWithComma(balance, true)} 원</div>
            <div css={highScoreTextCss}>
              나의 최고 점수: {formatNumberWithComma(userInfo.highScore, true)} 원 (랭킹은
              최고점수로 등록됩니다)
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title="랭킹 등록 완료"
        open={isFinishModalOpen}
        footer={[
          <Button key="submit" onClick={handleHomeClick}>
            홈으로
          </Button>,
          <Button key="ranking" type="primary" onClick={handleRankingClick} css={modalOkBtnCss}>
            랭킹 확인
          </Button>,
        ]}
        closable={false}
        width={600}
        centered
      >
        <div css={finishModalContainerCss}>
          <div css={finishTitleCss}>
            점수가 등록되었습니다.
            <br />
            플레이해주셔서 감사합니다!
          </div>
        </div>
      </Modal>

      <Modal
        open={isTimeOverModalOpen}
        footer={[
          <Button key="submit" type="primary" onClick={handleNextClick} css={modalOkBtnCss}>
            확인
          </Button>,
        ]}
        closable={false}
        width={600}
        centered
      >
        <div css={timeOverModalCss}>
          <div>타임 오버! 금액이 랜덤하게 선택됩니다.</div>
        </div>
      </Modal>
    </>
  );
}

export { SelectMoneyPanel };
