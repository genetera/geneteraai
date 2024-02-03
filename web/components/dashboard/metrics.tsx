import { Card, Grid, Metric, Text, Flex } from "@tremor/react";

const categories = [
  {
    title: "Organizations",
    metric: 0,
    createdByMe: 0,
  },
  {
    title: "Contents",
    metric: 0,
    createdByMe: 0,
  },
  {
    title: "Projects",
    metric: 0,
    createdByMe: 0,
  },
];

export default function Metrics() {
  return (
    <Grid numItemsSm={2} numItemsLg={3} className="gap-6 mt-4 mb-4">
      {categories.map((item) => (
        <Card key={item.title}>
          <Text className="font-bold">{item.title}</Text>
          <Metric>{item.metric}</Metric>
          <Flex justifyContent="start" className="space-x-2 mt-4">
            <Flex justifyContent="start" className="space-x-1 truncate">
              <Text color="emerald">{item.createdByMe}</Text>
              <Text className="truncate">Created by me</Text>
            </Flex>
          </Flex>
        </Card>
      ))}
    </Grid>
  );
}
