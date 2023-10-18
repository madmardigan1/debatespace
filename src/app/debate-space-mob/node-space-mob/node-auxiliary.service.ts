import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NodeAuxiliaryService {

  constructor() { }

  //this service handles a few calculations that the nodespace uses.

  traverseToOriginal(nodeId: number, originalNodeId: number, nodes: any, edges: any): { text: string; fullText: string, id: number; videoClip?: any, soundClip?: any }[] {
    let nodeData = nodes.get(nodeId);
    let textObj = { text: `${nodeData.user}: ${nodeData.text}`, fullText: `${nodeData.user}: ${nodeData.fullText}`, id: nodeId, soundClip: nodeData.soundClip, videoClip: nodeData.videoClip };  // <-- Updated to be an object

    // Base condition: if we reach the original node, stop
    if (nodeId === originalNodeId) {
      return [textObj];
    }

    // Get connected edges to the current node
    const connectedEdges = edges.get({
      filter: (edge: any) => edge.to === nodeId
    });

    // If we have a predecessor, move to it and continue traversal
    if (connectedEdges.length > 0) {
      const predecessorNodeId = connectedEdges[0].from;
      const previousTexts = this.traverseToOriginal(predecessorNodeId, originalNodeId, nodes, edges);

      // Highlight the edge (this could be done in a different function if preferred)
      //  this.edges.update([{ id: connectedEdges[0].id, color: "rgba(0,100,255,0.7)" }]);

      return [...previousTexts, textObj]; // appending current node's text to the result from predecessors
    }

    return [textObj];
  }

  traverseNodes(nodeId: number, nodes: any, edges: any): any[] {
    let currentNodeId = nodeId;
    const parentNodes: any[] = [];
    
    while (true) {
        // Get the parent node ID using the getParentNode function
        const parentNodeId = this.getParentNode(currentNodeId, edges);
        
        // If no parent node is found, break the loop
        if (parentNodeId === null) {
            break;
        }

        // Get the parent node object and add it to the array
        const parentNode = nodes.get(parentNodeId);

        parentNodes.push({node:parentNode, reaction: nodes.get(currentNodeId).Reaction});

        // Move up to the next parent node for the next iteration
        currentNodeId = parentNodeId;
    }
    
    return parentNodes;
}


  getDirectChildren(nodeId: number, nodes: any, edges: any): { text: string; fullText: string, id: number; videoClip?: any, soundClip?: any }[] {
    const directChildren:any = [];
  
    // Get edges that originate from the given nodeId
    const outgoingEdges = edges.get({
      filter: (edge: any) => edge.from === nodeId
    });
  
    // For each outgoing edge, get the associated child node and add its data to the results
    outgoingEdges.forEach((edge: any) => {
      const childNodeData = nodes.get(edge.to);
      const childTextObj = {
        text: `${childNodeData.user}: ${childNodeData.text}`,
        fullText: `${childNodeData.user}: ${childNodeData.fullText}`,
        id: edge.to,
        soundClip: childNodeData.soundClip,
        videoClip: childNodeData.videoClip
      };
      directChildren.push(childTextObj);
    });
  
    return directChildren;
  }
  getParentNode(nodeId: number, edges: any): number | null {
    // Find the edge where the node is the 'to' (child) node.
    const edgeToGivenNode = edges.get({
      filter: (edge:any) => edge.to === nodeId
    })[0];

    // If no such edge exists, the node doesn't have a parent.
    if (!edgeToGivenNode) return null;

    // Return the ID of the parent node.
    return edgeToGivenNode.from;
}


  getChildNodeIds(nodeId: number, nodes: any, edges: any): any[] {
    // Find the edges where the node is the 'from' (parent) node.
    const edgesFromGivenNode = edges.get({
      filter: (edge:any) => edge.from === nodeId
    });

    // If no such edges exist, the node doesn't have child nodes.
    if (edgesFromGivenNode.length === 0) return [];

    // Return the IDs of all child nodes.
    return edgesFromGivenNode.map((edge:any) => nodes.get(edge.to));
}
  

  wrapText(text: string, maxCharsPerLine: number = 25): string {
    // If text is longer than 122 characters, truncate it to the last 122 characters
    let appendEllipsis = false;
    if (text.length > 122) {
      text = text.slice(-122);
      appendEllipsis = true;
    }

    let wrappedText = '';
    let words = text.split(' ');

    let currentLine = '';
    let lineCount = 0;

    for (let word of words) {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += ' ' + word;
      } else {
        wrappedText += currentLine.trim().padEnd(maxCharsPerLine, ' ') + '\n';
        currentLine = word;
        lineCount++;
      }
    }

    if (currentLine) {
      wrappedText += currentLine.trim().padEnd(maxCharsPerLine, ' ') + '\n';
      lineCount++;
    }

    // If after processing the string we don't have 5 lines, we add more lines
    while (lineCount < 5) {
      wrappedText += ''.padEnd(maxCharsPerLine, ' ') + '\n';
      lineCount++;
    }

    // Take only the first 5 lines, then join them
    wrappedText = wrappedText.split('\n').slice(0, 5).join('\n');

    if (appendEllipsis) {
      return wrappedText + '...';
    } else {
      return wrappedText.trimEnd(); // remove trailing spaces for shorter texts
    }
  }
}
