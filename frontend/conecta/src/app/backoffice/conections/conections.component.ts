import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ProjectService} from '../../services/notes/project.service';
import {Project} from '../../services/interfaces/project';
import {PopUpService} from '../../services/utils/pop-up.service';
import {AiAnalysis} from '../../services/interfaces/ai-analysis';
import {AiAnalysisService} from '../../services/notes/ai-analysis.service';
import { Sigma } from 'sigma';
import Graph from 'graphology';
import ForceSupervisor from 'graphology-layout-force/worker';

interface SigmaNodeEventPayload {
  node: string;
  captor: {
    x: number;
    y: number;
  };
}

@Component({
  selector: 'app-conections',
  standalone: true,
  imports: [],
  templateUrl: './conections.component.html',
  styleUrl: './conections.component.scss'
})
export class ConectionsComponent implements OnInit {
  userProjects: Project[] = [];
  chosenProject: Project | undefined;
  projectAnalysis: AiAnalysis[] = [];
  private supervisor: ForceSupervisor | null = null;
  private FA2Config = {
    settings: {
      gravity: 1,
      adjustSizes: true,
      linLogMode: true,
      strongGravityMode: false,
      slowDown: 4,
      startingIterations: 50,
      iterationsPerRender: 1,
      barnesHutOptimize: true,
      barnesHutTheta: 0.5,
      scalingRatio: 2,
      preventOverlap: true,
      dissuadeHubs: true,
      maxIterations: 1000
    }
  };

  @ViewChild('sigmaContainer', { static: false }) sigmaContainer!: ElementRef;
  private sig: Sigma | undefined;
  private draggedNode: string | null = null;
  private isDragging = false;
  renderer: any;
  graph: any;
  container: any;

