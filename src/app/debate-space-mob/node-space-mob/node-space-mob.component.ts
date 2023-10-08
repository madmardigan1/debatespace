// Angular Core imports
import {
  Component, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, HostListener,
  Input, OnInit, NgZone, 
} from '@angular/core';
import { trigger, state, style, transition, animate} from '@angular/animations';

// External library imports
import { DataSet, Network } from 'vis-network/standalone';
import { Subscription } from 'rxjs';
import Swiper from 'swiper';

// Service imports
import { RtcService } from '../../rtcservice.service';
import { SpeechService } from './speech-service.service';
import { DebateAuthService } from 'src/app/home/debate-auth.service';
import { AvServiceService } from '../av-control-mob/av-service.service';
import { NodespaceServiceService } from './nodespace-service.service';
import { DebateSpaceService } from '../debate-space.service';
import { ChatspaceService } from '../chat-space-mob/chatspace.service';
import { ChatSubmitService } from '../chat-submit-mob/chat-submit.service';
import { CardDataService } from 'src/app/space-service.service';

@Component({
  selector: 'app-node-space-mob',
  templateUrl: './node-space-mob.component.html',
  styleUrls: ['./node-space-mob.component.css'],
  animations: [
      trigger('arrowAnimation', [
          state('void', style({ opacity: 1 })),
          state('up', style({ transform: 'translateY(-100px)', opacity: 0 })),
          state('down', style({ transform: 'translateY(100px)', opacity: 0 })),
          transition('* => up', [animate('0.5s')]),
          transition('* => down', [animate('0.5s')])
      ])
  ]
})
export class NodeSpaceMobComponent implements AfterViewInit, OnInit {
  // View references
  @ViewChild('visNetwork', { static: false }) visNetwork!: ElementRef;
  private mediaBlobURL?: string;

  // Inputs & Outputs
  @Input() inputdata: any;
  @Input() userType: string = '';
  @Output() nodeClicked = new EventEmitter<number>();
  @Output() nodeSelected = new EventEmitter<boolean>();
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  @Output() isRecordingType = new EventEmitter<string>();

  // Class properties
  
  animationState: 'up' | 'down' | 'void' = 'void';
  currentNode: any;
  previousNode: any;
  siblingChecker: any;
  zoomType=2
  thumbsPosition: { x: number, y: number } = { x: 0, y: 0 };
  isRecording = false;
  @Input () cardId!:string;
  @Input() isRanked = false;
  network!: Network;
  zoomscale = 1.0;
  positions: any;
  globalnode: any;
  isRotated = false;
  nodeLeft: any;
  nodeRight: any;
  zoomSwitch=false;
  public selectedPicture = 0;
  nodeShape = "circularImage";
  private highlightedEdges: any[] = [];
  isPanelExpanded = false;
  nodetoUpdate = 1;
 nodeIdCounter = 1;
 edgesAdd: any;

  // Arrays for nodes and edges
  public nodes = new DataSet<any>([
      { id: 1, label: '', text: '', fullText: '', shape: this.nodeShape, image: "assets/Steve.jpeg",  user: "Steve", Health: 100, totalPositive: 0, Moment: 1, Reaction: 'neutral', Positive:0, Negative:0, videoClip: null, soundClip: null, commentType: 'good' },
  ]);
  private edges = new DataSet<any>([]);
  private subscriptions: Subscription[] = [];
  private subscription2?: Subscription;
  selectedNodeIndex: number | null = null;
  private subscription?: Subscription;
  submitText = '';
  lastSelectedNode = 1;
  private phrasesSubscription: Subscription | null = null;
  private timerId: any;


  // video stuff


  //@ViewChild('liveVideoElement') liveVideoElement!: ElementRef;

