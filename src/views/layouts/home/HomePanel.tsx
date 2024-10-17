import { css } from '@emotion/react';
import { useState } from 'react';
import { colorLight } from 'styles/colors';
import { Button } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HintTag } from 'views/components/HintTag';

const containerCss = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const tutorialTextCss = css`
  align-content: center;
  font-size: 32px;
  text-align: center;
  font-family: 'SpoqaHanSansNeo-Bold';
`;

const btnContainerCss = css`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const prevBtnCss = css`
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

const nextBtnCss = css`
  width: 120px;
  height: 40px;
  font-size: 20px;
  color: white;
  background-color: ${colorLight.mainBtnColor};
  font-family: 'GmarketSans-Bold';
  outline: none;
  &:focus {
    outline: none;
  }
`;

const hintTextCss = css`
  font-size: 24px;
  font-family: 'SpoqaHanSansNeo-Bold';
`;

function HomePanel() {
  const navigate = useNavigate();

  const [tutorialIdx, setTutorialIdx] = useState(0);
  const tutorial = [
    '코인 예측왕 게임은 실시간 비트코인 가격을 바탕으로 모의투자를 즐길 수 있는 게임입니다',
    '게임의 순서는 다음과 같이 진행됩니다 <br /> <br />1) 아홉 개의 종목 중에서 가장 유망해보이는 세 개의 종목을 고른 뒤,<br />2) 각 종목에 투자할 금액을 선택하세요! <br />3) 15초 후의 가격 변동에 따라 점수를 얻게 됩니다',
    <>
      또한, 초보 투자자들을 위해 힌트를 제공해드리고 있습니다.
      <br /> 힌트를 참고해서 종목을 신중하게 선택해보세요!
      <br />
      <br />
      <div css={hintTextCss}>
        <HintTag hint={'하락세'} /> - 가격이 가장 많이 떨어진 종목
      </div>
      <div css={hintTextCss}>
        <HintTag hint={'상승세'} /> - 가격이 가장 많이 오른 종목
      </div>
      <div css={hintTextCss}>
        <HintTag hint={'변동적'} /> - 가격이 가장 많이 변동한 종목
      </div>
      <div css={hintTextCss}>
        <HintTag hint={'안정적'} /> - 변동이 크게 없는 가장 안정적인 종목
      </div>
      <div css={hintTextCss}>
        <HintTag hint={'거래량'} /> - 거래량이 가장 많은 종목
      </div>
      <div css={hintTextCss}>
        <HintTag hint={'AI픽'} /> - AI가 데이터 분석 후 추천한 종목
      </div>
    </>,
    '우선, 아홉 개의 비트코인 종목 중에서, 가장 유망해 보이는 세 개의 그래프를 골라주세요<br />제한 시간은 30초 입니다<br />선택이 어려우시다면 AI 추천을 활용해보세요!',
  ];

  const handleStartGame = () => {
    navigate('/select-coin');
  };

  return (
    <div css={containerCss}>
      <AnimatePresence mode="wait">
        <motion.div
          key={tutorialIdx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          css={tutorialTextCss}
        >
          {typeof tutorial[tutorialIdx] === 'string' ? (
            <div
              css={tutorialTextCss}
              dangerouslySetInnerHTML={{ __html: tutorial[tutorialIdx] as string }}
            />
          ) : (
            tutorial[tutorialIdx]
          )}
        </motion.div>
      </AnimatePresence>
      <div css={btnContainerCss}>
        {tutorialIdx === 0 ? (
          ''
        ) : (
          <Button css={prevBtnCss} onClick={() => setTutorialIdx(tutorialIdx - 1)}>
            이전
          </Button>
        )}
        {tutorialIdx === 3 ? (
          <Button css={nextBtnCss} onClick={handleStartGame}>
            준비 완료!
          </Button>
        ) : (
          <Button css={nextBtnCss} onClick={() => setTutorialIdx(tutorialIdx + 1)}>
            다음
          </Button>
        )}
      </div>
    </div>
  );
}

export { HomePanel };
