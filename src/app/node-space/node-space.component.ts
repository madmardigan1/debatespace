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
  constructor(private rtcService: RtcService, private speechService: SpeechService, private sharedService: SharedserviceService) {
    this.speechService.phrases.subscribe(transcript => {
      console.log(transcript);
      // If a node is selected, add the transcript to the node's text
      if (this.selectedNodeIndex !== null) {
        const newNodeId = this.nodes.length + 1;
        this.nodes.add({ id: newNodeId, text: transcript });
        this.edges.add({ from: this.selectedNodeIndex, to: newNodeId });
        this.selectedNodeIndex = null;
        //let selectedNode = this.nodes.get(this.selectedNodeIndex);
        //selectedNode.text += transcript;
        //this.nodes.update(selectedNode);
      }
    });
  }
  
  @ViewChild('visNetwork', { static: false }) visNetwork!: ElementRef;
  @Output() nodeClicked = new EventEmitter<number>();
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  network!: Network;
  selectedNodeIndex: number | null = null;
  public nodes = new DataSet<any>([
    {id: 1, label: 'Node 1', text: ''},
    {id: 2, label: 'Node 2', text: ''},
    {id: 3, label: 'Node 3', text: ''},
    {id: 4, label: 'Node 4', text: ''},
    {id: 5, label: 'Node 5', text: ''}
  ]);

  private edges = new DataSet<any>([
    {from: 1, to: 3},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 5}
  ]);

  positions: any;



  ngAfterViewInit() {
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
        shape: "dot",
        shadow: true,
      },
      manipulation: {
        enabled: false,
      },
      interaction:{
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

    this.network.once("initRedraw", () => {
      this.network.storePositions();
      this.network.setData({
        nodes: this.nodes,
        edges: this.edges,
      });
    });

    this.network.on('click', params => {
      if (params.nodes.length > 0) {
        const clickedNodeId = params.nodes[0];
        if (this.selectedNodeIndex !== null) {
          this.speechService.stopListening();
        }
    
        this.selectedNodeIndex = clickedNodeId;
    
        if (this.selectedNodeIndex !== null) {
          this.nodeClicked.emit(clickedNodeId);
    
          // Ensure this.selectedNodeIndex is not null before using it as an argument
          const node = this.nodes.get(this.selectedNodeIndex);
          if (node !== null) {
            this.notify.emit(node.text);
            this.sharedService.changeNodeText(node.text);
          }
        }
    
        this.rtcService.startStream();
        this.speechService.startListening();
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
