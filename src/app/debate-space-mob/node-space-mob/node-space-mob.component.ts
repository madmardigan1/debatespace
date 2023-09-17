import { Component, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, Input,  OnInit, NgZone, OnChanges, SimpleChanges} from '@angular/core';
  import { DataSet, Network } from 'vis-network/standalone';
  import { RtcService } from '../../rtcservice.service';
  import { SpeechService } from '../../speech-service.service';
  import { SharedserviceService } from '../../sharedservice.service';
  import { NodeshareService } from 'src/app/nodeshare.service';
  import { NodeLinkService } from 'src/app/node-link.service';
  import { DebateAuthService } from 'src/app/debate-auth.service';
  import { Subject } from 'rxjs';
  import { trigger, state, style, transition, animate } from '@angular/animations';
  import { ChatToNodeService } from 'src/app/chat-to-node.service';
  import { Subscription } from 'rxjs';
import { ChatsubmitToNodeService } from 'src/app/chatsubmit-to-node.service';
import { AvServiceService } from '../av-control-mob/av-service.service';
@Component({
  selector: 'app-node-space-mob',
  templateUrl: './node-space-mob.component.html',
  styleUrls: ['./node-space-mob.component.css'],
    animations: [
      trigger('arrowAnimation', [
        state('void', style({
          opacity: 1
        })),
        state('up', style({
          transform: 'translateY(-100px)',
          opacity: 0
        })),
        state('down', style({
          transform: 'translateY(100px)',
          opacity: 0
        })),
        transition('* => up', [
          animate('0.5s')
        ]),
        transition('* => down', [
          animate('0.5s')
        ])
      ])
    ]

})
export class NodeSpaceMobComponent implements AfterViewInit, OnInit {
  animationState: 'up' | 'down' | 'void' = 'void';
  @ViewChild('visNetwork', { static: false }) container!: ElementRef;
    submitText = '';
    @ViewChild('visNetwork', { static: false }) visNetwork!: ElementRef;
    @Output() nodeClicked = new EventEmitter<number>();
    @Output() nodeSelected = new EventEmitter<boolean>();
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();
    @Input() inputdata: any;
    @Input() userType: string = '';
    @Input() buttonType: string = '';
    @Input() buttonTypeSubject!: Subject<string>;
    currentNode: any;
    previousNode: any;
    siblingChecker: any;
    isRecording = false;
    network!: Network;
    zoomscale = 1.0;
    private subscriptions: Subscription[] = [];
    selectedNodeIndex: number | null = null;
    positions: any;
    globalnode: any;
    nodeLeft: any;
    nodeRight: any;
    public selectedPicture = 0;
    private highlightedEdges: any[] = [];
    isPanelExpanded = false;
  
    // Initial arrays for nodes and edges upon load
    public nodes = new DataSet<any>([
      { id: 1, label: '', text: '', shape: "circularImage", image: "assets/Steve.jpeg", user: "Steve", Moment: 0,soundClip: null},
    ]);
    private edges = new DataSet<any>([]);
   private subscription?: Subscription;
    constructor(private settingsService: AvServiceService, private nodeLink: NodeLinkService, private rtcService: RtcService, private chattoNode: ChatsubmitToNodeService,private nodeShare: NodeshareService, private speechService: SpeechService, private sharedService: SharedserviceService, private debateAuth:DebateAuthService, private ngZone: NgZone) {}
  
    ngOnInit(): void {
      this.subscriptions.push(
        this.settingsService.getZoomLevel().subscribe(zoom => {
         if (this.zoomscale !==null) {
          this.zoomscale = zoom;}
          else {this.zoomscale = 1;}
         this.network.focus(this.selectedNodeIndex!, {
          scale: this.zoomscale,
          animation: {
            duration: 500,
            easingFunction: 'easeInOutQuad'
          }  
        });
         
        }),
        this.settingsService.getPOV().subscribe(pov => {
          // Do something with the updated POV
        }),
        this.settingsService.getAudio().subscribe(audio => {
          // Do something with the updated audio setting
        }),
        this.settingsService.getView().subscribe(view =>{
          if (view=="detailed"){
          this.nodes.forEach((node) => {
            node.shape = 'box';  
            this.nodes.update(node);  
          
        });
     
        
            this.network.redraw();  // redraw the network
          }
          if (view=="curtailed"){
            this.nodes.forEach((node) => {
              node.shape = 'circularImage';  
              this.nodes.update(node);  
            
          });
       
          
              this.network.redraw();  // redraw the network
            }
        
        })
      );
      this.userType=this.debateAuth.getUser();
      
      if (this.buttonTypeSubject) {
      this.buttonTypeSubject.subscribe(type => {
        if (type === "play") {
          this.play();
        } 
        else if (type === "toggle") {
          this.toggleRecording();
        }
      });}
      this.subscription = this.chattoNode.getResponse().subscribe(text => {
        this.submitText = text;
        if (this.submitText !== '') {
          this.submitNode(this.submitText);
        }
      });
    }
 
