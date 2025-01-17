import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Visualization2D = ({ data, onPointSelect, colorBy }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d[0]))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d[1]))
      .range([height, 0]);

    const color = d3.scaleSequential(d3.interpolateViridis)
      .domain(d3.extent(data, d => d[colorBy] || 0));

    const zoom = d3.zoom()
      .scaleExtent([0.5, 20])
      .on('zoom', (event) => {
        svg.attr('transform', event.transform);
        svg.select('.x-axis').call(d3.axisBottom(x).scale(event.transform.rescaleX(x)));
        svg.select('.y-axis').call(d3.axisLeft(y).scale(event.transform.rescaleY(y)));
      });

    svg.call(zoom);

    const points = svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(d[0]))
      .attr('cy', d => y(d[1]))
      .attr('r', 3)
      .attr('fill', d => color(d[colorBy] || 0))
      .on('click', (event, d) => onPointSelect(d));

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    // Add color legend
    const legendWidth = 200;
    const legendHeight = 20;
    const legend = svg.append("g")
      .attr("transform", `translate(${width - legendWidth}, ${height + margin.bottom - legendHeight})`);

    const legendScale = d3.scaleLinear()
      .domain(color.domain())
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5)
      .tickFormat(d3.format(".2f"));

    legend.append("g")
      .call(legendAxis);

    const legendGradient = legend.append("defs")
      .append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    legendGradient.selectAll("stop")
      .data(color.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: color(t) })))
      .enter().append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", 10)
      .style("fill", "url(#legend-gradient)");

  }, [data, onPointSelect, colorBy]);

  return <svg ref={svgRef}></svg>;
};

export default Visualization2D;