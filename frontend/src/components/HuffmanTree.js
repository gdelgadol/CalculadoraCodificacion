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
    const treeLayout = d3.tree().size([400, 400]);
    treeLayout(hierarchy);

    // Draw links
    const linkGenerator = d3.linkVertical()
      .x((d) => d.x)
      .y((d) => d.y);

    svg.append("g")
      .selectAll("path")
      .data(hierarchy.links())
      .enter()
      .append("path")
      .attr("d", linkGenerator)
      .attr("fill", "none")
      .attr("stroke", "black");

    // Draw nodes
    svg.append("g")
      .selectAll("circle")
      .data(hierarchy.descendants())
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 15)
      .attr("fill", "lightblue");

    // Add labels (symbol above probability, placed to the right)
    svg.append("g")
      .selectAll("text.node-label")
      .data(hierarchy.descendants())
      .enter()
      .append("text")
      .attr("x", (d) => d.x + 20)
      .attr("y", (d) => d.y - 10)
      .attr("text-anchor", "start")
      .attr("class", "node-label")
      .text((d) => `${d.data.name}`);

    svg.append("g")
      .selectAll("text.node-probability")
      .data(hierarchy.descendants())
      .enter()
      .append("text")
      .attr("x", (d) => d.x + 20)
      .attr("y", (d) => d.y + 10)
      .attr("text-anchor", "start")
      .attr("class", "node-probability")
      .text((d) => `(${d.data.probability})`);

    // Label edges only at the final step
    if (stepIndex === steps.length - 1) {
      svg.append("g")
        .selectAll("text.edge-label")
        .data(hierarchy.links())
        .enter()
        .append("text")
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2 - 5)
        .attr("text-anchor", "middle")
        .attr("class", "edge-label")
        .text((d) => {
          if (!d.source.parent) return ""; // No label for root node

          const siblings = d.source.parent.children || [];
          const index = siblings.indexOf(d.source);

          return (n - 1 - index).toString();
        });
    }
  }, [steps, stepIndex, n]);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        {/* Forms for getting the data */}
        {/* Your form components go here */}
      </div>
      <div style={{ flex: 1 }}>
        <svg ref={svgRef} width={500} height={500}></svg>
        <div>
          <button onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))} disabled={stepIndex === 0}>
            Previous
          </button>
          <button onClick={() => setStepIndex((prev) => Math.min(steps.length - 1, prev + 1))} disabled={stepIndex === steps.length - 1}>
            Next
          </button>
        </div>
        {/* Display Entropy, Average Length, and Efficiency */}
        <Markdown rehypePlugins={[rehypeKatex]}>
          {`
            $H(\\mathcal{F}) = ${entropy}$

            $L(C) = ${avgLength}$

            $\\eta = \\frac{H(\\mathcal{F})}{L(C)} = ${efficiency}$
          `}
        </Markdown>
      </div>
    </div>
  );
};

export default HuffmanTree;
