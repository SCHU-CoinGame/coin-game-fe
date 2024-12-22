import { Tag } from 'antd';
import { css } from '@emotion/react';
import {
  FallOutlined,
  RiseOutlined,
  ThunderboltOutlined,
  FireOutlined,
  PushpinOutlined,
  CrownOutlined,
  RedditCircleFilled,
  RobotFilled,
  TrophyFilled,
  PythonOutlined,
  LikeOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

interface HintTagProps {
  hint: string;
}

function HintTag(props: HintTagProps) {
  const hintColors: { [key: string]: string } = {
    하락세: 'red',
    상승세: 'green',
    변동적: 'magenta',
    거래량: 'orange',
    안정적: 'geekblue',
    AI픽: 'gold',
    사용자픽: 'purple',
  };

  const hintIcons: { [key: string]: React.ReactNode } = {
    하락세: <FallOutlined />,
    상승세: <RiseOutlined />,
    변동적: <ThunderboltOutlined />,
    거래량: <FireOutlined />,
    안정적: <PushpinOutlined />,
    AI픽: <LikeOutlined />,
    사용자픽: <BarChartOutlined />,
  };

  const color = hintColors[props.hint] || 'default';
  const icon = hintIcons[props.hint];

  return (
    <Tag
      color={color}
      icon={icon}
      css={css`
        height: 23px;
      `}
    >
      {props.hint}
    </Tag>
  );
}

export { HintTag };