    ngAfterViewInit() {
      this.initNetwork();
      
      this.addEventListeners();
      this.nodeLink.getNodeLink().subscribe(data => {
        const input = Number(data);
        this.network.selectNodes([input]);
        this.handleNodeClick({
          nodes: [input],
          
      });
      
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
            background: '#FFFFFF',
            text: '#000000'
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
      this.network.selectNodes([1]); // Select the node
      this.handleNodeClick({
        nodes: [1],
        
    });

      //autoselect Node 1
    
  
  

    
  }
  private addEventListeners() {
  
  
    this.network.on('hoverNode', params => {
      
        const nodeId = params.node;
        const node: any = this.nodes.get(nodeId);
        
        
        
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
    this.handleNodeClick(params);
  
  });
}
  
  
  
    thumbdown(): void {
     // Check if a node is selected
     if (this.selectedNodeIndex !== null) {
        
      // Get the node data
      const nodeData = this.nodes.get(this.selectedNodeIndex);
      
      if (nodeData) {
        // Increment the likes count
        nodeData.Moment = (nodeData.Moment) - 1;
        this.animationState = 'down';
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
        
       
       

      }
    }
    
    }
  
    thumbup(): void {
      console.log("itworked");
      // Check if a node is selected
      if (this.selectedNodeIndex !== null) {
        
        // Get the node data
        const nodeData = this.nodes.get(this.selectedNodeIndex);
        
        if (nodeData) {
          // Increment the likes count
          nodeData.Moment = (nodeData.Moment) + 1;
          this.animationState = 'up';
          setTimeout(() => {
            this.animationState = 'void';
          }, 500);
         
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
    submitNode(submitText:string) {
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
        this.nodes.add({ id: newNodeId,label: this.wrapText(submitText, 20), text: this.wrapText(submitText, 200), shape: "circularImage", image: selectedImage, user: selectedName, Moment: 0, soundClip: null });
        this.edges.add({ from: this.selectedNodeIndex, to: newNodeId, opacity: 0.1 });
       
         this.network.once("initRedraw", () => {
  this.network.storePositions();
  this.network.setData({
    nodes: this.nodes,
    edges: this.edges,
  });
  this.network.selectNodes([this.globalnode]);
  this.nodeClicked.emit(this.globalnode);
  this.selectedNodeIndex=this.globalnode;
setTimeout(() => {
  this.ngZone.runOutsideAngular(() => {
    this.centerOnNode(this.globalnode);
  });
}, 1);

  
});

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
        this.network.selectNodes([this.globalnode]);
        this.nodeClicked.emit(this.globalnode);
        this.selectedNodeIndex=this.globalnode;
        this.nodeShare.emitEvent(this.selectedNodeIndex);
        this.selectedNodeIndex=this.globalnode;
     setTimeout(() => {
        this.ngZone.runOutsideAngular(() => {
          this.centerOnNode(this.globalnode);
        });
      }, 1);
     
        
    });
  
            }
         
        }
      
        this.isRecording = !this.isRecording;  // toggle the recording state
      }
      };
  
