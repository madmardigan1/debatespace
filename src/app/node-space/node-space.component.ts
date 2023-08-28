import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DataSet, Network } from 'vis-network/standalone';
import { RtcService } from '../rtcservice.service';
import { Output, EventEmitter } from '@angular/core';
import { ChatSpaceComponent } from '../chat-space/chat-space.component';
import { SpeechService } from '../speech-service.service';
import { SharedserviceService } from '../sharedservice.service';

@Component({
  selector: 'app-node-space',
  templateUrl: './node-space.component.html',
  styleUrls: ['./node-space.component.css']
})
export class NodeSpaceComponent implements AfterViewInit {

  constructor(private rtcService: RtcService, private speechService: SpeechService, private sharedService: SharedserviceService) {}
  
  @ViewChild('visNetwork', { static: false }) visNetwork!: ElementRef;
  @Output() nodeClicked = new EventEmitter<number>();
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  //declarations

  floatingButton!: HTMLElement;
  isRecording = false;  
  network!: Network;
  selectedNodeIndex: number | null = null;
  positions: any;
  globalnode: any;
  public selectedPicture = 0;

  //initial arrays for nodes and edges upon load
  public nodes = new DataSet<any>([
    {id: 1, label: 'What is the meaning of life?', text: 'What is the meaning of life?', shape: "circularImage", image: "assets/Steve.jpeg"},
  ]);

  private edges = new DataSet<any>([
  ]);

 

  showFloatingButton(x: number, y: number) {
    // assuming you have reference to the button as this.floatingButton
    this.floatingButton.style.left = `${x}px`;
    this.floatingButton.style.top = `${y}px`;
    this.floatingButton.style.display = 'block';  // make it visible
  }

