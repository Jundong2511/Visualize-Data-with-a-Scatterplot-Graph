const height = 600, width = 800, padding = 60;

const container = d3.select("body")
    .append("div")
    .attr("class", "container")
    .attr("width", width + 100)
    .attr("height", height + 100)
const visholder = d3.select("body")
    .append("div")
    .attr("class", "visholder")
    .attr("width", width + 100)
    .attr("height", height + 100)
const h1 = visholder.append("h1")
    .attr("id", "title")
    .text("Doping in Professional Bicycle Racing");
const svg = visholder.append("svg")
    .attr("class", "svg")
    .attr("width", width)
    .attr("height", height)
const tooltip = visholder.append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)
const color = d3.scaleOrdinal(d3.schemePastel1).domain(["Doping", "No Doping"])

const req = new XMLHttpRequest();
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
req.open("GET", url, true);
req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
        const data = (JSON.parse(req.responseText)).map(x => x);
        const dataset = [...data]
        data.forEach(function (x) {

            var parsedTime = x.Time.split(':');
            x.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
        });

        const xScale = d3.scaleLinear()
            .domain([d3.min(data, x => x.Year - 2), d3.max(data, x => x.Year + 2)])
            .range([padding, width - padding])
        const yScale = d3.scaleTime()
            .domain(d3.extent(data, x => x.Time))
            .range([padding, height - padding])

        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
        const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
        const circle = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr('class', 'dot')
            .attr("cx", (d, i) => xScale(d.Year))
            .attr('cy', (d, i) => yScale(d.Time))
            .attr("r", 10)
            .attr("fill", d => d.Doping ? color("Doping") : color("No Doping"))
            .attr("data-xvalue", d => d.Year)
            .attr("data-yvalue", d => d.Time)

            .on('mouseover', (event, d) => {
                tooltip.transition()
                    .duration(0)
                    .style('opacity', 0.9)
                tooltip.html(
                    "Name: " + d.Name + "<br>" +
                    "Year: " + d.Year + "<br>" +
                    "Time: " + d.Time.getMinutes() + ":" + d.Time.getSeconds() + "<br>" +
                    "Doping: " + d.Doping
                )
                tooltip.attr('data-year', d.Year)

                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + 30 + "px")
            })
            .on('mouseout', () => tooltip.transition().duration(0).style('opacity', 0))
        svg.append('g')
            .attr("id", "x-axis")
            .attr('transform', 'translate(0,' + (height - padding) + ')')
            .call(xAxis);
        svg.append('g')
            .attr("id", "y-axis")
            .attr('transform', 'translate(' + padding + ',0)')
            .call(yAxis)
        const legendContainer = svg.append('g').attr('id', 'legend');

        let i = 0
        while (i < data.length) {
            if (data[i].Doping) {
                legend = legendContainer.append('g')
                    .attr('id', 'doping')
                    .attr('class', 'g-doping')
                legend.append('rect')
                    .attr('x', width - 90)
                    .attr('y', 49)
                    .attr('width', 18)
                    .attr('height', 18)
                    .style('fill', color("Doping"))
                legend.append('text')
                    .attr('x', width - 94)
                    .attr('y', 49)
                    .attr('dy', '.7em')
                    .style('text-anchor', 'end')
                    .text("Doping");
                break
            } i++
        }

        while (i < data.length) {

            if (!(data[i].Doping)) {
                legend = legendContainer.append('g')
                    .attr('id', 'no-doping')
                    .attr('class', 'g-doping')
                legend.append('rect')
                    .attr('x', width - 90)
                    .attr("y", 70)
                    .attr('width', 18)
                    .attr('height', 18)
                    .style('fill', color("No Doping"))
                legend.append('text')
                    .attr('x', width - 94)
                    .attr('y', 70)
                    .attr('dy', '.7em')
                    .style('text-anchor', 'end')
                    .text("No Doping");
                break;
            } i++

        }


    }
}
req.send()
