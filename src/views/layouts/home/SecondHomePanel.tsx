import { css } from '@emotion/react';
import { useState } from 'react';
import { colorLight } from 'styles/colors';
import { Button } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePreventNavigation } from 'hooks/UsePreventNavigation';

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

function SecondHomePanel() {
  const navigate = useNavigate();
  usePreventNavigation({ when: true });
  const [tutorialIdx, setTutorialIdx] = useState(0);

  const tutorial = [
    '선택한 종목에 투자하세요!<br />종목 하나당 각각 10억, 5억, 1억을 투자할 수 있으며, 레버리지 선택도 가능합니다',
    '레버리지란, 적은 자본으로 더 큰 금액을 투자할 수 있는 방법입니다 <br />예를 들어, 100배 레버리지를 사용하면 100만 원으로 1억 원을 투자한 효과를 얻을 수 있습니다 <br />하지만 이익이 커지는 만큼 손실도 그만큼 커질 수 있다는 점을 유의해야 합니다',
    '금액을 선택한 뒤, 적절한 타이밍에 매도를 해 최대한의 이익을 남기세요<br />제한시간은 90초 입니다<br />선택이 어려우시다면 AI 추천을 활용해보세요!',
  ];

  const handleStartGame = () => {
    navigate('/select-money');
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
        {tutorialIdx === 2 ? (
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

export { SecondHomePanel };
