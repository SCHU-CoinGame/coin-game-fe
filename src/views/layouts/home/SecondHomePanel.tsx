import { css } from '@emotion/react';
import { useState } from 'react';
import { colorLight } from 'styles/colors';
import { Button } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
  height: 100px;
  font-size: 32px;
  text-align: center;
  font-family: 'SpoqaHanSansNeo-Bold';
`;

const btnContainerCss = css`
  display: flex;
  flex-direction: row;
  gap: 10px;
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

  const tutorial = [
    '고른 3개의 종목에 투자하세요!<br />종목 하나당 각각 10억, 5억, 1억을 투자할 수 있으며, 제한시간은 30초 입니다',
  ];

  const handleStartGame = () => {
    navigate('/select-money');
  };

  return (
    <div css={containerCss}>
      <AnimatePresence mode="wait">
        <motion.div
          key={0}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          css={tutorialTextCss}
          dangerouslySetInnerHTML={{ __html: tutorial[0] }}
        />
      </AnimatePresence>
      <div css={btnContainerCss}>
        <Button css={nextBtnCss} onClick={handleStartGame}>
          준비 완료!
        </Button>
      </div>
    </div>
  );
}

export { SecondHomePanel };
