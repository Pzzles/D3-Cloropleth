const countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
const educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let countyData;
let educationData;

const canvas = d3.select('#canvas');
const tooltip = d3.select('#tooltip');

const drawMap = () => {
  const colorScale = d3.scaleThreshold()
    .domain([15, 30, 45])
    .range(['tomato', 'orange', 'lightgreen', 'limegreen']);

  canvas.selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', (d) => colorScale(getPercentage(d)))
    .attr('data-fips', (d) => d.id)
    .attr('data-education', (d) => getPercentage(d))
    .on('mouseover', (d) => {
      tooltip.transition()
        .style('visibility', 'visible');

      tooltip.text(getTooltipText(d));

      tooltip.attr('data-education', getPercentage(d));
    })
    .on('mouseout', () => {
      tooltip.transition()
        .style('visibility', 'hidden');
    });
};

const getPercentage = (countyDataItem) => {
  const id = countyDataItem.id;
  const county = educationData.find((item) => item.fips === id);
  return county.bachelorsOrHigher;
};

const getTooltipText = (countyDataItem) => {
  const id = countyDataItem.id;
  const county = educationData.find((item) => item.fips === id);
  return `${county.fips} - ${county.area_name}, ${county.state} : ${county.bachelorsOrHigher}%`;
};

d3.json(countyURL).then((data) => {
  countyData = topojson.feature(data, data.objects.counties).features;
  d3.json(educationURL).then((data) => {
    educationData = data;
    drawMap();
  });
});
