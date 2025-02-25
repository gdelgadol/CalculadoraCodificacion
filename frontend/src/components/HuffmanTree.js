import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const HuffmanTree = ({ steps, n, entropy, avgLength, efficiency }) => {
  const svgRef = useRef();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!steps || steps.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous tree

    const width = 500;
    const height = 300;

    // Create a group for zoomable content
    const zoomG = svg.append("g");

    let nodes = {};
    let root = null;

    steps.slice(0, stepIndex + 1).forEach((step) => {
      const mergedSymbols = step.new_node.symbols.join("");
      const probability = step.new_node.probability;

      nodes[mergedSymbols] = {
        name: mergedSymbols,
        probability,
        children: step.merged.map(([symbols, prob]) => {
          const key = symbols.join("");
          return nodes[key] || { name: key, probability: prob };
        }),
      };

      root = nodes[mergedSymbols];
    });

    const hierarchy = d3.hierarchy(root, (d) => d.children);
    const treeLayout = d3.tree().size([width, height]);
    treeLayout(hierarchy);

    // Draw links
    const linkGenerator = d3.linkVertical()
      .x((d) => d.x)
      .y((d) => d.y);

    zoomG.append("g")
      .selectAll("path")
      .data(hierarchy.links())
      .enter()
      .append("path")
      .attr("d", linkGenerator)
      .attr("fill", "none")
      .attr("stroke", "black");

    // Draw nodes
    zoomG.append("g")
      .selectAll("circle")
      .data(hierarchy.descendants())
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 15)
      .attr("fill", "lightblue");

    // Add labels (symbol above probability, placed to the right)
    zoomG.append("g")
      .selectAll("text.node-label")
      .data(hierarchy.descendants())
      .enter()
      .append("text")
      .attr("x", (d) => d.x + 20)
      .attr("y", (d) => d.y - 10)
      .attr("text-anchor", "start")
      .attr("class", "node-label")
      .text((d) => `${d.data.name}`);

    zoomG.append("g")
      .selectAll("text.node-probability")
      .data(hierarchy.descendants())
      .enter()
      .append("text")
      .attr("x", (d) => d.x + 20)
      .attr("y", (d) => d.y + 10)
      .attr("text-anchor", "start")
      .attr("class", "node-probability")
      .text((d) => `(${d.data.probability.toFixed(2)})`);

    // Calculate the bounding box of the tree
    const bbox = zoomG.node().getBBox();
    const xOffset = (width - bbox.width) / 2 - bbox.x;
    const yOffset = (height - bbox.height) / 2 - bbox.y;

    // Apply transformation to center the tree
    zoomG.attr("transform", `translate(${xOffset}, ${yOffset})`);

    // Add zoom and pan functionality
    const zoom = d3.zoom()
      .scaleExtent([0.5, 5]) // Set the scale extent
      .on("zoom", (event) => {
        zoomG.attr("transform", event.transform);
      });

    svg.call(zoom);
  }, [steps, stepIndex, n]);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        {/* Forms for getting the data */}
        {/* Your form components go here */}
      </div>
      <div style={{ flex: 1 }}>
        <svg
          ref={svgRef}
          width={500}
          height={500}
          style={{ border: "2px solid black" }}
        ></svg>
        <div>
          <button
            onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={stepIndex === 0}
          >
            Previous
          </button>
          <button
            onClick={() => setStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
            disabled={stepIndex === steps.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HuffmanTree;