      centerOnNode(nodeId: any) {
        const position = this.getNodePosition(nodeId);
        this.network.moveTo({
          scale: this.zoomscale,
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
      console.log(wrappedText);
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
  
  handleNodeClick(params: any): void {
    
    if (this.isRecording) {
      this.toggleRecording();
    }
    
    if (params.nodes.length > 0) {
     
      this.nodeSelected.emit(true);
      this.isPanelExpanded = true;
     
      const clickedNodeId = params.nodes[0];
      this.siblingChecker = this.getAdjacentSiblingNodeIds(clickedNodeId);
      
      this.previousNode = this.currentNode;
      this.currentNode = clickedNodeId;
   
     
    
  
      this.selectedNodeIndex = clickedNodeId;
      

      this.nodeShare.emitEvent(this.selectedNodeIndex);
    

      if (this.selectedNodeIndex !== null) {
        this.nodeClicked.emit(clickedNodeId);
      
        const node = this.nodes.get(this.selectedNodeIndex);
        if (node !== null && this.selectedNodeIndex !== null) {
          this.nodeClicked.emit(clickedNodeId);
      
          const combinedObjects = this.traverseToOriginal(clickedNodeId, 1, this.nodes, this.edges);
          const combinedString = combinedObjects.map(obj => obj.text).join('<br>');
          
          this.notify.emit(combinedString);
          this.sharedService.changeNodeText(combinedObjects);
          this.nodeShare.emitEvent2(this.getAdjacentSiblingNodeIds(this.selectedNodeIndex));
          this.nodeShare.emitEvent(clickedNodeId);

      }
      
      }
    
      //this.rtcService.startStream();
      
      // zoom to the clicked node
      this.network.focus(clickedNodeId, {
        scale: this.zoomscale,
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
  }

  traverseToOriginal(nodeId: number, originalNodeId: number, nodes: any, edges: any): { text: string; id: number; }[] {
    let nodeData = nodes.get(nodeId);
    let textObj = { text: `${nodeData.user}: ${nodeData.text}`, id: nodeId };  // <-- Updated to be an object

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
        this.highlightedEdges.push(connectedEdges[0].id); // Storing the edge ID
        const previousTexts = this.traverseToOriginal(predecessorNodeId, originalNodeId, nodes, edges);

        // Highlight the edge (this could be done in a different function if preferred)
        this.edges.update([{ id: connectedEdges[0].id, color: "rgba(0,100,255,0.7)" }]);

        return [...previousTexts, textObj]; // appending current node's text to the result from predecessors
    }

    return [textObj];
}

getParentNodeId(nodeId: number): string | null {
  // Find the edge where the node is the 'to' (child) node.
  const edgeToGivenNode = this.edges.get({
    filter: edge => edge.to === nodeId
  })[0];

  // If no such edge exists, the node doesn't have a parent.
  if (!edgeToGivenNode) return null;

  // Return the ID of the parent node.
  return edgeToGivenNode.from;
}

getSiblingNodeId(nodeId: number): string | null {
  // Find the edges where the node is the 'from' (parent) node.
  const edgesFromGivenNode = this.edges.get({
    filter: edge => edge.from === nodeId
  });

  // If no such edges exist, the node doesn't have child nodes.
  if (edgesFromGivenNode.length === 0) return null;

  // Return the ID of the first child node.
  return edgesFromGivenNode[0].to;
}

getAdjacentSiblingNodeIds(nodeId: number): { previous: string, next: string } | null {
  // Find the edge where the node is the 'to' (child) node.
  const edgeToGivenNode = this.edges.get({
    filter: edge => edge.to === nodeId
  })[0];

  // If no such edge exists, the node doesn't have a parent and thus no siblings.
  if (!edgeToGivenNode) return null;

  // Get all child nodes of the parent node.
  const siblingsEdges = this.edges.get({
    
    filter: edge => edge.from === edgeToGivenNode.from
  });
  
  if (siblingsEdges.length === 1) return null;
  

  // Find the index of the given node within the siblings.
  const givenNodeIndex = siblingsEdges.findIndex(edge => edge.to === nodeId);
 
  // Determine the previous sibling's node ID.
  let previousNodeId;
  if (givenNodeIndex === 0) {
    // If the given node is the first child, wrap to the last child.
    previousNodeId = siblingsEdges[siblingsEdges.length - 1].to;
  } else {
    previousNodeId = siblingsEdges[givenNodeIndex - 1].to;
  }

  // Determine the next sibling's node ID.
  let nextNodeId;
  if (givenNodeIndex === siblingsEdges.length - 1) {
    // If the given node is the last child, wrap to the first child.
    nextNodeId = siblingsEdges[0].to;
  } else {
    nextNodeId = siblingsEdges[givenNodeIndex + 1].to;
  }

  return {
    previous: previousNodeId,
    next: nextNodeId
  };
}

up() {
  if (this.selectedNodeIndex){
    const adjacentSiblingIds = this.getParentNodeId(this.selectedNodeIndex);
  
    if (adjacentSiblingIds) {
      this.network.selectNodes([adjacentSiblingIds]);
      this.handleNodeClick({
        nodes: [adjacentSiblingIds]
      });
    } else {
      // Handle the scenario when there is no sibling or an error.
      console.warn('No previous sibling found or an error occurred.');
    }
  }
}

down() {
  if (this.selectedNodeIndex){
    const adjacentSiblingIds = this.getSiblingNodeId(this.selectedNodeIndex);
  
    if (adjacentSiblingIds) {
      this.network.selectNodes([adjacentSiblingIds]);
      this.handleNodeClick({
        nodes: [adjacentSiblingIds]
      });
    } else {
      // Handle the scenario when there is no sibling or an error.
      console.warn('No previous sibling found or an error occurred.');
    }
  }
}
previousId() {
  if (this.selectedNodeIndex){
  const adjacentSiblingIds = this.getAdjacentSiblingNodeIds(this.selectedNodeIndex);

  if (adjacentSiblingIds) {
    this.network.selectNodes([adjacentSiblingIds.previous]);
    this.handleNodeClick({
      nodes: [adjacentSiblingIds.previous]
    });
  } else {
    // Handle the scenario when there is no sibling or an error.
    console.warn('No previous sibling found or an error occurred.');
  }
}
} 
nextId () {
  if (this.selectedNodeIndex){
    const adjacentSiblingIds = this.getAdjacentSiblingNodeIds(this.selectedNodeIndex);
  
    if (adjacentSiblingIds) {
      this.network.selectNodes([adjacentSiblingIds.next]);
      this.handleNodeClick({
        nodes: [adjacentSiblingIds.next]
      });
    } else {
      // Handle the scenario when there is no sibling or an error.
      console.warn('No previous sibling found or an error occurred.');
    }
  }
}
goBack(){
  this.network.selectNodes([this.previousNode]);
  this.handleNodeClick({
    nodes: [this.previousNode],
    
});
}
  }
  
  
  
