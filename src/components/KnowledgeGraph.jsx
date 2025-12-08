import React, { useRef, useEffect, useState } from 'react';
import cytoscape from 'cytoscape';

const KnowledgeGraph = ({ recommendations, formData }) => {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    
    if (!containerRef.current) return;

    // Clear container
    containerRef.current.innerHTML = '';

    if (!recommendations?.length) {
      return;
    }

    try {
      const nodes = [];
      const edges = [];
      const seenNodes = new Set();
      const seenEdges = new Set(); // Track edges to prevent duplicates
    
      const nodeMap = new Map(); // Map label to node data
      
      const addNode = (label, color) => {
        // If node with this exact label already exists, return its ID
        if (nodeMap.has(label)) {
          console.log('Reusing existing node:', label);
          return nodeMap.get(label).id;
        }
        
        // Create new unique node
        const nodeId = 'node_' + nodes.length;
        const nodeData = {
          id: nodeId,
          label: label,
          color: color
        };
        
        nodes.push({ data: nodeData });
        nodeMap.set(label, nodeData);
        
        console.log('Created new node:', label, 'with ID:', nodeId);
        return nodeId;
      };
    
      const addEdge = (sourceId, targetId) => {
        const edgeKey = `${sourceId}->${targetId}`;
        
        // Only add edge if it hasn't been added before
        if (!seenEdges.has(edgeKey)) {
          edges.push({ data: { source: sourceId, target: targetId } });
          seenEdges.add(edgeKey);
        }
      };

      // Add industry nodes (support both single industry and multiple industries)
      const industryNodeIds = [];
      if (formData?.industry) {
        // Single industry from regular form
        const industryNodeId = addNode(formData.industry, '#F4C2C2');
        industryNodeIds.push(industryNodeId);
      } else if (formData?.industries?.length > 0) {
        // Multiple industries from search results
        formData.industries.forEach(industry => {
          if (industry && industry !== 'N/A') {
            const industryNodeId = addNode(industry, '#F4C2C2');
            industryNodeIds.push(industryNodeId);
          }
        });
      }

      // Add scale nodes (support both single scale and multiple scales)
      const scaleNodeIds = [];
      if (formData?.scale) {
        // Single scale from regular form
        const scaleNodeId = addNode(formData.scale, '#D4B5C4');
        scaleNodeIds.push(scaleNodeId);
      } else if (formData?.scales?.length > 0) {
        // Multiple scales from search results
        formData.scales.forEach(scale => {
          if (scale && scale !== 'N/A') {
            const scaleNodeId = addNode(scale, '#D4B5C4');
            scaleNodeIds.push(scaleNodeId);
          }
        });
      }

      // Group recommendations by instance details (same logic as table)
      const groupedRecs = new Map();
      
      recommendations.forEach(rec => {
        const key = JSON.stringify({
          instance: rec.instance || rec.instance_type || rec.instanceType || 'N/A',
          provider: rec.serviceProvider || rec.provider || 'N/A',
          category: rec.category || 'N/A',
          vcpu: rec.vcpu || rec.vCPU || 'N/A',
          ram: rec.ram || rec.RAM || 'N/A',
          price: rec.price || rec.price_per_hour || rec.pricePerHour || 'N/A'
        });
        
        if (groupedRecs.has(key)) {
          // Add purposes to existing group
          const existing = groupedRecs.get(key);
          let newPurposes = [];
          if (Array.isArray(rec.purposes)) {
            newPurposes = rec.purposes.filter(p => p && typeof p === 'string' &&
              p.trim().toLowerCase() !== 'nan' &&
              p.trim().toLowerCase() !== 'unknown' &&
              p.trim() !== '');
          } else if (typeof rec.purpose === 'string' && rec.purpose.trim() !== '' &&
            rec.purpose.trim().toLowerCase() !== 'nan' &&
            rec.purpose.trim().toLowerCase() !== 'unknown') {
            newPurposes = [rec.purpose.trim()];
          }
          newPurposes.forEach(p => {
            if (!existing.purposes.includes(p)) {
              existing.purposes.push(p);
            }
          });
        } else {
          // Create new group
          let newPurposes = [];
          if (Array.isArray(rec.purposes)) {
            newPurposes = rec.purposes.filter(p => p && typeof p === 'string' &&
              p.trim().toLowerCase() !== 'nan' &&
              p.trim().toLowerCase() !== 'unknown' &&
              p.trim() !== '');
          } else if (typeof rec.purpose === 'string' && rec.purpose.trim() !== '' &&
            rec.purpose.trim().toLowerCase() !== 'nan' &&
            rec.purpose.trim().toLowerCase() !== 'unknown') {
            newPurposes = [rec.purpose.trim()];
          }
          groupedRecs.set(key, {
            instance: rec.instance || rec.instance_type || rec.instanceType || 'N/A',
            provider: rec.serviceProvider || rec.provider || 'N/A',
            category: rec.category || 'N/A',
            vcpu: rec.vcpu || rec.vCPU || 'N/A',
            ram: rec.ram || rec.RAM || 'N/A',
            price: rec.price || rec.price_per_hour || rec.pricePerHour || 'N/A',
            region: rec.region || 'N/A',
            purposes: newPurposes
          });
        }
      });

      // Convert to array - API handles all sorting now based on ranking_preference
      let sortedRecs = Array.from(groupedRecs.values());
      
      // Limit to maximum 10 instances (same as table)
      const limitedRecs = sortedRecs.slice(0, 10);

      // Process limited and sorted recommendations
      limitedRecs.forEach((item) => {
        const inst = item.instance;
        const prov = item.provider;
        const reg = item.region;
        const cat = item.category;

        // Instance node
        const instNodeId = addNode(inst, '#B8D4B8');
        
        // Connect to all industry nodes
        industryNodeIds.forEach(industryNodeId => {
          addEdge(industryNodeId, instNodeId);
        });
        
        // Connect to all scale nodes
        scaleNodeIds.forEach(scaleNodeId => {
          addEdge(instNodeId, scaleNodeId);
        });

        // Provider
        if (prov && prov !== 'N/A') {
          const provNodeId = addNode(prov, '#F4D1AE');
          addEdge(instNodeId, provNodeId);
        }

        // Region
        if (reg && reg !== 'N/A') {
          const regNodeId = addNode(reg, '#A8C8EC');
          addEdge(instNodeId, regNodeId);
        }

        // Category
        if (cat && cat !== 'N/A') {
          const catNodeId = addNode(cat, '#B8C5D6');
          addEdge(instNodeId, catNodeId);
        }

        // Purposes (grouped)
        item.purposes.forEach(purpose => {
          if (purpose && purpose !== 'N/A') {
            const purposeNodeId = addNode(purpose, '#F4E4BC');
            addEdge(instNodeId, purposeNodeId);
          }
        });
      });

      console.log('Creating cytoscape with nodes:', nodes.length, 'edges:', edges.length);

      // Create Graph
      const cy = cytoscape({
        container: containerRef.current,
        elements: [...nodes, ...edges],
        style: [
          {
            selector: 'node',
            style: {
              'label': 'data(label)',
              'text-halign': 'center',
              'text-valign': 'center', 
              'font-size': '12px',
              'color': '#333',
              'width': '70px',
              'height': '70px',
              'text-wrap': 'wrap',
              'text-max-width': '65px',
              'shape': 'ellipse',
              'background-color': 'data(color)',
              'font-weight': 'bold'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 2,
              'line-color': '#999',
              'curve-style': 'bezier'
            }
          }
        ],
        layout: { 
          name: 'cose',
          idealEdgeLength: 100,
          padding: 30
        }
      });

      return () => {
        if (cy) cy.destroy();
      };
    
    } catch (error) {
      console.error('Cytoscape error:', error);
      setError(error.message);
    }
  }, [recommendations, formData]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px] text-red-500 border rounded bg-red-50">
        <div className="text-center">
          <p className="mb-2">Error loading knowledge graph</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!recommendations?.length) {
    return (
      <div className="flex items-center justify-center h-[600px] text-gray-500 border rounded bg-gray-50">
        <div className="text-center">
          <p className="mb-2">No recommendations available</p>
          <p className="text-sm">Generate some recommendations first to see the knowledge graph</p>
        </div>
      </div>
    );
  }

  if (!formData?.industry && (!formData?.industries || formData.industries.length === 0)) {
    return (
      <div className="flex items-center justify-center h-[600px] text-gray-500 border rounded bg-gray-50">
        <div className="text-center">
          <p className="mb-2">No industry data available</p>
          <p className="text-sm">Industry information is needed to generate the knowledge graph</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-1.5 mb-2 p-2 bg-gray-50 rounded text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F4C2C2' }}></div>
          <span className="font-medium">Industry</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#B8D4B8' }}></div>
          <span className="font-medium">Instance</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F4D1AE' }}></div>
          <span className="font-medium">Provider</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#A8C8EC' }}></div>
          <span className="font-medium">Region</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#B8C5D6' }}></div>
          <span className="font-medium">Category</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F4E4BC' }}></div>
          <span className="font-medium">Purpose</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D4B5C4' }}></div>
          <span className="font-medium">Scale</span>
        </div>
      </div>
      <div ref={containerRef} className="w-full h-[600px] border rounded bg-white" />
    </div>
  );
};

export default KnowledgeGraph;