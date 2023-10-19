// Angular Core imports
import {
  Component, AfterViewInit, ViewChild, ViewChildren, ElementRef, QueryList, Output, EventEmitter, Renderer2,
  Input, OnInit, NgZone,
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

// External library imports
import { DataSet, Network } from 'vis-network/standalone';
import { Subscription } from 'rxjs';
import Swiper from 'swiper';

// Service imports
import { RtcService } from '../../rtcservice.service';
import { DebateAuthService } from 'src/app/home/debate-auth.service';
import { AvServiceService } from '../av-control-mob/av-service.service';
import { NodespaceServiceService } from './nodespace-service.service';
import { DebateSpaceService } from '../debate-space.service';
import { ChatspaceService } from '../chat-space-mob/chatspace.service';
import { ChatSubmitService } from '../chat-submit-mob/chat-submit.service';
import { CardDataService } from 'src/app/space-service.service';
import { NodeAuxiliaryService } from './node-auxiliary.service';

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
    ]),

  ]
})

export class NodeSpaceMobComponent implements AfterViewInit, OnInit {
  // View references
  @ViewChild('visNetwork', { static: false }) visNetwork!: ElementRef;
  @ViewChild('mainSlide') mainSlide!: ElementRef;
  @ViewChildren('parentSlideList') parentSlideList!: QueryList<ElementRef>;
  private mediaBlobURL?: string;


  // Class properties

  animationState: 'up' | 'down' | 'void' = 'void';
  currentNode: any;
  previousNode: any;
  thumbsPosition: { x: number, y: number } = { x: 0, y: 0 };
  parentHeight: number = 0;
  @Input() cardId!: string;
  @Input() isRanked = false;
  network!: Network;
  zoomscale = 1.0;
  public selectedPicture = 0;
  nodeShape = "circularImage";
  nodetoUpdate = 1;
  nodeIdCounter = 1;
  edgesAdd: any;

  // Arrays for nodes and edges
  public nodes = new DataSet<any>([]);
  private edges = new DataSet<any>([]);
  private subscriptions: Subscription[] = [];
  selectedNodeIndex: number | null = 1;
  private timerId: any;
  private startY: number | null = null;
  private startX: number | null = null;
  shownSlide = this.nodes.get(1);
  childrenSlides: any = [];
  parentSlides: any =[];
  negativetagArray: any = [];
  positivetagArray: any = [];
  swipeExpanded = false;
  constructor(
    private cardService: CardDataService,
    private debateSpace: DebateSpaceService,
    private settingsService: AvServiceService,
    private rtcService: RtcService,
    private debateAuth: DebateAuthService,
    private ngZone: NgZone,
    private nodeService: NodespaceServiceService,
    private chatSpace: ChatspaceService,
    private chatSubmit: ChatSubmitService,
    private nodeAux: NodeAuxiliaryService
  ) { }


  // Lifecycle hooks and main component functions

  ngOnInit(): void {

    //finds the unique nodespace from the cards database and loads it into the nodes and edges arrays any time there is a change to the arrays on the database.
    this.cardService.cards$.subscribe((cards) => {
      const id = this.cardId;
      const card = cards.find((card) => card.id === id);
      if (card !== undefined) {
        if (card) {
          this.nodes.clear();
          this.nodes.add(card.nodes);
          if (card.edges) {
            this.edges.clear();
            this.edges.add(card.edges);
          }
          this.network.once("initRedraw", () => {
            this.handleNodeClick(this.selectedNodeIndex);
          });

        }
      } else {
        return;
      }
    });
  }

  ngAfterViewInit() {
    this.initNetwork();
    this.initializeSubscriptions();
    this.addEventListeners();
    if (this.isRanked) {
      this.loadGameRules();
    }
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
        zoomView: false,
      },

