import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { Progress } from 'antd';
import { colorLight } from 'styles/colors';

const overlayCSS = (height: number) => css`
  position: fixed;
  top: ${height + 20}px;
  left: 0;
  width: 100%;
  height: calc(100% - ${height}px);
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: #000000;
  font-size: 24px;
`;

interface OverlayProps {
  countdown: number;
  height: number;
}

function Overlay(props: OverlayProps) {
  const [percent, setPercent] = useState(99);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prevPercent) => {
        if (prevPercent <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevPercent - 4;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div css={overlayCSS(props.height)}>
      <Progress
        type="circle"
        percent={percent}
        format={() => `${props.countdown}`}
        strokeColor={colorLight.mainBtnColor}
      />
    </div>
  );
}

export { Overlay };
