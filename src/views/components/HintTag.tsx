import { Tag } from 'antd';
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
  };

  const hintIcons: { [key: string]: React.ReactNode } = {
    하락세: <FallOutlined />,
    상승세: <RiseOutlined />,
    변동적: <ThunderboltOutlined />,
    거래량: <FireOutlined />,
    안정적: <PushpinOutlined />,
    AI픽: <LikeOutlined />,
  };

  const color = hintColors[props.hint] || 'default';
  const icon = hintIcons[props.hint];

  return (
    <Tag color={color} icon={icon}>
      {props.hint}
    </Tag>
  );
}

export { HintTag };
