import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

function GraphView({ paper, papers = [], showFullNetwork = true }) {
  const svgRef = useRef()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    // Create mock data for visualization
    const nodes = [
      {
        id: paper.title || 'Current Paper',
        group: 1,
        x: dimensions.width / 2,
        y: dimensions.height / 2,
        size: 20,
        color: '#3b82f6'
      }
    ]

    // Add related papers as nodes
    papers.forEach((p, index) => {
      if (p.title !== paper.title) {
        const angle = (index * 2 * Math.PI) / Math.max(papers.length - 1, 1)
        const radius = Math.min(dimensions.width, dimensions.height) * 0.3
        nodes.push({
          id: p.title || `Paper ${index + 1}`,
          group: 2,
          x: dimensions.width / 2 + radius * Math.cos(angle),
          y: dimensions.height / 2 + radius * Math.sin(angle),
          size: 15,
          color: '#10b981'
        })
      }
    })

    // Create links
    const links = papers.slice(1).map((p, index) => ({
      source: paper.title || 'Current Paper',
      target: p.title || `Paper ${index + 1}`,
      strength: 0.5
    }))

    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide().radius(d => d.size + 5))

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)

    // Create container for zoom/pan
    const container = svg.append('g')

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Create links
    const link = container.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#94a3b8')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)

    // Create nodes
    const node = container.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', d => d.size)
      .attr('fill', d => d.color)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')

    // Add labels
    const label = container.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .text(d => d.id.length > 30 ? d.id.substring(0, 30) + '...' : d.id)
      .attr('font-size', '12px')
      .attr('font-family', 'Inter, sans-serif')
      .attr('fill', '#374151')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('pointer-events', 'none')

    // Add tooltips
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px 12px')
      .style('border-radius', '6px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000)

    // Add hover effects
    node
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', d.size * 1.2)
          .attr('stroke-width', 3)

        tooltip
          .style('opacity', 1)
          .html(`
            <div class="font-semibold">${d.id}</div>
            <div class="text-xs mt-1">Click to explore</div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', d.size)
          .attr('stroke-width', 2)

        tooltip.style('opacity', 0)
      })
      .on('click', function(event, d) {
        console.log('Clicked node:', d)
        // Add click handler for node interaction
      })

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y + d.size + 15)
    })

    // Cleanup function
    return () => {
      d3.select('body').selectAll('.tooltip').remove()
    }

  }, [dimensions, paper, papers, showFullNetwork])

  if (!paper) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p>No paper data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Research Network Visualization
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {papers.length} papers
        </div>
      </div>
      
      <div className="w-full h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ minHeight: '300px' }}
        />
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Current Paper</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Related Papers</span>
        </div>
      </div>
    </div>
  )
}

export default GraphView
