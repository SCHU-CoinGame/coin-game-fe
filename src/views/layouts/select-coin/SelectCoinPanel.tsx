import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { Button, Tag, Modal } from 'antd';
import { BtcWidget } from 'views/layouts/coin-chart/BtcWidget';
import { colorLight } from 'styles/colors';
import { useCoinInfoStore } from 'stores/userInfoStore';
import { useNavigate } from 'react-router-dom';
import { Overlay } from 'views/layouts/Overlay';
import { useCoinListStore } from 'stores/userInfoStore';
import { getDeeplearningData } from 'api/requests/requestCoin';
import { useQuery } from '@tanstack/react-query';
import { HintTag } from 'views/components/HintTag';
import { ConvertSlashToDash } from 'views/CoinConverter';

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
  transition: width 30s linear;
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
  margin-right: 5px;
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
  const { data: deeplearningData } = useQuery({
    queryKey: ['deeplearningData'],
    queryFn: getDeeplearningData,
  });

  const navigate = useNavigate();
  const changeCoinInfo = useCoinInfoStore((state) => state.changeCoinInfo);
  const coins = useCoinListStore((state) => state.coinList);

  // 시작 카운트다운
  const [countdown, setCountdown] = useState(5);
  const [timeLeft, setTimeLeft] = useState(35);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimeOverModalOpen, setIsTimeOverModalOpen] = useState(false);

  const handleTimeOver = () => {
    if (selectedCoins.length < 2) {
      setSelectedCoins([0, 1, 2]);
      setIsTimeOverModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

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
          handleTimeOver();

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
      setIsModalOpen(true);
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
          <div css={progressCss(countdown)}></div>
        </div>
        <div css={chartContainerCss}>
          {coins.map((coin, index) => {
            const isSelected = selectedCoins.includes(index);
            const isDisabled = !isSelected && isMaxSelected;
            if (deeplearningData) {
              const btcData = deeplearningData.find(
                (item) => item.code === ConvertSlashToDash(coin.value),
              );
              console.log(btcData);
            }
            return (
              <div key={index} css={coinItemCss}>
                <div css={coinTitleCss(isSelected)} onClick={() => toggleCoinSelection(index)}>
                  {coin.label} {coin.value}
                  <Button css={selectButtonCss(isSelected, isDisabled)} disabled={isDisabled}>
                    {isSelected ? '해제' : '선택'}
                  </Button>
                  {coin.value === 'BTCUSDT' && <HintTag hint={'하락세'} />}
                  {/* <HintTag hint={'하락세'} /> */}
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
          <Button css={recommendCss}>AI 추천</Button>
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
