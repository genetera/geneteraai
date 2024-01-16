import { Card, Grid, Metric, Text } from "@tremor/react";

const categories = [
  {
    title: "Organizations",
    metric: 4,
  },
  {
    title: "Contents",
    metric: 230,
  },
  {
    title: "Projects",
    metric: 15,
  },
];

export default function Metrics() {
  return (
    <Grid numItemsSm={2} numItemsLg={3} className="gap-6 mt-4 mb-4">
      {categories.map((item) => (
        <Card key={item.title}>
          <Text className="font-bold">{item.title}</Text>
          <Metric>{item.metric}</Metric>
        </Card>
      ))}
    </Grid>
  );
}