      edges: {
        width: 1,
        shadow: true,
        dashes: true,
        hover: false,
      }
    };

    this.network = new Network(this.visNetwork.nativeElement, data, options);
  }

  initializeSubscriptions() {

    this.subscriptions.push(
      // Subscriptions to services


      //listens for when the record buttons are pressed and triggers the startRecording function.
      this.debateSpace.getToggle().subscribe(type => {
        this.addNode(type);
      }),

      //listens for zoomlevel changes and triggers the zoom function.
      this.settingsService.getZoomLevel().subscribe(zoom => {
        if (this.zoomscale !== null) {
          this.zoomscale = zoom;
        } else {
          this.zoomscale = 1;
        }
        this.network.focus(this.selectedNodeIndex!, {
          scale: this.zoomscale,
          animation: false
        });
      }),

      //listens for when the user clicks on a nodelink from the chatspace and triggers the handleNodeClick function.
      this.chatSpace.getLink().subscribe(link => {
        this.handleNodeClick(link);
      })
    );
  }


  addEventListeners() {

    // Add event listeners for swipe events
    this.attachSwipeListeners('myDiv');

    // Add event listeners for network events
    this.network.on('click', params => {
      this.nodeService.setNodeId(params.nodes[0]);
      if (params.nodes[0] !== undefined) {
        this.handleNodeClick(params.nodes[0]);
      }
      else {
        this.network.selectNodes([this.selectedNodeIndex!]);
      }
    });
  
  }

  //sets a timer that updates each node moment and health values every 300ms.  If a node's health drops below 0, it and all descendants will be deleted.
  loadGameRules() {
    this.timerId = setInterval(() => {
      this.nodes.forEach(node => {
        node.label = '';
        if (node.CounterStatus.length > 0) {
          node.Health = 100;
          node.CounterStatus.forEach((element: any) => {
            if (element.status === 'active') {
              const x = this.nodes.get(Number(element.id));
              const y = x.Moment;

              element.value -= 1 * (y / 10) * Math.log10(x.totalPositive + x.Positive + x.Negative + 2);
              element.totalMoment = Math.abs(parseInt(element.value));
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

        if (node.Health <= 0) {
          const parentNode = this.nodes.get(this.getParentNodeId(node.id)!);
          const parentParent = this.nodes.get(this.getParentNodeId(parentNode.id)!);
          if (node.Reaction === 'positive') {
            parentNode.totalPositive = 0;
          }
          if (parentNode.Reaction === 'negative') {
            parentParent.CounterStatus.find((item: any) => item.id === parentNode.id).status = 'active';
          }

          if (parentNode && parentNode.CounterStatus) {
            parentNode.CounterStatus.splice({ id: node.id, value: 0, status: 'active' });

          }
          this.deleteNodeAndDescendants(node.id);


        }
      })

    }, 300);
  }

  //adds event listeners for swipe and mousewheel events to add navigation features for the node network.
  attachSwipeListeners(elementId: string) {
    const el = document.getElementById(elementId);
    el?.addEventListener('touchstart', this.onTouchStart.bind(this));
    el?.addEventListener('touchend', this.onTouchEnd.bind(this));
    el?.addEventListener('wheel', this.onWheel.bind(this));
  }


  onWheel(event: WheelEvent) {
    if (event.deltaY > 0) {
      console.log('Scrolled down');
      this.down();
      this.updateSlide();
      // Handle scroll down
    } else if (event.deltaY < 0) {
      console.log('Scrolled up');
      // Handle scroll up
      this.up();
      this.updateSlide();
    }
  }
  onTouchStart(event: Event) {
    const touchEvent = event as TouchEvent;
    this.startY = touchEvent.touches[0].clientY;
    this.startX = touchEvent.touches[0].clientX;
  }

  //detects when touch event ends and determines which direction the swipe occured.  This will trigger the node map to traverse in the direction of swipe and for the slide to update.
  onTouchEnd(event: Event) {
    const touchEvent = event as TouchEvent;
    const endY = touchEvent.changedTouches[0].clientY;
    const endX = touchEvent.changedTouches[0].clientX;

    if (this.startY !== null && this.startX !== null) {
      const deltaY = endY - this.startY;
      const deltaX = endX - this.startX;
      if (deltaY > 50) {
        this.down();
      } else if (deltaY < -50) {
        this.up();
      }
      if (deltaX > 50) {
        this.nextId();
      } else if (deltaX < -50) {
        this.previousId();
      }

      this.updateSlide();
      this.startY = null;
      this.startX = null;
    }
  }

   toggleSwipeRExpansion() {
    
    
    this.swipeExpanded = !this.swipeExpanded;
   
    const swipeRElement = document.querySelector('.swipeR');
    if (swipeRElement) {
        swipeRElement.classList.toggle('expanded');
        this.visNetwork.nativeElement.classList.toggle('blur');
        setTimeout(() => {
          this.scrollToSlide();
        }, 10);
    }
    
   
}




  //this function finds the top 3 positive and negative tags based on moment score and stores them in negative and positive array
  updateSlide() {
    this.shownSlide = this.sliceTags([this.nodes.get(this.selectedNodeIndex!)]);
    this.childrenSlides = this.sliceTags(this.getChildNodeIds(this.selectedNodeIndex!));
    this.parentSlides = this.nodeAux.traverseNodes(this.selectedNodeIndex!, this.nodes, this.edges);
    this.parentSlides = this.parentSlides.reverse();
    console.log(this.childrenSlides);
      this.scrollToSlide();
  
  }

  scrollToSlide() {
  // Calculate the total height of all parent slides above the current shown slide
  let totalHeight = 0;
  
  // Iterate over the parentSlideList (QueryList<ElementRef>) 
  // and accumulate their heights until the shown slide
  this.parentSlideList.toArray().forEach((slideElementRef, index) => {
    // Stop accumulating once you reach the shown slide
    if (this.shownSlide[0] && this.shownSlide[0].node.id !== slideElementRef.nativeElement.id) {
      totalHeight += slideElementRef.nativeElement.offsetHeight;
    } else {
      return; // Stop the forEach loop
    }
  });
 
  // Scroll the mainSlide element to the calculated position
  this.mainSlide.nativeElement.scrollTop = totalHeight;
}


  sliceTags (node:any[]) {
     // Assuming this.shownSlide contains the node data
     const sliceTag:any = [];
    node.forEach(element => {
         // Sort CounterStatus array by totalMoment in descending order
         let sortedCounterStatus = [...element.CounterStatus]
         .filter(item => item.status != 'positive')
         .sort((a, b) => b.totalMoment - a.totalMoment);
 
       // Take the first three items from the sorted array
       let negativetagArray = sortedCounterStatus.slice(0, 3);
 
       let positiveCounterStatus = [...element.CounterStatus]
         .filter(item => item.status === 'positive')
         .sort((a, b) => b.totalMoment - a.totalMoment);
 
       let positivetagArray = positiveCounterStatus.slice(0, 3);
       sliceTag.push({node:element, negativetagArray:negativetagArray, positivetagArray:positivetagArray});
     });
   return sliceTag;
    
  }
  // emote events.  when thumbdown or thumbup are clicked, the node's moment score is updated and the node is updated in the nodes array.
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
        this.cardService.updateCardMoment(this.cardId, nodeData.id, 'negative');
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
        const parentId = this.getParentNodeId(this.selectedNodeIndex);
        this.cardService.updateCardMoment(this.cardId, nodeData.id, 'positive', parentId);
      }
    }
  }

  addNode(data: any): void {


    let submitText = data[0];
    let soundClip = data[1];
    let videoClip = data[2];
    let reaction = data[3];
    let tag = data[4];

    //placeholder data until real users are used.  This just switches between making a Steve and Jared user
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

      this.nodeIdCounter += 1;
      const newNodeId = this.nodeIdCounter;
      this.nodetoUpdate = newNodeId;
      if (reaction === 'positive') {
        const parentNode = this.nodes.get(this.selectedNodeIndex);

        if (parentNode && parentNode.CounterStatus) {
          parentNode.CounterStatus.push({ id: this.nodetoUpdate, value: 0, status: 'positive', tag: tag, totalMoment: 0 });

        }
      }

      if (reaction === 'negative') {
        const parentNode = this.nodes.get(this.selectedNodeIndex);

        if (parentNode && parentNode.CounterStatus) {
          parentNode.CounterStatus.push({ id: this.nodetoUpdate, value: 0, status: 'active', tag: tag, totalMoment: 0 });

        }
        if (parentNode.id != 1) {
          const parentParentNode = this.nodes.get(Number(this.getParentNodeId(parentNode.id)));
          if (parentParentNode && parentParentNode.CounterStatus) {
            const item = parentParentNode.CounterStatus.find((item: any) => item.id === parentNode.id);
            if (item) {
              item.status = 'inactive';
            }
          }
        }
      }

      const nodeAdd = {
        id: newNodeId,
        label: '',
        text: this.nodeAux.wrapText(submitText, 20),
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
        soundClip: soundClip,
        videoClip: videoClip,
        tag: tag,
      };

      if (reaction === 'negative') {
        this.edgesAdd = {
          from: this.selectedNodeIndex,
          to: newNodeId,
          opacity: 0.1,
          arrows: {
            from: true // This adds an arrow pointing from the new node to the previous node
          },
          color: {
            color: 'rgba(255,0,0,0.5)', // This sets the edge color to red

          },
          label: tag,
          font: {
            color: 'white',
            size: 12,
            background: 'black',
            strokeWidth: .5,
            align: 'top',
            distance: 200,
            vadjust: -4
          },
          scaling: {
            label: {
              enabled: true,
              min: 12,
              max: 20
            }
          }
        };
      }

      else {
        this.edgesAdd = {
          from: this.selectedNodeIndex,
          to: newNodeId,
          opacity: 0.1,
          color: {
            color: 'rgba(144,238,144,0.5)', // This sets the edge color to red

          },
          label: tag,
          font: {
            color: 'white',
            size: 12,
            background: 'black',
            strokeWidth: .5,
            align: 'top',
            distance: 20
          }
        };
      }

      this.selectedNodeIndex = newNodeId;
      this.cardService.updateCardNode(this.cardId, nodeAdd, this.edgesAdd);
    }

  }

  //prevents connected edges to the selected node from turning grey when the node is selected.
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

  //method called when a node is selected.
  handleNodeClick(params: any): void {
    this.network.selectNodes([params]);
    this.selectedNodeIndex = params;
    this.preserveEdgeColors(this.selectedNodeIndex!);
    this.updateSlide();
    this.previousNode = this.currentNode;
    this.currentNode = this.selectedNodeIndex
    this.nodeService.setNodeId(this.selectedNodeIndex!);
    const node = this.nodes.get(this.selectedNodeIndex!);
    this.emitNodeInformation(this.selectedNodeIndex);
    this.zoomToNode(this.selectedNodeIndex);
   
  }

  private emitNodeInformation(nodeId: any): void {
    const combinedObjects = this.nodeAux.traverseToOriginal(nodeId, 1, this.nodes, this.edges);
    const children = this.nodeAux.getChildNodeIds(nodeId, this.nodes, this.edges);
    const parents = this.nodeAux.traverseNodes(nodeId, this.nodes, this.edges);
    this.nodeService.changeNodeText(this.nodes.get(nodeId));
    this.nodeService.setNodeId(nodeId);
   
  }

  private zoomToNode(nodeId: any): void {
    this.network.focus(nodeId, {
      scale: this.zoomscale,
      animation: false
    });
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

  getChildNodeIds(nodeId: number): any[] {
    // Find the edges where the node is the 'from' (parent) node.
    const edgesFromGivenNode = this.edges.get({
      filter: edge => edge.from === nodeId
    });

    // If no such edges exist, the node doesn't have child nodes.
    if (edgesFromGivenNode.length === 0) return [];

    // Return the IDs of all child nodes.
    return edgesFromGivenNode.map(edge => this.nodes.get(edge.to));
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
      filter: (edge: any) => edge.from === nodeId || edge.to === nodeId
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
    if (this.selectedNodeIndex) {
      const adjacentSiblingIds = this.getParentNodeId(this.selectedNodeIndex);

      if (adjacentSiblingIds) {
        this.network.selectNodes([adjacentSiblingIds]);
        this.handleNodeClick(
          adjacentSiblingIds
        );

      } else {
        // Handle the scenario when there is no sibling or an error.
        return;
      }
    }
  }

  down() {
    if (this.selectedNodeIndex) {
      const adjacentSiblingIds = this.getSiblingNodeId(this.selectedNodeIndex);

      if (adjacentSiblingIds) {
        this.network.selectNodes([adjacentSiblingIds]);
        this.handleNodeClick(
          adjacentSiblingIds
        );

      } else {
        // Handle the scenario when there is no sibling or an error.
        return;
      }
    }
  }
  previousId() {
    if (this.selectedNodeIndex) {
      const adjacentSiblingIds = this.getAdjacentSiblingNodeIds(this.selectedNodeIndex);

      if (adjacentSiblingIds) {
        this.network.selectNodes([adjacentSiblingIds.previous]);
        this.handleNodeClick(
          adjacentSiblingIds.previous
        );

      } else {
        // Handle the scenario when there is no sibling or an error.
        return;
      }
    }
  }
  nextId() {
    if (this.selectedNodeIndex) {
      const adjacentSiblingIds = this.getAdjacentSiblingNodeIds(this.selectedNodeIndex);

      if (adjacentSiblingIds) {
        this.network.selectNodes([adjacentSiblingIds.next]);
        this.handleNodeClick(
          adjacentSiblingIds.next
        );

      } else {
        // Handle the scenario when there is no sibling or an error.
        return;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }
}