  constructor(
    private projectService: ProjectService,
    private popUpService: PopUpService,
    private aiAnalysisService: AiAnalysisService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: async (data) => {
        this.userProjects = data;
        await this.chooseProject();
        this.getAIanalysis();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  async chooseProject() {
    const selectedName = await this.popUpService.showOptionDialog(
      "Elige un proyecto",
      this.userProjects.map(project => project.name)
    );

    if (selectedName) {
      this.chosenProject = this.userProjects.find(project => project.name === selectedName);
    }
  }

  getAIanalysis() {
    if (this.chosenProject) {
      this.aiAnalysisService.listAiAnalysis(this.chosenProject).subscribe({
        next: (data) => {
          this.projectAnalysis = data;
          console.log(this.projectAnalysis);
          setTimeout(() => this.initSigma(), 0);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

  initSigma(): void {
    if (!this.sigmaContainer?.nativeElement) {
      console.error('Contenedor Sigma no encontrado');
      return;
    }

    const graph = this.createGraphFromNotes();

    this.sig = new Sigma(graph, this.sigmaContainer.nativeElement, {
      minCameraRatio: 0.1,
      maxCameraRatio: 10,
      nodeProgramClasses: {},
      edgeProgramClasses: {},
      defaultNodeColor: '#999',
      defaultNodeType: 'circle',
      defaultEdgeColor: '#aaa',
      defaultEdgeType: 'line',
      labelSize: 12,
      labelWeight: 'bold',
      renderLabels: true,
      renderEdgeLabels: true,
      labelColor: {
        color: '#000'
      },
      labelDensity: 0.07,
      labelGridCellSize: 60,
      labelRenderedSizeThreshold: 6
    });

    this.supervisor = new ForceSupervisor(graph, {
      isNodeFixed: (_, attr) => attr['highlighted']
    });
    this.supervisor.start();

    let iterationCount = 0;
    let lastMovement = Infinity;
    const movementThreshold = 0.001;

    const checkStability = () => {
      if (!this.supervisor) return;

      const positions = graph.nodes().map(node => {
        const attrs = graph.getNodeAttributes(node);
        return { x: attrs['x'], y: attrs['y'] };
      });

      if (iterationCount > 100) {
        const movement = positions.reduce((sum, pos, i) => {
          if (this.previousPositions && this.previousPositions[i]) {
            const dx = pos.x - this.previousPositions[i].x;
            const dy = pos.y - this.previousPositions[i].y;
            return sum + Math.sqrt(dx * dx + dy * dy);
          }
          return sum;
        }, 0) / positions.length;

        if (movement < movementThreshold && lastMovement < movementThreshold) {
          console.log('Grafo estabilizado');
          this.supervisor.stop();
          return;
        }
        lastMovement = movement;
      }

      this.previousPositions = positions;
      iterationCount++;


      if (this.supervisor.isRunning()) {
        requestAnimationFrame(checkStability);
      }
    };

    // Iniciar la simulación y el control de estabilidad
    this.supervisor.start();
    requestAnimationFrame(checkStability);

    this.addControlButtons();
  }

  private previousPositions: Array<{x: number, y: number}> | null = null;

  private addControlButtons(): void {
    const container = this.sigmaContainer.nativeElement;
    const controlsDiv = document.createElement('div');
    controlsDiv.style.position = 'absolute';
    controlsDiv.style.top = '10px';
    controlsDiv.style.left = '10px';
    controlsDiv.style.zIndex = '1';

    const startButton = document.createElement('button');
    startButton.textContent = 'Iniciar Simulación';
    startButton.className = 'btn btn-primary btn-sm me-2';
    startButton.onclick = () => this.supervisor?.start();

    const stopButton = document.createElement('button');
    stopButton.textContent = 'Detener Simulación';
    stopButton.className = 'btn btn-secondary btn-sm';
    stopButton.onclick = () => this.supervisor?.stop();

    controlsDiv.appendChild(startButton);
    controlsDiv.appendChild(stopButton);
    container.appendChild(controlsDiv);
  }

  createGraphFromNotes(): Graph {
    const graph = new Graph();

    this.projectAnalysis.forEach((item, index) => {
      const noteId = item.note.toString();

      if (!graph.hasNode(noteId)) {
        graph.addNode(noteId, {
          label: `Nota ${noteId}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 10,
          color: '#007bff'
        });
      }
    });

    this.projectAnalysis.forEach(item => {
      const source = item.note.toString();

      Object.entries(item.noteSimilarity).forEach(([targetNote, similarity]) => {
        const target = targetNote;
        const similarityValue = parseFloat(similarity as any);

        if (similarityValue > 0.6 && source !== target &&
          !graph.hasEdge(source, target) && !graph.hasEdge(target, source)) {
          graph.addEdge(source, target, {
            label: null,
            originalLabel: `${(similarityValue * 100).toFixed(1)}%`,
            color: '#aaa',
            weight: similarityValue,
            size: similarityValue * 2
          });
        }
      });
    });

    return graph;
  }

  ngOnDestroy() {
    this.supervisor?.stop();
    this.supervisor?.kill();
  }

ngAfterViewInit() {
  // Asumiendo que aquí tienes tu inicialización de Sigma
  this.renderer = new Sigma(this.graph, this.container, {
    // ... tu configuración actual
  });

  // Llamar a setupDragListeners aquí
  this.setupDragListeners();
}

// Y definir la función como método de tu clase
private setupDragListeners(): void {
  let draggedNode: string | null = null;
  let isDragging = false;

  // Corregimos el tipo del evento downNode
  this.renderer.on("downNode", (e: SigmaNodeEventPayload) => {
    isDragging = true;
    draggedNode = e.node;
    this.graph.setNodeAttribute(draggedNode, "highlighted", true);
    if (!this.renderer.getCustomBBox())
      this.renderer.setCustomBBox(this.renderer.getBBox());
  });

  this.renderer.on("mousemove", (e: MouseEvent) => {
    if (!isDragging || !draggedNode) return;

    const pos = this.renderer.viewportToGraph({x: e.clientX, y: e.clientY});

    this.graph.setNodeAttribute(draggedNode, "x", pos.x);
    this.graph.setNodeAttribute(draggedNode, "y", pos.y);

    e.preventDefault();
    e.stopPropagation();
  });

  const handleUp = () => {
    if (draggedNode) {
      this.graph.removeNodeAttribute(draggedNode, "highlighted");
    }
    isDragging = false;
    draggedNode = null;
  };

  this.renderer.on("upNode", handleUp);
  this.renderer.on("upStage", handleUp);
}
}
