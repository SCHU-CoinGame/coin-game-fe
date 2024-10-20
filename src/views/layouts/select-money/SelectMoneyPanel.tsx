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
  transition: width 30s linear;
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

const firstCellBtnCss = (isSelected: boolean) => css`
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

const secondCellBtnCss = (isSelected: boolean) => css`
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

const thirdCellBtnCss = (isSelected: boolean) => css`
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
  height: 300px;
`;

const modalTitleCss = css`
  font-size: 36px;
  font-family: 'SpoqaHanSansNeo-Bold';
  margin-bottom: 20px;
`;

const modalContentCss = (balance: number) => css`
  font-size: 48px;
  font-family: 'SpoqaHanSansNeo-Bold';
  margin-bottom: 20px;
  color: ${balance >= 1600000000 ? '#C84A31' : '#0062DF'};
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

function SelectMoneyPanel() {
  const [coinDataList, setCoinDataList] = useState<any[]>([]); // 데이터 리스트 상태 추가
  const [finalCoinInfo, setFinalCoinInfo] = useState<any[]>([0, 0, 0]);
  const [previousTradePrices, setPreviousTradePrices] = useState<any>({});
  const [selectedLeverage, setSelectedLeverage] = useState<number>(1);
  const [isGameStart, setIsGameStart] = useState<boolean>(false);
  const [calcTimer, setCalcTimer] = useState<number>(45);
  const [isTimeOverModalOpen, setIsTimeOverModalOpen] = useState(false);
  const [balance, setBalance] = useState<number>(1600000000);
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

  const { userInfo } = useUserInfoStore((state) => ({
    userInfo: state.userInfo,
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
  const [timeLeft, setTimeLeft] = useState(35);
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

  const getCoinInfo = async () => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 0; i < 45; i++) {
      await upbitData.mutateAsync(); // 데이터 요청 및 처리 대기
      setCalcTimer((prevTimer) => prevTimer - 1);
      await delay(1000); // 1초 기다림
    }
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
      balance: Math.round(balance),
    });
    navigate('/signin');
  };

  async function processData(newData: any[]) {
    const updatedCoinInfo = finalCoinInfo.map((coin: any, index: number) => {
      if (cellStates[index]) {
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

        const prevTradePrice = previousTradePrices[matchingData.code];
        console.log('이전 거래 가격', prevTradePrice);
        console.log('현재 거래 가격', matchingData.trade_price);

        if (prevTradePrice) {
          if (prevTradePrice !== matchingData.trade_price) {
            let newMoney;

            const coinAmount = coin.money / prevTradePrice;
            if (matchingData.change === 'RISE' || matchingData.change === 'FALL') {
              newMoney =
                coin.money +
                coinAmount * (matchingData.trade_price - prevTradePrice) * selectedLeverage;
            } else {
              newMoney = coin.money;
            }

            newMoney = Math.max(newMoney, 0);

            setPreviousTradePrices((prevTradePrices: any) => ({
              ...prevTradePrices,
              [matchingData.code]: matchingData.trade_price,
            }));

            return { ...coin, money: newMoney };
          }
        } else {
          setPreviousTradePrices((prevTradePrices: any) => ({
            ...prevTradePrices,
            [matchingData.code]: matchingData.trade_price,
          }));
        }
      }

      return coin;
    });

    console.log('값 변경!', updatedCoinInfo);

    setFinalCoinInfo(updatedCoinInfo);
    setBalance(updatedCoinInfo.reduce((sum, coin) => sum + coin.money, 0));
  }

  const formatNumberWithComma = (number: number): string => {
    const roundedNumber = Math.floor(number); // 소수점 제거
    return new Intl.NumberFormat('en-US').format(roundedNumber);
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

      // 모든 셀이 체결되었는지 확인
      if (newStates.every((state) => state)) {
        stopGameTimer();
        setCalcTimer(0);
      }

      return newStates;
    });
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
                나의 체결가: {formatNumberWithComma(initialTradePrices[coin.value] || 0)}
                <br />
                실시간 현재가: {formatNumberWithComma(currentTradePrices[coin.value] || 0)}
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
              {formatNumberWithComma(finalCoinInfo[0].money)}
            </div>
            <div css={scoreTextCss(finalCoinInfo[1].money, transformMoneyData(selectedAmounts[1]))}>
              {formatNumberWithComma(finalCoinInfo[1].money)}
            </div>
            <div css={scoreTextCss(finalCoinInfo[2].money, transformMoneyData(selectedAmounts[2]))}>
              {formatNumberWithComma(finalCoinInfo[2].money)}
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
                  {value}배
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
          <div css={balanceCss(isGameStart, balance)}>
            잔고: {formatNumberWithComma(balance)} 원
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
                {cellStates[index] ? '체결' : '매수'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={calcTimer === 0}
        footer={[
          <Button key="submit" type="primary" onClick={handleGameEndClick}>
            게임 종료
          </Button>,
        ]}
        closable={false}
        width={800}
        centered
      >
        <div css={modalContainerCss}>
          <div css={modalTitleCss}>게임 종료!</div>
          <div css={modalContentCss(balance)}>
            <div>총 잔고: {formatNumberWithComma(balance)} 원</div>
          </div>
        </div>
      </Modal>

      <Modal
        open={isTimeOverModalOpen}
        footer={[
          <Button key="submit" type="primary" onClick={handleNextClick}>
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
