import { ResponsiveBar } from '@nivo/bar';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

function formatNumber(value: number) {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`; // 1B 이상
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`; // 1M 이상
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`; // 1K 이상
  return value; // 그 외는 그대로 표시
}

const MyResponsiveBar = ({
  data,
  legend,
  keys,
  indexBy,
  colors,
}: {
  data: any;
  legend: string;
  keys: string[];
  indexBy: string;
  colors: string;
}) => (
  <ResponsiveBar
    animate={false}
    data={data}
    keys={keys}
    indexBy={indexBy}
    margin={{ top: 50, right: 40, bottom: 50, left: 80 }}
    padding={0.3}
    axisTop={null}
    colors={colors}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legendPosition: 'middle',
      legendOffset: 32,
      truncateTickAt: 0,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: legend,
      legendPosition: 'middle',
      legendOffset: -70,
      truncateTickAt: 0,
      format: formatNumber,
    }}
  />
);

export { MyResponsiveBar };
