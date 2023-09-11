import { Component, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, Input,  OnInit, NgZone} from '@angular/core';
import { DataSet, Network } from 'vis-network/standalone';
import { RtcService } from '../../rtcservice.service';
import { SpeechService } from '../../speech-service.service';
import { SharedserviceService } from '../../sharedservice.service';
import { NodeshareService } from 'src/app/nodeshare.service';
import { NodeLinkService } from 'src/app/node-link.service';
import { DebateAuthService } from 'src/app/debate-auth.service';
@Component({
  selector: 'app-node-space',
  templateUrl: './node-space.component.html',
  styleUrls: ['./node-space.component.css']
})
export class NodeSpaceComponent implements AfterViewInit, OnInit {

  @ViewChild('visNetwork', { static: false }) visNetwork!: ElementRef;
  @Output() nodeClicked = new EventEmitter<number>();
  @Output() nodeSelected = new EventEmitter<boolean>();
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  @Input() inputdata: any;
  @Input() userType: string = '';
  floatingButton!: HTMLElement;
  isRecording = false;
  network!: Network;
 
  selectedNodeIndex: number | null = null;
  positions: any;
  globalnode: any;
  public selectedPicture = 0;
  private highlightedEdges: any[] = [];
  isPanelExpanded = false;

  // Initial arrays for nodes and edges upon load
  public nodes = new DataSet<any>([
    { id: 1, label: '', text: '', shape: "circularImage", image: "assets/Steve.jpeg", user: "Steve", Moment: 0,soundClip: null},
  ]);
  private edges = new DataSet<any>([]);

  constructor(private nodeLink: NodeLinkService, private rtcService: RtcService, private nodeShare: NodeshareService, private speechService: SpeechService, private sharedService: SharedserviceService, private debateAuth:DebateAuthService, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.userType=this.debateAuth.getUser();
    console.log(this.userType);

  }
  ngAfterViewInit() {
    this.initNetwork();
    this.addEventListeners();
    this.nodeLink.getNodeLink().subscribe(data => {
      const input = Number(data);
      
      if (this.isRecording) {
        this.toggleRecording();
      }
  
      if (input !==null) {
        this.isPanelExpanded = true;
        const clickedNodeId = input;
        
     
       
      
    
        this.selectedNodeIndex = clickedNodeId;
       
  
        if (this.selectedNodeIndex !== null) {
          this.nodeClicked.emit(clickedNodeId);
    
          // Ensure this.selectedNodeIndex is not null before using it as an argument
          const node = this.nodes.get(this.selectedNodeIndex);
          
        
          if (node !== null) {
            const combinedText: string[] = this.traverseToOriginal(clickedNodeId, 1, this.nodes, this.edges);
            const combinedString = combinedText.join('<br>');
            
            this.notify.emit(combinedString);
            this.sharedService.changeNodeText(combinedString);
        }
        
        }
      
        //this.rtcService.startStream();
        
        // zoom to the clicked node
        this.network.focus(clickedNodeId, {
          scale: 1.0,
          animation: {
            duration: 500,
            easingFunction: 'easeInOutQuad'
          }  
        });
      }
      else  {
        this.isPanelExpanded = !this.isPanelExpanded;
      }
      
      const resetEdges = this.highlightedEdges.map(edgeId => {
        return { id: edgeId, color: '000000' }; // Assuming '000000' is the original color
      });
      this.edges.update(resetEdges);
      this.highlightedEdges = [];
  
      // Highlight the path from the initial node to the clicked node
       
        
        this.traverseToOriginal(input, 1, this.nodes, this.edges); // Assuming 1 is your initial node ID
      
    });

  }
  
