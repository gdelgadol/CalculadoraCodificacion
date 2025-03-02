import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const HuffmanTree = ({ treeData }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!treeData) return;

    const width = 600;
    const height = 400;

    d3.select(svgRef.current).selectAll("*").remove();
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, 20)`);

    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree().size([width - 100, height - 100]);
    treeLayout(root);

    const linkGenerator = d3.linkVertical()
      .x(d => d.x)
      .y(d => d.y);

    svg.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", linkGenerator)
      .style("fill", "none")
      .style("stroke", "white")
      .style("stroke-width", 2);

    const nodes = svg.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    nodes.append("circle")
      .attr("r", 15)
      .style("fill", "#4A90E2")
      .style("stroke", "white");

    nodes.append("text")
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "12px")
      .text(d => d.data.symbols.join(""));
  }, [treeData]);

  return <svg ref={svgRef}></svg>;
};

export default HuffmanTree;
