import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const TunstallTree = ({ data, currentStep }) => {
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

  // Render the tree based on the current step
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

    // Build the tree structure up to the current step
    const root = buildTunstallTree(data, currentStep);
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
  }, [data, dimensions, currentStep]);

  // Helper function to build the Tunstall tree structure up to the current step
  const buildTunstallTree = (steps, currentStep) => {
    const root = { symbols: ["Root"], probability: 1, children: [] };
    let currentNodes = [root];

    for (let i = 0; i <= currentStep; i++) {
      const step = steps[i];
      if (!step) break;

      const expandedNode = currentNodes.find((node) => node.symbols.join("") === step.expanded);
      if (expandedNode) {
        expandedNode.children = step.new_nodes.map((node) => ({
          symbols: [node.code],
          probability: node.probability,
          children: [],
        }));
        currentNodes = currentNodes.filter((node) => node !== expandedNode).concat(expandedNode.children);
      }
    }

    return d3.hierarchy(root, (d) => d.children);
  };

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "100%" }}>
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
    </div>
  );
};

export default TunstallTree;