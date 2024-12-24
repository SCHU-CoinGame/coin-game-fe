import { ResponsivePie } from '@nivo/pie';

interface MyResponsivePieProps {
  data: any;
}

const MyResponsivePie = ({ data }: MyResponsivePieProps) => (
  <ResponsivePie
    animate={false}
    data={data}
    margin={{ top: 40, right: 90, bottom: 80, left: 90 }}
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={3}
    activeOuterRadiusOffset={8}
    borderWidth={1}
    borderColor={{
      from: 'color',
      modifiers: [['darker', 0.2]],
    }}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: 'color' }}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor={{
      from: 'color',
      modifiers: [['darker', 2]],
    }}
  />
);

export { MyResponsivePie };