  private initNetwork() {

    const data = {
      nodes: this.nodes,
      edges: this.edges
    };

    const options = {
      layout: {
        hierarchical: {direction: "UD", sortMethod: "directed"}
      },
      nodes: {
        physics: true,
        shadow: true,
        shape: 'circularImage',
        borderWidth: 2,  
        labelHighlightBold: true,
        font: { color: 'white' }, 
        color: {
          border: '#000000',
          background: '#FFFFFF'
        }
      },

    


      manipulation: {
        enabled: false,
      },
      interaction: {
        hover: true,
        hoverConnectedEdges: true,
        dragNodes: false,
        keyboard: true,
      },
      edges: {
        color: {
          color: "rgba(255,255,255,0.3)", // white color with 0.1 opacity
          highlight: "rgba(255,255,255,0.3)", // white color with 0.5 opacity when highlighted
          hover: "rgba(255,255,255,0.5)" 
        },
        width: 2,
        shadow: true,
        smooth: false,
      }
    };

    this.network = new Network(this.visNetwork.nativeElement, data, options);
    const node: any = this.nodes.get(1);
    node.label = this.inputdata;
    node.text = this.inputdata;
    this.nodes.update(node);

}

private addEventListeners() {


  this.network.on('hoverNode', params => {
    this.network.setOptions({ physics: false });
      const nodeId = params.node;
      const node: any = this.nodes.get(nodeId);
      this.nodes.update(node);
      
      
     if (node && node.shape === "circularImage") {
          // Save the original image to restore it later.
          node.originalImage = node.image;
  
          // Replace the image with the desired text.
          //node.label = node.text || 'Default Text';  // You can adjust this based on what text you want.
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
    this.network.setOptions({ physics: false });
      const nodeId = params.node;
      const node: any = this.nodes.get(nodeId);
      node.size = 20; // Restore to original size
     
      if (node && node.originalImage) {
          // Restore the original image.
          node.image = node.originalImage;
          node.shape = 'circularImage';
          //node.label = '';  // Remove the text label.
          node.originalImage = undefined;  // Cleanup the property we added.
          node.borderWidth = 2;  // Set a border.
          node.color = {
              border: '#000000', // Color of the border.
              background: '#FFFFFF' };// Color of the circle.
          // Update the node in the dataset.
          
this.nodes.update(node);
this.network.stopSimulation();
      }
  });

this.network.on('click', params => {
    if (this.isRecording) {
      this.toggleRecording();
    }
    
    if (params.nodes.length > 0) {
      this.nodeSelected.emit(true);
      this.isPanelExpanded = true;
      const clickedNodeId = params.nodes[0];
    
   
     
    
  
      this.selectedNodeIndex = clickedNodeId;
      console.log(this.selectedNodeIndex);

      if (this.selectedNodeIndex !== null) {
        this.nodeClicked.emit(clickedNodeId);
  
        // Ensure this.selectedNodeIndex is not null before using it as an argument
        const node = this.nodes.get(this.selectedNodeIndex);
        if (node !== null) {
          const combinedText: string[] = this.traverseToOriginal(clickedNodeId, 1, this.nodes, this.edges);
          const combinedString = combinedText.join('<br>');
          
          this.notify.emit(combinedString);
          this.sharedService.changeNodeText(combinedString);
      }
      
      }
    
      //this.rtcService.startStream();
      
      // zoom to the clicked node
      this.network.focus(clickedNodeId, {
        scale: 1.0,
        animation: {
          duration: 500,
          easingFunction: 'easeInOutQuad'
        }  
      });
    }
    else  {
      this.isPanelExpanded = !this.isPanelExpanded;
      this.nodeSelected.emit(false);
    }
    const resetEdges = this.highlightedEdges.map(edgeId => {
      return { id: edgeId, color: "rgba(255,255,255, 0.1"}; // Assuming '000000' is the original color
    });
    this.edges.update(resetEdges);
    this.highlightedEdges = [];

    // Highlight the path from the initial node to the clicked node
    if (params.nodes.length > 0) {
      this.traverseToOriginal(params.nodes[0], 1, this.nodes, this.edges); // Assuming 1 is your initial node ID
    }
  });
}

sharenode(): void {
  const dataToSend = this.selectedNodeIndex;
 
  this.nodeShare.emitEvent(dataToSend);
}

  thumbdown(): void {
   // Check if a node is selected
   if (this.selectedNodeIndex !== null) {
      
    // Get the node data
    const nodeData = this.nodes.get(this.selectedNodeIndex);
    
    if (nodeData) {
      // Increment the likes count
      nodeData.Moment = (nodeData.Moment) - 1;
   
        // Check if likes reach 50
    if (nodeData.Moment <= 0) {
      nodeData.color = { border: 'red', background: nodeData.color?.background || '#FFFFFF' };
      nodeData.shadow = {
        enabled: true,
        color: 'red',
        size: 20,  // adjust the size as needed
        x: 0,     // adjust the x-offset as needed
        y: 0      // adjust the y-offset as needed
      };
    }
      // Update the node data in the DataSet
      this.nodes.update(nodeData);
      
      // Optionally, emit an event or do something else
      // ...  
    }
  }
  
  }

  thumbup(): void {
    // Check if a node is selected
    if (this.selectedNodeIndex !== null) {
      
      // Get the node data
      const nodeData = this.nodes.get(this.selectedNodeIndex);
      
      if (nodeData) {
        // Increment the likes count
        nodeData.Moment = (nodeData.Moment) + 1;
  
          // Check if likes reach 50
      if (nodeData.Moment >= 5) {
        nodeData.color = { border: 'green', background: nodeData.color?.background || '#FFFFFF' };
        nodeData.shadow = {
          enabled: true,
          color: 'green',
          size: 20,  // adjust the size as needed
          x: 0,     // adjust the x-offset as needed
          y: 0      // adjust the y-offset as needed
        };
      }
        // Update the node data in the DataSet
        this.nodes.update(nodeData);
        
        // Optionally, emit an event or do something else
        // ...  
      }
    }
  }
  
  toggleRecording() {
    
    if (this.selectedNodeIndex){
      if (this.isRecording) {
       
          this.speechService.phrases.subscribe(transcript => {
          const nodeToUpdate = this.nodes.get(this.globalnode) as unknown as { text: string; label?: string; soundClip: Blob | null };
  
          if (nodeToUpdate) {
            nodeToUpdate.text = this.wrapText(transcript, 20);
            nodeToUpdate.label = this.wrapText(transcript, 20);
            this.speechService.stopRecordingAudio();
            nodeToUpdate.soundClip = this.speechService.returnAudio();
            this.nodes.update(nodeToUpdate);
            }
          });

          const nodeData = this.nodes.get(this.selectedNodeIndex);  
          this.speechService.stopListening();
          this.speechService.phrases.unsubscribe;
          
          
      
      } 
      
      else {
        
        this.speechService.startListening();
        this.speechService.startRecordingAudio();
       
          // If a node is selected, add the transcript to the node's text
          if (this.selectedNodeIndex !== null) {
           
            let selectedImage;
            let selectedName;
    
            if (this.selectedPicture == 0) {
                selectedImage = "assets/Jared.jpeg";
                this.selectedPicture += 1;
                selectedName = 'Jared';
            } else {
                selectedImage = "assets/Steve.jpeg";
                this.selectedPicture -= 1;
                selectedName= 'Steve'
            }
    
            const newNodeId = this.nodes.length + 1;
            this.globalnode = newNodeId;
            
            this.nodes.add({ id: newNodeId, label: '', text: '', shape: "circularImage", image: selectedImage, user: selectedName, Moment: 0, soundClip: null });
            this.edges.add({ from: this.selectedNodeIndex, to: newNodeId, opacity: 0.1 });
           
             this.network.once("initRedraw", () => {
      this.network.storePositions();
      this.network.setData({
        nodes: this.nodes,
        edges: this.edges,
      });
    });
      
    setTimeout(() => {
      this.ngZone.runOutsideAngular(() => {
        this.centerOnNode(this.globalnode);
      });
    }, 1);
      
    

          }
       
      }
    
      this.isRecording = !this.isRecording;  // toggle the recording state
    }
    };

    centerOnNode(nodeId: any) {
      const position = this.getNodePosition(nodeId);
      this.network.moveTo({
        scale: 1.0,
        position: position,
        animation: {
          duration: 500,
          easingFunction: 'easeInOutQuad'
        }
      });
    }
    
    getNodePosition(nodeId: any): { x: number, y: number } {
      const nodePosition = this.network.getPositions([nodeId]);
      return nodePosition[nodeId];
    }

  wrapText(text: string, maxCharsPerLine: number): string {
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

play(): void {
  if (this.selectedNodeIndex){
    const nodeData = this.nodes.get(this.selectedNodeIndex);
  if (nodeData.soundClip) {
    const audioUrl = URL.createObjectURL(nodeData.soundClip);
    const audio = new Audio(audioUrl);
    audio.play();
  }
}
 
}

traverseToOriginal(nodeId: number, originalNodeId: number, nodes: any, edges: any): string[] {
  let nodeData = nodes.get(nodeId);
  let text = `${nodeData.user}: ${nodeData.text}`;

  // Base condition: if we reach the original node, stop
  if (nodeId === originalNodeId) {
    return [text];
  }

  // Get connected edges to the current node
  const connectedEdges = edges.get({
    filter: (edge: any) => edge.to === nodeId
  });

  // If we have a predecessor, move to it and continue traversal
  if (connectedEdges.length > 0) {
    const predecessorNodeId = connectedEdges[0].from;
    this.highlightedEdges.push(connectedEdges[0].id); // Storing the edge ID
    const previousTexts = this.traverseToOriginal(predecessorNodeId, originalNodeId, nodes, edges);

    // Highlight the edge (this could be done in a different function if preferred)
    this.edges.update([{ id: connectedEdges[0].id, color: "rgba(0,100,255,0.7)" }]);

    return [...previousTexts, text]; // appending current node's text to the result from predecessors
  }

  return [text];
}
}