  ngAfterViewInit() {
    this.floatingButton = document.getElementById('floating-button') as HTMLElement;
    const nodesDataSet = this.nodes;
    const edgesDataSet = this.edges;
    

    const data = {
      nodes: nodesDataSet,
      edges: edgesDataSet
    };

    const options = {
      layout: {
        hierarchical: {direction: "UD", sortMethod: "directed",}
      },
      nodes: {
        physics: true,
        shadow: true,
        
              shape: 'circularImage',
              image: 'path/to/image',
              borderWidth: 2,  // Set a border.
              color: {
                  border: '#000000', // Color of the border.
                  background: '#FFFFFF' }// Color of the circle.
          
       
      },
      manipulation: {
        enabled: false,
      },
      interaction:{
        hover: true,  // This ensures that hover events are enabled.
        hoverConnectedEdges: true, // Optional, if you want to highlight edges connected to the hovered node.
        dragNodes:false,
        navigationButtons: true,
        keyboard: true,
      },
      edges: {
        color: "000000",
        width: 4,
        shadow: true,
        smooth: false,
      }
    };

    this.network = new Network(this.visNetwork.nativeElement, data, options);

    this.floatingButton.addEventListener('click', (event) => {
      event.stopPropagation();  // to prevent the underlying canvas from receiving the click event
    
      if (this.isRecording) {
        this.speechService.phrases.subscribe(transcript => {
          const nodeToUpdate = this.nodes.get(this.globalnode) as unknown as { text: string };

if (nodeToUpdate) {
    nodeToUpdate.text = wrapText(transcript, 20);
    this.nodes.update(nodeToUpdate);
}


      transcript = '';
        });
        
        this.speechService.stopListening();
      
      } else {
        this.speechService.startListening();
        this.speechService.phrases.subscribe(transcript => {
          // If a node is selected, add the transcript to the node's text
          if (this.selectedNodeIndex !== null) {
            let selectedImage;
    
          if (this.selectedPicture == 0) {
              selectedImage = "assets/Jared.jpeg";
              this.selectedPicture += 1;
          } else {
              selectedImage = "assets/Steve.jpeg";
              this.selectedPicture -= 1;
          }
    
    
            const newNodeId = this.nodes.length + 1;
            this.globalnode = newNodeId;
            this.nodes.add({ id: newNodeId, label: '', text: '', shape: "circularImage", image: selectedImage });
            this.edges.add({ from: this.selectedNodeIndex, to: newNodeId });
            this.selectedNodeIndex = null;
            
          }
        });
      }
    
      this.isRecording = !this.isRecording;  // toggle the recording state
    });

   this.network.on('hoverNode', params => {
    this.network.setOptions({ physics: false });
      const nodeId = params.node;
      const node: any = this.nodes.get(nodeId);
      node.size = 40; // Adjust this value as necessary
      this.network.setOptions({ physics: false });
      this.nodes.update(node);
      this.network.setOptions({ physics: true });
      
     if (node && node.shape === "circularImage") {
          // Save the original image to restore it later.
          node.originalImage = node.image;
  
          // Replace the image with the desired text.
          node.label = node.text || 'Default Text';  // You can adjust this based on what text you want.
          node.shape = 'circle';  // Change the shape to text.
          node.image = undefined;  // Remove the image property.
          node.borderWidth = 2;  // Set a border.
          node.color = {
              border: '#000000', // Color of the border.
              background: '#FFFFFF' };// Color of the circle.
          // Update the node in the dataset.
          this.nodes.update(node);
      }
  });
  
  this.network.on('blurNode', params => {
    this.network.setOptions({ physics: true });
      const nodeId = params.node;
      const node: any = this.nodes.get(nodeId);
      node.size = 20; // Restore to original size
      this.network.setOptions({ physics: false });
      this.nodes.update(node);
      this.network.setOptions({ physics: true });
      if (node && node.originalImage) {
          // Restore the original image.
          node.image = node.originalImage;
          node.shape = 'circularImage';
          node.label = '';  // Remove the text label.
          node.originalImage = undefined;  // Cleanup the property we added.
          node.borderWidth = 2;  // Set a border.
          node.color = {
              border: '#000000', // Color of the border.
              background: '#FFFFFF' };// Color of the circle.
          // Update the node in the dataset.
          this.network.stabilize();
this.nodes.update(node);
this.network.stopSimulation();
      }
  });
  
  function wrapText(text: string, maxCharsPerLine: number): string {
    let wrappedText = '';
    let words = text.split(' ');

    let currentLine = '';
    for (let word of words) {
        if ((currentLine + word).length <= maxCharsPerLine) {
            currentLine += ' ' + word;
        } else {
            wrappedText += currentLine.trim() + '\n';
            currentLine = word;
        }
    }
    wrappedText += currentLine;  // Append the last line
    return wrappedText.trim();
}

// Recursive function to traverse the graph
function traverseToOriginal(nodeId: number, originalNodeId: number, nodes: any, edges: any): string[] {
  let nodeData = nodes.get(nodeId);
  let text = `Node ${nodeData.id}: ${nodeData.text}`;

  // Base condition: if we reach the original node, stop
  if (nodeId === originalNodeId) {
      return [text];
  }

  // Get connected edges to the current node
  const connectedEdges = edges.get({
      filter: (edge:any) => edge.to === nodeId
  });

  // If we have a predecessor, move to it and continue traversal
  if (connectedEdges.length > 0) {
      const predecessorNodeId = connectedEdges[0].from;
      const previousTexts = traverseToOriginal(predecessorNodeId, originalNodeId, nodes, edges);
      return [...previousTexts, text]; // appending current node's text to the result from predecessors
  }

  return [text];
}




    this.network.on('click', params => {
      if (params.nodes.length > 0) {
        const clickedNodeId = params.nodes[0];
        const nodePosition = this.network.getPositions([clickedNodeId]);
        const canvasPosition = this.network.canvasToDOM(nodePosition[clickedNodeId]);
        this.showFloatingButton(canvasPosition.x, canvasPosition.y);
      
    
        this.selectedNodeIndex = clickedNodeId;
    
        if (this.selectedNodeIndex !== null) {
          this.nodeClicked.emit(clickedNodeId);
    
          // Ensure this.selectedNodeIndex is not null before using it as an argument
          const node = this.nodes.get(this.selectedNodeIndex);
          if (node !== null) {
            const combinedText: string[] = traverseToOriginal(clickedNodeId, 1, this.nodes, this.edges);
            const combinedString = combinedText.join('<br>');
            
            this.notify.emit(combinedString);
            this.sharedService.changeNodeText(combinedString);
        }
        
        }
      
        this.rtcService.startStream();
        
        // zoom to the clicked node
        this.network.focus(clickedNodeId, {
          scale: 1.0,
          animation: {
            duration: 500,
            easingFunction: 'easeInOutQuad'
          }  
        });
      }
    });
    
    

    
   
  }
  onChatSubmit(message: string) {
    if (this.selectedNodeIndex !== null) {
      const newNodeId = this.nodes.length + 1;
      this.nodes.add({ id: newNodeId, text: message });
      this.edges.add({ from: this.selectedNodeIndex, to: newNodeId });
      this.selectedNodeIndex = null;
    }
  }
}
