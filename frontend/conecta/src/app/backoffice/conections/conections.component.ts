import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../../services/notes/project.service';
import { Project } from '../../services/interfaces/project';
import { PopUpService } from '../../services/utils/pop-up.service';
import { AiAnalysis } from '../../services/interfaces/ai-analysis';
import { AiAnalysisService } from '../../services/notes/ai-analysis.service';
import Sigma from 'sigma';
import Graph from 'graphology';
import ForceSupervisor from 'graphology-layout-force/worker';
import { ComunicationService } from '../../services/comunication/comunication.service';
import {NoteService} from '../../services/notes/note.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-conections',
  standalone: true,
  imports: [],
  templateUrl: './conections.component.html',
  styleUrl: './conections.component.scss'
})
export class ConectionsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sigmaContainer', { static: false }) sigmaContainer!: ElementRef;

  chosenProject: Project | undefined;
  projectAnalysis: AiAnalysis[] = [];

  graph: Graph = new Graph();
  sig: Sigma | undefined;
  layout: ForceSupervisor | undefined;

  draggedNode: string | null = null;
  isDragging = false;

  constructor(
    private aiAnalysisService: AiAnalysisService,
    private comunicationService: ComunicationService,
    private noteService: NoteService,
    private router:Router
  ) {}

ngOnInit(): void {
  this.comunicationService.projectCom$.subscribe({
    next: (project) => {
      if (project) {
        this.chosenProject = project;
        this.getAIanalysis();
      } else {

        console.warn('No hay proyecto seleccionado');
      }
    },
    error: (err) => console.error(err)
  });
}

  getAIanalysis() {
    if (this.chosenProject && this.projectAnalysis.length === 0) {
      this.aiAnalysisService.listAiAnalysis(this.chosenProject).subscribe({
        next: (data) => {
          this.projectAnalysis = data;
          this.createGraphFromNotes();
          this.initSigma();
        },
        error: (error) => console.error(error)
      });
    }
  }

createGraphFromNotes(): void {
  this.graph.clear();

  this.projectAnalysis.forEach((item) => {
    const noteId = item.note.toString();
    if (!this.graph.hasNode(noteId)) {
      this.graph.addNode(noteId, {
        label: 'Cargando...',
        x: Math.random(),
        y: Math.random(),
        size: 10,
        color: '#007bff'
      });


      if (this.chosenProject) {
        this.noteService.getNoteById(this.chosenProject, noteId).subscribe({
          next: (data) => {
            this.graph.setNodeAttribute(noteId, 'label', data.title);
          },
          error: (error) => {
            console.error(`Error al cargar el título de la nota ${noteId}:`, error);
            this.graph.setNodeAttribute(noteId, 'label', 'Error al cargar');
          }
        });
      }
    }
  });

  this.projectAnalysis.forEach(item => {
    const source = item.note.toString();
    Object.entries(item.noteSimilarity).forEach(([targetNote, similarity]) => {
      const target = targetNote;
      const similarityValue = parseFloat(similarity as any);
      if (similarityValue > 0.4 && source !== target && !this.graph.hasEdge(source, target) && !this.graph.hasEdge(target, source)) {
        if (similarityValue > 0.8) {
          this.graph.addEdge(source, target, {
            label: null,
            originalLabel: `${(similarityValue * 100).toFixed(1)}%`,
            color: '#3354b9',
            weight: similarityValue,
            size: similarityValue * 2
          });
        } else if (similarityValue > 0.6) {
          this.graph.addEdge(source, target, {
            label: null,
            originalLabel: `${(similarityValue * 100).toFixed(1)}%`,
            color: '#858585',
            weight: similarityValue,
            size: similarityValue * 2
          });
        } else {
          this.graph.addEdge(source, target, {
            label: null,
            originalLabel: `${(similarityValue * 100).toFixed(1)}%`,
            color: '#ea0b0b',
            weight: similarityValue,
            size: similarityValue * 2,
            // añadir tipo dashed
          });
        }
      } else {
        this.graph.addEdge(source, target, {
          label: null,
          originalLabel: null,
          color: 'rgba(0, 0, 0, 0)',
          weight: similarityValue,
          size: 0.0001
        });
      }
    });
  });

  this.projectAnalysis.forEach((item) => {
    const noteId = item.note.toString();
    this.graph.setNodeAttribute(noteId, "x", Math.random() * 10 - 5);
    this.graph.setNodeAttribute(noteId, "y", Math.random() * 10 - 5);
  });

}

  initSigma(): void {
    const container = this.sigmaContainer?.nativeElement;
    if (!container) return;

    this.sig = new Sigma(this.graph, container, {
      minCameraRatio: 0.1,
      maxCameraRatio: 5
    });

    this.layout = new ForceSupervisor(this.graph, {
      isNodeFixed: (_, attr) => attr['highlighted']
    });
    this.layout.start();


    this.sig.on("downNode", (e) => {
      this.isDragging = true;
      this.draggedNode = e.node;
      this.graph.setNodeAttribute(this.draggedNode, "highlighted", true);
      if (!this.sig!.getCustomBBox())
        this.sig!.setCustomBBox(this.sig!.getBBox());
    });

    this.sig.on("moveBody", ({ event }) => {
      if (!this.isDragging || !this.draggedNode) return;

      const pos = this.sig!.viewportToGraph(event);
      this.graph.setNodeAttribute(this.draggedNode, "x", pos.x);
      this.graph.setNodeAttribute(this.draggedNode, "y", pos.y);

      event.preventSigmaDefault();
      event.original.preventDefault();
      event.original.stopPropagation();
    });

    const release = () => {
      if (this.draggedNode) {
        this.graph.removeNodeAttribute(this.draggedNode, "highlighted");
      }
      this.isDragging = false;
      this.draggedNode = null;
    };

    this.sig.on("upNode", release);
    this.sig.on("upStage", release);

    this.sig.on("clickNode", (e) => {
      let note;
      if (this.chosenProject) {

        this.noteService.getNoteById(this.chosenProject, e.node).subscribe({
          next: (data) => {
            note = data;
            this.comunicationService.selectNote(note);
            this.router.navigate(['backoffice/note']);
          },
          error: (error) => {
            console.error(`Error al cargar la nota ${e.node}:`, error);
          }
        })

      }
    })
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.layout?.stop();
    this.layout?.kill();
    this.sig?.kill();
  }
}
