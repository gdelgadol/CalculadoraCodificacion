import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const HuffmanTree = ({ data }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Observe the wrapper div's size and update dimensions
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      if (wrapperRef.current) {
        resizeObserver.unobserve(wrapperRef.current);
      }
    };
  }, []);

  // Render the tree or initial nodes
  useEffect(() => {
    if (!data || dimensions.width === 0 || dimensions.height === 0) return;

    const { width, height } = dimensions;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#1F2937") // Match the background color
      .style("overflow", "hidden"); // Prevent overflow

    // Clear previous content
    svg.selectAll("*").remove();

    // Add a clipping path to prevent overflow
    svg.append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    // Create a group element for the tree and apply the clipping path
    const g = svg.append("g")
      .attr("clip-path", "url(#clip)");

    // Add zoom and pan functionality
    const zoom = d3.zoom()
      .scaleExtent([0.5, 2]) // Allow zooming between 50% and 200%
      .on("zoom", (event) => {
        g.attr("transform", event.transform); // Apply transform to the group, not the SVG
      });

    svg.call(zoom);

    if (Array.isArray(data)) {
      // Calculate dynamic spacing and node size based on container width
      const minNodeRadius = 15; // Minimum node radius
      const maxNodeRadius = 25; // Maximum node radius
      const minSpacing = 20; // Minimum spacing between nodes
      const maxSpacing = 60; // Maximum spacing between nodes

      // Calculate the required width for the nodes
      const requiredWidth = data.length * (maxNodeRadius * 2 + maxSpacing) - maxSpacing;

      // Adjust node radius and spacing if the required width exceeds the container width
      let nodeRadius = maxNodeRadius;
      let nodeSpacing = maxSpacing;

      if (requiredWidth > width) {
        const scaleFactor = width / requiredWidth;
        nodeRadius = Math.max(minNodeRadius, maxNodeRadius * scaleFactor);
        nodeSpacing = Math.max(minSpacing, maxSpacing * scaleFactor);
      }

      const totalWidth = data.length * (nodeRadius * 2 + nodeSpacing) - nodeSpacing;
      const startX = (width - totalWidth) / 2; // Center the nodes horizontally
      const startY = height / 2; // Center the nodes vertically

      // Render initial nodes as circles
      g.selectAll(".node")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("cx", (d, i) => startX + i * (nodeRadius * 2 + nodeSpacing))
        .attr("cy", startY)
        .attr("r", nodeRadius)
        .style("fill", "#3B82F6") // Node color
        .style("stroke", "#1E40AF") // Border color
        .style("stroke-width", 2);

      // Add labels for initial nodes
      g.selectAll(".node-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "node-label")
        .attr("x", (d, i) => startX + i * (nodeRadius * 2 + nodeSpacing))
        .attr("y", startY)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("fill", "white")
        .style("font-size", `${Math.min(12, nodeRadius)}px`) // Adjust font size based on node radius
        .text((d) => `${d.symbols.join("")}\n(${parseFloat(d.probability).toFixed(4)})`);
    } else {
      // Render the tree structure
      const root = d3.hierarchy(data, (d) => d.children);
      const treeLayout = d3.tree().size([width, height - 100]);
      treeLayout(root);

      // Render edges first
      g.selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
          .x((d) => d.x)
          .y((d) => d.y + 50)
        )
        .style("fill", "none")
        .style("stroke", "#6B7280") // Link color
        .style("stroke-width", 2);

      // Render nodes
      g.selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y + 50)
        .attr("r", (d) => Math.max(10, 25 - d.depth * 2)) // Dynamic node size
        .style("fill", "#3B82F6") // Node color
        .style("stroke", "#1E40AF") // Border color
        .style("stroke-width", 2);

      // Render node labels last (on top of edges and nodes)
      g.selectAll(".node-label")
        .data(root.descendants())
        .enter()
        .append("text")
        .attr("class", "node-label")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y + 50)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("fill", "white")
        .style("font-size", (d) => `${Math.max(8, 12 - d.depth * 1)}px`) // Dynamic font size
        .text((d) => `${d.data.symbols.join("")}\n(${parseFloat(d.data.probability).toFixed(4)})`);
    }
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "100%" }}>
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
    </div>
  );
};

export default HuffmanTree;