  isRecordingVideo: boolean = false;
  isPlaying: boolean = false;
  private shouldPlayAfterLoad: boolean = false;
  private mediaRecorder!: MediaRecorder;
  private recordedChunks: any[] = [];
  private stream!: MediaStream;
  private mySwiper!: Swiper;
  constructor(
      private cardService: CardDataService,
      private debateSpace: DebateSpaceService,
      private settingsService: AvServiceService, 
      private rtcService: RtcService, 
      private speechService: SpeechService, 
      private debateAuth: DebateAuthService, 
      private ngZone: NgZone,
      private nodeService : NodespaceServiceService,
      private chatSpace: ChatspaceService,
      private chatSubmit: ChatSubmitService
  ) {}

  // Lifecycle hooks and main component functions

ngOnInit(): void {
  // Initialize component-level subscriptions and configurations
  
  this.userType = this.debateAuth.getUser();

  
 
    this.cardService.cards$.subscribe((cards) => {
      const id = this.cardId;
      const card = cards.find((card) => card.id === id);
      if (card !== undefined) { // Check if card is not undefined
        if (card) { 
          // Assuming card.nodes and card.edges are arrays
          this.nodes.clear();
          this.nodes.add(card.nodes);
          console.log(this.nodes);
          this.edges.clear();
          this.edges.add(card.edges);
        }
      
      } else {
        // Handle case when card is not found, e.g., redirect or show a message
      }
    });



  this.subscription = this.chatSubmit.getNodeText().subscribe(text => {
    this.submitText = text[0];
    if (this.submitText !== '') {
      
      this.submitNode(this.submitText, text[1], text[2]);
      
    }
  });


    
}


//drag logic



zoomMode(type:number) {
  this.zoomType=type;
  if (this.zoomType===3) {
  this.zoomSwitch=true;
  this.updateSlidesToShow();
  this.currentIndex=0;
  this.shownSlide=this.slidesToShow[0];
  }

  if (this.zoomType===2) {
    this.network.setOptions({
      interaction: {
          dragView: false
      }
  });
    this.zoomSwitch=false;
   
  }
  if (this.zoomType===1) {
    this.network.setOptions({
      interaction: {
          dragView: true
      }
  });
    this.zoomSwitch=false;
  }
}


private startY: number | null = null;
private startX: number | null = null;
currentIndex: number = 0;
shownSlide=this.nodes.get(1);

slidesToShow:any = [this.nodes.get(1)];

updateSlidesToShow() {
 
const siblingNodeIds = this.getOrderedSiblingNodeIds(this.selectedNodeIndex!);

if (siblingNodeIds) {
  const siblingNodes: any= [];

  siblingNodeIds.forEach(nodeId => {
    const node = this.nodes.get(nodeId);
    if (node) {
      siblingNodes.push(node);
    }
  });
  this.slidesToShow = siblingNodes;
  
}

else {
  this.slidesToShow = [
    this.nodes.get(this.selectedNodeIndex!)
  ]
}


}

showPreviousSlide() {
  if (this.currentIndex > 0) {
      this.currentIndex--;  }
      else {this.currentIndex=this.slidesToShow.length-1}
      this.shownSlide=this.slidesToShow[this.currentIndex];

}

showNextSlide() {
  if (this.currentIndex < this.nodes.length - 2) {
      this.currentIndex++; }
      else {this.currentIndex=0}
      this.shownSlide=this.slidesToShow[this.currentIndex];
      console.log(this.currentIndex)
}

attachSwipeListeners(elementId: string) {
  const el = document.getElementById(elementId);
  el?.addEventListener('touchstart', this.onTouchStart.bind(this));
  el?.addEventListener('touchend', this.onTouchEnd.bind(this));
}

onTouchStart(event: Event) {
  const touchEvent = event as TouchEvent;
  this.startY = touchEvent.touches[0].clientY;
  this.startX = touchEvent.touches[0].clientX;
}

onTouchEnd(event: Event) {
  const touchEvent = event as TouchEvent;
  const endY = touchEvent.changedTouches[0].clientY;
  const endX = touchEvent.changedTouches[0].clientX;

  if (this.startY !== null && this.startX !== null) {
      const deltaY = endY - this.startY;
      const deltaX = endX - this.startX;

      if (deltaY > 50) {
        
          this.down();
          this.currentIndex=0;
          this.shownSlide=this.slidesToShow[this.currentIndex];
      } else if (deltaY < -50) {
     
          this.up();
          this.currentIndex=0;
          this.shownSlide=this.slidesToShow[this.currentIndex];
      }

      if (deltaX > 50) {
       
          this.nextId();
          this.showNextSlide();
      } else if (deltaX < -50) {
       
          this.previousId();
          this.showPreviousSlide();
      }

      this.startY = null;
      this.startX = null;
  }
}


ngAfterViewInit() {
 
  
  this.initNetwork();
  this.initializeSubscriptions();
  this.addEventListeners();
  this.attachSwipeListeners('mynetwork');
  this.attachSwipeListeners('myDiv');  
 // Get a reference to your div using its id
 

 



  
 

  if (this.isRanked) {
    this.loadGameRules();
  }
  
}

loadGameRules() {
  this.startTimer();
}

startTimer() {
  this.timerId = setInterval(() => {
   
    this.nodes.forEach(node => {
      node.label= "Health: "+String(node.Health) + "\n" + "Moment: "+String(node.Moment);
      if (node.CounterStatus.length>0) {
        node.Health = 100;
        node.CounterStatus.forEach((element: any) => {
            if (element.status==='active') {
              const x = this.nodes.get(Number(element.id));
              const y = x.Moment;

              element.value-= 1*(y/10)*Math.log10(x.totalPositive + x.Positive +x.Negative+2);
           
            }
          
            node.Health = node.Health + element.value;
        });
      }
        

      if (node.CounterStatus.length === 0) {
        node.Health = 100;
    }
    
    if (node.Health > 95) {
        node.color = {
            background: 'black',
            border: 'white'
        };
        node.borderWidth = 2;
        node.shadow = {
            enabled: true,
            color: 'green',
            size: 30,
            x: 5,
            y: 5
        };
    } else if (node.Health >= 50 && node.Health <= 95) {
        node.shadow = {
            enabled: false
        };
    } else if (node.Health < 50) {
        node.shadow = {
            enabled: true,
            color: 'red',
            size: 30,
            x: 5,
            y: 5
        };
    }
    node.Health = parseFloat(node.Health.toFixed(2));
    this.nodes.update(node);
    
      if (node.Health<=0) {
           const parentNode= this.nodes.get(this.getParentNodeId(node.id)!);
           const parentParent = this.nodes.get(this.getParentNodeId(parentNode.id)!);
        if (node.Reaction === 'positive') {
          parentNode.totalPositive = 0;
        }
        if (parentNode.Reaction === 'negative') {
          parentParent.CounterStatus.find((item:any) => item.id === parentNode.id).status = 'active';
        }

          if(parentNode && parentNode.CounterStatus) {
            parentNode.CounterStatus.splice({id: node.id, value: 0, status: 'active'});
            
        }
        this.deleteNodeAndDescendants(node.id);
        
      
    }
    })
    
  }, 300);
}



private initializeSubscriptions() {
  // Group all the settingsService subscriptions

  this.subscriptions.push(
  this.debateSpace.getToggle().subscribe(type => {
    if (type[0] === "play") {
      this.play();
    } else if (type[0] === "toggle") {
      this.toggleRecording(false,type[1],type[2]);
    } else if (type[0] === "toggleVideo"){
      this.toggleVideoRecording(type[1], type[2]);
    }

  }),
  this.debateSpace.getEmoji().subscribe(type => {
    if (type === "positive") {
      this.thumbup();
    } else if (type === "negative") {
      this.thumbdown();
    }
  }),
    this.settingsService.getZoomLevel().subscribe(zoom => {
      if (this.zoomscale !== null) {
        this.zoomscale = zoom;
      } else {
        this.zoomscale = 1;
      }
      
      this.network.focus(this.lastSelectedNode, {
        scale: this.zoomscale,
        animation: false
      });
    }),
 
    this.settingsService.getView().subscribe(view => {
      if (view == "detailed") {
        this.nodeShape = "box";
        this.updateNodesShape('box');
      } else if (view == "curtailed") {
        this.nodeShape = "circularImage";
        this.updateNodesShape('circularImage');
      }
    }),
    this.chatSpace.getLink().subscribe(link => {
      this.handleNodeClick(link);
    })
  );
}

private updateNodesShape(shape: string) {
  // Utility function to update the shape of all nodes
  
  this.nodes.forEach((node) => {
    node.shape = shape;
    this.nodes.update(node);
  });
  this.network.redraw();
}

private initNetwork() {
  // Network configuration and setup

  const data = {
    nodes: this.nodes,
    edges: this.edges
  };

  const options = {
    layout: {
      hierarchical: { direction: "UD", sortMethod: "directed", shakeTowards: "roots" }
    },
    nodes: {
      physics: false,
      shadow: true,
      shape: this.nodeShape,
      borderWidth: 2,
      labelHighlightBold: true,
      font: { color: 'white' },
      color: {
        border: 'white',
        background: 'black',
        highlight: {
          background: 'black',
        },
        hover: {
          background: 'black',
          border: 'white'
        }
      }
    },
    manipulation: {
      enabled: false,
    },
    interaction: {
      hover: true,
      selectConnectedEdges: false,
      dragNodes: false,
      keyboard: true,
      dragView: false,
    
  },
  
    edges: {
      width: 1,
      shadow: true,
      dashes: true,
      hover: false,
      
     
  }
    
  };

  this.network = new Network(this.visNetwork.nativeElement, data, options);
  const node: any = this.nodes.get(1);
  node.label = this.wrapText(this.inputdata);
  node.text = this.wrapText(this.inputdata);
  node.fullText = this.inputdata;
  this.nodes.update(node);
  this.network.selectNodes([1]);
  this.handleNodeClick(1);

}

private addEventListeners() {
  // Add event listeners for network events


  this.network.on('click', params => {

  
    this.nodeService.setNodeId(params.nodes[0]);
    if (params.nodes[0] !== undefined) {
    
    this.handleNodeClick(params.nodes[0]);
    
    }
    else {
      this.network.selectNodes([this.selectedNodeIndex!]);
   //   this.isPanelExpanded = !this.isPanelExpanded;
     // this.nodeSelected.emit(false);
    }
  });
}

  
 // Component interaction methods
thumbdown(): void {
 
  if (this.selectedNodeIndex !== null) {
    const nodeData = this.nodes.get(this.selectedNodeIndex);
    if (nodeData) {
        // Get the position of the node in canvas space
        const canvasPos = this.network.getPositions([this.selectedNodeIndex]);
        if (canvasPos[this.selectedNodeIndex]) {
          const { x, y } = canvasPos[this.selectedNodeIndex];
  
          // Convert canvas position to DOM position
          const domPos = this.network.canvasToDOM({ x, y });
          this.thumbsPosition.x = domPos.x + 40; 
          this.thumbsPosition.y = domPos.y;
        }
        this.animationState = 'down';
        setTimeout(() => {
          this.animationState = 'void';
        }, 500);
      nodeData.Negative +=1;
      nodeData.Moment = parseFloat(Math.abs((nodeData.Positive+nodeData.totalPositive+1)/nodeData.Negative).toFixed(2));
      this.nodes.update(nodeData);
      
      
    }
  }
}



thumbup(): void {
 
  if (this.selectedNodeIndex !== null) {
    const nodeData = this.nodes.get(this.selectedNodeIndex);
    if (nodeData) {
   
       // Get the position of the node in canvas space
       const canvasPos = this.network.getPositions([this.selectedNodeIndex]);
       if (canvasPos[this.selectedNodeIndex]) {
         const { x, y } = canvasPos[this.selectedNodeIndex];
 
         // Convert canvas position to DOM position
         const domPos = this.network.canvasToDOM({ x, y });
         this.thumbsPosition.x = domPos.x - 80; 
         this.thumbsPosition.y = domPos.y;
       }
      
     
      this.animationState = 'up';
      setTimeout(() => {
        this.animationState = 'void';
      }, 500);
      nodeData.Positive +=1;
      if (nodeData.Negative !=0) {
      nodeData.Moment = parseFloat(Math.abs((nodeData.Positive+nodeData.totalPositive+1)/nodeData.Negative).toFixed(2));
      }

    
      else {
        nodeData.Moment =nodeData.Positive + nodeData.totalPositive+1;
      }
      this.nodes.get(this.getParentNodeId(this.selectedNodeIndex)!).totalPositive +=1;
      this.nodes.update(nodeData);
    }
  }
}


submitNode(submitText: string, Reaction:string, tag:string): void {
 this.stopRecording();

 this.addNode(submitText, Reaction, tag);
}

startRecording (type:boolean=false) : void {
  this.speechService.startListening();
  this.phrasesSubscription = this.speechService.phrases.subscribe(transcript => {
    const nodeToUpdate = this.nodes.get(this.nodetoUpdate) as unknown as { text: string; fullText: string, label?: string; soundClip: Blob | null };

    if (nodeToUpdate) {
      nodeToUpdate.fullText = transcript;
      nodeToUpdate.text = this.wrapText(transcript, 20);
      nodeToUpdate.label = this.wrapText(transcript, 20);
      this.nodes.update(nodeToUpdate);
  }
  });


  this.speechService.startRecording(type);

  this.isRecording=true;
  
}

stopRecording(): void {
  this.speechService.stopListening();


  
  this.isRecording=false;

  if (this.phrasesSubscription) {
      this.phrasesSubscription.unsubscribe();
      this.phrasesSubscription = null;
  }

  this.speechService.stopAndReturnMedia().then(result => {
    if (result) {
        const { blob, type } = result;

        if (type === 'audio') {
          this.nodes.get(this.nodetoUpdate).soundClip = blob;

          
        } else if (type === 'video') {
        
          this.nodes.get(this.nodetoUpdate).videoClip = blob;
        }
        this.handleNodeClick(this.nodetoUpdate);
    }

});





 
}


addNode(submitText: string, reaction:string, tag:string): void {
  if (this.selectedNodeIndex !== null) {
    let selectedImage: string;
    let selectedName: string;

    if (this.selectedPicture == 0) {
        selectedImage = "assets/Jared.jpeg";
        this.selectedPicture += 1;
        selectedName = 'Jared';
    } else {
        selectedImage = "assets/Steve.jpeg";
        this.selectedPicture -= 1;
        selectedName = 'Steve';
    }
   
    this.nodeIdCounter+=1;
    const newNodeId = this.nodeIdCounter;
    
    this.nodetoUpdate = newNodeId;
     if (reaction === 'negative') {
      const parentNode= this.nodes.get(this.selectedNodeIndex);

      if(parentNode && parentNode.CounterStatus) {
        parentNode.CounterStatus.push({id: this.nodetoUpdate, value: 0, status: 'active', tag:tag});
    
    }
    if (parentNode.id !=1){
    const parentParentNode = this.nodes.get(Number(this.getParentNodeId(parentNode.id)));
    if (parentParentNode && parentParentNode.CounterStatus) {
        const item = parentParentNode.CounterStatus.find((item:any) => item.id === parentNode.id);
        if (item) {
            item.status = 'inactive';
        }
    }
  }
     }
     
    const nodeAdd ={
        id: newNodeId,
        label: this.wrapText(submitText, 20),
       
        text: this.wrapText(submitText , 20),
        fullText: submitText,
        shape: this.nodeShape,
        image: selectedImage,
        user: selectedName,
        Moment: 1,
        totalPositive: 0,
        Positive: 0,
        Negative: 0,
        CounterStatus: [],
        Health: 100,
        Reaction: reaction,
        soundClip: null,
        videoClip: null,
        tag: tag,
    };

    if (reaction === 'negative') {
       this.edgesAdd ={
        from: this.selectedNodeIndex,
        to: newNodeId,
        opacity: 0.1,
        arrows: {
            from: true // This adds an arrow pointing from the new node to the previous node
        },
        color: {
          color: 'rgba(255,0,0,0.5)', // This sets the edge color to red
         
        }
      };
    }

    else {
       this.edgesAdd ={
        from: this.selectedNodeIndex,
        to: newNodeId,
        opacity: 0.1,
        color: {
            color: 'green', // This sets the edge color to red
            inherit: 'false' // This ensures the edge color doesn't inherit from the connected nodes
        }
      };
    }
    

    this.cardService.updateCardNode(this.cardId, nodeAdd, this.edgesAdd);

    this.network.once("initRedraw", () => {
        this.network.storePositions();
        this.network.setData({
            nodes: this.nodes,
            edges: this.edges,
        });
        
        this.selectedNodeIndex = newNodeId;
        this.handleNodeClick(newNodeId);
        this.nodeClicked.emit(newNodeId);
        this.nodeService.setNodeId(newNodeId);

      
        setTimeout(() => {
            this.ngZone.runOutsideAngular(() => {
                this.centerOnNode(newNodeId);
            });
        }, 1);
    });
}
  
}

toggleRecording(type:boolean=false, reaction:string, tag:string): void {
  if (this.selectedNodeIndex !==null) {
      if (this.isRecording) {
          this.isRecordingType.emit('soundTrue');
          this.stopRecording();
      } else  {
        this.isRecordingType.emit('soundFalse');
          this.startRecording(type);
          this.addNode('', reaction, tag);    
      }
          
    }
}

toggleVideoRecording (reaction:string, tag:string): void {
  if (this.selectedNodeIndex !==null) {
    if (this.isRecordingVideo) {
      this.isRecordingType.emit('videoTrue');
      this.nodeService.recordingSend(false);
      this.isRecordingVideo=false;
      this.stopRecording();
    }
    else {
      this.isRecordingType.emit('videoFalse');
      this.isRecordingVideo=true;
      this.startRecording(true);
      this.addNode('', reaction, tag);
      // Adjusted sequence:
      this.nodeService.recordingSend(true);
    
    
    
    }
    /*  this.speechService.stopListening();


  
      this.isRecording=false;
      this.isRecordingType.emit(true);
      if (this.phrasesSubscription) {
          this.phrasesSubscription.unsubscribe();
          this.phrasesSubscription = null;
      }
      
      this.stopAndReturnVideo().then(result => {
        if (result) {
            const { blob} = result;
             
            if (blob) {
              this.nodes.get(this.nodetoUpdate).videoClip = blob;
            
              this.handleNodeClick(this.nodetoUpdate);
            }
        }
    });
    
         this.isRecordingVideo = false;
         
    } else  {
      this.isRecordingVideo = true;
      this.speechService.startListening();
      this.phrasesSubscription = this.speechService.phrases.subscribe(transcript => {
        const nodeToUpdate = this.nodes.get(this.nodetoUpdate) as unknown as { text: string; fullText: string, label?: string; soundClip: Blob | null };
    
        if (nodeToUpdate) {
          nodeToUpdate.fullText = transcript;
          nodeToUpdate.text = this.wrapText(transcript, 20);
          nodeToUpdate.label = this.wrapText(transcript, 20);
          this.nodes.update(nodeToUpdate);
      }
      });
    
    
     
      this.isRecordingType.emit(false);
        this.startRecordingVideo();
       
        this.addNode('');    
    }*/
  }

  }

preserveEdgeColors(nodeId: number) {
    const connectedEdges = this.network.getConnectedEdges(nodeId);
  
    // Store updates for edges
    const edgeUpdates = [];
  
    for (const edgeId of connectedEdges) {
      const edge = this.edges.get(edgeId);
      if (edge) {
        edgeUpdates.push({
          id: edgeId,
          color: {
            color: edge.color.color,
            highlight: edge.color.color
          }
        });
      }
    }
  
    // Apply edge updates
    this.edges.update(edgeUpdates);
  }
  
  
handleNodeClick(params: any): void {
  
  this.network.selectNodes([params]);
  this.selectedNodeIndex = params;
  this.preserveEdgeColors(this.selectedNodeIndex!);
  this.updateSlidesToShow();
  this.currentIndex=0;
  this.shownSlide=this.slidesToShow[0];
  this.lastSelectedNode = params;


  // If a node was clicked

  this.handleNodeSelected(params);


  // Reset highlighted edges
  //this.resetHighlightedEdges();

  // Highlight the path from the initial node to the clicked node

  this.traverseToOriginal(params, 1, this.nodes, this.edges); // Assuming 1 is your initial node ID
  
}

private handleNodeSelected(params: any): void {
  
  this.nodeSelected.emit(true);
 // this.isPanelExpanded = true;
  const clickedNodeId = params;
  this.siblingChecker = this.getAdjacentSiblingNodeIds(clickedNodeId);
  this.previousNode = this.currentNode;
  this.currentNode = clickedNodeId;
  this.nodeService.setNodeId(this.selectedNodeIndex!);

  if (this.selectedNodeIndex !== null) {
      this.nodeClicked.emit(clickedNodeId);
      const node = this.nodes.get(this.selectedNodeIndex);
    
      if (node !== null && this.selectedNodeIndex !== null) {
          this.emitNodeInformation(clickedNodeId);
      }

      // Zoom to the clicked node
      this.zoomToNode(clickedNodeId);
  }
}

private emitNodeInformation(nodeId: any): void {
  this.nodeClicked.emit(nodeId);
  const combinedObjects = this.traverseToOriginal(nodeId, 1, this.nodes, this.edges);

  this.nodeService.changeNodeText(combinedObjects);
  this.nodeService.setNodeId(nodeId);
  this.nodeService.SetSiblingData(this.getAdjacentSiblingNodeIds(nodeId));
}

private zoomToNode(nodeId: any): void {
  this.network.focus(nodeId, {
      scale: this.zoomscale,
      animation: false  
  });
}


centerOnNode(nodeId: any): void {
  const position = this.network.getPositions([nodeId])[nodeId];
  this.network.fit({
      nodes: [this.getParentNodeId(nodeId),nodeId],
      animation: {duration: 100, easingFunction: "linear"}
      
  });
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









  
play(): void {
  if (this.selectedNodeIndex !==null) {
    const nodeData = this.nodes.get(this.selectedNodeIndex);
    if (nodeData.soundClip) {
      const audioUrl = URL.createObjectURL(nodeData.soundClip);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  }
}
/*
private resetHighlightedEdges(): void {
  const resetEdges = this.highlightedEdges.map(edgeId => {
      return { id: edgeId, color: "rgba(255,255,255, 0.1"}; // Assuming '000000' is the original color
  });
  this.edges.update(resetEdges);
  this.highlightedEdges = [];
}*/


  traverseToOriginal(nodeId: number, originalNodeId: number, nodes: any, edges: any): { text: string; fullText: string, id: number; videoClip?:any,soundClip?: any }[] {
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
        this.highlightedEdges.push(connectedEdges[0].id); // Storing the edge ID
        const previousTexts = this.traverseToOriginal(predecessorNodeId, originalNodeId, nodes, edges);

        // Highlight the edge (this could be done in a different function if preferred)
      //  this.edges.update([{ id: connectedEdges[0].id, color: "rgba(0,100,255,0.7)" }]);

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

getOrderedSiblingNodeIds(nodeId: number): number[] | null {
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
  
  if (siblingsEdges.length === 1) return [nodeId];

  // Extract node IDs of all siblings.
  const siblingsNodeIds = siblingsEdges.map(edge => edge.to);

  // Find the index of the given node within the siblings.
  const givenNodeIndex = siblingsNodeIds.indexOf(nodeId);

  // Create the ordered list of sibling IDs.
  // It starts with the selected node, then its next siblings, and ends with its previous siblings.
  const orderedSiblings = [
    nodeId,
    ...siblingsNodeIds.slice(givenNodeIndex + 1),   // next siblings
    ...siblingsNodeIds.slice(0, givenNodeIndex)    // previous siblings
  ];

  return orderedSiblings;
}

deleteNodeAndDescendants(nodeId: number) {
  // First, find all children of the node.
  const childrenEdges = this.edges.get({
      filter: edge => edge.from === nodeId
  });
  
  // For each child, recursively call the function
  for (const edge of childrenEdges) {
      this.deleteNodeAndDescendants(edge.to);
  }
  
  // After all children (and their descendants) are deleted, delete the node itself.
  this.nodes.remove(nodeId);

  // Also remove all edges associated with this node
  this.edges.remove({
      filter: (edge:any) => edge.from === nodeId || edge.to === nodeId
  });
  this.cardService.deleteNode(this.cardId, nodeId);
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
      this.handleNodeClick(
    adjacentSiblingIds
      );
      this.updateSlidesToShow();
    } else {
      // Handle the scenario when there is no sibling or an error.

    }
  }
}

down() {
  if (this.selectedNodeIndex){
    const adjacentSiblingIds = this.getSiblingNodeId(this.selectedNodeIndex);
  
    if (adjacentSiblingIds) {
      this.network.selectNodes([adjacentSiblingIds]);
      this.handleNodeClick(
        adjacentSiblingIds
      );
      this.updateSlidesToShow();
    } else {
      // Handle the scenario when there is no sibling or an error.
    
    }
  }
}
previousId() {
  if (this.selectedNodeIndex){
  const adjacentSiblingIds = this.getAdjacentSiblingNodeIds(this.selectedNodeIndex);

  if (adjacentSiblingIds) {
    this.network.selectNodes([adjacentSiblingIds.previous]);
    this.handleNodeClick(
      adjacentSiblingIds.previous
    );
    this.updateSlidesToShow();
    this.currentIndex=0;
  } else {
    // Handle the scenario when there is no sibling or an error.
    return;
   
  }
}
} 
nextId () {
  if (this.selectedNodeIndex){
    const adjacentSiblingIds = this.getAdjacentSiblingNodeIds(this.selectedNodeIndex);
  
    if (adjacentSiblingIds) {
      this.network.selectNodes([adjacentSiblingIds.next]);
      this.handleNodeClick(
        adjacentSiblingIds.next
      );
      this.updateSlidesToShow();
      this.currentIndex=0;
    } else {
      // Handle the scenario when there is no sibling or an error.
      return;
    }
  }
}
goBack(){
  this.network.selectNodes([this.previousNode]);
  this.handleNodeClick(
    this.previousNode
  );
}

ngOnDestroy(): void {
  if (this.timerId) {
    clearInterval(this.timerId);
  }
}





    //video recording functions

   
      
  
  
    


   /* startRecordingVideo() {
     
      this.isRecordingVideo = true;
      this.recordedChunks = []; // Clear previous recording
     
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          this.stream = stream;
          this.liveVideoElement.nativeElement.srcObject = stream;
          this.liveVideoElement.nativeElement.play();
    
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
              this.recordedChunks.push(event.data);
            }
          };
          this.mediaRecorder.start();
        })
        .catch(error => {
          console.error('Error accessing camera:', error);
        });
    }*/
    /*
    stopRecordingVideo() {
      this.isRecordingVideo = false;
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
        this.stream.getTracks().forEach(track => track.stop());
        
        //this.nodes.get(this.nodetoUpdate).videoClip = blob;
        this.handleNodeClick(this.nodetoUpdate);
      }
    }*/
   

  }
  
  
  
