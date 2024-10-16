import { Overlay } from 'views/layouts/Overlay';
import { css } from '@emotion/react';
import { Button, Radio } from 'antd';
import { useState, useEffect } from 'react';
import { colorLight } from 'styles/colors';
import { useCoinInfoStore } from 'stores/userInfoStore';
import { BtcWidget } from 'views/layouts/coin-chart/BtcWidget';
import { getUpbitData } from 'api/requests/requestCoin';
import { useMutation } from '@tanstack/react-query';
import { ConvertSlashToDash, transformMoneyData } from 'views/CoinConverter';
const titleTextCss = css`
  align-content: center;
  width: 100%;
  height: 40px;
  font-size: 32px;
  text-align: center;
  font-family: 'SpoqaHanSansNeo-Bold';
`;

const containerCss = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const chartContainerCss = css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5px;
  height: 360px;
`;

const radioContainerCss = css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-top: 30px;
`;

const titleContainerCss = css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
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
  transition: width 30s linear;
`;

const buttonContainerCss = css`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 20px;
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

const coinDataListCss = css`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 10px;
  width: 100%;
`;

const coinDataCss = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 200px;
`;

function SelectMoneyPanel() {
  const [coinDataList, setCoinDataList] = useState<any[]>([]); // 데이터 리스트 상태 추가
  const [finalCoinInfo, setFinalCoinInfo] = useState<any[]>([]);
  const [previousTimestamps, setPreviousTimestamps] = useState<any>({});

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

  const [countdown, setCountdown] = useState(5);
  const [timeLeft, setTimeLeft] = useState(35);
  const [selectedAmounts, setSelectedAmounts] = useState(['', '', '']);

  useEffect(() => {
    const loadingTimer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(loadingTimer);
    }, 5000);

    const gameTimer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(gameTimer);

          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(loadingTimer);
      clearInterval(gameTimer);
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

  const isValueSelected = (value: string) => selectedAmounts.includes(value);
  const isAllSelected = selectedAmounts.every((amount) => amount !== '');

  const handleNextClick = () => {
    if (isAllSelected) {
      setPreviousTimestamps({});
      console.log('온클릭', previousTimestamps);
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
      console.log('코인 데이터: ');
    }
  };

  const getCoinInfo = async () => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 0; i < 10; i++) {
      await upbitData.mutateAsync(); // 데이터 요청 및 처리 대기

      await delay(1000); // 1초 기다림
    }
  };

  async function processData(newData: any[]) {
    console.log('함수 맨 처음에 타임스탬프 가져오기', previousTimestamps);

    const updatedCoinInfo = finalCoinInfo.map((coin: any) => {
      // 서버 데이터 중에서 code가 일치하는 항목을 찾음
      const matchingData = newData.find((data) => data.code === coin.value);
      console.log('일치하는 데이터만', matchingData);

      if (matchingData) {
        // 이전에 받은 timestamp와 비교하여 변경 여부 확인
        const prevTimestamp = previousTimestamps[matchingData.code];
        console.log('이전 타임스탬프', prevTimestamp);
        console.log('현재 타임스탬프', matchingData.trade_timestamp);

        // 첫 번째 요청이거나 timestamp가 변경된 경우만 업데이트
        if (!prevTimestamp || prevTimestamp !== matchingData.trade_timestamp) {
          let newMoney;

          // newData.change가 'RISE'면 증가, 'FALL'이면 감소
          if (matchingData.change === 'RISE') {
            newMoney = coin.money + coin.money * matchingData.change_rate;
          } else if (matchingData.change === 'FALL') {
            newMoney = coin.money - coin.money * matchingData.change_rate;
          } else {
            newMoney = coin.money; // 변화가 없다면 그대로 유지
          }

          // 해당 code의 현재 timestamp를 상태로 저장 (이전 상태와 병합)
          setPreviousTimestamps((prevTimestamps: any) => ({
            ...prevTimestamps,
            [matchingData.code]: matchingData.trade_timestamp,
          }));

          return { ...coin, money: newMoney }; // 업데이트된 money 반환
        }
      }

      // 일치하지 않거나 timestamp가 동일하면 기존 상태 유지
      return coin;
    });

    console.log('값 변경!', updatedCoinInfo);

    // 상태값 업데이트
    setFinalCoinInfo(updatedCoinInfo);
  }
  return (
    <div css={containerCss}>
      {countdown > 0 && <Overlay countdown={countdown} height={80} />}
      <div css={titleTextCss}>
        선택한 3개의 종목에 투자하세요! <br />
        종목 하나당 각각 10억, 5억, 1억을 투자할 수 있습니다.
        <div css={progressBoxCss}>
          <div css={progressCss(countdown)}></div>
        </div>
      </div>

      <div style={{ width: '100%' }}>
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
        <div css={radioContainerCss}>
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
        <div css={coinDataListCss}>
          {coinDataList.map((coin, index) => (
            <div css={coinDataCss} key={index}>
              <hr />
              <p>코드: {coin.code}</p>
              <p>가격: {coin.trade_price}</p>
              <p>변동률: {coin.change_rate}</p>
              <p>타임스탬프: {coin.timestamp}</p>
              <p>트레이드 타임: {coin.trade_timestamp}</p>
            </div>
          ))}
        </div>
      </div>

      <div css={buttonContainerCss}>
        <Button css={recommendCss}>AI 추천</Button>
        <Button css={nextBtnCss(isAllSelected)} onClick={handleNextClick} disabled={!isAllSelected}>
          선택완료
        </Button>
      </div>
    </div>
  );
}

export { SelectMoneyPanel };